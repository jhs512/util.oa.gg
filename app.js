import {loadImage,compressImage} from './compressor.js';
const $ = id => document.getElementById(id);
$('form').noValidate=true;
let source, resultUrl, inputUrl, revision=0, busy=false;
const size = bytes => `${(bytes/1000).toLocaleString('ko-KR',{maximumFractionDigits:2})} KB (${bytes.toLocaleString()} B)`;
const dims = (w,h) => `${w.toLocaleString()} × ${h.toLocaleString()} px`;
function clearResult() {
  if(resultUrl) URL.revokeObjectURL(resultUrl);
  resultUrl=null; $('after').removeAttribute('src'); $('download').removeAttribute('href');
  $('result').hidden=$('afterFigure').hidden=true;
  $('badge').textContent='준비 중'; $('badge').className='';
}
function lock(value) {
  busy=value;
  document.querySelectorAll('input,select,button').forEach(el=>el.disabled=value);
  $('compress').disabled=value||!source;
  $('compress').textContent=value?'처리 중…':'목표 용량으로 압축';
}
async function selectFile(file) {
  if(busy||!file) return;
  const ticket=++revision;
  clearResult(); source?.bitmap.close();source=null;
  if(inputUrl) URL.revokeObjectURL(inputUrl);
  $('before').removeAttribute('src');$('comparison').hidden=true;$('empty').hidden=false;
  $('filename').textContent=file.name;$('status').textContent='이미지 확인 중…';lock(true);
  try {
    const loaded=await loadImage(file);
    if(ticket!==revision){loaded.bitmap.close();return;}
    source=loaded;inputUrl=URL.createObjectURL(new Blob([file],{type:source.type}));$('before').src=inputUrl;
    $('beforeStats').textContent=`${size(file.size)} · ${dims(source.width,source.height)}`;
    $('empty').hidden=true;$('comparison').hidden=false;
    $('status').textContent='목표 용량과 저장 형식을 고른 뒤 압축하세요.';
  } catch(error){$('status').textContent=error.message;$('badge').textContent='파일 확인 필요';$('badge').className='fail';}
  finally{lock(false);$('file').value='';}
}
$('file').addEventListener('change',e=>selectFile(e.target.files[0]));
['dragenter','dragover'].forEach(name=>$('drop').addEventListener(name,e=>{e.preventDefault();if(!busy)$('drop').classList.add('drag');}));
['dragleave','drop'].forEach(name=>$('drop').addEventListener(name,e=>{e.preventDefault();$('drop').classList.remove('drag');}));
$('drop').addEventListener('drop',e=>{if(e.dataTransfer.files.length!==1){$('status').textContent='한 번에 이미지 한 장을 선택하세요.';return;}selectFile(e.dataTransfer.files[0]);});
function settingsChanged(){clearResult();if(source)$('status').textContent='설정이 바뀌었습니다. 다시 압축해서 결과를 확인하세요.';}
['amount','unit','format','resize'].forEach(id=>$(id).addEventListener('input',settingsChanged));
document.querySelectorAll('[data-kb]').forEach(button=>button.addEventListener('click',()=>{$('amount').value=button.dataset.kb;$('unit').value='1000';settingsChanged();}));
$('format').addEventListener('change',()=>{$('formatHint').textContent=$('format').value==='image/jpeg'?'투명한 영역은 흰색으로 바뀝니다. 결과 배경을 확인하세요.':$('format').value==='image/png'?'PNG는 품질 조절 없이 크기 축소로만 목표에 접근합니다.':'WebP를 받지 않는 제출처라면 JPG를 선택하세요.';});
$('form').addEventListener('submit',async e=>{
  e.preventDefault();if(!source||busy)return;clearResult();
  const target=Math.floor(Number($('amount').value)*Number($('unit').value));
  lock(true);
  try {
    const type=$('format').value;
    const result=await compressImage(source,{target,type,allowResize:$('resize').checked},message=>$('status').textContent=message);
    resultUrl=URL.createObjectURL(result.blob);$('after').src=resultUrl;
    $('afterStats').textContent=`${size(result.blob.size)} · ${dims(result.width,result.height)}`;
    $('size').textContent=size(result.blob.size);$('goal').textContent=size(target);
    const extension={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[type];
    $('changes').textContent=result.original?'원본 그대로 · 재인코딩 없음':`${extension.toUpperCase()} · ${result.quality===null?'무손실 인코딩':`품질 설정 ${Math.round(result.quality*100)}%`} · ${result.width===source.width&&result.height===source.height?'크기 유지':`가로·세로 ${Math.round(result.width/source.width*100)}%`}${type==='image/jpeg'?' · 흰 배경':''}`;
    $('badge').textContent=result.met?'목표 달성':'목표 미달';$('badge').className=result.met?'success':'fail';
    $('status').textContent=result.met?(result.original?'이미 목표 이하입니다. 원본을 그대로 내려받을 수 있습니다.':'목표 이하로 맞췄습니다. 크기와 이미지 품질을 확인하세요.'):'현재 품질·크기 제한으로 목표에 도달하지 못했습니다. 목표를 높이거나 다른 형식을 선택하세요. 아래 결과는 목표를 초과합니다.';
    if(result.blob.size>source.file.size)$('status').textContent+=' 형식 변환으로 결과가 원본보다 커졌습니다.';
    $('download').href=resultUrl;$('download').download=`${source.file.name.replace(/\.[^.]+$/,'')}-compressed.${extension}`;
    $('download').textContent=result.met?'결과 내려받기':'목표 초과 결과 내려받기';
    $('afterFigure').hidden=$('result').hidden=false;
  }catch(error){$('status').textContent=error.message;$('badge').textContent='압축 실패';$('badge').className='fail';}
  finally{lock(false);}
});
['before','after'].forEach(id=>{
  const image=$(id);image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label',id==='before'?'원본 이미지 크게 보기':'결과 이미지 크게 보기');
  const open=()=>{const url=id==='before'?inputUrl:resultUrl;if(url)window.open(url,'_blank','noopener');};
  image.addEventListener('click',open);image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
});
