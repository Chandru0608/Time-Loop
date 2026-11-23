import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock3, Fingerprint, Users, Shield, ArrowRight, LockKeyhole, Eye, ScanLine, Radio, Terminal, LogOut, Copy, Check, Send, BrainCircuit, RotateCcw, ChevronRight, BookOpen, AlertTriangle, KeyRound } from "lucide-react";
import api from "./api";
import { getSocket } from "./socket";

const chapterFallback = [
["The First Reset","A body. A locked door. Five minutes to midnight."],
["The Missing Footage","Someone erased exactly seven minutes."],
["The Locked Memory","A message buried in the scientist's files."],
["The Hidden Laboratory","The experiment beneath the experiment."],
["The First Timeline","The past is a room you can enter."],
["Four Suspects","Every story changes when time repeats."],
["The Parallel Reality","A version of the facility where Voss survived."],
["The Paradox","The clue you erase is the clue you need."],
["The Last Witness","The person who remembers every reset."],
["The Last Timeline","End the loop. Choose what survives."]
];

function Shell({ children }) {
  return <div className="app-shell"><div className="scanlines"/><header className="topbar"><a href="/" className="brand"><span className="brand-mark"><Clock3 size={19}/></span><span>TIME<span className="cyan">LOOP</span><small>THE LAST TIMELINE</small></span></a><div className="top-status"><span className="pulse"/> CHRONOS NETWORK <b>ONLINE</b></div></header>{children}<footer>CHRONOS RESEARCH // CLASSIFIED ACCESS // 2099</footer></div>;
}
function getUser(){ try{return JSON.parse(localStorage.getItem("tl_user")||"null")}catch{return null} }
function saveSession(data){localStorage.setItem("tl_token",data.token);localStorage.setItem("tl_user",JSON.stringify(data.user));}

function Home(){
  const nav=useNavigate(); const user=getUser();
  return <Shell><main className="hero">
    <div className="hero-grid"/>
    <div className="hero-copy"><div className="eyebrow"><span className="line"/> TEMPORAL ANOMALY DETECTED <span className="line"/></div>
      <h1>THE LAST<br/><span>TIMELINE</span></h1>
      <p className="hero-sub">THE WORLD FORGETS. <strong>YOU REMEMBER.</strong></p>
      <p className="hero-desc">A cooperative time-travel detective escape room. Investigate a murder, recover evidence across repeating timelines, and uncover the truth buried in 2099.</p>
      <div className="hero-actions"><button className="btn primary" onClick={()=>nav(user?"/dashboard":"/register")}>ENTER THE LOOP <ArrowRight size={17}/></button><button className="btn ghost" onClick={()=>document.getElementById("briefing").scrollIntoView({behavior:"smooth"})}>MISSION BRIEFING</button></div>
      <div className="hero-stats"><div><b>10</b><span>CHAPTERS</span></div><div><b>04</b><span>INVESTIGATORS</span></div><div><b>∞</b><span>TIMELINES</span></div></div>
    </div>
    <div className="hero-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core"><div className="core-inner"><Clock3 size={82}/><span>23:59:59</span></div></div><div className="float-tag tag-a"><Radio size={14}/> TEMPORAL CORE <b>UNSTABLE</b></div><div className="float-tag tag-b"><Fingerprint size={14}/> SUBJECT IDENTIFIED <b>UNKNOWN</b></div><div className="float-tag tag-c"><ScanLine size={14}/> LOOP COUNT <b>001</b></div></div>
  </main><section id="briefing" className="briefing"><div className="section-kicker">01 / MISSION BRIEFING</div><h2>ONE MURDER. <span>INFINITE ATTEMPTS.</span></h2><div className="feature-grid"><Feature icon={<Fingerprint/>} title="INVESTIGATE" text="Search rooms, inspect evidence and connect the clues left behind by a scientist who knew too much."/><Feature icon={<RotateCcw/>} title="REPEAT" text="When the countdown expires, the world resets. Your discoveries and memories survive the collapse."/><Feature icon={<Users/>} title="COOPERATE" text="Create a private room and bring up to three other investigators into the mystery."/><Feature icon={<BrainCircuit/>} title="DEDUCE" text="Solve layered logic puzzles, expose contradictions and make decisions that reshape the story." /></div></section></Shell>;
}
function Feature({icon,title,text}){return <div className="feature"><div className="feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>}

function AuthPage({mode}){
  const nav=useNavigate(); const [form,setForm]=useState({username:"",email:"",password:""}); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  const submit=async e=>{e.preventDefault();setError("");setBusy(true);try{const {data}=await api.post(`/auth/${mode}`,form);saveSession(data);nav("/dashboard");}catch(err){setError(err.response?.data?.message||"Unable to connect to the server.");}finally{setBusy(false);}};
  return <Shell><main className="auth-wrap"><div className="auth-panel"><div className="section-kicker">CHRONOS IDENTITY SYSTEM</div><h2>{mode==="login"?"WELCOME BACK,":"REGISTER"} <span>INVESTIGATOR</span></h2><p className="muted">Your memories are the only thing the timeline cannot erase.</p><form onSubmit={submit}>
    {mode==="register"&&<label>CODENAME<input required minLength="3" placeholder="e.g. Detective01" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></label>}
    <label>EMAIL ADDRESS<input required type="email" placeholder="investigator@chronos.net" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
    <label>ACCESS KEY<input required minLength="8" type="password" placeholder="Minimum 8 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
    {error&&<div className="error">{error}</div>}<button className="btn primary full" disabled={busy}>{busy?"AUTHENTICATING...":mode==="login"?"ACCESS THE SYSTEM":"CREATE INVESTIGATOR ID"} <ArrowRight size={16}/></button>
  </form><p className="switch-auth">{mode==="login"?"New to Chronos?":"Already registered?"} <button onClick={()=>nav(mode==="login"?"/register":"/login")}>{mode==="login"?"Create an account":"Sign in"}</button></p></div></main></Shell>;
}

function Dashboard(){
  const nav=useNavigate(); const user=getUser(); const [code,setCode]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  useEffect(()=>{if(!user||!localStorage.getItem("tl_token"))nav("/login");},[]);
  const create=async()=>{setBusy(true);setError("");try{const {data}=await api.post("/rooms");nav(`/room/${data.room.roomCode}`);}catch(e){setError(e.response?.data?.message||"Could not create room.");}finally{setBusy(false);}};
  const join=async e=>{e.preventDefault();setBusy(true);setError("");try{const {data}=await api.post("/rooms/join",{roomCode:code});nav(`/room/${data.room.roomCode}`);}catch(e){setError(e.response?.data?.message||"Could not join room.");}finally{setBusy(false);}};
  const logout=()=>{localStorage.removeItem("tl_token");localStorage.removeItem("tl_user");nav("/");};
  return <Shell><main className="dashboard"><div className="dash-head"><div><div className="section-kicker">INVESTIGATOR TERMINAL / 2099</div><h2>GOOD TO SEE YOU, <span>{user?.username?.toUpperCase()||"INVESTIGATOR"}</span></h2><p className="muted">The anomaly is active. Assemble your team.</p></div><button className="btn ghost small" onClick={logout}><LogOut size={15}/> LOG OUT</button></div>
    <div className="dash-grid"><div className="action-card create-card"><div className="big-icon"><Users size={28}/></div><div className="section-kicker">HOST AN INVESTIGATION</div><h3>CREATE A NEW ROOM</h3><p>Open a new timeline and invite up to three fellow investigators using a secure room code.</p><button className="btn primary" onClick={create} disabled={busy}>{busy?"CREATING...":"CREATE ROOM"} <ArrowRight size={16}/></button></div>
    <div className="action-card join-card"><div className="big-icon"><KeyRound size={28}/></div><div className="section-kicker">JOIN YOUR TEAM</div><h3>ENTER ROOM CODE</h3><p>Have a code from your team leader? Enter it below to join the investigation.</p><form onSubmit={join}><input className="code-input" maxLength="6" placeholder="A1B2C3" value={code} onChange={e=>setCode(e.target.value.toUpperCase())}/><button className="btn secondary" disabled={busy||code.length!==6}>JOIN ROOM <ArrowRight size={16}/></button></form></div></div>
    {error&&<div className="error">{error}</div>}<div className="chapter-preview"><div className="section-kicker">CLASSIFIED CASE FILE</div><h3>THE VOSS INCIDENT</h3><p>Chronos Research Facility // 23 November 2099 // Case status: UNRESOLVED</p><div className="chapter-strip">{chapterFallback.map((c,i)=><div key={i} className="chapter-dot"><span>{String(i+1).padStart(2,"0")}</span><small>{c[0]}</small></div>)}</div></div>
  </main></Shell>;
}

function RoomPage(){
  const {code}=useParams(); const nav=useNavigate(); const [room,setRoom]=useState(null); const [chapter,setChapter]=useState(null); const [chat,setChat]=useState([]); const [message,setMessage]=useState(""); const [answer,setAnswer]=useState(""); const [notice,setNotice]=useState(""); const [remaining,setRemaining]=useState(0); const [hint,setHint]=useState(false); const [selectedEvidence,setSelectedEvidence]=useState(null);
  const user=getUser(); const socket=getSocket();
  const refresh=async()=>{try{const {data}=await api.get(`/game/${code}/state`);setRoom(data.room);setChapter(data.chapter);}catch(e){setNotice(e.response?.data?.message||"Could not load room.");}};
  useEffect(()=>{
    if(!localStorage.getItem("tl_token")){nav("/login");return;}
    socket.connect();
    socket.emit("room:join",{roomCode:code},ack=>{if(ack?.error)setNotice(ack.error);else {setRoom(ack.room);refresh();}});
    const update=r=>setRoom(r); const reset=d=>{setNotice(d.message);setRemaining(Math.ceil((new Date(d.timerEndsAt)-Date.now())/1000));refresh();}; const msg=m=>setChat(old=>[...old,m]); const noticeFn=n=>setNotice(n); const solved=d=>setNotice(d.success); const changed=()=>refresh(); const ended=d=>setNotice(`CASE CLOSED // ${d.ending.replaceAll("_"," ").toUpperCase()}`);
    socket.on("room:update",update);socket.on("game:reset",reset);socket.on("chat:message",msg);socket.on("game:notice",noticeFn);socket.on("puzzle:solved",solved);socket.on("chapter:changed",changed);socket.on("game:ended",ended);
    return()=>{socket.off("room:update",update);socket.off("game:reset",reset);socket.off("chat:message",msg);socket.off("game:notice",noticeFn);socket.off("puzzle:solved",solved);socket.off("chapter:changed",changed);socket.off("game:ended",ended);socket.disconnect();};
  },[code]);
  useEffect(()=>{if(room?.timerEndsAt&&room.status==="playing"){const tick=()=>setRemaining(Math.max(0,Math.ceil((new Date(room.timerEndsAt)-Date.now())/1000)));tick();const t=setInterval(tick,250);return()=>clearInterval(t);}},[room?.timerEndsAt,room?.status]);
  useEffect(()=>{if(room?.currentChapter){api.get("/game/chapters").then(({data})=>setChapter(data.chapters[room.currentChapter-1])).catch(()=>{});}},[room?.currentChapter]);
  const emit=(event,payload)=>new Promise(resolve=>socket.emit(event,{roomCode:code,...payload},resolve));
  const start=async()=>{const r=await emit("game:start",{});setNotice(r?.error||"Investigation started.");};
  const collect=async id=>{const r=await emit("evidence:collect",{evidenceId:id});setNotice(r?.error||"Evidence added to shared memory.");};
  const inspectEvidence=async clue=>{
    setSelectedEvidence(clue);
    if(!(room?.discoveredEvidence||[]).includes(clue.id)) await collect(clue.id);
  };
  const solve=async e=>{e.preventDefault();const r=await emit("puzzle:solve",{answer});setNotice(r?.message||r?.error||"No response.");if(r?.correct)setAnswer("");};
  const advance=async()=>{const r=await emit("chapter:advance",{});setNotice(r?.error||"Next chapter unlocked.");if(r?.ok)refresh();};
  const decide=async option=>{const r=await emit("decision:cast",{option});setNotice(r?.error||"Timeline decision recorded.");};
  const send=async e=>{e.preventDefault();const r=await emit("chat:send",{message});if(!r?.error)setMessage("");else setNotice(r.error);};
  if(!room)return <Shell><main className="loading">CONNECTING TO TEMPORAL NETWORK...</main></Shell>;
  const host=String(room.host)===String(user?.id); const current=chapter||{title:chapterFallback[(room.currentChapter||1)-1][0],briefing:"Loading case file...",clues:[],puzzle:{},choices:[]};
  const required=current.requiredClues||[]; const collected=room.discoveredEvidence||[]; const solved=(room.solvedPuzzles||[]).includes(`chapter-${room.currentChapter}-${current.puzzle?.id}`);
  return <Shell><main className="game-layout">
    <div className="game-top"><div><div className="section-kicker">LIVE INVESTIGATION // ROOM {room.roomCode}</div><h2>CHAPTER {String(room.currentChapter).padStart(2,"0")} <span>{current.title}</span></h2></div><div className={`timer ${remaining<30?"danger":""}`}><Clock3 size={19}/><b>{String(Math.floor(remaining/60)).padStart(2,"0")}:{String(remaining%60).padStart(2,"0")}</b><small>LOOP {room.currentLoop}</small></div></div>
    <div className="game-columns"><section className="game-main">
      <div className="room-scene"><div className="scene-grid"/><div className="scene-label"><span className="pulse"/> ACTIVE LOCATION</div><div className="scene-illustration"><div className="door door-left"/><div className="portal"><Clock3 size={54}/><span>CHRONOS</span></div><div className="door door-right"/></div><div className="scene-caption"><b>{current.location||"Chronos Facility"}</b><span>SECTOR {String(room.currentChapter).padStart(2,"0")} // TEMPORAL INSTABILITY {remaining<30?"CRITICAL":"MODERATE"}</span></div></div>
      <div className="brief-card"><div className="section-kicker">CASE FILE / CHAPTER {room.currentChapter}</div><h3>{current.subtitle}</h3><p>{current.briefing}</p></div>
      {room.status==="waiting"&&<div className="start-panel"><div><h3>INVESTIGATORS ASSEMBLED</h3><p>{room.players.length}/4 players connected. Share the room code with your team.</p></div>{host&&<button className="btn primary" onClick={start}>START INVESTIGATION <ArrowRight size={16}/></button>}</div>}
      {room.status==="playing"&&<><div className="clue-section"><div className="section-heading"><div><div className="section-kicker">SCANNABLE OBJECTS</div><h3>INVESTIGATE THE SCENE</h3></div><span className="count">{collected.length} MEMORIES</span></div><div className="clue-grid">{(current.clues||[]).map(clue=><button key={clue.id} className={`clue-card ${collected.includes(clue.id)?"found":""}`} onClick={()=>inspectEvidence(clue)} aria-label={`Inspect ${clue.name}`}><div className="clue-icon">{collected.includes(clue.id)?<Check/>:<Fingerprint/>}</div><b>{clue.name}</b><small>{clue.location}</small><span>{collected.includes(clue.id)?"REMEMBERED":"INSPECT EVIDENCE"}</span></button>)}</div></div>
      <div className="puzzle-card"><div className="section-kicker">SECURITY CHALLENGE</div><h3><LockKeyhole size={18}/> {current.puzzle?.title}</h3><p>{current.puzzle?.prompt}</p><form onSubmit={solve}><input value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="ENTER SOLUTION..." autoComplete="off"/><button className="btn secondary" disabled={!answer.trim()}>SUBMIT <ArrowRight size={15}/></button></form><button className="hint-button" onClick={()=>setHint(!hint)}><Eye size={14}/> {hint?"HIDE HINT":"REQUEST HINT"}</button>{hint&&<div className="hint">{current.puzzle?.hint}</div>}{solved&&<div className="success-line"><Check size={15}/> PUZZLE SOLVED — TEAM PROGRESS SAVED</div>}</div>
      {room.currentChapter===10&&current.choices?.length>0&&<div className="decision-card"><div className="section-kicker">FINAL TIMELINE DECISION</div><h3>WHAT SHOULD SURVIVE?</h3>{current.choices.map(c=><button key={c.id} className="decision-option" onClick={()=>decide(c.id)}><b>{c.label}</b><small>{c.description}</small></button>)}</div>}
      {room.status==="playing"&&host&&<button className="btn primary full advance" onClick={advance} disabled={!solved||!required.every(id=>collected.includes(id))}>UNLOCK NEXT CHAPTER <ChevronRight size={16}/></button>}
      </>}
      {room.status==="completed"&&<div className="ending-panel"><div className="section-kicker">TIMELINE RESOLVED</div><h2>CASE <span>CLOSED</span></h2><p>The team has chosen: {(room.ending||"unknown").replaceAll("_"," ").toUpperCase()}.</p><p>Every loop leaves a trace. This one leaves a future.</p></div>}
      {notice&&<div className="notice"><AlertTriangle size={15}/>{notice}<button onClick={()=>setNotice("")}>×</button></div>}
    </section><aside className="side-panel"><div className="side-box"><div className="section-kicker">INVESTIGATION TEAM</div><h3>OPERATIVES <span>{room.players.length}/4</span></h3>{room.players.map((p,i)=><div className="player-row" key={String(p.user)}><div className="avatar">{(p.username||"I")[0].toUpperCase()}</div><div><b>{p.username}</b><small>{String(p.user)===String(room.host)?"TEAM LEADER":"INVESTIGATOR"}</small></div><i className={p.connected?"online":""}/></div>)}</div>
      <div className="side-box"><div className="section-kicker">SHARED MEMORY</div><h3>EVIDENCE LOG <span>{collected.length}</span></h3>{collected.length?collected.map(id=><div className="memory-item" key={id}><Fingerprint size={14}/>{(current.clues||[]).find(c=>c.id===id)?.name||id.replaceAll("_"," ")}</div>):<p className="empty">No evidence recovered in this timeline.</p>}</div>
      <div className="side-box chat-box"><div className="section-kicker">SECURE CHANNEL</div><h3>TEAM COMMS</h3><div className="chat-messages">{chat.map((m,i)=><div className="chat-message" key={i}><b>{m.username}</b><p>{m.message}</p></div>)}</div><form onSubmit={send}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder="Send a message..."/><button aria-label="Send"><Send size={15}/></button></form></div>
      <div className="side-box progress-box"><div className="section-kicker">CASE PROGRESS</div><div className="progress-number">{room.currentChapter}<small>/10</small></div><div className="progress-track"><span style={{width:`${room.currentChapter*10}%`}}/></div><small>CHAPTERS UNLOCKED</small></div>
    </aside></div>
    <div className="room-footer"><button className="btn ghost small" onClick={()=>nav("/dashboard")}>← LEAVE ROOM</button><span><Shield size={13}/> ENCRYPTED SESSION // {room.roomCode}</span></div>
    {selectedEvidence&&<div className="evidence-modal-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedEvidence(null);}}><section className="evidence-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-modal-title"><div className="section-kicker"><ScanLine size={14}/> EVIDENCE SCAN // CHAPTER {room.currentChapter}</div><button className="evidence-modal-close" onClick={()=>setSelectedEvidence(null)} aria-label="Close evidence">×</button><div className="evidence-modal-icon"><Fingerprint size={30}/></div><h2 id="evidence-modal-title">{selectedEvidence.name}</h2><p className="evidence-location">LOCATION: {selectedEvidence.location}</p><div className="evidence-detail">{selectedEvidence.detail||"No additional information is available for this evidence."}</div><div className="evidence-modal-status"><Check size={15}/> {collected.includes(selectedEvidence.id)?"SAVED TO SHARED MEMORY":"ADDING TO SHARED MEMORY"}</div><button className="btn primary full" onClick={()=>setSelectedEvidence(null)}>RETURN TO INVESTIGATION</button></section></div>}
  </main></Shell>;
}

export default function App(){
  return <Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<AuthPage mode="login"/>}/><Route path="/register" element={<AuthPage mode="register"/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/room/:code" element={<RoomPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}
