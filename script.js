window.onerror=function(m,s,l){var d=document.createElement('div');d.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#b3261e;color:#fff;padding:10px;text-align:center;z-index:99;font:14px sans-serif';d.textContent='Error: '+m+' (line '+l+')';document.body.appendChild(d)};
const $=s=>document.querySelector(s),A=$('#app');
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let detU=null,D,me=null,tab='st',draft=[],tick=null;
function load(){try{D=JSON.parse(localStorage.getItem('drvu'))}catch(e){}
 if(!D)D={admin:{u:'admin',p:'admin123'},students:[],exam:{title:'Mid Exam: Computer and Mobile Application',duration:30,open:true,questions:[]},results:{},prog:{}}}
function save(){try{localStorage.setItem('drvu',JSON.stringify(D))}catch(e){}if(me&&me.role==='a'){put('students',D.students);put('exam',D.exam)}}
load();

/* ---------- CLOUD SYNC (lets students use any device) ---------- */
const CLOUD_URL=''; // optional: paste your Firebase Realtime Database URL here, e.g. 'https://myexam-default-rtdb.firebaseio.com'
let CLOUD=CLOUD_URL,skew=0,pend=[],sync='off',rem=false,busy=0;
try{CLOUD=localStorage.getItem('drvu_cloud')||CLOUD_URL;pend=JSON.parse(localStorage.getItem('drvu_q')||'[]')}catch(e){}
const now=()=>Date.now()+skew;
const ky=u=>u.replace(/[%.$#\[\]\/]/g,c=>'%'+c.charCodeAt(0).toString(16).padStart(2,'0')),pk=u=>encodeURIComponent(ky(u)),uk=k=>decodeURIComponent(k);
const eC=o=>o&&{...o,ans:JSON.stringify(o.ans||{})};
const dC=o=>o&&{...o,ans:typeof o.ans==='string'?JSON.parse(o.ans||'{}'):(o.ans||{})};
async function rq(p,m,b){const r=await fetch(CLOUD.replace(/\/+$/,'')+'/drvu'+(p?'/'+p:'')+'.json',{method:m||'GET',headers:b!==undefined?{'Content-Type':'application/json'}:{},body:b!==undefined?JSON.stringify(b):undefined});if(!r.ok)throw 0;return r.json()}
function put(p,v){if(!CLOUD)return;pend=pend.filter(x=>x.p!==p);pend.push({p,v});sq();flush()}
function sq(){try{localStorage.setItem('drvu_q',JSON.stringify(pend))}catch(e){}}
async function flush(){if(busy||!CLOUD)return;busy=1;try{while(pend.length){const x=pend[0];await rq(x.p,x.v===null?'DELETE':'PUT',x.v===null?undefined:x.v);pend.shift();sq()}sync='on'}catch(e){sync='off'}busy=0;badge()}
async function pull(){if(!CLOUD)return;try{await flush();skew=(await rq('tick','PUT',{'.sv':'timestamp'}))-Date.now();const X=await rq('');
 rem=!!(X&&(X.students||X.exam));
 if(rem){D.students=X.students||[];D.exam={...D.exam,...(X.exam||{}),questions:(X.exam&&X.exam.questions)||[]};D.results={};D.prog={};
  Object.keys(X.results||{}).forEach(k=>D.results[uk(k)]=dC(X.results[k]));Object.keys(X.prog||{}).forEach(k=>D.prog[uk(k)]=dC(X.prog[k]));save()}
 sync='on'}catch(e){sync='off'}badge()}
function pushAll(){put('students',D.students);put('exam',D.exam);Object.keys(D.results).forEach(u=>put('results/'+pk(u),eC(D.results[u])));Object.keys(D.prog).forEach(u=>put('prog/'+pk(u),eC(D.prog[u])))}
function saveProg(u){save();put('prog/'+pk(u),eC(D.prog[u]))}
function badge(){const e=$('#sb');if(!e)return;const ok=sync==='on'&&!pend.length;e.className='bd '+(!CLOUD?'n':ok?'g':'y');e.textContent=!CLOUD?'Local only':ok?'● Synced':'⚠ '+(pend.length?pend.length+' pending':'Offline')}
function setCloud(){const u=prompt('Paste the Firebase Realtime Database URL (leave empty = this device only):',CLOUD);if(u===null)return;CLOUD=u.trim();try{localStorage.setItem('drvu_cloud',CLOUD)}catch(e){}alert(CLOUD?'Server saved on this device.':'Cloud sync turned off.');if(me&&me.role==='a')pull().then(admin)}
setInterval(flush,5000);
setInterval(async()=>{if(!CLOUD||!me||me.role!=='a'||document.hidden)return;if(tab==='rs'||tab==='st'){if([...document.querySelectorAll('.body input,.body textarea')].some(e=>e.value&&e.type!=='file'))return;await pull();admin()}},15000);

const LOGO=`<svg viewBox="0 0 64 64"><path d="M32 3 8 12v18c0 15 10 26 24 31 14-5 24-16 24-31V12z" fill="#d4a82a"/><path d="M32 8 12 15v15c0 12 8 22 20 27 12-5 20-15 20-27V15z" fill="#0a2150"/><path d="M32 22c-5-3-11-3-15-1v16c4-2 10-2 15 1 5-3 11-3 15-1V21c-4-2-10-2-15 1z" fill="#fff"/><path d="M32 22v16" stroke="#d4a82a" stroke-width="2"/></svg>`;
const IC={st:'<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',ex:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',rs:'<path d="M18 20V10M12 20V4M6 20v-6"/>',ac:'<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2 21 2M16 7l3 3"/>',out:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'};
const ic=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;
const NAV=[['st','Students'],['ex','Exam setup'],['rs','Results'],['ac','Account']];
function shell(k,c){setTimeout(badge,0);const nm=k==='admin'?'Administrator':esc(me.s.name);
 const side=k==='admin'?`<aside><div class="lg">${LOGO}<div><b>DRVU</b><small>Online Exam</small></div></div><nav>${NAV.map(([t,n])=>`<a class="${tab===t?'on':''}" onclick="tab='${t}';detU=null;admin()">${ic(t)}<span>${n}</span></a>`).join('')}</nav><a class="out" onclick="logout()">${ic('out')}<span>Logout</span></a></aside>`:'';
 const title=k==='admin'?(NAV.find(x=>x[0]===tab)||[])[1]:esc(D.exam.title);
 return `<div class="shell ${k}">${side}<section><div class="top"><div><h1>${title}</h1><small>Dembi Dollo Rift Valley University</small></div><div class="usr"><span id="sb" class="bd n"></span><i>${nm[0]}</i>${nm}${k==='admin'?'':'<button class="s" onclick="logout()">Logout</button>'}</div></div><div class="body">${c}</div><footer>© Dembi Dollo Rift Valley University · Prepared by <b>Daba Atm</b></footer></section></div>`}
function hl(){document.querySelectorAll('label.o').forEach(l=>l.classList.toggle('sel',l.querySelector('input').checked))}
function pg(){hl();const n=Object.keys(D.prog[me.s.user].ans).length,e=$('#pc');if(e)e.textContent='Answered '+n+' / '+D.exam.questions.length}
function loginView(m,uv){A.innerHTML=`<div class="split"><div class="hero"><div class="hc">${LOGO}<h1>Dembi Dollo Rift Valley University</h1><p>Online Mid Exam Portal</p><span class="tag">Computer and Mobile Application</span></div></div><div class="fm"><div class="fb"><h2>Welcome back</h2><p class="mu">Sign in to continue to your exam portal.</p>
<label>Username</label><input id="u" value="${esc(uv||'')}" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Enter username"><label>Password</label><input id="p" type="password" autocomplete="current-password" autocapitalize="off" autocorrect="off" placeholder="Enter password">
<p class="no">${m||''}</p><button class="wide" onclick="login()">Sign in</button>
<p class="mu" style="margin-top:14px">Students: use the account given by your exam administrator.</p><p class="mu"><a href="#" onclick="setCloud();return false">⚙ Server connection</a></p><footer>Prepared by <b>Daba Atm</b></footer></div></div></div>`;
 $('#p').onkeydown=e=>{if(e.key==='Enter')login()}}
async function login(){const raw=$('#u').value.trim(),u=raw.toLowerCase(),p=$('#p').value.trim();
 if(CLOUD){const b=$('button.wide');if(b)b.textContent='Signing in…';await pull()}
 if(u===D.admin.u.toLowerCase()){if(p===D.admin.p){me={role:'a'};if(CLOUD&&!rem)pushAll();return admin()}return loginView('Wrong password.',raw)}
 const s=D.students.find(x=>x.user.toLowerCase()===u);
 if(!s)return loginView('No account found with this username'+(CLOUD?'.':' on this computer.'),raw);
 if(s.pass!==p)return loginView('Wrong password.',raw);
 me={role:'s',s};student()}
function logout(){clearInterval(tick);me=null;loginView()}

/* ---------- ADMIN ---------- */
function admin(){
 const T=(k,n)=>`<button class="${tab===k?'on':''}" onclick="tab='${k}';admin()">${n}</button>`;
 const sub=Object.keys(D.results).length,avg=sub?Math.round(Object.values(D.results).reduce((a,r)=>a+r.score/r.total*100,0)/sub):0;
 let h=`<div class="stats"><div class="stat"><b>${D.students.length}</b><span>Students</span></div><div class="stat"><b>${sub}</b><span>Submitted</span></div><div class="stat"><b>${D.exam.questions.length}</b><span>Questions</span></div><div class="stat"><b>${D.exam.duration}m</b><span>Exam time</span></div><div class="stat"><b>${avg}%</b><span>Average score</span></div></div>`;
 if(tab==='st')h+=`<div class="card"><h2>Register student</h2><div class="row"><div><label>Full name</label><input id="n"></div><div><label>Username</label><input id="un"></div><div><label>Password</label><input id="pw"></div></div><button onclick="addSt()">Register</button></div>
 <div class="card"><h2>Students (${D.students.length})</h2><input placeholder="Search student…" oninput="flt(this.value)" style="margin-bottom:12px"><div class="tw"><table id="stt"><tr><th>Name</th><th>Username</th><th>Password</th><th>Status</th><th></th></tr>${D.students.map((s,i)=>`<tr><td>${esc(s.name)}</td><td>${esc(s.user)}</td><td>${esc(s.pass)}</td><td>${D.results[s.user]?'<span class="bd g">Submitted</span>':D.prog[s.user]?'<span class="bd y">In progress</span>':'<span class="bd n">Not started</span>'}</td><td><button class="s" onclick="es(${i})">Edit</button><button class="s" onclick="rp(${i})">Reset password</button><button class="d" onclick="ds(${i})">Delete</button></td></tr>`).join('')||'<tr><td>No students yet.</td></tr>'}</table></div></div>`;
 if(tab==='ex')h+=examTab();
 if(tab==='rs')h+=detU?detCard():resTab();
 if(tab==='ac')h+=`<div class="card"><h2>Admin account</h2><div class="row"><div><label>Username</label><input id="au" value="${esc(D.admin.u)}" autocomplete="off"></div><div><label>Current password</label><input id="ac" type="password" autocomplete="off"></div><div><label>New password (leave empty to keep)</label><input id="ap" type="password" autocomplete="new-password"></div></div><button onclick="saveAd()">Save</button></div><div class="card"><h2>Cloud sync (use on all devices)</h2><p class="mu">Status: ${CLOUD?'connected to '+esc(CLOUD):'not connected — data stays on this device only'}. Create a free Firebase Realtime Database, then paste its URL here and on every device (or put it in <b>CLOUD_URL</b> inside script.js).</p><button onclick="setCloud()">Set server URL</button><button class="s" onclick="pull().then(admin)">Sync now</button><button class="s" onclick="pushAll();alert('Data sent to the server.')">Upload this device’s data</button></div><div class="card"><h2>Backup and restore</h2><p class="mu">Data is stored in this browser. To use several computers: download a backup here, restore it on each lab computer, then download a backup from each one and merge the results back here.</p><button onclick="exp()">Download backup</button><label>Merge results from another computer</label><input type="file" accept=".json" onchange="imp(this.files[0],false)"><label>Restore full backup (replaces everything)</label><input type="file" accept=".json" onchange="imp(this.files[0],true)"><button class="d" onclick="if(confirm('Delete ALL data?')){try{localStorage.removeItem('drvu')}catch(e){}location.reload()}">Reset all data</button></div>`;
 A.innerHTML=shell('admin',h)}
function addSt(){const n=$('#n').value.trim(),u=$('#un').value.trim(),p=$('#pw').value.trim();
 if(!n||!u||!p)return alert('Fill all fields.');if(D.students.some(s=>s.user===u))return alert('Username already exists.');
 D.students.push({name:n,user:u,pass:p});save();admin()}
function rp(i){const p=prompt('New password for '+D.students[i].name+':');if(p&&p.trim()){D.students[i].pass=p.trim();save();admin()}}
function ds(i){if(confirm('Delete this student and their result?')){const u=D.students[i].user;delete D.results[u];delete D.prog[u];put('results/'+pk(u),null);put('prog/'+pk(u),null);D.students.splice(i,1);save();admin()}}
function saveAd(){const u=$('#au').value.trim(),cp=$('#ac').value.trim(),np=$('#ap').value.trim();if(!u)return;
 if(cp!==D.admin.p)return alert('Current password is incorrect.');
 D.admin={u,p:np||D.admin.p};save();$('#ac').value='';$('#ap').value='';alert('Admin account saved.')}
function examTab(){const E=D.exam;
 return `<div class="card"><h2>Exam settings</h2><label>Title</label><input id="et" value="${esc(E.title)}"><div class="row"><div><label>Time (minutes)</label><input id="ed" type="number" min="1" value="${E.duration}"></div><div><label>Exam status</label><select id="eo"><option value="1" ${E.open?'selected':''}>Open</option><option value="0" ${E.open?'':'selected'}>Closed</option></select></div><div><label>Show answers after submit</label><select id="es"><option value="0" ${E.showAns?'':'selected'}>No</option><option value="1" ${E.showAns?'selected':''}>Yes</option></select></div></div><button onclick="saveEx()">Save settings</button></div>
 <div class="card"><h2>Upload questions from PDF</h2><p class="mu">Format in the PDF: “1. Question”, then options “A. … B. … C. … D. …”, then “Answer: B”. If no answer line exists, set correct answers below.</p>
 <input type="file" id="pf" accept="application/pdf" onchange="readPdf(this.files[0])"><label>…or paste exam text here</label><textarea id="pt" rows="5"></textarea><button class="s" onclick="loadTxt($('#pt').value)">Parse text</button><p id="pm" class="mu"></p></div>
 <div class="card"><h2>Questions (${E.questions.length})</h2>${E.questions.map((q,i)=>qEdit(q,i,'D.exam.questions')).join('')||'<p class="mu">No questions yet.</p>'}
 <button class="s" onclick="D.exam.questions.push({q:'New question',opts:['','','',''],ans:0});save();admin()">+ Add question</button><button class="d" onclick="if(confirm('Delete all questions?')){D.exam.questions=[];save();admin()}">Clear all</button></div>`}
function qEdit(q,i,ref){return `<div class="q"><label>Q${i+1}</label><textarea rows="2" onchange="${ref}[${i}].q=this.value;save()">${esc(q.q)}</textarea>${q.opts.map((o,j)=>`<div class="o"><b style="margin:0">${'ABCDE'[j]}.</b><input value="${esc(o)}" onchange="${ref}[${i}].opts[${j}]=this.value;save()"></div>`).join('')}
 <label>Correct answer</label><select onchange="${ref}[${i}].ans=+this.value;save()">${q.opts.map((o,j)=>`<option value="${j}" ${q.ans===j?'selected':''}>${'ABCDE'[j]}</option>`).join('')}<option value="-1" ${q.ans<0?'selected':''}>Not set</option></select>
 <button class="d" onclick="${ref}.splice(${i},1);save();admin()">Delete</button></div>`}
function saveEx(){D.exam.title=$('#et').value;D.exam.duration=Math.max(1,+$('#ed').value||30);D.exam.open=$('#eo').value==='1';D.exam.showAns=$('#es').value==='1';save();alert('Exam settings saved.')}
async function readPdf(f){if(!f)return;const m=$('#pm');m.textContent='Reading PDF…';
 try{pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 const pdf=await pdfjsLib.getDocument({data:await f.arrayBuffer()}).promise;let txt='';
 for(let p=1;p<=pdf.numPages;p++){const c=await(await pdf.getPage(p)).getTextContent(),rows={};
  c.items.forEach(it=>{const y=Math.round(it.transform[5]/3);(rows[y]=rows[y]||[]).push(it)});
  Object.keys(rows).sort((a,b)=>b-a).forEach(y=>{txt+=rows[y].sort((a,b)=>a.transform[4]-b.transform[4]).map(i=>i.str).join(' ').trim()+'\n'})}
 loadTxt(txt)}catch(e){m.textContent='Could not read the PDF here. Paste the text into the box instead, or add questions manually.'}}
function parse(t){const qs=[];let cur=null,last=null;
 t.split(/\r?\n/).forEach(l=>{l=l.trim();if(!l)return;let m;
  if(m=l.match(/^(?:answer|ans)\s*[:\-]?\s*\(?([A-Ea-e])/i)){if(cur)cur.ans='ABCDE'.indexOf(m[1].toUpperCase());last=null}
  else if(cur&&(m=l.match(/^\(?([A-Ea-e])[.)]\s*(.*)/))){cur.opts.push(m[2]);last='o'}
  else if(m=l.match(/^(\d+)\s*[.)]\s*(.+)/)){cur={q:m[2],opts:[],ans:-1};qs.push(cur);last='q'}
  else if(cur){if(last==='o')cur.opts[cur.opts.length-1]+=' '+l;else if(last==='q')cur.q+=' '+l}});
 return qs.filter(q=>q.opts.length>=2)}
function loadTxt(t){const qs=parse(t);if(!qs.length)return $('#pm').textContent='No questions detected. Check the format.';
 if(D.exam.questions.length&&!confirm(qs.length+' questions found. Replace existing questions? (Cancel = append)'))D.exam.questions.push(...qs);else D.exam.questions=qs;
 save();admin()}
function resTab(){const R=D.students.map(s=>({s,r:D.results[s.user]})),n=D.exam.questions.length;
 return `<div class="card"><h2>Student results</h2><div class="tw"><table><tr><th>Name</th><th>Username</th><th>Score</th><th>%</th><th>Submitted</th><th></th></tr>${R.map(({s,r})=>`<tr><td>${esc(s.name)}</td><td>${esc(s.user)}</td>${r?`<td>${r.score}/${r.total}</td><td>${Math.round(r.score/r.total*100)}%</td><td>${esc(r.date)}</td><td><button class="s" onclick="det('${esc(s.user)}')">Details</button><button class="s" onclick="allow('${esc(s.user)}')">Allow retake</button></td>`:'<td colspan="4" class="mu">No result</td>'}</tr>`).join('')||'<tr><td>No students.</td></tr>'}</table></div><button onclick="csv()">Download CSV</button><button class="s" onclick="window.print()">Print</button></div>`}
function allow(u){if(confirm('Delete this result and let the student take the exam again?')){delete D.results[u];put('results/'+pk(u),null);put('prog/'+pk(u),null);save();admin()}}
function dl(n,t,s){const u=URL.createObjectURL(new Blob([s],{type:t})),a=document.createElement('a');a.href=u;a.download=n;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000)}
function csv(){let c='Name,Username,Score,Total,Percent,Date\n';D.students.forEach(s=>{const r=D.results[s.user];c+=`"${s.name}",${s.user},${r?r.score:''},${r?r.total:''},${r?Math.round(r.score/r.total*100):''},"${r?r.date:''}"\n`});
 dl('exam-results.csv','text/csv;charset=utf-8','\ufeff'+c)}

function flt(v){document.querySelectorAll('#stt tr:not(:first-child)').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(v.toLowerCase())?'':'none')}
function es(i){const n=prompt('Student full name:',D.students[i].name);if(n&&n.trim()){D.students[i].name=n.trim();save();admin()}}
function det(u){detU=u;admin()}
function review(r){return (r.qs||D.exam.questions).map((q,i)=>{const a=r.ans[i],ok=a===q.ans;return `<div class="q"><b>${i+1}. ${esc(q.q)}</b><p class="${ok?'ok':'no'}">Answer: ${a==null?'No answer':'ABCDE'[a]+'. '+esc(q.opts[a])} ${ok?'✓':'✗'}</p>${ok?'':`<p class="mu">Correct: ${q.ans>=0?'ABCDE'[q.ans]+'. '+esc(q.opts[q.ans]):'not set'}</p>`}</div>`}).join('')}
function detCard(){const s=D.students.find(x=>x.user===detU)||{name:detU},r=D.results[detU];if(!r){detU=null;return resTab()}
 return `<div class="card"><h2>${esc(s.name)} — ${r.score}/${r.total} (${Math.round(r.score/r.total*100)}%)</h2><button class="s" onclick="detU=null;admin()">← Back to results</button><button class="s" onclick="window.print()">Print</button><div style="margin-top:14px">${review(r)}</div></div>`}
function exp(){dl('drvu-backup.json','application/json',JSON.stringify(D))}
function imp(f,full){if(!f)return;const r=new FileReader();r.onload=()=>{try{const X=JSON.parse(r.result);if(!X.students||!X.exam)throw 0;
 if(full){D=X}else{X.students.forEach(s=>{if(!D.students.some(t=>t.user===s.user))D.students.push(s)});Object.keys(X.results||{}).forEach(u=>{if(!D.results[u])D.results[u]=X.results[u]})}
 save();pushAll();alert('Import done.');admin()}catch(e){alert('Invalid backup file.')}};r.readAsText(f)}

/* ---------- STUDENT ---------- */
function student(){clearInterval(tick);const s=me.s,u=s.user,r=D.results[u],E=D.exam;
 let h='';
 if(r){const p=Math.round(r.score/r.total*100);
  h+=`<div class="card"><h2>Your result</h2><div class="ring" style="--p:${p}"><div><b>${p}%</b><span>${r.score} / ${r.total}</span></div></div><p class="c"><span class="bd ${p>=50?'g':'y'}">${p>=50?'PASSED':'BELOW PASS MARK'}</span></p><p class="c">Correct: ${r.score} · Wrong/unanswered: ${r.total-r.score}</p><p class="mu" style="text-align:center">Submitted ${esc(r.date)}. The exam has been sent to the admin and cannot be taken again.</p></div>`+(E.showAns?`<div class="card"><h2>Answer review</h2>${review(r)}</div>`:'')}
 else if(D.prog[u]) return runExam();
 else h+=`<div class="card"><h2>${esc(E.title)}</h2><div class="stats"><div class="stat"><b>${E.questions.length}</b><span>Questions</span></div><div class="stat"><b>${E.duration} min</b><span>Time allowed</span></div><div class="stat"><b>1</b><span>Attempt only</span></div></div><p class="mu">All questions are multiple choice. The timer starts when you press Start and the exam is submitted automatically when time ends. You can take the exam only once.</p>${E.open&&E.questions.length?'<button onclick="startEx()">Start exam</button>':'<p class="no">The exam is not available right now.</p>'}</div>`;
 A.innerHTML=shell('student',h)}
function startEx(){if(!confirm('Start now? The timer cannot be paused.'))return;const u=me.s.user;D.prog[u]={start:now(),dur:D.exam.duration,ans:{}};saveProg(u);runExam()}
function runExam(){const u=me.s.user,P=D.prog[u],Q=D.exam.questions;
 A.innerHTML=shell('exam',`<div class="tm"><div id="pc"></div><div>Time left <span id="tl"></span></div></div>`+Q.map((q,i)=>`<div class="q"><b>${i+1}. ${esc(q.q)}</b>${q.opts.map((o,j)=>`<label class="o"><input type="radio" name="q${i}" value="${j}" ${P.ans[i]===j?'checked':''} onchange="D.prog['${u}'].ans[${i}]=${j};saveProg('${u}');pg()"> ${'ABCDE'[j]}. ${esc(o)}</label>`).join('')}</div>`).join('')+`<button onclick="if(confirm('Submit your exam now?'))submit()">Submit exam</button>`);pg();
 const t=()=>{const l=P.start+P.dur*60000-now();if(l<=0){clearInterval(tick);alert('Time is up. Your exam is being submitted.');return submit()}
  const s=Math.ceil(l/1000);$('#tl').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')};t();tick=setInterval(t,500)}
function submit(){clearInterval(tick);const u=me.s.user,P=D.prog[u]||{ans:{}},Q=D.exam.questions;if(D.results[u])return student();
 let sc=0;Q.forEach((q,i)=>{if(P.ans[i]===q.ans)sc++});
 D.results[u]={score:sc,total:Q.length,date:new Date().toLocaleString(),ans:P.ans,qs:JSON.parse(JSON.stringify(Q))};delete D.prog[u];save();put('results/'+pk(u),eC(D.results[u]));put('prog/'+pk(u),null);student()}
loginView();
