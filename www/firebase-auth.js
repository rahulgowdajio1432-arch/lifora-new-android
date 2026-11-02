/* LIFORA Firebase Phone OTP Authentication — Firebase compat SDK */
(function(){
  const config = {
    apiKey: "AIzaSyAfKyUy3tWSKyRKtnJBMtKiaVVpb7Gn-2Q",
    authDomain: "lifora-30a21.firebaseapp.com",
    projectId: "lifora-30a21",
    storageBucket: "lifora-30a21.firebasestorage.app",
    messagingSenderId: "472133841604",
    appId: "1:472133841604:android:3cc20e05b6624a4fae0f91"
  };
  const login = document.getElementById("loginView");
  if(!login) return;
  login.innerHTML = `
    <div class="login-aura login-aura-one"></div><div class="login-aura login-aura-two"></div>
    <main class="login-shell">
      <div class="login-brand-mark"><div class="login-emblem">L</div><div class="login-wordmark">LIFORA</div><div class="login-tagline">YOUR LIFE. ORGANIZED.</div><div class="login-divider"><span></span> ✦ <span></span></div></div>
      <div class="login-content">
        <div class="login-kicker">PRIVATE LIFE ORGANIZER</div>
        <h2 id="otpTitle">Welcome to LIFORA</h2>
        <p id="otpDesc">Enter your mobile number to receive a one-time verification code.</p>
        <div id="phonePane"><label for="liforaPhone">Mobile number</label><input class="field" id="liforaPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 9876543210" maxlength="16"><div id="recaptcha-container" style="display:flex;justify-content:center;margin:14px 0"></div><button class="btn login-unlock" id="sendOtpBtn" type="button">Send OTP</button></div>
        <div id="codePane" class="hidden"><label for="liforaCode">6-digit OTP</label><input class="field" id="liforaCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="Enter OTP"><button class="btn login-unlock" id="verifyOtpBtn" type="button" style="margin-top:12px">Verify & Open LIFORA</button><button class="login-reset" id="changePhoneBtn" type="button">Change mobile number</button></div>
        <div id="otpStatus" class="pin-status" aria-live="polite">Your number is used to sign in securely.</div>
      </div>
      <div class="login-footer"><span>PLAN</span><i>•</i><span>TRACK</span><i>•</i><span>ACHIEVE</span><small>POWERED BY VR TECH SOLUTIONS</small></div>
    </main>`;
  const loadSdk=(src)=>new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)});
  let confirmation=null, verifier=null;
  const status=(t)=>document.getElementById("otpStatus").textContent=t;
  const send=document.getElementById("sendOtpBtn"), verify=document.getElementById("verifyOtpBtn");
  function phone(){let p=document.getElementById("liforaPhone").value.trim().replace(/[\\s()-]/g,"");if(/^\\d{10}$/.test(p))p="+91"+p;return p}
  function setupCaptcha(){if(verifier){try{verifier.clear()}catch(e){}}verifier=new firebase.auth.RecaptchaVerifier("recaptcha-container",{size:"normal"});return verifier.render()}
  async function start(){try{send.disabled=true;status("Loading secure sign-in…");await loadSdk("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");await loadSdk("https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js");if(!firebase.apps.length)firebase.initializeApp(config);firebase.auth().useDeviceLanguage();await setupCaptcha();status("Complete the reCAPTCHA, then tap Send OTP.");send.disabled=false;}catch(e){status("Firebase setup failed: "+(e.message||e));send.disabled=false}}
  send.addEventListener("click",async()=>{try{const p=phone();if(!/^\\+[1-9]\\d{7,14}$/.test(p)){status("Enter a valid phone number with country code (example: +91 9876543210).");return}send.disabled=true;status("Sending OTP…");confirmation=await firebase.auth().signInWithPhoneNumber(p,verifier);document.getElementById("phonePane").classList.add("hidden");document.getElementById("codePane").classList.remove("hidden");document.getElementById("otpTitle").textContent="Verify Your Number";document.getElementById("otpDesc").textContent="Enter the SMS code sent to "+p;status("OTP sent. SMS delivery may take a moment.");}catch(e){status(e.message||"Could not send OTP. Check Firebase Phone Auth and SMS settings.");try{await setupCaptcha()}catch(x){}send.disabled=false}});
  verify.addEventListener("click",async()=>{try{const code=document.getElementById("liforaCode").value.trim();if(!/^\\d{6}$/.test(code)){status("Enter the 6-digit OTP.");return}verify.disabled=true;status("Verifying code…");await confirmation.confirm(code);localStorage.setItem("lifora_phone",phone());document.getElementById("loginView").classList.add("hidden");document.getElementById("appView").classList.remove("hidden");if(typeof load==="function")load();if(typeof render==="function")render();status("Verified.");}catch(e){status(e.message||"OTP verification failed.");verify.disabled=false}});
  document.getElementById("changePhoneBtn").addEventListener("click",()=>{confirmation=null;document.getElementById("codePane").classList.add("hidden");document.getElementById("phonePane").classList.remove("hidden");document.getElementById("otpTitle").textContent="Welcome to LIFORA";document.getElementById("otpDesc").textContent="Enter your mobile number to receive a one-time verification code.";status("Enter your number again.");});
  document.getElementById("liforaPhone").value=localStorage.getItem("lifora_phone")||"+91 ";
  start();
})();