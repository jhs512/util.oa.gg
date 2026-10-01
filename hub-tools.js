const text=document.querySelector('#text-input');
if(text){
  const segmenter=new Intl.Segmenter('ko',{granularity:'grapheme'});
  const update=()=>{
    const value=text.value;
    document.querySelector('#characters').textContent=[...segmenter.segment(value)].length.toLocaleString();
    document.querySelector('#no-spaces').textContent=[...segmenter.segment(value.replace(/\s/gu,''))].length.toLocaleString();
    document.querySelector('#bytes').textContent=new TextEncoder().encode(value).length.toLocaleString();
    document.querySelector('#words').textContent=value.trim()?value.trim().split(/\s+/u).length.toLocaleString():'0';
  };
  text.addEventListener('input',update);document.querySelector('#clear').addEventListener('click',()=>{text.value='';update();text.focus();});update();
}
const quantity=document.querySelector('#quantity');
if(quantity){
  const update=()=>{
    const value=Number(quantity.value), factor=Number(document.querySelector('#from-unit').value), bytes=value*factor;
    const valid=quantity.value.trim()!==''&&Number.isFinite(bytes)&&bytes>=0&&bytes<=Number.MAX_SAFE_INTEGER;
    document.querySelector('#conversion-status').textContent=valid?'Decimal and binary units are shown separately.':'Enter a nonnegative value within the safe calculation range.';
    document.querySelectorAll('[data-factor]').forEach(el=>el.textContent=valid?(bytes/Number(el.dataset.factor)).toLocaleString('ko-KR',{maximumFractionDigits:6}):'—');
  };
  quantity.addEventListener('input',update);document.querySelector('#from-unit').addEventListener('change',update);update();
}
