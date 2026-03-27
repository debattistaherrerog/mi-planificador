import { useState, useEffect } from "react";

const ESTADOS = ["Pendiente de aprobación", "Aprobado", "Publicado", "Rechazado"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const FORMATOS = ["Reels","Carrusel","Post estático","Historia","Video","Blog","Email","Otro"];
const OBJETIVOS = ["Ventas","Branding","Educación","Entretenimiento","Engagement","Tráfico"];

const EC = {
  "Pendiente de aprobación": { bg:"#FAEEDA", text:"#633806", border:"#EF9F27" },
  "Aprobado":  { bg:"#EAF3DE", text:"#27500A", border:"#639922" },
  "Publicado": { bg:"#E1F5EE", text:"#085041", border:"#1D9E75" },
  "Rechazado": { bg:"#FCEBEB", text:"#791F1F", border:"#E24B4A" },
};

const emptyForm = { fecha:"", formato:"", objetivo:"", promocion:"", idea:"", textoImagen:"", extras:"", opinionesEquipo:"", artes:"", descripciones:"", estado:"Pendiente de aprobación" };

function Badge({ estado }) {
  const c = EC[estado] || {};
  return <span style={{ background:c.bg, color:c.text, border:`1px solid ${c.border}`, borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:500, whiteSpace:"nowrap" }}>{estado}</span>;
}

function Modal({ onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || emptyForm);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid #ddd", padding:"1.5rem", width:"min(560px,95vw)", maxHeight:"88vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontWeight:500, fontSize:16 }}>{initial?"Editar contenido":"Nuevo contenido"}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#888" }}>✕</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px 14px" }}>
          {[["fecha","Fecha","date"],["formato","Formato","select",FORMATOS],["objetivo","Objetivo","select",OBJETIVOS],["promocion","Promoción","text"]].map(([k,label,type,opts])=>(
            <div key={k}>
              <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>{label}</label>
              {type==="select"?(
                <select value={form[k]} onChange={e=>set(k,e.target.value)} style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"0.5px solid #ccc", fontSize:13 }}>
                  <option value="">Seleccionar...</option>
                  {opts.map(o=><option key={o}>{o}</option>)}
                </select>
              ):<input type={type} value={form[k]} onChange={e=>set(k,e.target.value)} style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"0.5px solid #ccc", fontSize:13, boxSizing:"border-box" }} />}
            </div>
          ))}
        </div>
        {[["idea","Idea"],["textoImagen","Texto en imagen"],["extras","Extras"],["opinionesEquipo","Opiniones del equipo"],["artes","Artes (link o descripción)"],["descripciones","Descripciones"]].map(([k,label])=>(
          <div key={k} style={{ marginTop:10 }}>
            <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>{label}</label>
            <textarea value={form[k]} onChange={e=>set(k,e.target.value)} rows={2} style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"0.5px solid #ccc", fontSize:13, resize:"vertical", boxSizing:"border-box" }} />
          </div>
        ))}
        <div style={{ marginTop:10 }}>
          <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>Estado</label>
          <select value={form.estado} onChange={e=>set("estado",e.target.value)} style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"0.5px solid #ccc", fontSize:13 }}>
            {ESTADOS.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:8, marginTop:18 }}>
          <button onClick={onClose} style={{ padding:"7px 16px", borderRadius:8, border:"0.5px solid #ccc", background:"#fff", cursor:"pointer", fontSize:13 }}>Cancelar</button>
          <button onClick={()=>onSave(form)} style={{ padding:"7px 16px", borderRadius:8, border:"none", background:"#1a73e8", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:500 }}>Guardar</button>
        </div>
      </div>
    </div>
  );
}

function NotifModal({ content, onClose }) {
  const msg = `Hola! Te aviso que hay nuevo contenido pendiente de tu aprobación en el planificador.\n\n📅 Fecha: ${content.fecha||"—"}\n📌 Formato: ${content.formato||"—"}\n🎯 Objetivo: ${content.objetivo||"—"}\n💡 Idea: ${content.idea||"—"}\n\nPor favor revisalo cuando puedas. ¡Gracias!`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#e8f8ef", borderRadius:14, border:"1px solid #25D366", padding:"1.5rem", width:"min(480px,92vw)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontWeight:500, fontSize:15, color:"#0F6E56" }}>Notificación para el cliente</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#0F6E56" }}>✕</button>
        </div>
        <p style={{ fontSize:12, color:"#0F6E56", marginBottom:8 }}>El mensaje ya está listo. Tocá el enlace para abrirlo en WhatsApp y elegí el grupo:</p>
        <textarea readOnly value={msg} rows={8} style={{ width:"100%", background:"#fff", border:"0.5px solid #9FE1CB", borderRadius:8, padding:10, fontSize:13, resize:"none", color:"#085041", boxSizing:"border-box" }} />
        <div style={{ display:"flex", justifyContent:"flex-end", marginTop:12 }}>
          <a href={waUrl} target="_blank" rel="noreferrer" style={{ background:"#25D366", color:"#fff", borderRadius:8, padding:"9px 20px", fontWeight:500, fontSize:14, textDecoration:"none", display:"inline-block" }}>
            Abrir en WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function ApprovalModal({ item, onClose, onDecide }) {
  const [comment, setComment] = useState("");
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{ background:"#fff", borderRadius:14, border:"0.5px solid #ddd", padding:"1.5rem", width:"min(500px,94vw)", maxHeight:"90vh", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <span style={{ fontWeight:500, fontSize:16 }}>Revisar contenido</span>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:"#888" }}>✕</button>
        </div>
        <div style={{ background:"#f5f5f5", borderRadius:10, padding:"12px 14px", marginBottom:14, fontSize:13 }}>
          <div style={{ marginBottom:8 }}><Badge estado={item.estado} /></div>
          {[["Fecha",item.fecha],["Formato",item.formato],["Objetivo",item.objetivo],["Promoción",item.promocion],["Idea",item.idea],["Texto en imagen",item.textoImagen],["Extras",item.extras],["Artes",item.artes],["Descripciones",item.descripciones]].filter(([,v])=>v).map(([k,v])=>(
            <div key={k} style={{ marginBottom:6 }}>
              <span style={{ color:"#888", fontSize:12 }}>{k}: </span>
              <span style={{ fontSize:13 }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:12, color:"#666", display:"block", marginBottom:4 }}>Comentario (opcional)</label>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={3} placeholder="Dejá tu feedback acá..." style={{ width:"100%", padding:"7px 10px", borderRadius:8, border:"0.5px solid #ccc", fontSize:13, resize:"vertical", boxSizing:"border-box" }} />
        </div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={()=>onDecide(item.id,"Rechazado",comment)} style={{ padding:"7px 16px", borderRadius:8, background:"#FCEBEB", color:"#791F1F", border:"0.5px solid #E24B4A", fontWeight:500, cursor:"pointer", fontSize:13 }}>Rechazar</button>
          <button onClick={()=>onDecide(item.id,"Aprobado",comment)} style={{ padding:"7px 16px", borderRadius:8, background:"#EAF3DE", color:"#27500A", border:"0.5px solid #639922", fontWeight:500, cursor:"pointer", fontSize:13 }}>Aprobar</button>
        </div>
      </div>
    </div>
  );
}

function AdminCard({ item, onEdit, onDelete, onPublish }) {
  return (
    <div style={{ background:"#fff", border:"0.5px solid #ddd", borderRadius:10, padding:"12px 14px", marginBottom:10, fontSize:13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <span style={{ fontWeight:500, fontSize:14, flex:1, marginRight:8 }}>{item.idea||"(Sin idea)"}</span>
        <Badge estado={item.estado} />
      </div>
      <div style={{ color:"#888", fontSize:12, display:"flex", flexWrap:"wrap", gap:"4px 12px", marginBottom:8 }}>
        {item.fecha&&<span>📅 {item.fecha}</span>}
        {item.formato&&<span>📌 {item.formato}</span>}
        {item.objetivo&&<span>🎯 {item.objetivo}</span>}
        {item.promocion&&<span>📣 {item.promocion}</span>}
      </div>
      {item.comentarioCliente&&(
        <div style={{ background:"#f5f5f5", borderRadius:6, padding:"6px 10px", fontSize:12, marginBottom:8 }}>
          <strong>Comentario del cliente:</strong> {item.comentarioCliente}
        </div>
      )}
      <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap" }}>
        <button onClick={()=>onEdit(item)} style={{ fontSize:12, padding:"4px 12px", borderRadius:8, border:"0.5px solid #ccc", background:"#fff", cursor:"pointer" }}>Editar</button>
        <button onClick={()=>onDelete(item.id)} style={{ fontSize:12, padding:"4px 12px", borderRadius:8, border:"0.5px solid #E24B4A", color:"#791F1F", background:"#fff", cursor:"pointer" }}>Eliminar</button>
        {item.estado==="Aprobado"&&(
          <button onClick={()=>onPublish(item.id)} style={{ fontSize:12, padding:"4px 12px", background:"#E1F5EE", color:"#085041", border:"1px solid #1D9E75", fontWeight:500, borderRadius:8, cursor:"pointer" }}>Marcar como publicado</button>
        )}
      </div>
    </div>
  );
}

function ClientCard({ item, onReview }) {
  const canReview = item.estado==="Pendiente de aprobación";
  return (
    <div style={{ background:"#fff", border:"0.5px solid #ddd", borderRadius:10, padding:"12px 14px", marginBottom:10, fontSize:13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
        <span style={{ fontWeight:500, fontSize:14, flex:1, marginRight:8 }}>{item.idea||"(Sin idea)"}</span>
        <Badge estado={item.estado} />
      </div>
      <div style={{ color:"#888", fontSize:12, display:"flex", flexWrap:"wrap", gap:"4px 12px", marginBottom:8 }}>
        {item.fecha&&<span>📅 {item.fecha}</span>}
        {item.formato&&<span>📌 {item.formato}</span>}
        {item.objetivo&&<span>🎯 {item.objetivo}</span>}
      </div>
      {item.comentarioCliente&&(
        <div style={{ background:"#f5f5f5", borderRadius:6, padding:"6px 10px", fontSize:12, marginBottom:8, color:"#666" }}>
          <strong>Tu comentario:</strong> {item.comentarioCliente}
        </div>
      )}
      {canReview&&<button onClick={()=>onReview(item)} style={{ fontSize:12, padding:"5px 14px", background:"#e8f0fe", color:"#1a73e8", border:"0.5px solid #1a73e8", fontWeight:500, borderRadius:8, cursor:"pointer" }}>Revisar y decidir</button>}
    </div>
  );
}

function MonthlyView({ items, onEdit, onDelete, onPublish }) {
  const now = new Date();
  const [selYear, setSelYear] = useState(now.getFullYear());
  const years = [...new Set(items.map(i=>i.fecha?new Date(i.fecha+"T00:00:00").getFullYear():null).filter(Boolean))];
  if (!years.includes(selYear)) years.push(selYear);
  years.sort();

  const activeMonths = MESES.map((mes,idx)=>({
    mes, idx,
    items: items.filter(i=>{ if(!i.fecha) return false; const d=new Date(i.fecha+"T00:00:00"); return d.getFullYear()===selYear&&d.getMonth()===idx; })
  })).filter(m=>m.items.length>0);

  const [selMes, setSelMes] = useState(()=>activeMonths.find(m=>m.idx===now.getMonth())?.idx??activeMonths[0]?.idx??0);

  const mesItems = items.filter(i=>{ if(!i.fecha) return false; const d=new Date(i.fecha+"T00:00:00"); return d.getFullYear()===selYear&&d.getMonth()===selMes; });

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
        <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))} style={{ fontSize:13, padding:"4px 10px", borderRadius:8, border:"0.5px solid #ccc" }}>
          {years.map(y=><option key={y}>{y}</option>)}
        </select>
      </div>
      {activeMonths.length===0?(
        <p style={{ fontSize:13, color:"#888", textAlign:"center", padding:"2rem 0" }}>No hay contenidos con fecha cargados aún.</p>
      ):(
        <>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:18 }}>
            {activeMonths.map(m=>(
              <button key={m.idx} onClick={()=>setSelMes(m.idx)}
                style={{ fontSize:12, padding:"5px 14px", borderRadius:20, fontWeight:selMes===m.idx?500:400,
                  background:selMes===m.idx?"#e8f0fe":"transparent",
                  color:selMes===m.idx?"#1a73e8":"#666",
                  border:selMes===m.idx?"0.5px solid #1a73e8":"0.5px solid #ddd", cursor:"pointer" }}>
                {m.mes} <span style={{ fontSize:11, opacity:0.8 }}>({m.items.length})</span>
              </button>
            ))}
          </div>
          {mesItems.length===0?(
            <p style={{ fontSize:13, color:"#888", textAlign:"center", padding:"1rem 0" }}>Sin contenidos este mes.</p>
          ):(
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, tableLayout:"fixed" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #eee" }}>
                    {["Fecha","Formato","Objetivo","Idea","Estado","Acciones"].map(h=>(
                      <th key={h} style={{ textAlign:"left", padding:"8px 10px", fontSize:12, color:"#888", fontWeight:500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mesItems.sort((a,b)=>a.fecha>b.fecha?1:-1).map(item=>(
                    <tr key={item.id} style={{ borderBottom:"0.5px solid #eee" }}>
                      <td style={{ padding:"8px 10px", whiteSpace:"nowrap" }}>{item.fecha||"—"}</td>
                      <td style={{ padding:"8px 10px" }}>{item.formato||"—"}</td>
                      <td style={{ padding:"8px 10px" }}>{item.objetivo||"—"}</td>
                      <td style={{ padding:"8px 10px", color:"#666" }}>{item.idea||"—"}</td>
                      <td style={{ padding:"8px 10px" }}><Badge estado={item.estado} /></td>
                      <td style={{ padding:"8px 10px" }}>
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                          <button onClick={()=>onEdit(item)} style={{ fontSize:11, padding:"3px 10px", borderRadius:6, border:"0.5px solid #ccc", background:"#fff", cursor:"pointer" }}>Editar</button>
                          <button onClick={()=>onDelete(item.id)} style={{ fontSize:11, padding:"3px 10px", borderRadius:6, border:"0.5px solid #E24B4A", color:"#791F1F", background:"#fff", cursor:"pointer" }}>Eliminar</button>
                          {item.estado==="Aprobado"&&(
                            <button onClick={()=>onPublish(item.id)} style={{ fontSize:11, padding:"3px 10px", background:"#E1F5EE", color:"#085041", border:"1px solid #1D9E75", fontWeight:500, borderRadius:6, cursor:"pointer" }}>Publicar</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function App() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("admin");
  const [view, setView] = useState("kanban");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [notif, setNotif] = useState(null);
  const [reviewing, setReviewing] = useState(null);
  const [adminAlert, setAdminAlert] = useState(null);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem("planificador_contenidos");
      if (saved) setItems(JSON.parse(saved));
    } catch(e) {}
  }, []);

  // Guardar en localStorage cada vez que cambian los items
  useEffect(() => {
    try {
      localStorage.setItem("planificador_contenidos", JSON.stringify(items));
    } catch(e) {}
  }, [items]);

  const playSound = (aprobado) => {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      const notas = aprobado?[523,659,784]:[400,320];
      notas.forEach((freq,i)=>{
        const osc=ctx.createOscillator(), gain=ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value=freq; osc.type="sine";
        gain.gain.setValueAtTime(0.3,ctx.currentTime+i*0.18);
        gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+i*0.18+0.3);
        osc.start(ctx.currentTime+i*0.18); osc.stop(ctx.currentTime+i*0.18+0.3);
      });
    } catch(e){}
  };

  const save = (form) => {
    if (editing) {
      setItems(items.map(i=>i.id===editing.id?{...form,id:editing.id,comentarioCliente:i.comentarioCliente}:i));
      setEditing(null);
    } else {
      const newItem={...form,id:Date.now(),comentarioCliente:""};
      setItems(prev=>[...prev,newItem]);
      if (form.estado==="Pendiente de aprobación") setNotif(newItem);
    }
    setShowForm(false);
  };

  const del = (id) => setItems(items.filter(i=>i.id!==id));
  const edit = (item) => { setEditing(item); setShowForm(true); };
  const publish = (id) => setItems(items.map(i=>i.id===id?{...i,estado:"Publicado"}:i));

  const decide = (id, estado, comentarioCliente) => {
    const item = items.find(i=>i.id===id);
    setItems(items.map(i=>i.id===id?{...i,estado,comentarioCliente}:i));
    setReviewing(null);
    setAdminAlert({ estado, idea:item?.idea||"(Sin idea)", comentario:comentarioCliente });
    playSound(estado==="Aprobado");
    if ("Notification" in window) {
      const send = () => new Notification(estado==="Aprobado"?"Contenido aprobado":"Contenido rechazado",{ body:`"${item?.idea||"Sin idea"}"${comentarioCliente?` — ${comentarioCliente}`:""}` });
      if (Notification.permission==="granted") send();
      else if (Notification.permission!=="denied") Notification.requestPermission().then(p=>{ if(p==="granted") send(); });
    }
  };

  const cols = ["Pendiente de aprobación","Aprobado","Publicado"];
  const pendientes = items.filter(i=>i.estado==="Pendiente de aprobación");
  const decididos = items.filter(i=>["Aprobado","Rechazado","Publicado"].includes(i.estado));

  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"1.5rem 1rem", fontFamily:"sans-serif", color:"#222" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:8 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, fontWeight:500 }}>Planificador de contenido</h2>
          <p style={{ margin:"2px 0 0", fontSize:13, color:"#888" }}>{mode==="admin"?"Vista administrador":"Vista cliente"}</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>setMode("admin")} style={{ fontSize:12, padding:"6px 14px", fontWeight:mode==="admin"?500:400, background:mode==="admin"?"#e8f0fe":"transparent", color:mode==="admin"?"#1a73e8":"#666", border:"0.5px solid #1a73e8", borderRadius:8, cursor:"pointer" }}>Admin</button>
          <button onClick={()=>setMode("client")} style={{ fontSize:12, padding:"6px 14px", fontWeight:mode==="client"?500:400, background:mode==="client"?"#EAF3DE":"transparent", color:mode==="client"?"#27500A":"#666", border:"0.5px solid #639922", borderRadius:8, cursor:"pointer" }}>Cliente</button>
        </div>
      </div>

      {mode==="admin"&&(
        <>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={()=>setView("kanban")} style={{ fontSize:12, padding:"5px 14px", borderRadius:20, fontWeight:view==="kanban"?500:400, background:view==="kanban"?"#f0f0f0":"transparent", border:"0.5px solid #ddd", cursor:"pointer" }}>Kanban</button>
              <button onClick={()=>setView("monthly")} style={{ fontSize:12, padding:"5px 14px", borderRadius:20, fontWeight:view==="monthly"?500:400, background:view==="monthly"?"#f0f0f0":"transparent", border:"0.5px solid #ddd", cursor:"pointer" }}>Por mes</button>
            </div>
            <button onClick={()=>{ setEditing(null); setShowForm(true); }} style={{ background:"#1a73e8", color:"#fff", border:"none", borderRadius:8, fontWeight:500, padding:"8px 16px", cursor:"pointer", fontSize:13 }}>+ Nuevo contenido</button>
          </div>

          {view==="kanban"&&(
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:14 }}>
                {cols.map(col=>{
                  const ci=items.filter(i=>i.estado===col);
                  const c=EC[col];
                  return (
                    <div key={col} style={{ background:"#f9f9f9", borderRadius:10, padding:12, minHeight:100 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                        <span style={{ fontSize:13, fontWeight:500 }}>{col}</span>
                        <span style={{ background:c.bg, color:c.text, borderRadius:12, padding:"1px 8px", fontSize:11, fontWeight:500 }}>{ci.length}</span>
                      </div>
                      {ci.length===0&&<p style={{ fontSize:12, color:"#bbb", textAlign:"center", marginTop:16 }}>Sin contenidos</p>}
                      {ci.map(item=><AdminCard key={item.id} item={item} onEdit={edit} onDelete={del} onPublish={publish} />)}
                    </div>
                  );
                })}
              </div>
              {items.filter(i=>i.estado==="Rechazado").length>0&&(
                <div style={{ marginTop:14, background:"#f9f9f9", borderRadius:10, padding:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                    <span style={{ fontSize:13, fontWeight:500 }}>Rechazado</span>
                    <span style={{ background:EC["Rechazado"].bg, color:EC["Rechazado"].text, borderRadius:12, padding:"1px 8px", fontSize:11, fontWeight:500 }}>{items.filter(i=>i.estado==="Rechazado").length}</span>
                  </div>
                  {items.filter(i=>i.estado==="Rechazado").map(item=><AdminCard key={item.id} item={item} onEdit={edit} onDelete={del} onPublish={publish} />)}
                </div>
              )}
            </>
          )}
          {view==="monthly"&&<MonthlyView items={items} onEdit={edit} onDelete={del} onPublish={publish} />}
        </>
      )}

      {mode==="client"&&(
        <>
          {items.length===0&&<div style={{ textAlign:"center", padding:"3rem 0", color:"#888", fontSize:14 }}>No hay contenidos para revisar aún.</div>}
          {pendientes.length>0&&(
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:13, fontWeight:500, marginBottom:10 }}>Pendientes de tu aprobación ({pendientes.length})</p>
              {pendientes.map(item=><ClientCard key={item.id} item={item} onReview={setReviewing} />)}
            </div>
          )}
          {decididos.length>0&&(
            <div>
              <p style={{ fontSize:13, fontWeight:500, marginBottom:10, color:"#888" }}>Historial</p>
              {decididos.map(item=><ClientCard key={item.id} item={item} onReview={setReviewing} />)}
            </div>
          )}
        </>
      )}

      {showForm&&<Modal onClose={()=>{ setShowForm(false); setEditing(null); }} onSave={save} initial={editing} />}
      {notif&&<NotifModal content={notif} onClose={()=>setNotif(null)} />}
      {reviewing&&<ApprovalModal item={reviewing} onClose={()=>setReviewing(null)} onDecide={decide} />}

      {adminAlert&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:adminAlert.estado==="Aprobado"?"#EAF3DE":"#FCEBEB", borderRadius:14, border:`1px solid ${adminAlert.estado==="Aprobado"?"#639922":"#E24B4A"}`, padding:"1.5rem", width:"min(420px,92vw)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontWeight:500, fontSize:15, color:adminAlert.estado==="Aprobado"?"#27500A":"#791F1F" }}>
                {adminAlert.estado==="Aprobado"?"El cliente aprobó el contenido":"El cliente rechazó el contenido"}
              </span>
              <button onClick={()=>setAdminAlert(null)} style={{ background:"none", border:"none", fontSize:18, cursor:"pointer", color:adminAlert.estado==="Aprobado"?"#27500A":"#791F1F" }}>✕</button>
            </div>
            <p style={{ fontSize:13, margin:"0 0 6px", color:adminAlert.estado==="Aprobado"?"#3B6D11":"#A32D2D" }}><strong>Contenido:</strong> {adminAlert.idea}</p>
            {adminAlert.comentario&&<p style={{ fontSize:13, margin:"0 0 14px", color:adminAlert.estado==="Aprobado"?"#3B6D11":"#A32D2D" }}><strong>Comentario:</strong> {adminAlert.comentario}</p>}
            <div style={{ display:"flex", justifyContent:"flex-end" }}>
              <button onClick={()=>setAdminAlert(null)} style={{ fontSize:13, padding:"6px 16px", background:adminAlert.estado==="Aprobado"?"#639922":"#E24B4A", color:"#fff", border:"none", borderRadius:8, fontWeight:500, cursor:"pointer" }}>Entendido</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
