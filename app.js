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
  $('badge').textContent='Ready'; $('badge').className='';
}
function lock(value) {
  busy=value;
  document.querySelectorAll('input,select,button').forEach(el=>el.disabled=value);
  $('compress').disabled=value||!source;
  $('compress').textContent=value?'Processing…':'Compress image';
}
async function selectFile(file) {
  if(busy||!file) return;
  const ticket=++revision;
  clearResult(); source?.bitmap.close();source=null;
  if(inputUrl) URL.revokeObjectURL(inputUrl);
  $('before').removeAttribute('src');$('comparison').hidden=true;$('empty').hidden=false;
  $('filename').textContent=file.name;$('status').textContent='Checking image…';lock(true);
  try {
    const loaded=await loadImage(file);
    if(ticket!==revision){loaded.bitmap.close();return;}
    source=loaded;inputUrl=URL.createObjectURL(new Blob([file],{type:source.type}));$('before').src=inputUrl;
    $('beforeStats').textContent=`${size(file.size)} · ${dims(source.width,source.height)}`;
    $('empty').hidden=true;$('comparison').hidden=false;
    $('status').textContent='Choose your target size and output format, then compress.';
  } catch(error){$('status').textContent=error.message;$('badge').textContent='Check file';$('badge').className='fail';}
  finally{lock(false);$('file').value='';}
}
$('file').addEventListener('change',e=>selectFile(e.target.files[0]));
['dragenter','dragover'].forEach(name=>$('drop').addEventListener(name,e=>{e.preventDefault();if(!busy)$('drop').classList.add('drag');}));
['dragleave','drop'].forEach(name=>$('drop').addEventListener(name,e=>{e.preventDefault();$('drop').classList.remove('drag');}));
$('drop').addEventListener('drop',e=>{if(e.dataTransfer.files.length!==1){$('status').textContent='Choose one image at a time.';return;}selectFile(e.dataTransfer.files[0]);});
function settingsChanged(){clearResult();if(source)$('status').textContent='Settings changed. Compress again to see an updated result.';}
['amount','unit','format','resize'].forEach(id=>$(id).addEventListener('input',settingsChanged));
document.querySelectorAll('[data-kb]').forEach(button=>button.addEventListener('click',()=>{$('amount').value=button.dataset.kb;$('unit').value='1000';settingsChanged();}));
$('format').addEventListener('change',()=>{$('formatHint').textContent=$('format').value==='image/jpeg'?'Transparent areas become white. Check the result background.':$('format').value==='image/png'?'PNG approaches the target by reducing dimensions, without quality adjustment.':'Choose JPG if your destination does not accept WebP.';});
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
    $('changes').textContent=result.original?'Original file · No re-encoding':`${extension.toUpperCase()} · ${result.quality===null?'Lossless encoding':`Quality setting ${Math.round(result.quality*100)}%`} · ${result.width===source.width&&result.height===source.height?'Dimensions unchanged':`Width and height ${Math.round(result.width/source.width*100)}%`}${type==='image/jpeg'?' · White background':''}`;
    $('badge').textContent=result.met?'Target met':'Target not met';$('badge').className=result.met?'success':'fail';
    $('status').textContent=result.met?(result.original?'Already below your target. You can download the original file.':'Below your target. Check the dimensions and image quality.'):'The target could not be reached within the quality and dimension limits. Increase the target or try another format. This result exceeds your target.';
    if(result.blob.size>source.file.size)$('status').textContent+=' Format conversion made this result larger than the original.';
    $('download').href=resultUrl;$('download').download=`${source.file.name.replace(/\.[^.]+$/,'')}-compressed.${extension}`;
    $('download').textContent=result.met?'Download image':'Download oversized result';
    $('afterFigure').hidden=$('result').hidden=false;
  }catch(error){$('status').textContent=error.message;$('badge').textContent='Compression failed';$('badge').className='fail';}
  finally{lock(false);}
});
['before','after'].forEach(id=>{
  const image=$(id);image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label',id==='before'?'Open original image at full size':'Open result image at full size');
  const open=()=>{const url=id==='before'?inputUrl:resultUrl;if(url)window.open(url,'_blank','noopener');};
  image.addEventListener('click',open);image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
});
