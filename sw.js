// Minimal service worker: app opens even on weak network; data is never cached.
const CACHE='sms-shell-v1';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/'))return; // never touch API/data
  e.respondWith(fetch(r).then(res=>{if(r.mode==='navigate'){const c=res.clone();caches.open(CACHE).then(x=>x.put('/',c))}return res}).catch(()=>caches.match(r.mode==='navigate'?'/':r)));
});
