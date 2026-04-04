"use client";

import { useState } from "react";
import { BrainCircuit, Sparkles, Send, UploadCloud, BookOpen, Settings2, Network, FileText, Loader2 } from "lucide-react";

export default function MotorIAPage() {
  // === ESTADOS DE LA APLICACIÓN (LA MEMORIA DE LA PANTALLA) ===
  const [pregunta, setPregunta] = useState("");
  const [respuestaIA, setRespuestaIA] = useState("");
  const [cargando, setCargando] = useState(false);
  const [lenteSeleccionado, setLenteSeleccionado] = useState("Raíces Originales");

  // === LA FUNCIÓN MÁGICA QUE LLAMA A TU API ===
  const consultarGemini = async () => {
    if (!pregunta.trim()) return;
    
    setCargando(true);
    setRespuestaIA(""); // Limpiamos la pantalla antes de la nueva respuesta

    try {
      // Llamamos al archivo route.ts que creaste en el paso anterior
      const res = await fetch('/api/ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pregunta: pregunta, 
          lente: lenteSeleccionado 
        })
      });

      const data = await res.json();
      
      if (data.error) {
        setRespuestaIA("❌ Error del servidor: " + data.error);
      } else {
        setRespuestaIA(data.respuesta);
      }
    } catch (error) {
      setRespuestaIA("❌ Error de conexión. Revisa tu internet o la consola.");
    }

    setCargando(false);
  };

  return (
    // CAMBIO: h-full en lugar de calc() para que se adapte perfecto al celular
    <div className="flex flex-col h-full w-full overflow-hidden animate-fade-in-up bg-[#080908]">
      
      {/* HEADER: LENTES HERMENÉUTICOS */}
      <div className="flex-shrink-0 p-4 md:px-8 md:py-5 border-b border-[#D1A65B]/10 bg-[#0c0d0c] flex flex-col md:flex-row justify-between items-start md:items-center gap-3 relative z-20 shadow-md">
        <div>
          <h1 className="text-xl md:text-2xl font-serif text-[#F9F6F0] flex items-center gap-2 md:gap-3">
            <BrainCircuit className="text-[#c4b5fd] w-6 h-6 md:w-7 md:h-7 shrink-0" /> Motor de Inferencia RAG
          </h1>
          <p className="text-[#F9F6F0]/50 text-[10px] md:text-xs mt-1">Selecciona el lente teológico antes de consultar.</p>
        </div>

        {/* SELECTOR DE LENTES */}
        <div className="flex bg-[#151715] p-1.5 rounded-xl border border-[#D1A65B]/20 shadow-inner overflow-x-auto w-full md:w-auto scrollbar-hide">
          {['Raíces Originales', 'Contexto Histórico', 'Teología Sistemática'].map((lente) => (
            <button 
              key={lente}
              onClick={() => setLenteSeleccionado(lente)}
              className={`px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                lenteSeleccionado === lente 
                  ? "bg-gradient-to-r from-[#7c3aed]/20 to-[#c4b5fd]/10 text-[#c4b5fd] border border-[#7c3aed]/30 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                  : "text-[#F9F6F0]/50 hover:text-[#D1A65B] border border-transparent"
              }`}
            >
              {lenteSeleccionado === lente && <Sparkles size={14} className="shrink-0" />} {lente}
            </button>
          ))}
        </div>
      </div>

      {/* PANTALLA DIVIDIDA */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* === LADO IZQUIERDO: CHAT Y RESPUESTAS === */}
        <div className="flex-1 flex flex-col border-none lg:border-r border-[#D1A65B]/10 relative bg-[#0c0d0c]/50 h-full overflow-hidden">
          
          {/* ÁREA DE MENSAJES (Con scroll independiente) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col justify-center items-center">
            
            {/* Analizador de Tesis (Estado Inicial) */}
            {!respuestaIA && !cargando && (
              <div className="max-w-xl w-full">
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#D1A65B] to-[#7c3aed] rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse hidden md:block"></div>
                  <div className="relative bg-[#080908] border md:border-2 border-dashed border-[#D1A65B]/30 hover:border-[#7c3aed]/60 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center text-center transition-all shadow-xl">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-[#151715] rounded-full border border-[#7c3aed]/30 flex items-center justify-center mb-4 md:mb-6 shadow-[0_0_30px_rgba(124,58,237,0.1)] group-hover:scale-110 transition-transform shrink-0">
                      <UploadCloud className="text-[#c4b5fd] w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-serif text-[#F9F6F0] mb-2 md:mb-3">Analizador Teológico</h3>
                    <p className="text-[#F9F6F0]/60 text-xs md:text-sm font-light mb-2 max-w-sm">
                      Hazle una pregunta profunda a la IA en la barra de abajo. El erudito cibernético cruzará la información según el lente que hayas elegido.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Animación de Carga */}
            {cargando && (
              <div className="flex flex-col items-center justify-center text-[#c4b5fd] animate-pulse">
                <Loader2 size={40} className="animate-spin mb-4 md:w-12 md:h-12" />
                <p className="font-serif text-base md:text-lg text-center">Consultando los pergaminos digitales...</p>
              </div>
            )}

            {/* Respuesta IA */}
            {respuestaIA && !cargando && (
              <div className="w-full max-w-3xl bg-[#151715]/80 border border-[#7c3aed]/30 p-5 md:p-8 rounded-2xl shadow-2xl relative animate-fade-in-up mt-auto md:mt-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 blur-[50px] rounded-full hidden md:block"></div>
                <h3 className="text-[#c4b5fd] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 md:mb-4 flex items-center gap-2">
                  <BrainCircuit size={16} /> Respuesta del Erudito IA
                </h3>
                <div className="prose prose-sm md:prose-base prose-invert prose-p:text-[#F9F6F0]/80 prose-p:font-light prose-p:leading-relaxed max-w-none whitespace-pre-wrap">
                  {respuestaIA}
                </div>
              </div>
            )}
          </div>

          {/* === INPUT DE CHAT FIJO ABAJO === */}
          <div className="p-4 md:p-6 bg-[#0c0d0c] border-t border-[#D1A65B]/10 shrink-0">
            <div className="max-w-4xl mx-auto bg-[#151715] border border-[#7c3aed]/30 rounded-[20px] md:rounded-2xl p-1.5 md:p-2 pl-4 md:pl-6 flex items-center gap-2 md:gap-4 focus-within:border-[#c4b5fd]/60 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all">
              <Sparkles size={18} className="text-[#c4b5fd] shrink-0 hidden sm:block" />
              <input 
                type="text" 
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && consultarGemini()}
                placeholder="Ejemplo: ¿Significado de 'Logos'?" 
                className="w-full bg-transparent border-none text-[#F9F6F0] placeholder-[#F9F6F0]/30 focus:outline-none focus:ring-0 text-sm md:text-base py-2 md:py-3"
                disabled={cargando}
              />
              <button 
                onClick={consultarGemini}
                disabled={cargando || !pregunta.trim()}
                className="bg-gradient-to-r from-[#7c3aed] to-[#5b21b6] hover:from-[#8b5cf6] hover:to-[#6d28d9] text-[#F9F6F0] p-2.5 md:p-3 rounded-xl transition-all shadow-lg shrink-0 disabled:opacity-50 flex items-center justify-center"
              >
                <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
            <p className="text-center text-[#F9F6F0]/30 text-[9px] md:text-[10px] mt-2 md:mt-3">
              El Motor IA puede cometer errores. Verifica siempre con el texto bíblico original.
            </p>
          </div>
        </div>

        {/* === LADO DERECHO: CONSTELACIÓN Y CÓDICE (OCULTO EN CELULAR) === */}
        <div className="hidden lg:flex w-[450px] bg-[#080908] flex-col h-full border-l border-[#D1A65B]/10 shrink-0">
          
          <div className="flex-1 border-b border-[#D1A65B]/10 relative overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#D1A65B]/5 flex justify-between items-center bg-[#0c0d0c]/50 z-10">
              <h3 className="text-[#F9F6F0] font-serif text-sm flex items-center gap-2">
                <Network size={16} className="text-[#c4b5fd]" /> Red Neural de Búsqueda
              </h3>
              <span className="flex h-2 w-2 relative">
                {cargando && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c4b5fd] opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${cargando ? 'bg-[#c4b5fd]' : 'bg-[#7c3aed]'}`}></span>
              </span>
            </div>
            
            <div className="flex-1 relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#7c3aed]/10 via-[#080908] to-[#080908] flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 4" className={cargando ? "animate-ping" : "animate-pulse"} />
                <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 4" className={cargando ? "animate-pulse" : ""} />
                <line x1="50%" y1="50%" x2="70%" y2="80%" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="4 4" className={cargando ? "animate-ping" : "animate-pulse"} />
              </svg>

              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#151715] rounded-full border border-[#c4b5fd] shadow-[0_0_30px_rgba(124,58,237,0.4)] flex items-center justify-center z-10 transition-transform ${cargando ? 'scale-125' : ''}`}>
                <BrainCircuit size={20} className={`text-[#c4b5fd] ${cargando ? 'animate-bounce' : ''}`} />
              </div>

              <div className="absolute top-[30%] left-[20%] group">
                <div className="w-3 h-3 bg-[#D1A65B] rounded-full shadow-[0_0_15px_rgba(209,166,91,0.6)] animate-pulse"></div>
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-[#D1A65B] whitespace-nowrap opacity-50">Lexicon Griego</span>
              </div>
              <div className="absolute top-[20%] right-[20%] group">
                <div className="w-3 h-3 bg-[#85C4A3] rounded-full shadow-[0_0_15px_rgba(60,127,96,0.6)]"></div>
                <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-[#85C4A3] whitespace-nowrap opacity-50">Institución de Calvino</span>
              </div>
              
              <div className="absolute bottom-4 left-0 w-full text-center">
                <p className="text-[#c4b5fd] text-[10px] uppercase tracking-widest bg-[#0c0d0c]/80 inline-block px-3 py-1 rounded-full border border-[#7c3aed]/20 backdrop-blur-sm">
                  {cargando ? "Analizando hermenéutica..." : "Esperando consulta..."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#0c0d0c] flex flex-col">
            <div className="p-5 border-b border-[#D1A65B]/10 flex justify-between items-center z-10">
              <h3 className="text-[#F9F6F0] font-serif text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-[#D1A65B]" /> Códice Dinámico
              </h3>
              <button className="text-[#F9F6F0]/30 hover:text-[#D1A65B]"><Settings2 size={16} /></button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="opacity-50 text-center flex flex-col items-center justify-center h-full">
                <FileText size={48} className="text-[#D1A65B]/20 mb-4" />
                <p className="text-[#F9F6F0]/40 text-sm font-light px-8">
                  {respuestaIA ? "Respuesta completada. Puedes hacer otra consulta en la barra inferior." : "Los versículos clave aparecerán aquí."}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}