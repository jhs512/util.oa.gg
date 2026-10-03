// Only entry URLs invoke this Worker; ordinary tool assets use static hosting.
const slugs=['calendar','date-calculator','percentage-calculator','unit-converter','password-generator','timer','json-formatter','url-encoder','base64','color-picker'];
const entries=new Map(slugs.map(slug=>[`${slug}.util.oa.gg`,slug]));
export default {
 async fetch(request,env){
  const url=new URL(request.url),slug=entries.get(url.hostname);
  if(slug&&(url.pathname==='/'||url.pathname==='/index.html')){
   return Response.redirect(`https://util.oa.gg/${slug}/${url.search}`,301);
  }
  return env.ASSETS.fetch(request);
 }
};
