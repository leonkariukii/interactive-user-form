// Minimal JS: validation, localStorage, conditional rendering, template literals, quotes loop
const STORAGE_KEY = 'userProfile_v1';
const QUOTES = [
  "Believe you can and you're halfway there.",
  "Small steps every day lead to big changes.",
  "Focus on progress, not perfection.",
  "Your potential is endless — keep going.",
  "Consistency beats intensity over time."
];

const qs = id => document.getElementById(id);
const form = qs('profile-form');
const nameInput = qs('name');
const ageInput = qs('age');
const errorBox = qs('error');
const greeting = qs('greeting');
const months = qs('months');
const adultSection = qs('adult-section');
const quotesList = qs('quotes-list');
const clearBtn = qs('clear-btn');

function validate(name, ageRaw){
  const errs = [];
  const nameTrim = (name||'').trim();
  if(!nameTrim) errs.push('Please enter your name.');
  const ageNum = Number(ageRaw);
  if(!Number.isInteger(ageNum) || ageNum < 0 || ageNum > 130) errs.push('Age must be an integer between 0 and 130.');
  return {ok: errs.length===0, errors:errs, name:nameTrim, age:ageNum};
}

function showErrors(arr){
  if(!arr || arr.length===0){
    errorBox.textContent = '';
    errorBox.classList.add('sr-only');
    return;
  }
  errorBox.classList.remove('sr-only');
  errorBox.textContent = arr.join(' ');
}

function saveProfile(profile){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(profile)); }catch(e){console.warn('localStorage failed',e)}
}

function loadProfile(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return null;
    return JSON.parse(raw);
  }catch(e){return null}
}

function calcMonths(age){ return age * 12; }

function renderAdultSection(age){
  if(age >= 18){
    adultSection.classList.remove('hidden');
    adultSection.setAttribute('aria-hidden','false');
    adultSection.innerHTML = '<strong>Adult content</strong><p>You are eligible for adult content and features.</p>';
  } else {
    adultSection.classList.add('hidden');
    adultSection.setAttribute('aria-hidden','true');
    adultSection.innerHTML = '';
  }
}

function renderGreeting(name){
  greeting.innerHTML = name ? `<h2>Hello, ${escapeHtml(name)}!</h2>` : '<h2>Hello!</h2>';
}

function renderMonths(age){
  months.innerHTML = age !== undefined && age !== null ? `<p>Age in months: <strong>${calcMonths(age)}</strong></p>` : '';
}

function renderQuotes(){
  quotesList.innerHTML = '';
  // loop 5 times and append each quote
  for(let i=0;i<QUOTES.length;i++){
    const li = document.createElement('li');
    li.textContent = QUOTES[i];
    quotesList.appendChild(li);
  }
}

function escapeHtml(str){
  return str.replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[s]);
}

function renderAll(profile){
  if(!profile) return;
  renderGreeting(profile.name);
  renderMonths(profile.age);
  renderAdultSection(profile.age);
  renderQuotes();
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  const result = validate(nameInput.value, ageInput.value);
  if(!result.ok){
    showErrors(result.errors);
    if(!result.name) nameInput.classList.add('error');
    if(!Number.isInteger(result.age)) ageInput.classList.add('error');
    (result.name ? ageInput : nameInput).focus();
    return;
  }
  // clear errors & styles
  showErrors([]);
  nameInput.classList.remove('error'); ageInput.classList.remove('error');

  const profile = {name: result.name, age: result.age, savedAt: (new Date()).toISOString()};
  saveProfile(profile);
  renderAll(profile);
});

clearBtn.addEventListener('click', function(){
  localStorage.removeItem(STORAGE_KEY);
  form.reset();
  showErrors([]);
  greeting.innerHTML = '';
  months.innerHTML = '';
  adultSection.classList.add('hidden');
  quotesList.innerHTML = '';
});

// load on start
document.addEventListener('DOMContentLoaded', function(){
  renderQuotes();
  const p = loadProfile();
  if(p){
    nameInput.value = p.name||'';
    ageInput.value = p.age!==undefined ? p.age : '';
    renderAll(p);
  }
});
