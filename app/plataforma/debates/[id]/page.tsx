"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase";
import Link from "next/link";
import { useParams } from "next/navigation"; 
import { ArrowLeft, MessageSquare, ArrowUp, ArrowDown, Share, Bookmark, MoreHorizontal, Sparkles } from "lucide-react";

export default function DetalleDebatePage() {
  const params = useParams(); 
  const idRealDelDebate = params.id as string; 

  const [debatePrincipal, setDebatePrincipal] = useState<any>(null); 
  const [nuevaRespuesta, setNuevaRespuesta] = useState("");
  const [estaPublicando, setEstaPublicando] = useState(false);
  const [listaRespuestas, setListaRespuestas] = useState<any[]>([]);

  useEffect(() => {
    // Solo busca en la base de datos si es un número (un ID real)
    if (idRealDelDebate && idRealDelDebate !== 'romanos-8') {
      cargarDebatePrincipal();
      cargarRespuestas();
    }
  }, [idRealDelDebate]);

  const cargarDebatePrincipal = async () => {
    const { data, error } = await supabase
      .from('debates')
      .select('*')
      .eq('id', idRealDelDebate)
      .single();
    
    if (data) setDebatePrincipal(data);
  };

  const cargarRespuestas = async () => {
    const { data, error } = await supabase
      .from('respuestas')
      .select('*')
      .eq('debate_id', idRealDelDebate)
      .order('created_at', { ascending: true }); 
    
    if (data) setListaRespuestas(data);
  };

  const publicarRespuesta = async () => {
    if (!nuevaRespuesta.trim()) return;
    setEstaPublicando(true);

    const { error } = await supabase
      .from('respuestas')
      .insert([
        { 
          debate_id: idRealDelDebate, 
          contenido: nuevaRespuesta, 
          autor: "Erudito Dominico" 
        }
      ]);

    if (!error) {
      setNuevaRespuesta(""); 
      cargarRespuestas(); 
    }
    setEstaPublicando(false);
  };

  // Si le dan clic a la tarjeta estática de muestra de "Romanos 8"
  if (idRealDelDebate === 'romanos-8') {
    return (
      <div className="p-10 md:p-20 text-center text-[#F9F6F0]">
        <h2 className="text-2xl font-serif text-[#D1A65B] mb-4">Sala de Archivo</h2>
        <p className="text-[#F9F6F0]/60 text-sm md:text-base">Este fue un debate de prueba del diseño. Por favor, vuelve al Ágora y entra a una de las tesis reales publicadas por la comunidad.</p>
        <Link href="/plataforma/debates" className="inline-block mt-6 text-[#080908] bg-[#D1A65B] px-6 py-2 rounded-xl font-bold">Volver al Ágora</Link>
      </div>
    );
  }

  // Pantalla de carga mientras trae tus datos de Supabase
  if (!debatePrincipal) {
    return <div className="p-10 md:p-20 text-center text-[#D1A65B] animate-pulse font-serif text-lg md:text-xl mt-20">Desempolvando los pergaminos de la base de datos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 w-full animate-fade-in-up">
      
      <div className="mb-6 md:mb-8">
        <Link href="/plataforma/debates" className="inline-flex items-center gap-2 text-[#F9F6F0]/50 hover:text-[#D1A65B] transition-colors text-xs md:text-sm font-medium">
          <ArrowLeft size={16} /> Volver al Ágora
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        <div className="lg:col-span-2 space-y-8 md:space-y-10">
          
          {/* AQUÍ SE DIBUJA TU TESIS REAL DESDE LA BASE DE DATOS */}
          <article className="bg-[#080908] border border-[#D1A65B]/10 rounded-[24px] md:rounded-3xl p-6 md:p-10 shadow-2xl relative">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <span className="bg-[#3C7F60]/10 text-[#85C4A3] border border-[#3C7F60]/30 text-[10px] md:text-xs uppercase tracking-widest px-3 py-1.5 rounded-full font-bold">
                {debatePrincipal.etiqueta || "Tesis"}
              </span>
            </div>

            {/* ARREGLO DEL TÍTULO: text-3xl en celular, text-5xl en PC, y break-words */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#F9F6F0] mb-6 md:mb-8 leading-tight break-words">
              {debatePrincipal.titulo}
            </h1>

            <div className="flex items-center justify-between border-b border-[#D1A65B]/10 pb-6 md:pb-8 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#151715] flex items-center justify-center border border-[#7c3aed]/30 text-[#c4b5fd] font-bold text-xs md:text-sm shrink-0">ED</div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-[#F9F6F0] flex items-center gap-2 flex-wrap">
                    {debatePrincipal.autor} <span className="bg-[#7c3aed]/10 text-[#c4b5fd] text-[9px] md:text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider border border-[#7c3aed]/20">Erudito</span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="prose prose-invert prose-base md:prose-lg max-w-none text-[#F9F6F0]/80 font-light leading-relaxed space-y-4 md:space-y-6">
              <p>{debatePrincipal.contenido}</p>
            </div>
          </article>

          {/* SECCIÓN DE RESPUESTAS DINÁMICA */}
          <div>
            <h3 className="text-xl md:text-2xl font-serif text-[#F9F6F0] mb-4 md:mb-6">Respuestas de la Comunidad</h3>
            
            <div className="bg-[#080908] border border-[#D1A65B]/20 rounded-2xl p-4 mb-6 md:mb-8 flex gap-3 md:gap-4 items-start focus-within:border-[#D1A65B]/50 transition-all shadow-lg">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#151715] border border-[#F9F6F0]/10 flex-shrink-0 flex items-center justify-center text-[#D1A65B] font-bold text-[10px] md:text-xs">ED</div>
              <div className="flex-1">
                <textarea 
                  value={nuevaRespuesta}
                  onChange={(e) => setNuevaRespuesta(e.target.value)}
                  disabled={estaPublicando}
                  placeholder="Añade tu exégesis o refutación con respeto..." 
                  className="w-full bg-transparent border-none text-[#F9F6F0] placeholder-[#F9F6F0]/30 focus:outline-none focus:ring-0 text-xs md:text-sm resize-none h-16 md:h-20"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={publicarRespuesta}
                    disabled={estaPublicando || !nuevaRespuesta.trim()}
                    className="bg-[#D1A65B] text-[#080908] hover:bg-[#F4E8D1] px-4 md:px-5 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {estaPublicando ? "Enviando..." : "Publicar Respuesta"}
                  </button>
                </div>
              </div>
            </div>

            {/* AQUÍ SE DIBUJAN TUS COMENTARIOS LIMPIOS */}
            {listaRespuestas.map((respuesta) => (
              <div key={respuesta.id} className="bg-[#151715]/80 border border-[#D1A65B]/20 rounded-xl md:rounded-2xl p-5 md:p-6 mb-4 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#080908] border border-[#D1A65B]/40 flex items-center justify-center text-[10px] md:text-xs font-serif text-[#D1A65B] font-bold shrink-0">ED</div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-[#F9F6F0]">{respuesta.autor}</h4>
                    </div>
                  </div>
                </div>
                <p className="text-[#F9F6F0]/80 text-xs md:text-sm font-light leading-relaxed mb-2 md:mb-4">
                  {respuesta.contenido}
                </p>
              </div>
            ))}
            
            {listaRespuestas.length === 0 && (
              <p className="text-center text-[#F9F6F0]/30 italic text-sm md:text-base py-6">Sé el primero en responder a esta tesis.</p>
            )}

          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="hidden lg:block space-y-6">
           <div className="sticky top-28 space-y-6">
              <div className="bg-[#080908] border border-[#7c3aed]/30 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7c3aed]/10 blur-[50px] rounded-full pointer-events-none"></div>
                <h3 className="text-[#F9F6F0] font-serif text-xl mb-4 flex items-center gap-2 relative z-10">
                  <Sparkles size={20} className="text-[#c4b5fd]" /> Síntesis de IA
                </h3>
                <p className="text-[#F9F6F0]/60 text-sm font-light">La IA analizará este debate cuando haya más respuestas.</p>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}