/* ==========================================================================
   SmartRent Portal — shared interactions
   ========================================================================== */

// Build the hero facade: a grid of windows, some "lit" (paid), some
// "amber" (pending), most off (vacant/unpaid) — purely decorative.
function buildFacade(el, cols, rows, litRatio){
  if(!el) return;
  el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  const total = cols * rows;
  let html = '';
  for(let i = 0; i < total; i++){
    const r = Math.random();
    let cls = 'win';
    if(r < litRatio) cls += ' lit';
    else if(r < litRatio + 0.08) cls += ' amber';
    html += `<div class="${cls}"></div>`;
  }
  el.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  buildFacade(document.getElementById('hero-facade'), 6, 5, 0.55);
  buildFacade(document.getElementById('auth-facade'), 4, 9, 0.5);

  // Generic modal open/close
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.openModal);
      if(modal) modal.removeAttribute('hidden');
    });
  });
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if(modal) modal.setAttribute('hidden', '');
    });
  });
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if(e.target === backdrop) backdrop.setAttribute('hidden', '');
    });
  });

  // STK Push demo flow (front-end only — replace with real API call later)
  const stkForm = document.getElementById('stk-form');
  if(stkForm){
    const status = document.getElementById('stk-status');
    stkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      status.hidden = false;
      status.querySelector('.stk-state').textContent = 'Sending prompt to your phone…';
      setTimeout(() => {
        status.querySelector('.stk-state').textContent = 'Enter your M-Pesa PIN on your phone to confirm.';
      }, 1200);
      setTimeout(() => {
        status.querySelector('.stk-state').textContent = 'Payment confirmed. Receipt generated.';
        status.classList.add('stk-success');
      }, 3000);
    });
  }

  // Mobile sidebar label toggle isn't needed (handled via CSS),
  // but role-switch radio buttons should update form action/labels.
  document.querySelectorAll('.role-switch input').forEach(input => {
    input.addEventListener('change', () => {
      const formTitle = document.getElementById('login-title');
      const formSub = document.getElementById('login-sub');
      if(!formTitle) return;
      if(input.value === 'manager'){
        formTitle.textContent = 'Manager login';
        formSub.textContent = 'Sign in to manage properties, tenants and reports.';
      } else if(input.value === 'admin'){
        formTitle.textContent = 'Administrator login';
        formSub.textContent = 'Sign in to configure SmartRent Portal settings.';
      } else {
        formTitle.textContent = 'Tenant login';
        formSub.textContent = 'Sign in to view your balance and pay rent.';
      }
    });
  });

  // Pre-select role from ?role= query string on login page
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if(role){
    const input = document.querySelector(`.role-switch input[value="${role}"]`);
    if(input){ input.checked = true; input.dispatchEvent(new Event('change')); }
  }
});
