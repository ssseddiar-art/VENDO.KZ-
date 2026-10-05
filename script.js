const products=[["iPhone 15 256 GB","Электроника",399990,"images/iphone15.jpg"],["Nike Air Force 1","Аяқ киім",49990,"images/nike-air-force.jpg"],["BACKPACK NIKE NK HERITAGE EUGENE WNTRZD BKPK (DN3592-010)","Киім",24990,"images/backpack.jpg"],["JBL LIVE 660NC сымсыз/сымды құлаққаптар қара түсті 2021","Электроника",39990,"images/jbl.jpg"],["Smart Watch - Ерлер мен әйелдерге арналған ақылды сағаттар тонометрмен жауап береді/қоңырауға жауап береді","Электроника",59990,"images/smart_watch.jpg"],["Ерлерге арналған Puma Teamliga спорттық костюмі Puma Black/Sun Stream, sS","Спорт",45990,"images/teamLIGA_Football.jpg"],["PS5 үшін PlayStation DualSense сымсыз контроллері","Ойындар",29990,"images/playstation-ps5.jpg"],["Жарықдиодты төбеге арналған қабырға шамы LED RIO 48W 4000K","Үйге арналған",12990,"images/svet.jpg"]];let cart=JSON.parse(localStorage.getItem("vendoCartV2")||"{}");
const cartTotal=()=>Object.values(cart).reduce((s,n)=>s+n,0);
const cartSum=()=>products.reduce((s,p)=>s+(cart[p[0]]?cart[p[0]]*p[2]:0),0);
const saveCart=()=>localStorage.setItem("vendoCartV2",JSON.stringify(cart));
const money=n=>n.toLocaleString("kk-KZ")+" ₸";
function render(list=products){const grid=document.getElementById("productGrid");if(!grid)return;grid.innerHTML=list.map(p=>`<article class="product"><div class="product-pic"><img src="${p[3]}" alt="${p[0]}" loading="lazy" onerror="this.style.display='none';this.parentElement.textContent='Сурет табылмады';"></div><small>${p[1]}</small><h3>${p[0]}</h3><div class="price">${money(p[2])}</div><button class="add" onclick="addCart('${p[0]}')">${cart[p[0]]?"Себетте: "+cart[p[0]]+" шт · Қосу +":"Себетке қосу"}</button></article>`).join("")}
function updateCart(){const el=document.getElementById("cartCount");if(el){el.textContent=cartTotal();el.style.display=cartTotal()?"":"none"}}
function addCart(name){cart[name]=(cart[name]||0)+1;saveCart();updateCart();renderAll();bumpCart();showToast(name+" себетке қосылды ("+cart[name]+" шт)")}
function removeItem(name){if(cart[name]&&cart[name]>1){cart[name]--;saveCart();updateCart();renderAll();showToast("1 дана өшірілді: "+name)}else{delete cart[name];saveCart();updateCart();renderAll();showToast("Тауар өшірілді: "+name)}}
function removeLine(name){const q=cart[name]||0;delete cart[name];saveCart();updateCart();renderAll();showToast(q?"Өшірілді: "+name:"Тауар табылмады")}
function clearCart(){cart={};saveCart();updateCart();renderAll();showToast("Себет босатылды")}
function renderAll(){render();if(document.getElementById("modal").classList.contains("show"))openCart()}
function bumpCart(){const btn=document.querySelector(".cart-btn");const num=document.getElementById("cartCount");if(btn){btn.classList.remove("bump");void btn.offsetWidth;btn.classList.add("bump")}if(num){num.classList.remove("pop");void num.offsetWidth;num.classList.add("pop")}}
function filterCategory(cat){render(products.filter(p=>p[1]===cat))}
function showAll(){render(products)}
function search(){const q=(document.getElementById("search")?.value||"").toLowerCase().trim();render(q?products.filter(p=>(p[0]+" "+p[1]).toLowerCase().includes(q)):products)}
function openCart(){
  const names=Object.keys(cart).filter(n=>cart[n]>0);
  let inner;
  if(!names.length){
    inner=`<div class="cart-empty"><span></span><h2>Себет бос</h2><p>Әзіше ешбір тауар қосылмады.</p><button class="primary" onclick="closeModal()">Тауар таңдауға өту</button></div>`;
  }else{
    const rows=names.map(n=>{const p=products.find(x=>x[0]===n);if(!p)return "";const q=cart[n];return `
      <div class="cart-item">
        <div class="cart-item-pic"><img src="${p[3]}" alt="${p[0]}" onerror="this.style.display='none';this.parentElement.textContent='📦'"></div>
        <div class="cart-item-info"><small>${p[1]}</small><b>${p[0]}</b><span class="cart-item-price">${money(p[2])}</span></div>
        <div class="qty">
          <button onclick="removeItem('${n}')" title="Бір дана өшіру">−</button>
          <b>${q} шт</b>
          <button onclick="addCart('${n}')" title="Тағы қосу">+</button>
        </div>
        <div class="cart-item-sum">${money(p[2]*q)}</div>
        <button class="cart-del" onclick="removeLine('${n}')" title="Толық өшіру">✕</button>
      </div>`}).join("");
    inner=`
      <div class="cart-head"><h2> Себет (${cartTotal()} шт)</h2><button class="cart-clear" onclick="clearCart()">Барлығын өшіру</button></div>
      <div class="cart-list">${rows}</div>
      <div class="cart-foot"><div class="cart-total">Барлығы: <b>${money(cartSum())}</b></div><button class="primary" onclick="checkout()">Тапсырыс беру →</button></div>`;
  }
  openModal(inner);
}
function checkout(){
  if(!cartTotal()){showToast("Себет бос!");return}
  openPayment();
}

/* ================= КАРТА ТӨЛЕМІ (демо) =================
   ЕСКЕРТУ: карта деректері серверге/браузерде сақталмайды және нақты ақша алынбайды.
   Нақты төлем үшін payWithProvider() ішінде төлем провайдерінің (Kaspi Pay, Halyk ePay,
   Freedom Pay, CloudPayments) хостталған төлем бетіне бағыттау керек — backend қажет. */
let payMethod="card";
function openPayment(){
  const sum=cartSum();
  openModal(`
    <div class="pay-box">
      <h2>  Төлем</h2>
      <p class="pay-sum">Төлейтін сома: <b>${money(sum)}</b></p>
      <div class="pay-tabs">
        <button type="button" id="tabCard" class="active" onclick="setPayMethod('card')">Банк картасы</button>
        <button type="button" id="tabCash" onclick="setPayMethod('cash')">Қолма-қол</button>
      </div>
      <form id="payForm" onsubmit="submitPayment(event)" novalidate>
        <div id="cardFields">
          <div class="pay-card-preview"><span id="pvBrand">CARD</span><b id="pvNum">•••• •••• •••• ••••</b><div><small id="pvName">КАРТА ИЕСІ</small><small id="pvExp">ММ/ЖЖ</small></div></div>
          <label>Карта нөмірі<input id="cardNum" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="0000 0000 0000 0000" oninput="fmtCard(this)"></label>
          <label>Карта иесінің аты<input id="cardName" autocomplete="cc-name" placeholder="ELDIYAR A." oninput="this.value=this.value.toUpperCase();pvUpdate()"></label>
          <div class="pay-row">
            <label>Мерзімі<input id="cardExp" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="ММ/ЖЖ" oninput="fmtExp(this)"></label>
            <label>CVV<input id="cardCvv" type="password" inputmode="numeric" autocomplete="cc-csc" maxlength="3" placeholder="•••"></label>
          </div>
        </div>
        <div id="cashInfo" class="pay-cash" style="display:none">Тауарды алған кезде курьерге қолма-қол немесе картамен төлейсіз.</div>
        <p id="payErr" class="pay-err"></p>
        <button class="primary pay-btn" id="payBtn" type="submit">Төлеу ${money(sum)}</button>
        <small class="pay-note"></small>
      </form>
    </div>`);
}
function setPayMethod(m){
  payMethod=m;
  document.getElementById("tabCard").classList.toggle("active",m==="card");
  document.getElementById("tabCash").classList.toggle("active",m==="cash");
  document.getElementById("cardFields").style.display=m==="card"?"":"none";
  document.getElementById("cashInfo").style.display=m==="cash"?"":"none";
  document.getElementById("payErr").textContent="";
  document.getElementById("payBtn").textContent=m==="card"?"Төлеу "+money(cartSum()):"Тапсырысты растау";
}
function fmtCard(el){
  el.value=el.value.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  pvUpdate();
}
function fmtExp(el){
  let v=el.value.replace(/\D/g,"").slice(0,4);
  if(v.length>=3)v=v.slice(0,2)+"/"+v.slice(2);
  el.value=v;pvUpdate();
}
function cardBrand(n){
  n=n.replace(/\s/g,"");
  if(/^4/.test(n))return "VISA";
  if(/^(5[1-5]|2[2-7])/.test(n))return "MASTERCARD";
  if(/^220[0-4]/.test(n))return "МИР";
  return "CARD";
}
function pvUpdate(){
  const num=document.getElementById("cardNum").value.replace(/\s/g,"");
  const shown=(num+"••••••••••••••••").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  document.getElementById("pvNum").textContent=shown;
  document.getElementById("pvBrand").textContent=cardBrand(num);
  document.getElementById("pvName").textContent=document.getElementById("cardName").value||"КАРТА ИЕСІ";
  document.getElementById("pvExp").textContent=document.getElementById("cardExp").value||"ММ/ЖЖ";
}
function luhn(num){
  let sum=0,alt=false;
  for(let i=num.length-1;i>=0;i--){
    let d=+num[i];
    if(alt){d*=2;if(d>9)d-=9}
    sum+=d;alt=!alt;
  }
  return num.length>=13&&sum%10===0;
}
function validateCard(){
  const num=document.getElementById("cardNum").value.replace(/\s/g,"");
  const name=document.getElementById("cardName").value.trim();
  const exp=document.getElementById("cardExp").value;
  const cvv=document.getElementById("cardCvv").value;
  if(!luhn(num))return "Карта нөмірі қате";
  if(name.length<3)return "Карта иесінің атын жазыңыз";
  const m=/^(\d{2})\/(\d{2})$/.exec(exp);
  if(!m||+m[1]<1||+m[1]>12)return "Мерзімі қате (ММ/ЖЖ)";
  const now=new Date(),y=now.getFullYear()%100,mo=now.getMonth()+1;
  if(+m[2]<y||(+m[2]===y&&+m[1]<mo))return "Картаның мерзімі өтіп кеткен";
  if(!/^\d{3}$/.test(cvv))return "CVV 3 сан болуы керек";
  return "";
}
function submitPayment(e){
  e.preventDefault();
  const err=document.getElementById("payErr");
  if(payMethod==="card"){
    const msg=validateCard();
    if(msg){err.textContent=msg;return}
  }
  err.textContent="";
  const btn=document.getElementById("payBtn");
  btn.disabled=true;btn.textContent="Өңделуде...";
  payWithProvider().then(()=>finishOrder(payMethod)).catch(()=>{
    err.textContent="Төлем өтпеді. Қайталап көріңіз.";
    btn.disabled=false;btn.textContent="Төлеу "+money(cartSum());
  });
}
/* Нақты интеграция осы жерде жасалады:
   1) backend-ке себетті жібересіз: fetch("/api/orders",{method:"POST",body:JSON.stringify(cart)})
   2) backend провайдерден төлем сілтемесін алады
   3) window.location = paymentUrl  -> клиент карта деректерін провайдер бетінде енгізеді
   4) төлемнен кейін провайдер сіздің backend-ке webhook жібереді */
function payWithProvider(){
  return new Promise(res=>setTimeout(res,1400));
}
function finishOrder(method){
  const sum=cartSum();
  const id="VK-"+Date.now().toString().slice(-6);
  cart={};saveCart();updateCart();renderAll();closeModal();
  openModal(`<div class="cart-empty"><span>✅</span><h2>${method==="card"?"Төлем сәтті өтті!":"Тапсырыс қабылданды!"}</h2><p>Тапсырыс №: <b>${id}</b></p><p>Сома: <b>${money(sum)}</b> · ${method==="card"?"Карта":"Қолма-қол"}</p><p>Біздің менеджер жақын арада сізбен байланысады.</p><button class="primary" onclick="closeModal()">Жақсы!</button></div>`);
}
function openModal(content){document.getElementById("modalContent").innerHTML=content;document.getElementById("modal").classList.add("show")}
function closeModal(){document.getElementById("modal").classList.remove("show")}
function backdrop(e){if(e.target.id==="modal")closeModal()}
function showToast(text){const t=document.getElementById("toast");if(!t)return;t.textContent=text;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function sendMessage(e){e.preventDefault();e.target.reset();showToast("Хабарлама сәтті жіберілді ✓")}

/* ================= ҚОЛДАНУШЫ (кіру/профиль) ================= */
const getUser=()=>JSON.parse(localStorage.getItem("vendoUser")||"null");
function updateUserIcon(){
  const user=getUser();
  const link=document.querySelector('.head-icon[href="login.html"]');
  if(!link)return;
  if(user){
    link.removeAttribute("href");
    link.onclick=()=>openProfile();
    link.textContent=user.name.trim().charAt(0).toUpperCase();
    link.classList.add("user-avatar");
    link.title=user.name;
  }else{
    link.setAttribute("href","login.html");
    link.onclick=null;
    link.textContent="♙";
    link.classList.remove("user-avatar");
    link.title="Кіру";
  }
}
function openProfile(){
  const user=getUser();
  if(!user)return;
  openModal(`
    <div class="profile-box">
      <div class="profile-avatar">${user.name.trim().charAt(0).toUpperCase()}</div>
      <h2>${user.name}</h2>
      <p class="profile-line">✉ ${user.email}</p>
      ${user.phone?`<p class="profile-line">☎ ${user.phone}</p>`:""}
      <p class="profile-line">🛒 Себетте: <b>${cartTotal()} тауар</b></p>
      <div class="profile-actions">
        <button class="primary" onclick="closeModal();openCart()">Себетті көру</button>
        <button class="profile-logout" onclick="logout()">Шығу</button>
      </div>
    </div>`);
}
function logout(){localStorage.removeItem("vendoUser");closeModal();updateUserIcon();showToast("Сіз жүйеден шықтыңыз")}
document.addEventListener("DOMContentLoaded",updateUserIcon);
updateUserIcon();
render();updateCart();

// Promo carousel
let promoIndex=0;
let promoTimer;
function showPromo(index){
  const slides=document.querySelectorAll('.promo-slide');
  const dots=document.querySelectorAll('.promo-dot');
  if(!slides.length)return;
  promoIndex=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===promoIndex));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===promoIndex));
}
function goPromo(index){showPromo(index);restartPromoTimer()}
function changePromo(step){showPromo(promoIndex+step);restartPromoTimer()}
function restartPromoTimer(){clearInterval(promoTimer);promoTimer=setInterval(()=>showPromo(promoIndex+1),4500)}
document.addEventListener('DOMContentLoaded',()=>{showPromo(0);restartPromoTimer()});

/* ================= ANIMATIONS ================= */

// --- Scroll reveal: элементтер пайда болғанда жұмсақ анимациямен шығады ---
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el=entry.target;
      const delay=Number(el.dataset.delay||0);
      setTimeout(()=>{
        el.classList.add('in');
        const cleanup=()=>el.classList.remove('reveal','reveal-left','reveal-right','reveal-zoom','in');
        // Анимация біткен соң reveal-кластарын алу — hover эффекттері істеп тұруы үшін
        el.addEventListener('transitionend',cleanup,{once:true});
        // Сақтық: transitionend іске қоспаса да, мазмұн жасырылып қалмауы керек
        setTimeout(cleanup,delay+950);
      },delay);
      revealObserver.unobserve(el);
    }
  })
},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
function initReveal(){
  // Басты бет: санаттар
  document.querySelectorAll('.categories a').forEach((el,i)=>{el.classList.add('reveal-zoom');el.dataset.delay=i*70;revealObserver.observe(el)});
  // Өнім карточкалары (render қайта шақырылса да жаңартылады)
  observeProducts();
  // Артықшылықтар / қызметтер / жаңалықтар
  document.querySelectorAll('.features article,.service-grid article,.news-grid article').forEach((el,i)=>{el.classList.add('reveal');el.dataset.delay=(i%4)*90;revealObserver.observe(el)});
  // Басқа блоктар
  document.querySelectorAll('.about-layout>*,.contact-layout>*,.page-heading,.title-row,.promo,.stats,.subheading,.map').forEach(el=>{el.classList.add('reveal');revealObserver.observe(el)});
}
function observeProducts(){
  document.querySelectorAll('#productGrid .product:not(.reveal)').forEach((el,i)=>{
    el.classList.add('reveal');el.dataset.delay=(i%4)*80;revealObserver.observe(el);
  });
}

// --- Өнімдер қайта салынғанда жаңа карточкаларды да бақылау ---
const _origRender=render;
render=function(list){_origRender(list);observeProducts()}

// --- Stats сандарды өсіру (count-up) ---
function animateCount(el){
  const raw=el.textContent;
  const m=raw.match(/^([\d.,]+)(.*)$/);
  if(!m)return;
  const target=parseFloat(m[1].replace(/,/g,''));
  const suffix=m[2]||'';
  const dur=1400;const start=performance.now();
  function tick(now){
    const p=Math.min((now-start)/dur,1);
    const eased=1-Math.pow(1-p,3);
    const val=Math.round(target*eased);
    el.textContent=val.toLocaleString('kk-KZ').replace(/,/g,' ')+suffix;
    if(p<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const statsObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCount(e.target);statsObserver.unobserve(e.target)}})
},{threshold:.5});
document.querySelectorAll('.stats strong').forEach(el=>statsObserver.observe(el));

// --- Батырмаларға ripple эффект ---
document.addEventListener('click',e=>{
  const btn=e.target.closest('.primary,.add,.link-btn,.promo-arrow,.promo-dot');
  if(!btn)return;
  const rect=btn.getBoundingClientRect();
  const ink=document.createElement('span');
  ink.className='ripple-ink';
  const size=Math.max(rect.width,rect.height);
  ink.style.width=ink.style.height=size+'px';
  ink.style.left=(e.clientX-rect.left-size/2)+'px';
  ink.style.top=(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(ink);
  setTimeout(()=>ink.remove(),650);
});

// --- Тышқанмен горизонталь тегіреу: карусельді сырғытып ауыстыру ---
(function(){
  const carousel=document.getElementById('promoCarousel');
  if(!carousel)return;
  let startX=null;
  carousel.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input'))return;startX=e.clientX});
  carousel.addEventListener('pointerup',e=>{
    if(startX===null)return;
    const dx=e.clientX-startX;
    if(Math.abs(dx)>50)changePromo(dx<0?1:-1);
    startX=null;
  });
})();

// --- Keyboard: карусельді жебемен ауыстыру (мәтін өрістерінде жұмыс істемейді) ---
document.addEventListener('keydown',e=>{
  const t=e.target;
  if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.isContentEditable))return;
  if(e.key==='ArrowLeft')changePromo(-1);
  if(e.key==='ArrowRight')changePromo(1);
});

// --- Scroll-to-top батырмасы ---
(function(){
  const btn=document.createElement('button');
  btn.id='toTop';btn.innerHTML='↑';btn.title='Жоғары';
  btn.setAttribute('aria-label','Жоғары жылжу');
  document.body.appendChild(btn);
  btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  window.addEventListener('scroll',()=>{
    btn.classList.toggle('show',window.scrollY>500);
  },{passive:true});
})();

initReveal();
