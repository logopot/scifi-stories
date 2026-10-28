// Preusmerava staru adresu i www na glavni domen; svi ostali hostovi (npr. preview grana) prolaze nepromenjeni.
const MAIN_HOST = 'otherworldstories.com';
const REDIRECTED_HOSTS = new Set(['scifi-stories.pages.dev', `www.${MAIN_HOST}`]);

export const onRequest = (context) => {
  const url = new URL(context.request.url);
  if (REDIRECTED_HOSTS.has(url.hostname)) {
    return Response.redirect(`https://${MAIN_HOST}${url.pathname}${url.search}`, 301);
  }
  return context.next();
};
