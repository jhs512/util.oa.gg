import {ko} from './i18n-data.js';
export const locale=document.documentElement.lang==='ko'?'ko-KR':'en-US';
export function translate(message){
 if(locale!=='ko-KR')return message;
 if(ko[message])return ko[message];
 const larger=' Format conversion made this result larger than the original.';
 if(message.endsWith(larger))return translate(message.slice(0,-larger.length))+' '+ko[larger.trim()];
 if(message.includes('\n'))return message.split('\n').map(translate).join('\n');
 if(message.startsWith('Invalid input: '))return ko[message.slice(15)]||'입력이 올바르지 않습니다. 형식과 인코딩을 확인하세요.';
 return message.replace(/^Difference: (.*?) days$/,'날짜 차이: $1일').replace(/^Date after (.*?) days: (.*)$/,'$1일 후 날짜: $2')
  .replace(/^(.*?)% of (.*?) = (.*)$/,'$2의 $1% = $3').replace(/^(.*?) as a percentage of (.*?) = (.*)$/,'$2에 대한 $1의 비율 = $3').replace(/^Change from (.*?) to (.*?) = (.*)$/,'$1에서 $2로 변화율 = $3').replaceAll('Undefined',ko.Undefined)
  .replace(/^Compressing · /,'압축 중 · ').replace(/Quality setting (\d+)%/g,'품질 설정 $1%').replace(/Width and height (\d+)%/g,'가로·세로 $1%').replaceAll('Lossless encoding',ko['Lossless encoding']).replaceAll('Dimensions unchanged',ko['Dimensions unchanged']).replaceAll('White background',ko['White background'])
  .replace(/, today$/,', 오늘').replace(/ Format conversion made this result larger than the original\.$/,' '+ko['Format conversion made this result larger than the original.']);
}
// Observe only application messages. User text, filenames and generated values are never translated.
if(locale==='ko-KR'){
 for(const id of ['status','badge','compress','download','formatHint','changes','conversion-status','tool-result','month-title','before','after']){
  const element=document.getElementById(id);if(!element)continue;
  const update=()=>{
   for(const node of element.childNodes)if(node.nodeType===Node.TEXT_NODE){
    const value=translate(node.textContent);if(value!==node.textContent)node.textContent=value;
   }
   const label=element.getAttribute('aria-label');if(label&&translate(label)!==label)element.setAttribute('aria-label',translate(label));
  };
  update();new MutationObserver(update).observe(element,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['aria-label']});
 }
}
