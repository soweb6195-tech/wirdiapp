import { useState, useRef, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const DAYS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const DAYS_SHORT = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const HIZBS = Array.from({ length: 60 }, (_, i) => ({
  id: `h${i + 1}`, label: `Hizb ${i + 1}`, juz: Math.ceil((i + 1) / 2),
}));

const SOURATES = [
  { id:"s1",label:"Al-Fatiha (1)",pages:"1"},{ id:"s2",label:"Al-Baqara (2)",pages:"2–49"},
  { id:"s3",label:"Al-Imran (3)",pages:"50–76"},{ id:"s4",label:"An-Nisa (4)",pages:"77–106"},
  { id:"s5",label:"Al-Ma'ida (5)",pages:"106–127"},{ id:"s6",label:"Al-An'am (6)",pages:"128–150"},
  { id:"s7",label:"Al-A'raf (7)",pages:"151–176"},{ id:"s8",label:"Al-Anfal (8)",pages:"177–186"},
  { id:"s9",label:"At-Tawbah (9)",pages:"187–207"},{ id:"s10",label:"Yunus (10)",pages:"208–221"},
  { id:"s11",label:"Hud (11)",pages:"221–235"},{ id:"s12",label:"Yusuf (12)",pages:"235–248"},
  { id:"s13",label:"Ar-Ra'd (13)",pages:"249–255"},{ id:"s14",label:"Ibrahim (14)",pages:"255–261"},
  { id:"s15",label:"Al-Hijr (15)",pages:"262–267"},{ id:"s16",label:"An-Nahl (16)",pages:"267–281"},
  { id:"s17",label:"Al-Isra (17)",pages:"282–293"},{ id:"s18",label:"Al-Kahf (18)",pages:"293–304"},
  { id:"s19",label:"Maryam (19)",pages:"305–312"},{ id:"s20",label:"Ta-Ha (20)",pages:"312–321"},
  { id:"s21",label:"Al-Anbiya (21)",pages:"322–331"},{ id:"s22",label:"Al-Hajj (22)",pages:"332–341"},
  { id:"s23",label:"Al-Mu'minun (23)",pages:"342–349"},{ id:"s24",label:"An-Nur (24)",pages:"350–359"},
  { id:"s25",label:"Al-Furqan (25)",pages:"359–366"},{ id:"s26",label:"Ash-Shu'ara (26)",pages:"367–376"},
  { id:"s27",label:"An-Naml (27)",pages:"377–385"},{ id:"s28",label:"Al-Qasas (28)",pages:"385–396"},
  { id:"s29",label:"Al-Ankabut (29)",pages:"396–404"},{ id:"s30",label:"Ar-Rum (30)",pages:"404–411"},
  { id:"s31",label:"Luqman (31)",pages:"411–414"},{ id:"s32",label:"As-Sajdah (32)",pages:"415–417"},
  { id:"s33",label:"Al-Ahzab (33)",pages:"418–427"},{ id:"s34",label:"Saba (34)",pages:"428–434"},
  { id:"s35",label:"Fatir (35)",pages:"434–440"},{ id:"s36",label:"Ya-Sin (36)",pages:"440–445"},
  { id:"s37",label:"As-Saffat (37)",pages:"446–452"},{ id:"s38",label:"Sad (38)",pages:"453–458"},
  { id:"s39",label:"Az-Zumar (39)",pages:"458–467"},{ id:"s40",label:"Ghafir (40)",pages:"467–476"},
  { id:"s41",label:"Fussilat (41)",pages:"477–482"},{ id:"s42",label:"Ash-Shura (42)",pages:"483–489"},
  { id:"s43",label:"Az-Zukhruf (43)",pages:"489–495"},{ id:"s44",label:"Ad-Dukhan (44)",pages:"496–498"},
  { id:"s45",label:"Al-Jathiyah (45)",pages:"499–502"},{ id:"s46",label:"Al-Ahqaf (46)",pages:"502–506"},
  { id:"s47",label:"Muhammad (47)",pages:"507–510"},{ id:"s48",label:"Al-Fath (48)",pages:"511–515"},
  { id:"s49",label:"Al-Hujurat (49)",pages:"515–517"},{ id:"s50",label:"Qaf (50)",pages:"518–520"},
  { id:"s51",label:"Adh-Dhariyat (51)",pages:"520–523"},{ id:"s52",label:"At-Tur (52)",pages:"523–525"},
  { id:"s53",label:"An-Najm (53)",pages:"526–528"},{ id:"s54",label:"Al-Qamar (54)",pages:"528–531"},
  { id:"s55",label:"Ar-Rahman (55)",pages:"531–534"},{ id:"s56",label:"Al-Waqi'ah (56)",pages:"534–537"},
  { id:"s57",label:"Al-Hadid (57)",pages:"537–541"},{ id:"s58",label:"Al-Mujadila (58)",pages:"542–545"},
  { id:"s59",label:"Al-Hashr (59)",pages:"545–548"},{ id:"s60",label:"Al-Mumtahanah (60)",pages:"549–551"},
  { id:"s61",label:"As-Saf (61)",pages:"551–552"},{ id:"s62",label:"Al-Jumu'ah (62)",pages:"553–554"},
  { id:"s63",label:"Al-Munafiqun (63)",pages:"554–555"},{ id:"s64",label:"At-Taghabun (64)",pages:"556–557"},
  { id:"s65",label:"At-Talaq (65)",pages:"558–559"},{ id:"s66",label:"At-Tahrim (66)",pages:"560–561"},
  { id:"s67",label:"Al-Mulk (67)",pages:"562–564"},{ id:"s68",label:"Al-Qalam (68)",pages:"564–566"},
  { id:"s69",label:"Al-Haqqah (69)",pages:"566–568"},{ id:"s70",label:"Al-Ma'arij (70)",pages:"568–570"},
  { id:"s71",label:"Nuh (71)",pages:"570–571"},{ id:"s72",label:"Al-Jinn (72)",pages:"572–573"},
  { id:"s73",label:"Al-Muzzammil (73)",pages:"574–575"},{ id:"s74",label:"Al-Muddaththir (74)",pages:"575–577"},
  { id:"s75",label:"Al-Qiyamah (75)",pages:"577–578"},{ id:"s76",label:"Al-Insan (76)",pages:"578–580"},
  { id:"s77",label:"Al-Mursalat (77)",pages:"580–581"},{ id:"s78",label:"An-Naba (78)",pages:"582–583"},
  { id:"s79",label:"An-Nazi'at (79)",pages:"583–584"},{ id:"s80",label:"Abasa (80)",pages:"585"},
  { id:"s81",label:"At-Takwir (81)",pages:"586"},{ id:"s82",label:"Al-Infitar (82)",pages:"587"},
  { id:"s83",label:"Al-Mutaffifin (83)",pages:"587–589"},{ id:"s84",label:"Al-Inshiqaq (84)",pages:"589"},
  { id:"s85",label:"Al-Buruj (85)",pages:"590"},{ id:"s86",label:"At-Tariq (86)",pages:"591"},
  { id:"s87",label:"Al-A'la (87)",pages:"591–592"},{ id:"s88",label:"Al-Ghashiyah (88)",pages:"592"},
  { id:"s89",label:"Al-Fajr (89)",pages:"593–594"},{ id:"s90",label:"Al-Balad (90)",pages:"594"},
  { id:"s91",label:"Ash-Shams (91)",pages:"595"},{ id:"s92",label:"Al-Layl (92)",pages:"595–596"},
  { id:"s93",label:"Ad-Duha (93)",pages:"596"},{ id:"s94",label:"Ash-Sharh (94)",pages:"596"},
  { id:"s95",label:"At-Tin (95)",pages:"597"},{ id:"s96",label:"Al-Alaq (96)",pages:"597–598"},
  { id:"s97",label:"Al-Qadr (97)",pages:"598"},{ id:"s98",label:"Al-Bayyinah (98)",pages:"598–599"},
  { id:"s99",label:"Az-Zalzalah (99)",pages:"599"},{ id:"s100",label:"Al-Adiyat (100)",pages:"599–600"},
  { id:"s101",label:"Al-Qari'ah (101)",pages:"600"},{ id:"s102",label:"At-Takathur (102)",pages:"600"},
  { id:"s103",label:"Al-Asr (103)",pages:"601"},{ id:"s104",label:"Al-Humazah (104)",pages:"601"},
  { id:"s105",label:"Al-Fil (105)",pages:"601"},{ id:"s106",label:"Quraysh (106)",pages:"602"},
  { id:"s107",label:"Al-Ma'un (107)",pages:"602"},{ id:"s108",label:"Al-Kawthar (108)",pages:"602"},
  { id:"s109",label:"Al-Kafirun (109)",pages:"603"},{ id:"s110",label:"An-Nasr (110)",pages:"603"},
  { id:"s111",label:"Al-Masad (111)",pages:"603"},{ id:"s112",label:"Al-Ikhlas (112)",pages:"604"},
  { id:"s113",label:"Al-Falaq (113)",pages:"604"},{ id:"s114",label:"An-Nas (114)",pages:"604"},
];

// ─── Storage ──────────────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem("wirdi-v5") || "{}"); } catch { return {}; }
}
function save(d) { localStorage.setItem("wirdi-v5", JSON.stringify(d)); }

function getWeekKey() {
  const now = new Date();
  const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const y = d.getUTCFullYear();
  const wk = Math.ceil((((d - new Date(Date.UTC(y,0,1)))/86400000)+1)/7);
  return `${y}-W${String(wk).padStart(2,"0")}`;
}
function todayIdx() { return (new Date().getDay()+6)%7; }

function weekLabel(key) {
  // "2025-W03" → "13 jan – 19 jan 2025"
  const [y, w] = key.split("-W").map(Number);
  const jan4 = new Date(Date.UTC(y, 0, 4));
  const monday = new Date(jan4);
  monday.setUTCDate(jan4.getUTCDate() - ((jan4.getUTCDay()||7)-1) + (w-1)*7);
  const sunday = new Date(monday); sunday.setUTCDate(monday.getUTCDate()+6);
  const fmt = d => d.toLocaleDateString("fr-FR",{day:"numeric",month:"short",timeZone:"UTC"});
  return `${fmt(monday)} – ${fmt(sunday)} ${y}`;
}

// An item is "done" if itemDone[dayIdx] contains its id
function isWeekComplete(weekData) {
  const sch = weekData?.schedule || {};
  const itemDone = weekData?.itemDone || {};
  const allItems = Object.entries(sch).flatMap(([day, items]) => (items||[]).map(it => [day, it.id]));
  if (allItems.length === 0) return false;
  return allItems.every(([day, id]) => (itemDone[day]||[]).includes(id));
}

function dayProgress(items, doneIds) {
  const total = items.length;
  const done = items.filter(it => doneIds.includes(it.id)).length;
  return { total, done };
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function WirdiLogo({ size = 36 }) {
  const cx = size/2, cy = size/2, r = size*0.38, ri = size*0.18;
  const pts = Array.from({length:8},(_,i)=>{
    const o=(i*45-90)*Math.PI/180, inn=(i*45-67.5)*Math.PI/180;
    return [cx+r*Math.cos(o),cy+r*Math.sin(o),cx+ri*Math.cos(inn),cy+ri*Math.sin(inn)];
  });
  const path = pts.map(([ox,oy,ix,iy],i)=>`${i===0?"M":"L"}${ox},${oy} L${ix},${iy}`).join(" ")+" Z";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <circle cx={cx} cy={cy} r={size*0.46} fill="#3D7A5E" opacity="0.15"/>
      <path d={path} fill="#3D7A5E"/>
      <circle cx={cx} cy={cy} r={size*0.07} fill="#C8A96E"/>
    </svg>
  );
}

// ─── Notification helper ───────────────────────────────────────────────────────
async function requestNotifPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const res = await Notification.requestPermission();
  return res;
}

function scheduleTestNotif() {
  if (Notification.permission !== "granted") return;
  // Fire a demo notification immediately as browsers block delayed ones without SW
  new Notification("WirdiApp 📖", {
    body: "N'oublie pas ta séance de révision aujourd'hui !",
    icon: "https://via.placeholder.com/64/3D7A5E/ffffff?text=W",
  });
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Amiri:wght@400;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{background:#F0F8F4;color:#1A3028;font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
.app{min-height:100vh;max-width:430px;margin:0 auto;background:#F0F8F4;padding-bottom:36px;}

/* Header */
.hdr{background:linear-gradient(160deg,#1A3028 0%,#2D5243 100%);padding:36px 20px 24px;
  display:flex;align-items:center;gap:14px;position:relative;overflow:hidden;}
.hdr::before{content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 80% 50%,rgba(200,169,110,.13) 0%,transparent 60%);pointer-events:none;}
.hdr-logo{flex-shrink:0;position:relative;z-index:1;}
.hdr-text{position:relative;z-index:1;flex:1;}
.hdr-brand{font-size:20px;font-weight:700;color:#fff;letter-spacing:-.01em;line-height:1;}
.hdr-brand span{color:#C8A96E;}
.hdr-sub{font-family:'Amiri',serif;font-size:14px;color:rgba(255,255,255,.5);margin-top:3px;direction:rtl;}
.hdr-notif{position:relative;z-index:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);
  border-radius:10px;padding:7px 10px;cursor:pointer;font-size:17px;transition:background .15s;flex-shrink:0;}
.hdr-notif:hover{background:rgba(255,255,255,.18);}
.hdr-notif.active{background:rgba(200,169,110,.25);border-color:rgba(200,169,110,.4);}

/* Tabs */
.tabs{display:flex;padding:0 20px;border-bottom:1.5px solid #D6EDE3;background:#F0F8F4;
  position:sticky;top:0;z-index:20;}
.tab{padding:13px 0;margin-right:24px;font-size:12px;font-weight:600;color:#8AB8A4;
  background:none;border:none;border-bottom:2px solid transparent;cursor:pointer;
  letter-spacing:.07em;text-transform:uppercase;transition:all .15s;}
.tab.on{color:#1A3028;border-bottom-color:#3D7A5E;}

/* Week strip */
.week-strip{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:20px 20px 0;}
.day-pill{display:flex;flex-direction:column;align-items:center;gap:5px;}
.dp-label{font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#8AB8A4;}
.dp-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid #C8DFD5;background:none;
  cursor:pointer;font-size:10px;font-weight:700;color:#B8DECA;transition:all .15s;}
.dp-btn.has-content{border-color:#3D7A5E;color:#3D7A5E;background:#EBF7F1;}
.dp-btn.done{background:#3D7A5E;border-color:#3D7A5E;color:#fff;}
.dp-btn.today-ring{box-shadow:0 0 0 2.5px #C8A96E;}
.dp-btn.selected-ring{outline:2px solid #1A3028;outline-offset:2px;}

/* Loop bar */
.loop-wrap{padding:18px 20px 0;}
.loop-header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:7px;}
.loop-title{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6AAF8B;}
.loop-fraction{font-size:13px;font-weight:600;color:#1A3028;font-variant-numeric:tabular-nums;}
.loop-track{height:5px;background:#D6EDE3;border-radius:3px;overflow:hidden;}
.loop-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#3D7A5E,#6AAF8B);
  transition:width .5s cubic-bezier(.4,0,.2,1);}

/* Day card */
.day-detail{margin:16px 20px 0;background:#fff;border:1.5px solid #D6EDE3;border-radius:16px;
  overflow:hidden;box-shadow:0 2px 12px rgba(26,48,40,.06);}
.dd-head{padding:16px 18px 14px;border-bottom:1px solid #EBF7F1;
  display:flex;justify-content:space-between;align-items:center;}
.dd-dayname{font-size:15px;font-weight:700;color:#1A3028;}
.dd-done-btn{font-size:11px;font-weight:700;letter-spacing:.05em;padding:7px 15px;
  border-radius:20px;border:none;cursor:pointer;transition:all .15s;}
.dd-done-btn.mark{background:#3D7A5E;color:#fff;}
.dd-done-btn.mark:hover{background:#2D5243;}
.dd-done-btn.unmark{background:#EBF7F1;color:#3D7A5E;border:1.5px solid #B8DECA;}
.assigned-list{padding:0 18px;}
.assigned-item{display:flex;align-items:center;justify-content:space-between;
  padding:11px 0;border-bottom:1px solid #F0F8F4;gap:8px;}
.assigned-item:last-child{border-bottom:none;}
.ai-label{font-size:13px;font-weight:600;color:#1A3028;}
.ai-sub{font-size:11px;color:#8AB8A4;margin-top:2px;}
.ai-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px;letter-spacing:.04em;}
.ai-badge.hizb{background:#EBF7F1;color:#3D7A5E;}
.ai-badge.sourate{background:#FDF6EB;color:#C8A96E;}
.ai-del{background:none;border:none;color:#C8DFD5;cursor:pointer;font-size:18px;
  padding:2px 6px;line-height:1;transition:color .15s;border-radius:6px;}
.ai-del:hover{color:#E07070;}
.add-row{padding:14px 18px;border-top:1.5px solid #EBF7F1;display:flex;gap:8px;
  align-items:center;background:#FAFFFE;}
.add-type-toggle{display:flex;background:#EBF7F1;border-radius:8px;padding:2px;flex-shrink:0;}
.att-btn{padding:5px 10px;border-radius:6px;border:none;font-size:11px;font-weight:700;
  letter-spacing:.04em;cursor:pointer;color:#8AB8A4;background:transparent;transition:all .15s;}
.att-btn.on{background:#3D7A5E;color:#fff;}
.add-select{flex:1;background:#F0F8F4;border:1.5px solid #D6EDE3;border-radius:9px;
  padding:8px 10px;font-size:13px;font-family:'Inter',sans-serif;color:#1A3028;outline:none;
  appearance:none;-webkit-appearance:none;min-width:0;}
.add-select:focus{border-color:#3D7A5E;}
.add-confirm{width:34px;height:34px;border-radius:9px;background:#3D7A5E;color:#fff;
  border:none;cursor:pointer;font-size:20px;line-height:1;flex-shrink:0;transition:background .15s;}
.add-confirm:hover{background:#2D5243;}
.empty-day{padding:18px;font-size:13px;color:#B8DECA;font-style:italic;}

/* Programme view */
.prog-view{padding:20px;}
.loop-overview{background:linear-gradient(135deg,#1A3028 0%,#2D5243 100%);
  border-radius:16px;padding:20px;margin-bottom:20px;
  box-shadow:0 4px 16px rgba(26,48,40,.18);position:relative;overflow:hidden;}
.loop-overview::before{content:'';position:absolute;right:-20px;top:-20px;
  width:100px;height:100px;border-radius:50%;background:rgba(200,169,110,.1);pointer-events:none;}
.lo-title{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:rgba(255,255,255,.4);margin-bottom:14px;}
.lo-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.lo-day{display:flex;flex-direction:column;align-items:center;gap:5px;}
.lo-d-label{font-size:9px;color:rgba(255,255,255,.35);letter-spacing:.06em;text-transform:uppercase;}
.lo-d-count{font-size:14px;font-weight:600;color:#fff;font-variant-numeric:tabular-nums;}
.lo-d-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.12);}
.lo-d-dot.done{background:#C8A96E;}
.dpb-block{margin-bottom:18px;}
.dpb-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:#6AAF8B;margin-bottom:8px;display:flex;align-items:center;gap:8px;}
.dpb-label .line{flex:1;height:1px;background:#D6EDE3;}
.dpb-done-tag{font-size:9px;background:#3D7A5E;color:#fff;padding:2px 7px;border-radius:10px;}
.dpb-done-tag.partial{background:#C8A96E;}
.dpb-pills{display:flex;flex-wrap:wrap;gap:6px;}
.dpb-pill{border-radius:20px;padding:5px 13px;font-size:12px;font-weight:600;}
.dpb-pill.hizb{background:#EBF7F1;color:#2D5243;border:1px solid #B8DECA;}
.dpb-pill.sourate{background:#FDF6EB;color:#8B6914;border:1px solid #EDD9A3;}
.dpb-pill.pill-done{opacity:0.55;text-decoration:line-through;}
.dpb-empty{font-size:12px;color:#B8DECA;font-style:italic;}
.sec-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:#6AAF8B;margin-bottom:14px;}

/* ── Item checkbox ── */
.assigned-item.item-done{opacity:0.6;}
.item-check{width:24px;height:24px;border-radius:7px;border:1.5px solid #C8DFD5;background:#fff;
  cursor:pointer;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;transition:all .15s;
  display:flex;align-items:center;justify-content:center;}
.item-check.checked{background:#3D7A5E;border-color:#3D7A5E;}
.item-check:hover{border-color:#3D7A5E;}
.ai-label{transition:color .15s;}
.item-done .ai-label{text-decoration:line-through;color:#B8DECA;}

/* Day circle partial state */
.dp-btn.partial{border-color:#C8A96E;color:#C8A96E;background:#FDF6EB;}

/* ── Progress circle card ── */
.circle-card{background:#fff;border:1.5px solid #D6EDE3;border-radius:18px;
  padding:24px;margin-bottom:20px;box-shadow:0 2px 12px rgba(26,48,40,.06);
  display:flex;flex-direction:column;align-items:center;}
.circle-title{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
  color:#6AAF8B;margin-bottom:18px;}
.circle-wrap{position:relative;display:flex;align-items:center;justify-content:center;}
.circle-center{position:absolute;display:flex;flex-direction:column;align-items:center;}
.circle-pct{font-size:30px;font-weight:300;color:#1A3028;line-height:1;font-variant-numeric:tabular-nums;}
.circle-sub{font-size:11px;color:#8AB8A4;margin-top:4px;font-weight:600;}
.circle-legend{display:flex;gap:18px;margin-top:18px;}
.circle-legend-item{display:flex;align-items:center;gap:6px;font-size:11px;color:#6AAF8B;font-weight:600;}
.circle-legend-item .dot{width:8px;height:8px;border-radius:50%;display:inline-block;}
.circle-legend-item .dot.hizb{background:#3D7A5E;}
.circle-legend-item .dot.sourate{background:#C8A96E;}

/* ── Historique ── */
.hist-view{padding:20px;}
.hist-week{background:#fff;border:1.5px solid #D6EDE3;border-radius:14px;
  padding:16px 18px;margin-bottom:12px;box-shadow:0 1px 6px rgba(26,48,40,.04);}
.hist-week-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;}
.hist-week-label{font-size:13px;font-weight:600;color:#1A3028;}
.hist-week-badge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;}
.hist-week-badge.complete{background:#EBF7F1;color:#3D7A5E;border:1px solid #B8DECA;}
.hist-week-badge.partial{background:#FDF6EB;color:#C8A96E;border:1px solid #EDD9A3;}
.hist-week-badge.current{background:#1A3028;color:#fff;}
.hist-dots{display:flex;gap:5px;}
.hist-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
  justify-content:center;font-size:9px;font-weight:700;letter-spacing:.04em;
  text-transform:uppercase;border:1.5px solid #E5EDE9;color:#C8DFD5;background:#F5FAF7;}
.hist-dot.done{background:#3D7A5E;border-color:#3D7A5E;color:#fff;}
.hist-dot.today{border-color:#C8A96E;}
.hist-empty{text-align:center;padding:40px 20px;color:#B8DECA;font-size:13px;line-height:1.7;}

/* Notif panel */
.notif-panel{margin:16px 20px 0;background:#fff;border:1.5px solid #D6EDE3;
  border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(26,48,40,.06);}
.notif-title{font-size:13px;font-weight:700;color:#1A3028;margin-bottom:4px;}
.notif-sub{font-size:12px;color:#8AB8A4;margin-bottom:16px;line-height:1.5;}
.notif-status{display:flex;align-items:center;gap:8px;font-size:12px;
  padding:10px 14px;border-radius:10px;margin-bottom:14px;}
.notif-status.granted{background:#EBF7F1;color:#2D5243;}
.notif-status.denied{background:#FFF0F0;color:#C05050;}
.notif-status.default{background:#F5F5F5;color:#888;}
.notif-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.notif-dot.granted{background:#3D7A5E;}
.notif-dot.denied{background:#E07070;}
.notif-dot.default{background:#CCC;}
.notif-btn{width:100%;padding:12px;border-radius:10px;border:none;
  font-family:'Inter',sans-serif;font-size:13px;font-weight:700;
  cursor:pointer;letter-spacing:.04em;transition:all .15s;margin-bottom:8px;}
.notif-btn.primary{background:#3D7A5E;color:#fff;}
.notif-btn.primary:hover{background:#2D5243;}
.notif-btn.secondary{background:#EBF7F1;color:#3D7A5E;border:1.5px solid #B8DECA;}
.notif-time-row{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.notif-time-label{font-size:12px;color:#6AAF8B;font-weight:500;white-space:nowrap;}
.notif-time-input{flex:1;background:#F0F8F4;border:1.5px solid #D6EDE3;border-radius:9px;
  padding:8px 12px;font-size:14px;font-family:'Inter',sans-serif;color:#1A3028;outline:none;}
.notif-time-input:focus{border-color:#3D7A5E;}

/* Toast */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);
  background:#1A3028;color:#fff;padding:9px 20px;border-radius:20px;
  font-size:13px;font-weight:600;opacity:0;transition:opacity .25s;
  pointer-events:none;white-space:nowrap;z-index:999;
  box-shadow:0 4px 16px rgba(26,48,40,.3);}
.toast.on{opacity:1;}

/* Confetti overlay */
.confetti-wrap{position:fixed;inset:0;pointer-events:none;z-index:500;overflow:hidden;}
@keyframes confettiFall{
  0%{transform:translateY(-10px) rotate(0deg);opacity:1;}
  100%{transform:translateY(110vh) rotate(720deg);opacity:0;}
}
.confetti-piece{position:absolute;top:-10px;width:8px;height:8px;border-radius:2px;
  animation:confettiFall linear forwards;}
`;

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ show }) {
  if (!show) return null;
  const pieces = Array.from({length:40},(_,i)=>({
    id:i,
    left: Math.random()*100,
    color:["#3D7A5E","#6AAF8B","#C8A96E","#B8DECA","#1A3028"][i%5],
    delay: Math.random()*0.8,
    duration: 1.5+Math.random()*1,
    size: 6+Math.random()*8,
  }));
  return (
    <div className="confetti-wrap">
      {pieces.map(p=>(
        <div key={p.id} className="confetti-piece" style={{
          left:`${p.left}%`, background:p.color,
          width:p.size, height:p.size,
          animationDelay:`${p.delay}s`,
          animationDuration:`${p.duration}s`,
        }}/>
      ))}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(load);
  const [tab, setTab] = useState("semaine");
  const [selectedDay, setSelectedDay] = useState(todayIdx());
  const [addType, setAddType] = useState("hizb");
  const [addVal, setAddVal] = useState(HIZBS[0].id);
  const [toast, setToast] = useState({ msg:"", on:false });
  const [showNotif, setShowNotif] = useState(false);
  const [notifPerm, setNotifPerm] = useState(typeof Notification!=="undefined" ? Notification.permission : "unsupported");
  const [notifTime, setNotifTime] = useState(data.notifTime || "08:00");
  const [confetti, setConfetti] = useState(false);
  const timerRef = useRef(null);

  const weekKey = getWeekKey();
  const thisWeek = data.weeks?.[weekKey] || { itemDone:{}, schedule:{} };
  const schedule = thisWeek.schedule || {};
  const itemDone = thisWeek.itemDone || {}; // { [dayIdx]: [itemId, itemId...] }

  function persist(next) { setData(next); save(next); }

  function updateWeek(fn) {
    const prev = data.weeks?.[weekKey] || { itemDone:{}, schedule:{} };
    const updated = fn(JSON.parse(JSON.stringify(prev)));
    const newData = { ...data, weeks: { ...(data.weeks||{}), [weekKey]: updated } };
    // Auto-detect full loop completion (all assigned items across the week validated)
    if (isWeekComplete(updated) && !isWeekComplete(prev)) {
      triggerKhatmaPrompt(newData);
    }
    persist(newData);
  }

  function triggerKhatmaPrompt(d) {
    setConfetti(true);
    setTimeout(()=>setConfetti(false), 2500);
    flash("🎉 Boucle complète cette semaine !");
  }

  function flash(msg) {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ msg, on:true });
    timerRef.current = setTimeout(()=>setToast(t=>({...t,on:false})), 2200);
  }

  function toggleItemDone(dayIdx, itemId) {
    updateWeek(w => {
      const id = w.itemDone || {};
      const list = id[dayIdx] || [];
      id[dayIdx] = list.includes(itemId) ? list.filter(x=>x!==itemId) : [...list, itemId];
      w.itemDone = id;
      return w;
    });
  }

  function addToDay(dayIdx) {
    if (!addVal) return;
    updateWeek(w=>{
      const sch=w.schedule||{};
      const list=sch[dayIdx]||[];
      if (!list.find(x=>x.id===addVal)) sch[dayIdx]=[...list,{type:addType,id:addVal}];
      w.schedule=sch; return w;
    });
    flash("Ajouté ✓");
  }

  function removeFromDay(dayIdx, itemId) {
    updateWeek(w=>{
      const sch=w.schedule||{};
      sch[dayIdx]=(sch[dayIdx]||[]).filter(x=>x.id!==itemId);
      const id=w.itemDone||{};
      id[dayIdx]=(id[dayIdx]||[]).filter(x=>x!==itemId);
      w.schedule=sch; w.itemDone=id; return w;
    });
  }

  // ── Notifications ──
  async function handleEnableNotif() {
    const res = await requestNotifPermission();
    setNotifPerm(res);
    if (res==="granted") {
      persist({...data, notifEnabled:true, notifTime});
      scheduleTestNotif();
      flash("Notifications activées ✓");
      setShowNotif(false);
    } else {
      flash("Notifications refusées par le navigateur");
    }
  }

  function saveNotifTime() {
    persist({...data, notifTime, notifEnabled:true});
    flash("Heure de rappel enregistrée ✓");
    setShowNotif(false);
  }

  // ── Helpers ──
  function getItemLabel(item) {
    if (item.type==="hizb") return HIZBS.find(h=>h.id===item.id)?.label||item.id;
    return SOURATES.find(s=>s.id===item.id)?.label||item.id;
  }
  function getItemSub(item) {
    if (item.type==="hizb"){const h=HIZBS.find(h=>h.id===item.id);return h?`Juz ${h.juz}`:"";}
    const s=SOURATES.find(s=>s.id===item.id);return s?`P. ${s.pages}`:"";
  }

  // Total items planned this week & how many validated (across all days)
  const allPlannedItems = Object.entries(schedule).flatMap(([day, items]) => (items||[]).map(it => ({...it, day})));
  const totalPlanned = allPlannedItems.length;
  const totalValidated = allPlannedItems.filter(it => (itemDone[it.day]||[]).includes(it.id)).length;

  // Personal loop = unique hizbs/sourates assigned across the week (the user's own boucle)
  const plannedHizbIds = new Set();
  const plannedSourateIds = new Set();
  const validatedHizbIds = new Set();
  const validatedSourateIds = new Set();
  allPlannedItems.forEach(it => {
    if (it.type==="hizb") plannedHizbIds.add(it.id);
    else plannedSourateIds.add(it.id);
    if ((itemDone[it.day]||[]).includes(it.id)) {
      if (it.type==="hizb") validatedHizbIds.add(it.id);
      else validatedSourateIds.add(it.id);
    }
  });

  const hizbPlanned = plannedHizbIds.size;
  const souratePlanned = plannedSourateIds.size;
  const hizbValidatedCount = validatedHizbIds.size;
  const sourateValidatedCount = validatedSourateIds.size;
  const hizbPercent = hizbPlanned ? Math.round((hizbValidatedCount/hizbPlanned)*100) : 0;
  const souratePercent = souratePlanned ? Math.round((sourateValidatedCount/souratePlanned)*100) : 0;
  const totalLoopUnits = hizbPlanned + souratePlanned;
  const validatedCount = hizbValidatedCount + sourateValidatedCount;
  const loopPercent = totalLoopUnits ? Math.round((validatedCount/totalLoopUnits)*100) : 0;

  function switchType(t) { setAddType(t); setAddVal(t==="hizb"?HIZBS[0].id:SOURATES[0].id); }
  const options = addType==="hizb" ? HIZBS : SOURATES;

  // ── Historique ──
  const allWeeks = Object.entries(data.weeks||{})
    .sort(([a],[b])=>b.localeCompare(a));

  const notifStatusLabel = { granted:"Activées", denied:"Refusées (modifier dans les réglages)", default:"Non activées", unsupported:"Non supportées" };

  return (
    <>
      <style>{CSS}</style>
      <Confetti show={confetti}/>
      <div className="app">

        {/* Header */}
        <div className="hdr">
          <div className="hdr-logo"><WirdiLogo size={42}/></div>
          <div className="hdr-text">
            <div className="hdr-brand">Wirdi<span>App</span></div>
            <div className="hdr-sub">مراجعة القرآن الكريم</div>
          </div>
          <button
            className={`hdr-notif${data.notifEnabled?" active":""}`}
            onClick={()=>setShowNotif(v=>!v)}
            title="Notifications"
          >🔔</button>
        </div>

        {/* Notif panel */}
        {showNotif && (
          <div className="notif-panel">
            <div className="notif-title">Rappel quotidien</div>
            <div className="notif-sub">Reçois une notification chaque jour pour te rappeler ta séance de révision.</div>
            <div className={`notif-status ${notifPerm}`}>
              <div className={`notif-dot ${notifPerm}`}/>
              {notifStatusLabel[notifPerm]||notifPerm}
            </div>
            {notifPerm==="granted" && (
              <>
                <div className="notif-time-row">
                  <span className="notif-time-label">Heure du rappel</span>
                  <input className="notif-time-input" type="time" value={notifTime}
                    onChange={e=>setNotifTime(e.target.value)}/>
                </div>
                <button className="notif-btn primary" onClick={saveNotifTime}>Enregistrer l'heure</button>
                <button className="notif-btn secondary" onClick={scheduleTestNotif}>Tester la notification</button>
              </>
            )}
            {notifPerm!=="granted" && notifPerm!=="unsupported" && (
              <button className="notif-btn primary" onClick={handleEnableNotif}>
                {notifPerm==="denied"?"Voir les réglages du navigateur":"Activer les notifications"}
              </button>
            )}
            {notifPerm==="unsupported" && (
              <div style={{fontSize:12,color:"#B8DECA",fontStyle:"italic"}}>Les notifications ne sont pas supportées sur ce navigateur.</div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          {[["semaine","Semaine"],["programme","Programme"],["historique","Historique"]].map(([k,l])=>(
            <button key={k} className={`tab${tab===k?" on":""}`} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </div>

        {/* ════ SEMAINE ════ */}
        {tab==="semaine" && (<>
          <div className="week-strip">
            {DAYS_SHORT.map((d,i)=>{
              const items = schedule[i]||[];
              const { total, done: nDone } = dayProgress(items, itemDone[i]||[]);
              const hasC = total>0;
              const isFullyDone = hasC && nDone===total;
              const isPartial = hasC && nDone>0 && nDone<total;
              const isToday=i===todayIdx();
              const isSel=i===selectedDay;
              return (
                <div className="day-pill" key={i}>
                  <span className="dp-label">{d}</span>
                  <button
                    className={["dp-btn",hasC?"has-content":"",isFullyDone?"done":"",isPartial?"partial":"",isToday?"today-ring":"",isSel&&!isFullyDone?"selected-ring":""].filter(Boolean).join(" ")}
                    onClick={()=>setSelectedDay(i)}
                  >{isFullyDone?"✓":hasC?`${nDone}/${total}`:""}</button>
                </div>
              );
            })}
          </div>

          <div className="loop-wrap">
            <div className="loop-header">
              <span className="loop-title">Boucle de la semaine</span>
              <span className="loop-fraction">{totalValidated} / {totalPlanned||0}</span>
            </div>
            <div className="loop-track">
              <div className="loop-fill" style={{width:`${totalPlanned?(totalValidated/totalPlanned)*100:0}%`}}/>
            </div>
          </div>

          <div className="day-detail">
            <div className="dd-head">
              <span className="dd-dayname">{DAYS[selectedDay]}</span>
              {(schedule[selectedDay]||[]).length>0 && (
                <span style={{fontSize:11,fontWeight:700,color:"#6AAF8B"}}>
                  {dayProgress(schedule[selectedDay]||[], itemDone[selectedDay]||[]).done} / {dayProgress(schedule[selectedDay]||[], itemDone[selectedDay]||[]).total} validés
                </span>
              )}
            </div>
            {(schedule[selectedDay]||[]).length===0?(
              <div className="empty-day">Aucune révision assignée — ajoutez ci-dessous.</div>
            ):(
              <div className="assigned-list">
                {(schedule[selectedDay]||[]).map(item=>{
                  const isDone = (itemDone[selectedDay]||[]).includes(item.id);
                  return (
                    <div className={`assigned-item${isDone?" item-done":""}`} key={item.id}>
                      <button className={`item-check${isDone?" checked":""}`} onClick={()=>toggleItemDone(selectedDay,item.id)}>
                        {isDone?"✓":""}
                      </button>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span className="ai-label">{getItemLabel(item)}</span>
                          <span className={`ai-badge ${item.type}`}>{item.type==="hizb"?"Hizb":"Sourate"}</span>
                        </div>
                        <div className="ai-sub">{getItemSub(item)}</div>
                      </div>
                      <button className="ai-del" onClick={()=>removeFromDay(selectedDay,item.id)}>×</button>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="add-row">
              <div className="add-type-toggle">
                <button className={`att-btn${addType==="hizb"?" on":""}`} onClick={()=>switchType("hizb")}>Hizb</button>
                <button className={`att-btn${addType==="sourate"?" on":""}`} onClick={()=>switchType("sourate")}>Sourate</button>
              </div>
              <select className="add-select" value={addVal} onChange={e=>setAddVal(e.target.value)}>
                {options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
              <button className="add-confirm" onClick={()=>addToDay(selectedDay)}>+</button>
            </div>
          </div>
        </>)}

        {/* ════ PROGRAMME ════ */}
        {tab==="programme" && (
          <div className="prog-view">

            {/* Loop progress circle */}
            <div className="circle-card">
              <div className="circle-title">Ma boucle personnelle</div>
              {totalLoopUnits === 0 ? (
                <div style={{textAlign:"center",padding:"20px 0",color:"#B8DECA",fontSize:13,fontStyle:"italic",lineHeight:1.6}}>
                  Assigne des hizbs ou sourates<br/>dans l'onglet Semaine pour<br/>voir ta boucle apparaître ici.
                </div>
              ) : (
                <>
                  <div className="circle-wrap">
                    <svg viewBox="0 0 160 160" width="160" height="160">
                      <circle cx="80" cy="80" r="68" fill="none" stroke="#EBF7F1" strokeWidth="12"/>
                      {souratePlanned > 0 && <circle cx="80" cy="80" r="50" fill="none" stroke="#FDF6EB" strokeWidth="12"/>}
                      {hizbPlanned > 0 && (
                        <circle cx="80" cy="80" r="68" fill="none" stroke="#3D7A5E" strokeWidth="12"
                          strokeDasharray={`${2*Math.PI*68}`}
                          strokeDashoffset={`${2*Math.PI*68*(1-hizbPercent/100)}`}
                          strokeLinecap="round" transform="rotate(-90 80 80)"
                          style={{transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)"}}
                        />
                      )}
                      {souratePlanned > 0 && (
                        <circle cx="80" cy="80" r="50" fill="none" stroke="#C8A96E" strokeWidth="12"
                          strokeDasharray={`${2*Math.PI*50}`}
                          strokeDashoffset={`${2*Math.PI*50*(1-souratePercent/100)}`}
                          strokeLinecap="round" transform="rotate(-90 80 80)"
                          style={{transition:"stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)"}}
                        />
                      )}
                    </svg>
                    <div className="circle-center">
                      <span className="circle-pct">{loopPercent}%</span>
                      <span className="circle-sub">{validatedCount} / {totalLoopUnits}</span>
                    </div>
                  </div>
                  <div className="circle-legend">
                    {hizbPlanned > 0 && (
                      <span className="circle-legend-item">
                        <span className="dot hizb"/>Hizbs · {hizbValidatedCount}/{hizbPlanned}
                      </span>
                    )}
                    {souratePlanned > 0 && (
                      <span className="circle-legend-item">
                        <span className="dot sourate"/>Sourates · {sourateValidatedCount}/{souratePlanned}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="sec-label">Programme jour par jour</div>
            {DAYS.map((day,i)=>{
              const items=schedule[i]||[];
              const { total, done: nDone } = dayProgress(items, itemDone[i]||[]);
              return (
                <div className="dpb-block" key={i}>
                  <div className="dpb-label">
                    {day}
                    {total>0&&<span className={`dpb-done-tag${nDone===total?"":" partial"}`}>{nDone}/{total}</span>}
                    <span className="line"/>
                  </div>
                  {items.length===0?<span className="dpb-empty">Aucune révision planifiée</span>:(
                    <div className="dpb-pills">
                      {items.map(item=>{
                        const isDone=(itemDone[i]||[]).includes(item.id);
                        return (
                          <span key={item.id} className={`dpb-pill ${item.type}${isDone?" pill-done":""}`}>
                            {isDone&&"✓ "}{getItemLabel(item)}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════ HISTORIQUE ════ */}
        {tab==="historique" && (
          <div className="hist-view">
            {allWeeks.length===0?(
              <div className="hist-empty">
                Aucun historique pour l'instant.<br/>
                Commence à valider tes révisions pour voir l'historique apparaître ici.
              </div>
            ):allWeeks.map(([wk, wd])=>{
              const isCurrent = wk===weekKey;
              const complete = isWeekComplete(wd);
              const sch = wd.schedule||{};
              const id = wd.itemDone||{};
              const planned = DAYS.map((_,i)=>(sch[i]?.length||0)>0);
              const dayFull = DAYS.map((_,i)=>{
                const items = sch[i]||[];
                if (items.length===0) return false;
                return items.every(it=>(id[i]||[]).includes(it.id));
              });
              const totalItems = Object.values(sch).flat().length;
              const totalDone = Object.entries(sch).reduce((acc,[day,items])=>acc+(items||[]).filter(it=>(id[day]||[]).includes(it.id)).length,0);
              const badge = isCurrent?"current":complete?"complete":"partial";
              const badgeLabel = isCurrent?"En cours":complete?"Complète":"Partielle";
              return (
                <div className="hist-week" key={wk}>
                  <div className="hist-week-head">
                    <div>
                      <div className="hist-week-label">{isCurrent?"Cette semaine":weekLabel(wk)}</div>
                      <div style={{fontSize:11,color:"#B8DECA",marginTop:2}}>
                        {totalDone} / {totalItems} révisions validées
                      </div>
                    </div>
                    <span className={`hist-week-badge ${badge}`}>{badgeLabel}</span>
                  </div>
                  <div className="hist-dots">
                    {DAYS_SHORT.map((d,i)=>(
                      <div key={i} className={["hist-dot",dayFull[i]?"done":"",i===todayIdx()&&isCurrent?"today":""].filter(Boolean).join(" ")}>
                        {d[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className={`toast${toast.on?" on":""}`}>{toast.msg}</div>
    </>
  );
}
