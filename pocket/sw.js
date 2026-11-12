'use strict';
const CACHE='letter-pocket-v1';
const APP_URL=new URL('./index.html',self.location.href).href;
const ASSETS=['./','./index.html','./icon.svg','./manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('letter-pocket-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(APP_URL,copy)));return response;}return caches.match(APP_URL).then(cached=>cached||response);}).catch(()=>caches.match(APP_URL)));
 }else{event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));}
});
