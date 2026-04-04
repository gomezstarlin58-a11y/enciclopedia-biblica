"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../supabase"; // Recuerda verificar que esta ruta te funcione (puede ser ../../../../supabase)
import { MessageSquare, ArrowUp, ArrowDown, Flame, PenTool, TrendingUp, BookOpen, Hash } from "lucide-react";
import Link from "next/link";

export default function DebatesPage() {
  const [nuevaTesis, setNuevaTesis] = useState("");
  const [hashtag, setHashtag] = useState(""); // NUEVO: Estado para el hashtag
  const [estaPublicando, setEstaPublicando] = useState(false);
  const [listaDebates, setListaDebates] = useState<any[]>([]);

  useEffect(() => {
    cargarDebates();
  }, []);

  const cargarDebates = async () => {
    const { data, error } = await supabase
      .from('debates')
      .select('*')
      .order('created_at', { ascending: false }); 
    
    if (data) {
      setListaDebates(data);
    }
  };

  const publicarTesis = async () => {
    // Validamos que haya texto y que el hashtag tenga más que solo el símbolo "#"
    if (!nuevaTesis.trim() || hashtag.trim().length <= 1) return;
    
    setEstaPublicando(true);

    const { error } = await supabase
      .from('debates')
      .insert([
        { 
          titulo: nuevaTesis, 
          contenido: "Contenido extendido de la tesis generado en la sala de estudio...", 
          autor: "Erudito Dominico",
          etiqueta: hashtag.trim() // NUEVO: Guardamos el hashtag en la base de datos
        }
      ]);

    if (!error) {
      setNuevaTesis(""); 
      setHashtag(""); // Limpiamos el hashtag también
      cargarDebates(); 
    } else {
      alert("Hubo un error: " + error.message);
    }
    setEstaPublicando(false);
  };

  // NUEVO: Algoritmo para calcular los Temas en Tendencia
  // Cuenta qué etiquetas se repiten más en los debates descargados
  const obtenerTendencias = () => {
    const conteo: Record<string, number> = {};
    listaDebates.forEach(debate => {
      if (debate.etiqueta) {
        conteo[debate.etiqueta] = (conteo[debate.etiqueta] || 0) + 1;
      }
    });
    // Ordenamos de mayor a menor y sacamos los top 5
    return Object.entries(conteo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  };

  const temasTendencia = obtenerTendencias();

  return (
    // Agregamos pb-20 para que el menú de celular no lo tape
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full animate-fade-in-up pb-24 md:pb-10">
      
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-serif text-[#F9F6F0] mb-2">Ágora de Eruditos</h1>
        <p className="text-[#F9F6F0]/60 font-light text-base md:text-lg">El foro central para el debate teológico riguroso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          {/* CREADOR DE TESIS */}
          <div className="bg-[#151715] border border-[#D1A65B]/30 rounded-[20px] md:rounded-2xl p-4 md:p-6 shadow-[0_0_20px_rgba(209,166,91,0.05)] relative overflow-hidden group focus-within:border-[#D1A65B]/60 transition-all duration-500 w-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D1A65B]/50 to-transparent opacity-50"></div>
            
            <div className="flex gap-3 md:gap-4 items-start w-full">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D1A65B]/20 to-[#080908] border border-[#D1A65B]/40 flex-shrink-0 flex items-center justify-center shadow-inner">
                <PenTool size={18} className="text-[#D1A65B] md:w-[20px] md:h-[20px]" />
              </div>
              
              {/* min-w-0 evita que los inputs estiren la pantalla en celular */}
              <div className="flex-1 min-w-0 w-full">
                <input 
                  type="text" 
                  value={nuevaTesis}
                  onChange={(e) => setNuevaTesis(e.target.value)}
                  placeholder="Proponer una nueva tesis, exégesis..." 
                  className="w-full bg-transparent border-none text-[#F9F6F0] text-base md:text-lg placeholder-[#F9F6F0]/30 focus:outline-none focus:ring-0 font-serif italic mb-3 break-words"
                  disabled={estaPublicando}
                />
                
                {/* CONTROLES INFERIORES: flex-col en móvil, flex-row en PC */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-[#D1A65B]/10 w-full">
                  
                  <div className="flex items-center gap-2 bg-[#080908] border border-[#D1A65B]/20 rounded-lg px-3 py-2 sm:py-1.5 focus-within:border-[#D1A65B]/60 transition-colors w-full sm:w-auto">
                    <Hash size={14} className="text-[#D1A65B]/60 shrink-0" />
                    <input 
                      type="text"
                      value={hashtag}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (!val.startsWith('#') && val.length > 0) {
                          setHashtag('#' + val.replace(/#/g, ''));
                        } else {
                          setHashtag(val.replace(/\s/g, '')); // No permitimos espacios
                        }
                      }}
                      placeholder="#TemaIA"
                      className="bg-transparent border-none text-[#D1A65B] text-sm w-full sm:w-24 md:w-40 focus:outline-none focus:ring-0 placeholder-[#D1A65B]/30"
                      disabled={estaPublicando}
                    />
                  </div>
                  
                  <button 
                    onClick={publicarTesis}
                    disabled={estaPublicando || !nuevaTesis.trim() || hashtag.trim().length <= 1}
                    className="w-full sm:w-auto bg-[#D1A65B] text-[#080908] hover:bg-[#F4E8D1] px-5 md:px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(209,166,91,0.2)] whitespace-nowrap text-center"
                  >
                    {estaPublicando ? "Enviando..." : "Publicar Tesis"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-8 border-b border-[#D1A65B]/10 px-2">
            <button className="text-[#D1A65B] font-semibold text-sm border-b-2 border-[#D1A65B] pb-3 -mb-[2px] flex items-center gap-2">
              <Flame size={16} /> Mayor Rigor
            </button>
          </div>

          <div className="space-y-4 md:space-y-6">
            
            {listaDebates.map((debate) => (
              <Link href={`/plataforma/debates/${debate.id}`} key={debate.id} className="block group w-full">
                <article className="bg-[#080908] border border-[#7c3aed]/30 rounded-[20px] md:rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-lg group-hover:border-[#7c3aed]/60 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.1)] relative overflow-hidden cursor-pointer w-full">
                  <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-[#7c3aed]/10 blur-[30px] rounded-full pointer-events-none transition-all group-hover:bg-[#7c3aed]/20"></div>
                  
                  {/* CABECERA DEL DEBATE */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3 md:mb-4 relative z-10 w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#151715] flex items-center justify-center border border-[#7c3aed]/30 text-[#c4b5fd] font-bold text-[10px] md:text-xs shrink-0">ED</div>
                      <div>
                        <h3 className="text-xs md:text-sm font-semibold text-[#F9F6F0] flex items-center gap-2 flex-wrap">
                          {debate.autor} <span className="bg-[#7c3aed]/10 text-[#c4b5fd] text-[8px] md:text-[9px] px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#7c3aed]/20">Nuevo</span>
                        </h3>
                        <p className="text-[10px] md:text-xs text-[#F9F6F0]/40 font-light">Hace un momento</p>
                      </div>
                    </div>
                    {/* MOSTRAMOS EL HASHTAG REAL */}
                    <span className="bg-[#3C7F60]/10 text-[#85C4A3] border border-[#3C7F60]/30 text-[9px] md:text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full group-hover:bg-[#3C7F60]/20 transition-colors self-start sm:self-auto shrink-0">
                      {debate.etiqueta || "#Tesis"}
                    </span>
                  </div>
                  
                  <h2 className="text-lg md:text-xl font-serif text-[#F9F6F0] mb-3 relative z-10 group-hover:text-[#c4b5fd] transition-colors break-words leading-snug">{debate.titulo}</h2>
                  
                  <div className="flex items-center justify-between mt-4 md:mt-5 pt-3 md:pt-4 border-t border-[#D1A65B]/10 relative z-10 w-full">
                    <div className="flex items-center gap-3 md:gap-4 text-[#F9F6F0]/50 w-full flex-wrap">
                      <div className="flex items-center bg-[#151715] border border-[#D1A65B]/20 rounded-full px-1">
                        <button className="p-1 md:p-1.5 hover:text-[#D1A65B] transition-colors"><ArrowUp size={14} className="md:w-4 md:h-4" /></button>
                        <span className="text-[10px] md:text-xs font-bold px-1.5 md:px-2 text-[#D1A65B]">{debate.votos}</span>
                        <button className="p-1 md:p-1.5 hover:text-red-400 transition-colors"><ArrowDown size={14} className="md:w-4 md:h-4" /></button>
                      </div>
                      <button className="flex items-center gap-1 md:gap-1.5 group-hover:text-[#D1A65B] transition-colors text-[10px] md:text-xs font-medium"><MessageSquare size={14} className="md:w-4 md:h-4" /> {debate.respuestas} Resp.</button>
                    </div>
                  </div>
                </article>
              </Link>
            ))}

          </div>
        </div>

        {/* COLUMNA DERECHA: TENDENCIAS DINÁMICAS */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-[#080908] border border-[#D1A65B]/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-[#F9F6F0] font-serif text-lg mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-[#D1A65B]" /> Temas en Tendencia
            </h3>
            <div className="flex flex-wrap gap-2">
              {temasTendencia.length > 0 ? (
                temasTendencia.map((tema, index) => (
                  <span key={index} className="bg-[#151715] border border-[#D1A65B]/20 text-[#F9F6F0]/70 text-xs px-3 py-1.5 rounded-lg hover:text-[#D1A65B] cursor-pointer transition-colors shadow-inner">
                    {tema}
                  </span>
                ))
              ) : (
                <span className="text-[#F9F6F0]/30 text-xs italic">Aún no hay tendencias suficientes.</span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}