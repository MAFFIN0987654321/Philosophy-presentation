'use strict';
const $=s=>document.querySelector(s),
      P=(n,f)=>Array.from({length:n},(_,i)=>f(i)),
      r1=n=>Math.round(n*10)/10;

/* ---------- Розбиття заголовків на слова (маска-reveal) ---------- */
document.querySelectorAll('.sp').forEach(el=>{
  let n=0;
  el.innerHTML=el.innerHTML.split(/<br\s*\/?>/i).map(l=>
    l.trim().split(/\s+/).map(w=>`<span class="w"><i style="--i:${n++}">${w}</i></span>`).join(' ')
  ).join('<br>');
});

/* ---------- Процедурна SVG-графіка ---------- */
// 3 · ідеальне симетричне місто (потім руйнується)
$('#city').innerHTML=P(16,i=>{
  const d=Math.abs(i-7.5),h=Math.round(120+(8-d)*27),j=(i*7)%5-2;
  return `<rect class="b" x="${i*120+6}" y="${460-h}" width="108" height="${h}" style="--dx:${j*20}px;--dy:${(i*53)%46+14}px;--r:${(i%2?1:-1)*(4+i%4*3)}deg;--d:${(2.3+i*.07).toFixed(2)}s"/>`;
}).join('')+'<path class="b" d="M845 138A115 115 0 0 1 1075 138Z" style="--dx:10px;--dy:70px;--r:-16deg;--d:2.2s"/>';

// 4 · грива лева + народ (точки; частина «відвертається»)
$('#mane').setAttribute('points',P(40,k=>{
  const r=k%2?210:290,a=k/40*Math.PI*2;
  return r1(Math.cos(a)*r)+','+r1(Math.sin(a)*r);
}).join(' '));
$('#crowd').innerHTML=P(72,n=>{
  const c=n%24,r=(n/24)|0,x=84+c*76+(r%2)*38,y=790+r*66,out=(c*5+r*3)%5<2;
  return `<circle class="d${out?' x':''}" cx="${x}" cy="${y}" r="15" style="--p:${(.5+c*.03).toFixed(2)}s;--a:${(3.4+(c*7+r*11)%10*.18).toFixed(2)}s"/>`;
}).join('');

// 5 · вівці витісняють людей
$('#sheep').innerHTML=P(30,n=>{
  const r=(n/10)|0,c=n%10;
  return `<g transform="translate(${190+c*160+(r%2)*70} ${660+r*140})"><use class="sh" href="#sh" style="--i:${(9-c)*3+r}"/></g>`;
}).join('');
$('#ppl').innerHTML=P(9,n=>
  `<g transform="translate(${250+n*100} ${690+n%3*110}) scale(1.5)"><g class="pp" style="--i:${n};--tx:${-260-n*30}px;--ty:${(n%3-1)*40}px"><circle cy="-50" r="9"/><path d="M-13 0L-9-38H9L13 0Z"/></g></g>`
).join('');

// 7 · сім кілець + промені Міста Сонця
$('#rings').innerHTML=P(7,j=>{
  const k=7-j;
  return `<circle class="rg${k%2?' o':''}" r="${62*k}" style="--k:${k}"/>`;
}).join('');
$('#spk').setAttribute('d',P(12,k=>{
  const a=k*Math.PI/6,c=Math.cos(a),s=Math.sin(a);
  return `M${r1(c*62)} ${r1(s*62)}L${r1(c*434)} ${r1(s*434)}`;
}).join(''));

// 8 · стіна знань: радіальна симетрія → сувора сітка
const W=[];
[[1,0],[7,105],[15,205],[25,300]].forEach(([n,r])=>P(n,k=>{
  const a=k/n*Math.PI*2-Math.PI/2;
  W.push([r1(1424+Math.cos(a)*r),r1(508+Math.sin(a)*r)]);
}));
$('#wall').innerHTML=W.map((p,i)=>
  `<use class="k" href="#k${i%6}" width="64" height="64" style="--i:${i};--rx:${p[0]}px;--ry:${p[1]}px;--gx:${1088+i%8*96}px;--gy:${268+(i/8|0)*96}px"/>`
).join('');

// 6 і 8 · циферблат (24 години, виділена частина = години праці)
document.querySelectorAll('.dial').forEach(el=>{
  const r=+el.dataset.r,h=el.dataset.h,w=r*.16,L=r+w+36;
  el.setAttribute('viewBox',`${-L} ${-L} ${2*L} ${2*L}`);
  el.innerHTML=
    `<circle class="disc" r="${r+w+4}"/><circle class="trk" r="${r}" stroke-width="${w}"/>`+
    `<g transform="rotate(-90)"><circle class="arc" r="${r}" stroke-width="${w}" pathLength="24" style="--h:${h}"/></g>`+
    P(24,k=>{
      const a=k*Math.PI/12-Math.PI/2,c=Math.cos(a),s=Math.sin(a),a0=r+w/2+8,a1=a0+(k%6?8:20);
      return `<line class="tk" x1="${r1(c*a0)}" y1="${r1(s*a0)}" x2="${r1(c*a1)}" y2="${r1(s*a1)}"/>`;
    }).join('')+
    `<text class="dn" y="${r*.3}" font-size="${r*.9}">${h}</text><text class="ds" y="${r*.62}" font-size="${r*.15}">із 24 год</text>`;
});

/* ---------- Навігація ---------- */
const S=[...document.querySelectorAll('.s')],N=S.length,cur=$('#cur'),bar=$('#bar');
let i=-1,lock=false;

const fit=()=>document.documentElement.style.setProperty('--k',Math.min(innerWidth/1920,innerHeight/1080));

function go(n){
  if(lock||n===i||n<0||n>=N)return;
  const old=S[i],nu=S[n];
  lock=true;
  if(old)old.classList.add('out');          // старий слайд лишається під новим
  nu.classList.add('on');
  i=n;
  document.documentElement.style.background=nu.dataset.bg;
  document.body.classList.toggle('lt',nu.dataset.l==='1');
  cur.textContent=String(n+1).padStart(2,'0')+' / '+N;
  bar.style.width=(n+1)/N*100+'%';
  history.replaceState(null,'','#'+(n+1));
  setTimeout(()=>{if(old)old.classList.remove('on','out');lock=false},1300);
}
const next=()=>go(i+1<N?i+1:0);   // з останнього — знову на перший (кільце)
const prev=()=>go(i-1);

addEventListener('keydown',e=>{
  const k=e.key;
  if(k==='ArrowRight'||k===' '||k==='PageDown'||k==='Enter')next();
  else if(k==='ArrowLeft'||k==='PageUp')prev();
  else if(k==='Home')go(0);
  else if(k==='End')go(N-1);
  else if(/^[0-9]$/.test(k))go(k==='0'?9:+k-1);
  else if(k==='f'||k==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}
  else return;
  e.preventDefault();
});
addEventListener('click',e=>e.clientX<innerWidth*.3?prev():next());

let tx=0;
addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});
addEventListener('touchend',e=>{
  const d=e.changedTouches[0].clientX-tx;
  if(Math.abs(d)>50)d<0?next():prev();
},{passive:true});

addEventListener('resize',fit);
fit();
const h=parseInt(location.hash.slice(1));
go(h>0&&h<=N?h-1:0);