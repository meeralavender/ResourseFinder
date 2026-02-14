// Simple demo auth using localStorage
// - This is a client-side prototype only. Do NOT use in production.

(function(){
  const usersKey = 'ami_users_v1';
  const currentUserKey = 'ami_current_user_v1';

  function readUsers(){
    try{ return JSON.parse(localStorage.getItem(usersKey)) || []; }
    catch(e){ return []; }
  }
  function writeUsers(u){ localStorage.setItem(usersKey, JSON.stringify(u)); }

  function setCurrent(user){ localStorage.setItem(currentUserKey, JSON.stringify(user)); }
  function clearCurrent(){ localStorage.removeItem(currentUserKey); }

  // Signup flow
  const signupForm = document.getElementById('signupForm');
  if(signupForm){
    signupForm.addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const notify = document.getElementById('notifications').checked;

      if(password.length < 8){ alert('Password must be at least 8 characters'); return; }
      const users = readUsers();
      if(users.find(u => u.email === email)){ alert('An account with this email already exists. Please login.'); return; }

      const user = { id: Date.now(), name, email, password, preferences: { notifications: !!notify }, saved: [] };
      users.push(user); writeUsers(users); setCurrent({id: user.id, name: user.name, email: user.email});
      alert('Account created — you are signed in (demo)');
      window.location.href = 'index.html';
    });
  }

  // Login flow
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('email').value.trim().toLowerCase();
      const password = document.getElementById('password').value;
      const users = readUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if(!user){ alert('Invalid credentials (demo)'); return; }
      setCurrent({id: user.id, name: user.name, email: user.email});
      alert('Signed in successfully (demo)');
      window.location.href = 'index.html';
    });
  }

  // Expose simple API for other pages
  window.AuthDemo = {
    getCurrent: function(){ try{ return JSON.parse(localStorage.getItem(currentUserKey)); }catch(e){return null;} },
    logout: function(){ clearCurrent(); window.location.href = 'index.html'; },
    saveOpportunity: function(item){
      const cur = this.getCurrent(); if(!cur) return false;
      const users = readUsers();
      const user = users.find(u=>u.id===cur.id);
      if(!user) return false;
      user.saved = user.saved || [];
      user.saved.push(item);
      writeUsers(users);
      return true;
    }
  };

  // run on load
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', replaceHeaderAuth);
  } else replaceHeaderAuth();
  // Update header buttons on index and other pages
  function replaceHeaderAuth(){
    try{
      const cur = window.AuthDemo.getCurrent();
      const authArea = document.querySelector('.auth-buttons');
      if(!authArea) return;
      if(cur){
        authArea.innerHTML = `
          <div class="user-badge">Hi, ${escapeHtml(cur.name || cur.email.split('@')[0])}</div>
          <button id="btn-logout" class="btn-signup">Logout</button>
        `;
        const out = document.getElementById('btn-logout');
        if(out) out.addEventListener('click', ()=>{ window.AuthDemo.logout(); });
      } else {
        authArea.innerHTML = `
          <button onclick="location.href='signup.html'" class="btn-signup">Sign Up</button>
          <button onclick="location.href='login.html'" class="btn-login">Login</button>
        `;
      }
      setTimeout(renderNotificationsUI, 80);
    }catch(e){/* ignore */}
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'': '&#39;'}[m]; }); }

  // (old load handled earlier) --- keep compatibility

})();