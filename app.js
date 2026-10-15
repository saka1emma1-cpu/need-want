let decisions = JSON.parse(localStorage.getItem('nw')||'[]');
let score = parseInt(localStorage.getItem('nw_score')||'0');
updateUI();
function decide(){
 let item=document.getElementById('item').value;
 let price=parseInt(document.getElementById('price').value)||0;
 let choice=document.getElementById('choice').value;
 let why=document.getElementById('why').value;
 if(!item||!price||choice=='Choose...') return alert('Fill all');
 let days=Math.floor(price/200);
 let msg='';
 if(choice=='WANT'){
   score=Math.max(0,score-2);
   msg=`<b style=color:red>❌ WANT!</b><br>₦${price} = <b>${days} days</b> of your future SECURITY gone.<br><small>If you skip it, you save ₦${price} for growth.</small>`;
 }else{
   score+=5;
   if(why.length<10) msg=`<b style=color:orange>⚠️ NEED but reason weak</b><br>Real NEED helps you survive, work, or learn.`;
   else msg=`<b style=color:green>✅ TRUE NEED</b><br>Good! ₦${price} for ${item} protects you.`;
   if(why.toLowerCase().match(/learn|work|business|school|job/)){score+=3; msg+='<br>💡 GROWTH Need +3 bonus!'}
 }
 decisions.unshift({item,price,choice,why,date:new Date().toLocaleDateString()});
 localStorage.setItem('nw',JSON.stringify(decisions.slice(0,50)));
 localStorage.setItem('nw_score',score);
 document.getElementById('result').innerHTML=msg;
 updateUI();
}
function updateUI(){
 document.getElementById('score').innerText='Score: '+score+(score<20?' 😴':score<50?' 🙂':' 🔥');
 document.getElementById('history').innerHTML=decisions.map(d=>`<div class="${d.choice=='NEED'?'need':'want'} card"><b>${d.item}</b> ₦${d.price} - ${d.choice}<br><small>${d.why} | ${d.date}</small></div>`).join('');
}
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');
