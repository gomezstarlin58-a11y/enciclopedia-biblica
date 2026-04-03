"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/supabase";
import { Shield, Save, CheckCircle, AlertTriangle, Plus, Trash2, Book, History, Lock } from "lucide-react";

export default function AdminPage() {
  // ==========================================
  // SISTEMA DE SEGURIDAD (EL CADENERO)
  // ==========================================
  const [autorizado, setAutorizado] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorPin, setErrorPin] = useState(false);

  // LA CONTRASEÑA SECRETA (Cámbiala por la que tú quieras)
  const PIN_SECRETO = "Erudito2026"; 

  const verificarAcceso = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === PIN_SECRETO) {
      setAutorizado(true);
    } else {
      setErrorPin(true);
      setPinInput("");
      setTimeout(() => setErrorPin(false), 3000);
    }
  };

  // ==========================================
  // ESTADOS DEL FORMULARIO (Igual que antes)
  // ==========================================
  const [libros, setLibros] = useState<any[]>([]);
  const [libroId, setLibroId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [capitulo, setCapitulo] = useState("");
  const [numeroTema, setNumeroTema] = useState("");
  const [contenido, setContenido] = useState("");
  const [versiculos, setVersiculos] = useState([{ referencia: "", texto: "" }]);
  const [patristica, setPatristica] = useState([{ autor: "", siglo: "", cita: "" }]);
  const [estado, setEstado] = useState<{ tipo: string, texto: string } | null>(null);

  useEffect(() => {
    if (!autorizado) return; // Si no está autorizado, ni siquiera busca los libros
    const fetchLibros = async () => {
      const { data } = await supabase.from('libros_biblicos').select('id, nombre').order('orden_biblico');
      if (data) {
        setLibros(data);
        if (data.length > 0) setLibroId(data[0].id);
      }
    };
    fetchLibros();
  }, [autorizado]);

  const agregarVersiculo = () => setVersiculos([...versiculos, { referencia: "", texto: "" }]);
  const quitarVersiculo = (index: number) => setVersiculos(versiculos.filter((_, i) => i !== index));
  const agregarPatristica = () => setPatristica([...patristica, { autor: "", siglo: "", cita: "" }]);
  const quitarPatristica = (index: number) => setPatristica(patristica.filter((_, i) => i !== index));

  const guardarTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado({ tipo: "cargando", texto: "Forjando matriz completa..." });

    try {
      const { data: nuevoTema, error: errorTema } = await supabase.from('temas_estudio').insert([{
        libro_id: libroId, titulo_tema: titulo, capitulo_principal: capitulo, numero_tema: parseInt(numeroTema), contenido_central: contenido
      }]).select().single();

      if (errorTema) throw new Error(errorTema.message);
      const temaId = nuevoTema.id;

      const versiculosValidos = versiculos.filter(v => v.referencia && v.texto).map(v => ({ tema_id: temaId, referencia: v.referencia, texto_versiculo: v.texto }));
      if (versiculosValidos.length > 0) await supabase.from('versiculos_apoyo').insert(versiculosValidos);

      const patristicaValida = patristica.filter(p => p.autor && p.cita).map(p => ({ tema_id: temaId, autor_padre: p.autor, siglo: p.siglo, cita: p.cita }));
      if (patristicaValida.length > 0) await supabase.from('pensamientos_patristicos').insert(patristicaValida);

      setEstado({ tipo: "exito", texto: "¡Estudio guardado con éxito!" });
      setTitulo(""); setCapitulo(""); setNumeroTema(""); setContenido("");
      setVersiculos([{ referencia: "", texto: "" }]); setPatristica([{ autor: "", siglo: "", cita: "" }]);
      setTimeout(() => setEstado(null), 5000);
    } catch (error: any) {
      setEstado({ tipo: "error", texto: error.message });
    }
  };

  // ==========================================
  // PANTALLA DE BLOQUEO (Si no está autorizado)
  // ==========================================
  if (!autorizado) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in">
        <div className="bg-[#151715] border border-[#D1A65B]/20 p-10 rounded-3xl shadow-2xl text-center max-w-md w-full relative overflow-hidden">
          <Lock className="absolute -top-10 -right-10 w-48 h-48 text-[#D1A65B]/5 rotate-12" />
          <Shield className="text-[#D1A65B] w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl font-serif text-[#F9F6F0] mb-2">Acceso Restringido</h2>
          <p className="text-[#F9F6F0]/50 text-sm mb-8">Ingresa el código de Arquitecto para acceder a la Forja del Scriptorium.</p>
          
          <form onSubmit={verificarAcceso} className="space-y-4 relative z-10">
            <input 
              type="password" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Código de seguridad..." 
              className={`w-full bg-[#080908] border ${errorPin ? 'border-red-500' : 'border-[#D1A65B]/30'} text-[#F9F6F0] rounded-xl p-4 text-center tracking-[0.3em] font-bold focus:outline-none focus:border-[#D1A65B] transition-colors`}
            />
            {errorPin && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Código Incorrecto</p>}
            <button type="submit" className="w-full bg-[#D1A65B] text-[#080908] font-bold text-sm uppercase tracking-widest p-4 rounded-xl hover:bg-[#F9F6F0] transition-colors">
              Desbloquear
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // EL FORMULARIO REAL (Solo se ve si puso la clave)
  // ==========================================
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 w-full animate-fade-in-up">
      {/* ... (Aquí va todo el diseño del formulario que ya teníamos, lo dejé intacto) ... */}
      <div className="mb-10 flex items-center justify-between border-b border-red-900/30 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-red-950/50 p-3 rounded-xl border border-red-900">
            <Shield className="text-red-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-[#F9F6F0]">La Forja de Estudios</h1>
            <p className="text-red-400/80 text-sm font-bold tracking-widest uppercase mt-1">Nivel Arquitecto Desbloqueado</p>
          </div>
        </div>
        <button onClick={() => setAutorizado(false)} className="text-[#F9F6F0]/40 hover:text-red-400 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
          <Lock size={14} /> Cerrar Bóveda
        </button>
      </div>

      {estado && (
        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 font-bold text-sm ${
          estado.tipo === 'exito' ? 'bg-green-950/30 border-green-900 text-green-400' : 
          estado.tipo === 'error' ? 'bg-red-950/30 border-red-900 text-red-400' : 
          'bg-[#D1A65B]/10 border-[#D1A65B]/30 text-[#D1A65B] animate-pulse'
        }`}>
          {estado.tipo === 'exito' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          {estado.texto}
        </div>
      )}

      <form onSubmit={guardarTodo} className="space-y-8">
        
        {/* BLOQUE 1: DATOS CENTRALES */}
        <div className="bg-[#151715] border border-[#D1A65B]/20 p-8 rounded-3xl shadow-xl space-y-6">
          <h2 className="text-[#D1A65B] font-serif text-xl border-b border-[#D1A65B]/10 pb-2 mb-6">1. El Manuscrito Central</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#F9F6F0]/60 text-xs font-bold uppercase tracking-widest">Libro del Canon</label>
              <select value={libroId} onChange={(e) => setLibroId(e.target.value)} className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl p-3 focus:outline-none focus:border-[#D1A65B]">
                {libros.map((l) => <option key={l.id} value={l.id}>{l.nombre}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[#F9F6F0]/60 text-xs font-bold uppercase tracking-widest">Número de Estudio</label>
              <input type="number" value={numeroTema} onChange={(e) => setNumeroTema(e.target.value)} placeholder="Ej: 3" className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl p-3 focus:outline-none focus:border-[#D1A65B]" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#F9F6F0]/60 text-xs font-bold uppercase tracking-widest">Título del Estudio</label>
              <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: La justificación por la fe" className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl p-3 focus:outline-none focus:border-[#D1A65B]" required />
            </div>
            <div className="space-y-2">
              <label className="text-[#F9F6F0]/60 text-xs font-bold uppercase tracking-widest">Capítulo Base</label>
              <input type="text" value={capitulo} onChange={(e) => setCapitulo(e.target.value)} placeholder="Ej: Romanos 5" className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl p-3 focus:outline-none focus:border-[#D1A65B]" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[#F9F6F0]/60 text-xs font-bold uppercase tracking-widest">Desglose Exegético</label>
            <textarea value={contenido} onChange={(e) => setContenido(e.target.value)} placeholder="Escribe aquí todo el análisis teológico..." className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl p-4 focus:outline-none focus:border-[#D1A65B] h-40 resize-none" required />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* BLOQUE 2: VERSÍCULOS DE APOYO */}
          <div className="bg-[#151715] border border-[#D1A65B]/20 p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center border-b border-[#D1A65B]/10 pb-2 mb-6">
              <h2 className="text-[#F9F6F0] font-serif text-lg flex items-center gap-2"><Book className="text-[#D1A65B]" size={18} /> Testigos Bíblicos</h2>
              <button type="button" onClick={agregarVersiculo} className="text-[#D1A65B] hover:text-[#F9F6F0] transition-colors"><Plus size={20} /></button>
            </div>
            <div className="space-y-4">
              {versiculos.map((v, index) => (
                <div key={index} className="bg-[#080908] p-4 rounded-xl border border-[#D1A65B]/10 relative">
                  {index > 0 && <button type="button" onClick={() => quitarVersiculo(index)} className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full p-1"><Trash2 size={12} /></button>}
                  <input type="text" placeholder="Referencia (Ej: Juan 3:16)" value={v.referencia} onChange={(e) => { const nuevos = [...versiculos]; nuevos[index].referencia = e.target.value; setVersiculos(nuevos); }} className="w-full bg-transparent border-b border-[#D1A65B]/30 text-[#F9F6F0] pb-2 mb-3 text-sm focus:outline-none focus:border-[#D1A65B]" />
                  <textarea placeholder="Texto del versículo..." value={v.texto} onChange={(e) => { const nuevos = [...versiculos]; nuevos[index].texto = e.target.value; setVersiculos(nuevos); }} className="w-full bg-transparent text-[#F9F6F0]/80 text-sm focus:outline-none h-16 resize-none" />
                </div>
              ))}
            </div>
          </div>

          {/* BLOQUE 3: PATRÍSTICA */}
          <div className="bg-[#151715] border border-[#D1A65B]/20 p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center border-b border-[#D1A65B]/10 pb-2 mb-6">
              <h2 className="text-[#F9F6F0] font-serif text-lg flex items-center gap-2"><History className="text-[#D1A65B]" size={18} /> Patrística</h2>
              <button type="button" onClick={agregarPatristica} className="text-[#D1A65B] hover:text-[#F9F6F0] transition-colors"><Plus size={20} /></button>
            </div>
            <div className="space-y-4">
              {patristica.map((p, index) => (
                <div key={index} className="bg-[#080908] p-4 rounded-xl border border-[#D1A65B]/10 relative">
                  {index > 0 && <button type="button" onClick={() => quitarPatristica(index)} className="absolute -top-2 -right-2 bg-red-900 text-white rounded-full p-1"><Trash2 size={12} /></button>}
                  <div className="flex gap-3 mb-3">
                    <input type="text" placeholder="Autor (Ej: Agustín)" value={p.autor} onChange={(e) => { const nuevos = [...patristica]; nuevos[index].autor = e.target.value; setPatristica(nuevos); }} className="w-2/3 bg-transparent border-b border-[#D1A65B]/30 text-[#F9F6F0] pb-2 text-sm focus:outline-none focus:border-[#D1A65B]" />
                    <input type="text" placeholder="Siglo (Ej: IV)" value={p.siglo} onChange={(e) => { const nuevos = [...patristica]; nuevos[index].siglo = e.target.value; setPatristica(nuevos); }} className="w-1/3 bg-transparent border-b border-[#D1A65B]/30 text-[#F9F6F0] pb-2 text-sm focus:outline-none focus:border-[#D1A65B]" />
                  </div>
                  <textarea placeholder="Cita de la iglesia primitiva..." value={p.cita} onChange={(e) => { const nuevos = [...patristica]; nuevos[index].cita = e.target.value; setPatristica(nuevos); }} className="w-full bg-transparent text-[#F9F6F0]/80 text-sm focus:outline-none h-16 resize-none" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" disabled={estado?.tipo === 'cargando'} className="w-full bg-[#D1A65B] text-[#080908] font-bold text-lg uppercase tracking-widest p-5 rounded-2xl hover:bg-[#F9F6F0] hover:scale-[1.01] transition-all flex justify-center items-center gap-3 disabled:opacity-50 shadow-[0_0_30px_rgba(209,166,91,0.2)]">
          <Save size={24} /> Ejecutar Inserción en la Matriz
        </button>
      </form>
    </div>
  );
}