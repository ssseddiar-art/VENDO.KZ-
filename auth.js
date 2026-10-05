// ---------- VENDO.KZ Auth (демо, localStorage) ----------
function err(id,msg){const el=document.getElementById(id);if(el)el.textContent=msg||""}

// Қолданушылар: { [email]: {name,email,phone,pass} }
const getUsers=()=>JSON.parse(localStorage.getItem("vendoUsers")||"{}");
const saveUsers=u=>localStorage.setItem("vendoUsers",JSON.stringify(u));

// ---------- КІРУ ----------
const lf=document.getElementById("loginForm");
if(lf)lf.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("loginEmail"),pass=document.getElementById("loginPass");
  err("loginEmailError","");err("loginPassError","");
  let ok=true;
  if(email.value.trim().length<3){err("loginEmailError","Email немесе телефон енгізіңіз");ok=false}
  if(pass.value.length<6){err("loginPassError","Кемінде 6 таңба болу керек");ok=false}
  if(!ok)return;
  const users=getUsers();
  const key=email.value.trim().toLowerCase();
  const user=users[key];
  if(!user){err("loginEmailError","Мұндай аккаунт табылмады — алдымен тіркеліңіз");return}
  if(user.pass!==pass.value){err("loginPassError","Құпиясөз дұрыс емес");return}
  localStorage.setItem("vendoUser",JSON.stringify({name:user.name,email:user.email,phone:user.phone}));
  showToast("Қош келдіңіз, "+user.name+"! ✓");
  setTimeout(()=>location.href="index.html",700);
});

// ---------- ТІРКЕЛУ ----------
const rf=document.getElementById("registerForm");
if(rf)rf.addEventListener("submit",e=>{
  e.preventDefault();
  const name=document.getElementById("regName"),email=document.getElementById("regEmail"),
        phone=document.getElementById("regPhone"),pass=document.getElementById("regPass");
  ["regNameError","regEmailError","regPhoneError","regPassError"].forEach(x=>err(x,""));
  let ok=true;
  if(name.value.trim().length<2){err("regNameError","Аты-жөніңізді енгізіңіз");ok=false}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){err("regEmailError","Email дұрыс емес");ok=false}
  if(phone.value.replace(/\D/g,"").length<10){err("regPhoneError","Телефон толық емес (мыс: +7 700 123 45 67)");ok=false}
  if(pass.value.length<6){err("regPassError","Кемінде 6 таңба болу керек");ok=false}
  if(!ok)return;
  const users=getUsers();
  const key=email.value.trim().toLowerCase();
  if(users[key]){err("regEmailError","Бұл email-мен аккаунт бар — кіріңіз");return}
  users[key]={name:name.value.trim(),email:email.value.trim(),phone:phone.value.trim(),pass:pass.value};
  saveUsers(users);
  showToast("Аккаунт жасалды! Енді кіріңіз ✓");
  setTimeout(()=>location.href="login.html",700);
});

// ---------- Құпиясөзді көрсету/жасыру ----------
document.querySelectorAll("[data-toggle]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const input=document.getElementById(btn.dataset.toggle);
    if(!input)return;
    const show=input.type==="password";
    input.type=show?"text":"password";
    btn.textContent=show?"🙈":"👁";
  });
});

// ---------- Кішкене toast (auth беттер үшін, style.css жүктелмесе де) ----------
function showToast(text){
  let t=document.getElementById("authToast");
  if(!t){t=document.createElement("div");t.id="authToast";document.body.appendChild(t)}
  t.textContent=text;
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}
