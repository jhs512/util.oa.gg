export const LIMIT_BYTES = 20_000_000;
export async function inspectFile(file) {
  if (file.size > LIMIT_BYTES) throw new Error('20 MB 이하의 이미지를 선택하세요.');
  const bytes = new Uint8Array(await file.arrayBuffer());
  const ascii = (start, length) => String.fromCharCode(...bytes.subarray(start, start + length));
  let type, width, height;
  const view = new DataView(bytes.buffer);
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    type = 'image/jpeg';
    let pos = 2;
    while (pos + 4 <= bytes.length) {
      if (bytes[pos++] !== 255) continue;
      let marker = bytes[pos++];
      while (marker === 255 && pos < bytes.length) marker = bytes[pos++];
      if (marker === 217 || marker === 218) break;
      if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
      const length = view.getUint16(pos);
      if (length < 2 || pos + length > bytes.length) break;
      if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker) && length >= 8) {
        height = view.getUint16(pos + 3); width = view.getUint16(pos + 5); break;
      }
      pos += length;
    }
  } else if (ascii(0, 8) === '\x89PNG\r\n\x1a\n' && bytes.length >= 24) {
    type = 'image/png'; width = view.getUint32(16); height = view.getUint32(20);
    for (let pos = 8; pos + 12 <= bytes.length;) {
      const length = view.getUint32(pos);
      if (ascii(pos + 4, 4) === 'acTL') throw new Error('애니메이션 PNG는 지원하지 않습니다. 정지 이미지를 선택하세요.');
      pos += length + 12;
    }
  } else if (ascii(0,4) === 'RIFF' && ascii(8,4) === 'WEBP') {
    type = 'image/webp';
    for (let pos = 12; pos + 8 <= bytes.length;) {
      const kind = ascii(pos,4), length = view.getUint32(pos + 4, true), data = pos + 8;
      if (data + length > bytes.length) break;
      if (kind === 'ANIM' || kind === 'ANMF' || (kind === 'VP8X' && bytes[data] & 2)) throw new Error('애니메이션 WebP는 지원하지 않습니다. 정지 이미지를 선택하세요.');
      if (kind === 'VP8X' && length >= 10) {
        width = 1 + bytes[data+4] + (bytes[data+5]<<8) + (bytes[data+6]<<16);
        height = 1 + bytes[data+7] + (bytes[data+8]<<8) + (bytes[data+9]<<16);
      } else if (kind === 'VP8 ' && length >= 10 && !width) {
        width = view.getUint16(data+6,true) & 16383; height = view.getUint16(data+8,true) & 16383;
      } else if (kind === 'VP8L' && length >= 5 && !width) {
        const bits = view.getUint32(data+1,true); width = (bits & 16383)+1; height = ((bits>>>14)&16383)+1;
      }
      pos = data + length + (length % 2);
    }
  } else throw new Error('정지 JPG, PNG, WebP만 지원합니다. SVG, GIF, HEIC 등은 선택할 수 없습니다.');
  if (!width || !height) throw new Error('이미지 헤더를 읽을 수 없습니다. 손상된 파일인지 확인하세요.');
  if (width * height > 24_000_000 || Math.max(width,height) > 8192) throw new Error('2,400만 픽셀, 한 변 8,192 px 이하의 이미지를 선택하세요.');
  return {type, width, height};
}

export async function loadImage(file) {
  const info = await inspectFile(file);
  let bitmap;
  try { bitmap = await createImageBitmap(new Blob([file], {type:info.type})); }
  catch { throw new Error('이미지를 열 수 없습니다. 파일이 손상되었거나 이 브라우저가 지원하지 않는 이미지입니다.'); }
  if (bitmap.width * bitmap.height > 24_000_000 || Math.max(bitmap.width,bitmap.height) > 8192) { bitmap.close(); throw new Error('이미지 크기가 처리 한도를 넘었습니다.'); }
  return {...info, width:bitmap.width, height:bitmap.height, bitmap, file};
}

function encode(canvas, type, quality) {
  return new Promise((resolve,reject) => {
    canvas.toBlob(blob => {
      if (!blob) reject(new Error('이미지 저장에 실패했습니다. 다른 형식이나 더 작은 이미지를 시도하세요.'));
      else if (blob.type !== type) reject(new Error('이 브라우저는 선택한 저장 형식을 지원하지 않습니다. 다른 형식을 선택하세요.'));
      else resolve(blob);
    }, type, quality);
  });
}

export async function compressImage(source, {target, type, allowResize}, progress = () => {}) {
  if (!Number.isFinite(target) || target < 1 || target > LIMIT_BYTES) throw new Error('목표 용량은 1바이트 이상, 20 MB 이하로 입력하세요.');
  if (!['image/jpeg','image/webp','image/png'].includes(type)) throw new Error('지원하지 않는 저장 형식입니다.');
  if (source.type === type && source.file.size <= target) return {blob:source.file,width:source.width,height:source.height,quality:null,met:true,original:true};
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('이 브라우저에서 이미지 처리를 시작할 수 없습니다.');
  let smallest=source.type===type?{blob:source.file,width:source.width,height:source.height,quality:null,met:false,original:true}:undefined;
  try {
    for (let step = 0; step <= (allowResize ? 7 : 0); step++) {
      const scale = Math.max(.25, .8 ** step);
      const width = Math.max(1,Math.ceil(source.width*scale)), height = Math.max(1,Math.ceil(source.height*scale));
      canvas.width = width; canvas.height = height;
      if (type === 'image/jpeg') {ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);}
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality='high';
      ctx.drawImage(source.bitmap,0,0,width,height);
      progress(`압축 중 · ${width.toLocaleString()} × ${height.toLocaleString()} px`);
      const attempt = async quality => {
        const blob = await encode(canvas,type,quality);
        const item = {blob,width,height,quality:type==='image/png'?null:quality,met:blob.size<=target,original:false};
        if (!smallest || blob.size < smallest.blob.size) smallest=item;
        return item;
      };
      const high = await attempt(.95);
      if (high.met) return high;
      if (type !== 'image/png') {
        const low = await attempt(.6);
        if (low.met) {
          let best=low, left=.6, right=.95;
          for (let i=0;i<7;i++) {
            const quality=(left+right)/2, candidate=await attempt(quality);
            if (candidate.met) {best=candidate;left=quality;} else right=quality;
          }
          return best;
        }
      }
      if (scale === .25) break;
    }
    return smallest;
  } finally {canvas.width=canvas.height=1;}
}
