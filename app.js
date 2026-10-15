let decisions = JSON.parse(localStorage.getItem('nw')||'[]');
let score = parseInt(localStorage.getItem('nw_score')||'0');
updateUI();

const NEED_WORDS = ['rice','garri','beans','food','eat','family','medicine','drug','hospital','school','fees','book','rent','house','transport','fuel','light','nepa','water','work','job','business','learn','child','baby','uniform','church','mosque'];
const WANT_WORDS = ['shawarma','pizza','burger','iphone','samsung s','ps5','bet','alcohol','beer','club','party','wig','lense','makeup','jewelry','gold','shoe new','cloth new','netflix','data extra','betting','lotto','cigarette'];

function smartDecide(text){
  text = text.toLowerCase();
  let needScore = 0, wantScore = 0;
  NEED_WORDS.forEach(w=>{ if(text.includes(w)) needScore+=2 });
  WANT_WORDS.forEach(w=>{ if(text.includes(w)) wantScore+=2 });
  // survival phrases
  if(text.match(/family.*eat|children.*eat|school.*fee|go.*work|to.*work|for.*business/)) needScore+=3;
  if(text.match(/for.*shakara|show.*off|impress|flex|party|enjoy/)) wantScore+=3;
  if(needScore > wantScore) return 'NEED';
  if(wantScore > needScore) return 'WANT';
  return 'UNKNOWN';
}

function decide(){
 let item=document.getElementById('item').value;
 let price=parseInt(document.getElementById('price').value)||0;
 let why=document.getElementById('why').value;
 let userChoice=document.getElementById('choice').value;
 if(!item||!price||!why) return alert('Fill item, price, why - be honest');
 let fullText = item + ' ' + why;
 let brainChoice = smartDecide(fullText);
 let days=Math.floor(price/200);
 let msg='';

 if(brainChoice=='NEED'){
   score+=5;
   if(why.toLowerCase().match(/learn|work|business|school|job/)){score+=3; msg+='💡 GROWTH Need +3! '}
   if(userChoice=='WANT' && brainChoice=='NEED'){
     msg=`<b style=color:orange>⚠️ YOUR BRAIN LIED!</b><br>You said WANT but this is <b style=color:green>TRUE NEED</b>: "${item}"<br>Why: ${why}<br><br><b style=color:green>✅ I corrected you. +5</b>`;
   }else{
     msg=`<b style=color:green>✅ TRUE NEED</b><br>"${item}" for ${why}<br>Good! ₦${price} protects survival.`;
   }
 }else if(brainChoice=='WANT'){
   score=Math.max(0,score-3);
   if(userChoice=='NEED' && brainChoice=='WANT'){
     msg=`<b style=color:red>❌ FAKE NEED! BRAIN TRICK!</b><br>You said NEED but "${item}" = <b>WANT</b><br>Why you wrote: "${why}" sounds like shakara.<br><br>₦${price} = <b>${days} days</b> of SECURITY gone.<br><small>If you skip, save ₦${price} for growth.</small><br><b>Score -3</b>`;
   }else{
     msg=`<b style=color:red>❌ WANT!</b><br>₦${price} = <b>${days} days</b> of future SECURITY gone.<br><small>${item} can wait. Save ₦${price} for growth.</small>`;
   }
 }else{
   // unknown, use user choice
   if(userChoice=='WANT'){ score=Math.max(0,score-2); msg=`<b style=color:red>❌ WANT</b> (not sure, but I trust you) - ${days} days lost`; }
   else{ score+=2; msg=`<b style=color:green>✅ NEED</b> (not sure, but I trust you) +2`; }
   brainChoice = userChoice;
 }

 decisions.unshift({item,price,choice:brainChoice,userSaid:userChoice,why,date:new Date().toLocaleDateString()});
 localStorage.setItem('nw',JSON.stringify(decisions.slice(0,50)));
 localStorage.setItem('nw_score',score);
 document.getElementById('result').innerHTML=msg;
 updateUI();
}

function updateUI(){
 document.getElementById('score').innerText='Score: '+score+(score<20?' 😴':score<50?' 🙂':score<100?' 💪':' 🔥 MASTER');
 document.getElementById('history').innerHTML=decisions.map(d=>`<div class="${d.choice=='NEED'?'need':'want'} card"><b>${d.item}</b> ₦${d.price} - Brain says: ${d.choice} (You said ${d.userSaid||d.choice})<br><small>${d.why} | ${d.date}</small></div>`).join('');
}
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
