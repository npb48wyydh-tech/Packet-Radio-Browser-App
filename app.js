const STORAGE_KEY = 'houstonPacketField.v1';

const starterData = {
  stations: [
    { id:'bigboy', call:'BIGBOY', alias:'', type:'Node', status:'worked', frequency:'', lastTested:'2026-08-27', route:'HOME → BIGBOY', commands:'J', notes:'Primary Houston-area node used as a stepping stone during recent tests.' },
    { id:'wr5gc', call:'WR5GC', alias:'', type:'Node', status:'worked', frequency:'', lastTested:'2026-08-27', route:'via BIGBOY', commands:'', notes:'A connection reached WR5GC during testing.' },
    { id:'foxhop', call:'FOXHOP', alias:'', type:'Node', status:'worked', frequency:'', lastTested:'2026-08-27', route:'HOME → BIGBOY → FOXHOP', commands:'C FOXHOP', notes:'Confirmed reachable through BIGBOY.' },
    { id:'tarnod', call:'TARNOD', alias:'', type:'Node', status:'worked', frequency:'', lastTested:'2026-08-27', route:'HOME → BIGBOY → TARNOD', commands:'C TARNOD', notes:'Confirmed working through BIGBOY.' },
    { id:'lcchat', call:'LCCHAT', alias:'', type:'Chat', status:'observed', frequency:'', lastTested:'2026-08-27', route:'via BIGBOY / discovered in node listings', commands:'C LCCHAT', notes:'Discovered during testing. Keep participation/room-specific commands here as they are confirmed.' },
    { id:'lcity', call:'LCITY', alias:'', type:'Node', status:'failed', frequency:'', lastTested:'2026-08-27', route:'via BIGBOY', commands:'C LCITY', notes:'No useful response during the recent test.' },
    { id:'tarbox', call:'TARBOX', alias:'', type:'BBS', status:'failed', frequency:'', lastTested:'2026-08-27', route:'via BIGBOY', commands:'C TARBOX', notes:'Did not work during the recent test; TARNOD did.' },
    { id:'gc', call:'GC', alias:'', type:'Other', status:'failed', frequency:'', lastTested:'2026-08-27', route:'from connected node', commands:'C GC', notes:'Produced no response during testing.' }
  ],
  edges: [
    { from:'bigboy', to:'wr5gc', status:'worked' },
    { from:'bigboy', to:'foxhop', status:'worked' },
    { from:'bigboy', to:'tarnod', status:'worked' },
    { from:'bigboy', to:'lcchat', status:'observed' },
    { from:'bigboy', to:'lcity', status:'failed' },
    { from:'bigboy', to:'tarbox', status:'failed' }
  ],
  logs: [
    { id:'log1', date:'2026-08-27T12:00', station:'FOXHOP', status:'worked', route:'via BIGBOY', note:'Confirmed FOXHOP reachable through BIGBOY.' },
    { id:'log2', date:'2026-08-27T12:10', station:'TARNOD', status:'worked', route:'via BIGBOY', note:'TARNOD worked; TARBOX did not.' },
    { id:'log3', date:'2026-08-27T12:20', station:'LCCHAT', status:'observed', route:'via BIGBOY', note:'Found LCCHAT during node exploration.' }
  ]
};

const commandReference = [
  ['C <CALL>', 'Connect to a callsign or alias. Example: C FOXHOP.'],
  ['J', 'Often shows heard stations, routes, or node information. Exact meaning varies by node software.'],
  ['L', 'Commonly lists BBS messages or available items.'],
  ['R <#>', 'Common BBS pattern for reading a numbered message.'],
  ['SP <CALL>', 'Common BBS pattern for sending a private message to a callsign.'],
  ['SB <CALL>', 'Common BBS pattern for forwarding/sending a bulletin or message; syntax varies.'],
  ['B', 'Commonly disconnects from a BBS/node (Bye).'],
  ['?', 'Usually displays local help/command list. Use this first on an unfamiliar system.']
];

let data = loadData();
let activeFilter = 'All';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || structuredClone(starterData); }
  catch { return structuredClone(starterData); }
}
function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
function esc(s='') { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function statusLabel(s) { return ({worked:'Worked',failed:'No response',observed:'Observed',unknown:'Unknown'})[s] || s; }
function formatDate(s) { if (!s) return '—'; const d = new Date(s.includes('T') ? s : s+'T12:00'); return new Intl.DateTimeFormat(undefined,{month:'short',day:'numeric',year:'numeric',hour:s.includes('T')?'numeric':undefined,minute:s.includes('T')?'2-digit':undefined}).format(d); }
function makeId(base) { return (base || 'station').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') + '-' + Math.random().toString(36).slice(2,6); }

function renderFilters() {
  const types = ['All','Worked','No response','Node','BBS','Chat'];
  $('#filterBar').innerHTML = types.map(t => `<button class="chip ${t===activeFilter?'active':''}" data-filter="${esc(t)}">${esc(t)}</button>`).join('');
  $$('#filterBar .chip').forEach(b => b.onclick = () => { activeFilter = b.dataset.filter; renderFilters(); renderStations(); });
}

function filteredStations() {
  const q = $('#searchInput').value.trim().toLowerCase();
  return data.stations.filter(s => {
    const hay = [s.call,s.alias,s.type,s.status,s.frequency,s.route,s.commands,s.notes].join(' ').toLowerCase();
    const qOk = !q || hay.includes(q);
    let fOk = true;
    if (activeFilter === 'Worked') fOk = s.status === 'worked';
    else if (activeFilter === 'No response') fOk = s.status === 'failed';
    else if (activeFilter !== 'All') fOk = s.type === activeFilter;
    return qOk && fOk;
  });
}

function renderStations() {
  const stations = filteredStations();
  $('#stationCount').textContent = `${stations.length} station${stations.length===1?'':'s'}`;
  $('#stationList').innerHTML = stations.length ? stations.map(s => `
    <button class="station-card" data-id="${esc(s.id)}" style="text-align:left; color:inherit; width:100%;">
      <div>
        <div class="station-name"><span class="status-dot status-${esc(s.status)}"></span><strong>${esc(s.call)}</strong>${s.alias?`<span class="alias">${esc(s.alias)}</span>`:''}</div>
        <div class="meta-row"><span class="badge">${esc(s.type)}</span>${s.frequency?`<span class="badge">${esc(s.frequency)}</span>`:''}<span class="muted small">${esc(statusLabel(s.status))}</span></div>
        ${s.route?`<div class="route">${esc(s.route)}</div>`:''}
      </div><span class="chev">›</span>
    </button>`).join('') : `<div class="empty">No matching stations.</div>`;
  $$('#stationList .station-card').forEach(b => b.onclick = () => openDetail(b.dataset.id));
}

function openDetail(id) {
  const s = data.stations.find(x=>x.id===id); if (!s) return;
  $('#detailContent').innerHTML = `
    <div class="sheet-head"><div><p class="eyebrow">${esc(s.type.toUpperCase())}</p><h2>${esc(s.call)} ${s.alias?`<span class="alias">${esc(s.alias)}</span>`:''}</h2></div><button class="icon-btn" id="closeDetail">×</button></div>
    <div class="meta-row"><span class="status-dot status-${esc(s.status)}"></span><strong>${esc(statusLabel(s.status))}</strong>${s.frequency?`<span class="badge">${esc(s.frequency)}</span>`:''}</div>
    <dl class="detail-kv"><dt>Last tested</dt><dd>${esc(formatDate(s.lastTested))}</dd><dt>Route</dt><dd>${esc(s.route || '—')}</dd></dl>
    ${s.commands?`<h3>Commands</h3><pre class="command-box">${esc(s.commands)}</pre>`:''}
    <h3>Notes</h3><p class="muted" style="white-space:pre-wrap;line-height:1.5">${esc(s.notes || 'No notes yet.')}</p>
    <div class="sheet-actions"><button id="editFromDetail" class="secondary-btn">Edit</button>${s.route?'<button id="copyRouteBtn" class="secondary-btn">Copy route</button>':''}<span class="spacer"></span><button id="detailDone" class="primary-btn">Done</button></div>`;
  const d = $('#detailDialog'); d.showModal();
  $('#closeDetail').onclick = $('#detailDone').onclick = () => d.close();
  $('#editFromDetail').onclick = () => { d.close(); openStationForm(id); };
  if ($('#copyRouteBtn')) $('#copyRouteBtn').onclick = async () => { await navigator.clipboard?.writeText(s.route); $('#copyRouteBtn').textContent='Copied'; };
}

function openStationForm(id=null) {
  const s = id ? data.stations.find(x=>x.id===id) : null;
  $('#stationDialogTitle').textContent = s ? 'Edit station' : 'Add station';
  $('#stationId').value = s?.id || '';
  $('#stationCall').value = s?.call || '';
  $('#stationAlias').value = s?.alias || '';
  $('#stationType').value = s?.type || 'Node';
  $('#stationStatus').value = s?.status || 'unknown';
  $('#stationFrequency').value = s?.frequency || '';
  $('#stationLastTested').value = s?.lastTested || '';
  $('#stationRoute').value = s?.route || '';
  $('#stationCommands').value = s?.commands || '';
  $('#stationNotes').value = s?.notes || '';
  $('#deleteStationBtn').classList.toggle('hidden', !s);
  $('#stationDialog').showModal();
}

function saveStationFromForm() {
  const existingId = $('#stationId').value;
  const station = {
    id: existingId || makeId($('#stationCall').value), call: $('#stationCall').value.trim().toUpperCase(), alias: $('#stationAlias').value.trim().toUpperCase(),
    type: $('#stationType').value, status: $('#stationStatus').value, frequency: $('#stationFrequency').value.trim(), lastTested: $('#stationLastTested').value,
    route: $('#stationRoute').value.trim(), commands: $('#stationCommands').value.trim(), notes: $('#stationNotes').value.trim()
  };
  if (existingId) data.stations[data.stations.findIndex(s=>s.id===existingId)] = station; else data.stations.push(station);
  saveData(); renderAll();
}

function deleteStation() {
  const id = $('#stationId').value; if (!id) return;
  const s = data.stations.find(x=>x.id===id);
  if (!confirm(`Delete ${s.call}?`)) return;
  data.stations = data.stations.filter(x=>x.id!==id);
  data.edges = data.edges.filter(e=>e.from!==id && e.to!==id);
  saveData(); $('#stationDialog').close(); renderAll();
}

function renderLogs() {
  const logs = [...data.logs].sort((a,b)=>b.date.localeCompare(a.date));
  $('#logList').innerHTML = logs.length ? logs.map(l=>`<div class="log-card"><div class="log-top"><div><strong>${esc(l.station || 'General')}</strong><div class="small muted">${esc(formatDate(l.date))}</div></div><span class="badge"><span class="status-dot status-${esc(l.status)}" style="margin-right:6px"></span>${esc(statusLabel(l.status))}</span></div>${l.route?`<div class="route">${esc(l.route)}</div>`:''}<p style="margin-top:10px">${esc(l.note)}</p></div>`).join('') : '<div class="empty">No field notes yet.</div>';
}

function openLogForm() {
  const now = new Date(); const local = new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,16);
  $('#logDate').value = local; $('#logStation').value=''; $('#logStatus').value='worked'; $('#logRoute').value=''; $('#logNote').value=''; $('#logDialog').showModal();
}
function saveLog() {
  data.logs.push({ id: makeId('log'), date:$('#logDate').value, station:$('#logStation').value.trim().toUpperCase(), status:$('#logStatus').value, route:$('#logRoute').value.trim(), note:$('#logNote').value.trim() });
  saveData(); renderLogs();
}

function renderReference() { $('#referenceList').innerHTML = commandReference.map(([c,d])=>`<div class="reference-card"><code>${esc(c)}</code><p>${esc(d)}</p></div>`).join(''); }

function renderMap() {
  const svg = $('#networkSvg');
  const positions = {
    bigboy:[450,310], wr5gc:[450,100], foxhop:[170,170], tarnod:[170,455], lcchat:[730,170], lcity:[730,455], tarbox:[450,535], gc:[795,310]
  };
  const extras = data.stations.filter(s=>!positions[s.id]);
  extras.forEach((s,i)=>{ const angle=(i/Math.max(1,extras.length))*Math.PI*2; positions[s.id]=[450+300*Math.cos(angle),310+230*Math.sin(angle)]; });
  const edgeHtml = data.edges.map(e=>{
    const a=positions[e.from], b=positions[e.to]; if(!a||!b)return '';
    return `<line class="edge ${esc(e.status||'')}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" />`;
  }).join('');
  const nodeHtml = data.stations.map(s=>{
    const p=positions[s.id]; if(!p)return '';
    const label=s.call.length>10?s.call.slice(0,10):s.call;
    return `<g class="node ${esc(s.status)}" data-id="${esc(s.id)}" transform="translate(${p[0]},${p[1]})"><circle r="44"/><text y="-2">${esc(label)}</text><text class="sub" y="17">${esc(s.type)}</text></g>`;
  }).join('');
  svg.innerHTML = `<defs><radialGradient id="bg"><stop offset="0%" stop-color="#10233a"/><stop offset="100%" stop-color="#081320"/></radialGradient></defs><rect width="900" height="620" fill="url(#bg)"/>${edgeHtml}${nodeHtml}`;
  svg.querySelectorAll('.node').forEach(n=>n.onclick=()=>openDetail(n.dataset.id));
}

function renderAll(){ renderFilters(); renderStations(); renderLogs(); renderReference(); renderMap(); }

function exportData() {
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`houston-packet-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
}
async function importData(file) {
  try { const parsed=JSON.parse(await file.text()); if(!Array.isArray(parsed.stations)||!Array.isArray(parsed.logs)) throw new Error('Invalid backup'); data=parsed; data.edges ||= []; saveData(); renderAll(); $('#toolsDialog').close(); }
  catch { alert('That file does not look like a Houston Packet Field backup.'); }
}

$$('.tab').forEach(t=>t.onclick=()=>{ $$('.tab').forEach(x=>x.classList.remove('active')); $$('.view').forEach(x=>x.classList.remove('active')); t.classList.add('active'); $('#'+t.dataset.view).classList.add('active'); if(t.dataset.view==='mapView') renderMap(); });
$('#searchInput').oninput=renderStations;
$('#addStationBtn').onclick=()=>openStationForm();
$('#addLogBtn').onclick=openLogForm;
$('#moreBtn').onclick=()=>$('#toolsDialog').showModal();
$('#fitMapBtn').onclick=renderMap;
$$('.close-dialog').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$('#stationForm').onsubmit=(e)=>{ e.preventDefault(); saveStationFromForm(); $('#stationDialog').close(); };
$('#deleteStationBtn').onclick=deleteStation;
$('#logForm').onsubmit=(e)=>{ e.preventDefault(); saveLog(); $('#logDialog').close(); };
$('#exportBtn').onclick=exportData;
$('#importInput').onchange=e=>e.target.files[0]&&importData(e.target.files[0]);
$('#resetBtn').onclick=()=>{ if(confirm('Reset all local data to the starter Houston observations?')) { data=structuredClone(starterData); saveData(); renderAll(); $('#toolsDialog').close(); } };

renderAll();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
