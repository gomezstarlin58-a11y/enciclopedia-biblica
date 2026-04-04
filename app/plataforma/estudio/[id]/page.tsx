"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useParams } from "next/navigation";
import { Book, Quote, Scroll, History, ChevronLeft, Bookmark, Share2, Sparkles, BrainCircuit } from "lucide-react";
import Link from "next/link";

// ==========================================
// EL GLOSARIO EXEGÉTICO (DICCIONARIO EN MEMORIA)
// ==========================================
const DICCIONARIO_ORIGINAL: Record<string, { griegoHebreo: string, fonetica: string, significado: string }> = {
  "Elohim": { griegoHebreo: "אֱלֹהִים", fonetica: "e-lo-heem'", significado: "Dios (Plural de majestad), el Creador Supremo y Juez." },
  "elección": { griegoHebreo: "ἐκλογή", fonetica: "ek-log-ay'", significado: "El acto de escoger, selección divina por pura gracia." },
  "alfarero": { griegoHebreo: "κεραμεύς", fonetica: "ker-am-yooce'", significado: "Alfarero; metáfora bíblica de la soberanía absoluta de Dios sobre su creación." },
  "simiente": { griegoHebreo: "זֶרַע", fonetica: "zeh'-rah", significado: "Semilla, descendencia. Fuerte referencia mesiánica desde Génesis 3:15." }
};

// Función que detecta las palabras mágicas y las convierte en Pop-ups
const renderizarTextoConGlosario = (texto: string) => {
  if (!texto) return null;
  
  let partes: (string | React.ReactNode)[] = [texto];
  
  Object.keys(DICCIONARIO_ORIGINAL).forEach((palabra) => {
    const regex = new RegExp(`(${palabra})`, 'gi'); // Busca la palabra ignorando mayúsculas/minúsculas
    partes = partes.flatMap((parte) => {
      if (typeof parte !== 'string') return parte;
      
      const divisiones = parte.split(regex);
      return divisiones.map((div, i) => {
        if (div.toLowerCase() === palabra.toLowerCase()) {
          const datos = DICCIONARIO_ORIGINAL[palabra];
          return (
            <span key={`${i}-${palabra}`} className="relative group inline-block cursor-help mx-1">
              <span className="text-[#D1A65B] border-b border-dashed border-[#D1A65B]/50 group-hover:border-[#D1A65B] transition-colors font-medium">
                {div}
              </span>
              
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 md:w-64 bg-gradient-to-b from-[#151715] to-[#080908] border border-[#D1A65B]/40 text-[#F9F6F0] p-4 md:p-5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-[0_10px_40px_rgba(0,0,0,0.8)] translate-y-2 group-hover:translate-y-0">
                <span className="block text-2xl md:text-3xl font-serif text-[#D1A65B] mb-1">{datos.griegoHebreo}</span>
                <span className="block text-[10px] md:text-xs text-[#F9F6F0]/40 font-mono mb-2 md:mb-3 tracking-widest">[{datos.fonetica}]</span>
                <span className="block text-xs md:text-sm leading-relaxed text-[#F9F6F0]/90">{datos.significado}</span>
                
                <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#080908]"></span>
              </span>
            </span>
          );
        }
        return div;
      });
    });
  });
  
  return partes;
};

export default function EstudioDetallePage() {
  const params = useParams();
  const id = params?.id as string;

  const [estudio, setEstudio] = useState<any>(null);
  const [apoyo, setApoyo] = useState<any[]>([]);
  const [patristica, setPatristica] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  const [analisisIA, setAnalisisIA] = useState("");
  const [generando, setGenerando] = useState(false);

  useEffect(() => {
    const fetchFullEstudio = async () => {
      if (!id) return;

      // Gatillo de vistas en la BD
      await supabase.rpc('incrementar_vista_tema', { tema_id: id });

      const { data: dTema } = await supabase.from('temas_estudio').select('*, libros_biblicos(id, nombre)').eq('id', id).single();
      if (dTema) setEstudio(dTema);

      const { data: dApoyo } = await supabase.from('versiculos_apoyo').select('*').eq('tema_id', id);
      if (dApoyo) setApoyo(dApoyo);

      const { data: dPatros } = await supabase.from('pensamientos_patristicos').select('*').eq('tema_id', id);
      if (dPatros) setPatristica(dPatros);

      setCargando(false);
    };
    fetchFullEstudio();
  }, [id]);

  const pedirAnalisisIA = async () => {
    setGenerando(true);
    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        body: JSON.stringify({
          pregunta: `Haz un análisis exegético profundo sobre este tema: ${estudio?.titulo_tema}. Usa como base el capítulo ${estudio?.capitulo_principal} y relaciónalo con la patrística.`,
          lente: "Raíces Originales"
        }),
      });
      const data = await res.json();
      setAnalisisIA(data.respuesta);
    } catch (e) {
      console.error("Error en el oráculo:", e);
    }
    setGenerando(false);
  };

  if (cargando) return <div className="flex justify-center items-center h-screen bg-[#0c0d0c]"><span className="w-8 h-8 border-4 border-[#D1A65B] border-t-transparent rounded-full animate-spin"></span></div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 w-full animate-fade-in pb-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-10 gap-4">
        <Link href={`/plataforma/enciclopedia/${estudio.libros_biblicos.id}`} className="text-[#D1A65B] hover:text-white flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-colors">
          <ChevronLeft size={16} /> Volver al Índice
        </Link>
        <div className="flex gap-4 self-end sm:self-auto">
          <button className="text-[#F9F6F0]/40 hover:text-[#D1A65B] transition-colors"><Bookmark size={20} /></button>
          <button className="text-[#F9F6F0]/40 hover:text-[#D1A65B] transition-colors"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
        <div className="lg:col-span-3 space-y-8 md:space-y-12">
          
          <header>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[#D1A65B] mb-3 md:mb-4">
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] border border-[#D1A65B]/30 px-2 py-1 rounded-full">Estudio {estudio.numero_tema}</span>
              <span className="w-1 h-1 rounded-full bg-[#D1A65B]/50 hidden sm:block"></span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]">{estudio.libros_biblicos.nombre}</span>
            </div>
            {/* Título responsivo y con break-words para evitar desbordes */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-[#F9F6F0] mb-4 md:mb-6 leading-tight italic break-words">
              {estudio.titulo_tema}
            </h1>
            <div className="inline-block bg-gradient-to-r from-[#D1A65B]/10 to-transparent border-l-4 border-[#D1A65B] p-4 md:p-5 rounded-r-2xl max-w-full">
              <p className="text-[#D1A65B] font-serif text-lg md:text-xl flex flex-wrap items-center gap-2 md:gap-3 break-words">
                <Scroll size={20} className="shrink-0" /> <span className="break-words w-full sm:w-auto">Capítulo Base: {estudio.capitulo_principal}</span>
              </p>
            </div>
          </header>

          {/* AQUÍ SE APLICA LA MAGIA DEL GLOSARIO */}
          <article className="prose prose-invert max-w-none">
            <div className="text-[#F9F6F0]/80 text-lg md:text-xl leading-relaxed font-light first-letter:text-5xl md:first-letter:text-6xl first-letter:font-serif first-letter:text-[#D1A65B] first-letter:mr-3 md:first-letter:mr-4 first-letter:float-left break-words">
              {renderizarTextoConGlosario(estudio.contenido_central)}
            </div>
          </article>

          <section>
            <h3 className="text-[#F9F6F0] font-serif text-2xl md:text-3xl mb-6 md:mb-8 flex items-center gap-2 md:gap-3 border-b border-[#D1A65B]/10 pb-4">
              <Book className="text-[#D1A65B]" size={24} /> Testigos Bíblicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {apoyo.map((v) => (
                <div key={v.id} className="bg-[#151715] border border-[#D1A65B]/10 p-5 md:p-6 rounded-[24px] md:rounded-3xl hover:border-[#D1A65B]/40 transition-all shadow-lg">
                  <p className="text-[#D1A65B] font-bold text-[10px] md:text-xs mb-2 md:mb-3 uppercase tracking-[0.2em]">{v.referencia}</p>
                  <p className="text-[#F9F6F0]/70 italic text-sm md:text-base leading-relaxed break-words">"{v.texto_versiculo}"</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#151715] to-[#080908] border border-[#D1A65B]/20 p-6 md:p-10 rounded-[30px] md:rounded-[40px] relative overflow-hidden shadow-2xl">
            <Sparkles className="absolute -top-10 -right-10 w-32 h-32 md:w-48 md:h-48 text-[#D1A65B]/5 rotate-12" />
            <div className="relative z-10">
              <h3 className="text-[#F9F6F0] font-serif text-2xl md:text-3xl mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                <BrainCircuit className="text-[#D1A65B]" size={28} /> Oráculo Exegético (IA)
              </h3>
              <p className="text-[#F9F6F0]/50 text-sm md:text-base mb-6 md:mb-8 max-w-2xl font-light">
                Profundiza en este estudio. Genera un análisis en tiempo real basado en la teología sistemática y el contexto histórico.
              </p>

              {!analisisIA ? (
                <button 
                  onClick={pedirAnalisisIA}
                  disabled={generando}
                  className="bg-[#D1A65B] text-[#080908] px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm uppercase tracking-widest hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center sm:justify-start gap-2 md:gap-3 shadow-[0_0_30px_rgba(209,166,91,0.2)] w-full sm:w-auto text-center"
                >
                  {generando ? "Consultando los Archivos..." : "Generar Análisis Profundo"}
                </button>
              ) : (
                <div className="bg-[#080908]/80 backdrop-blur-md border border-[#D1A65B]/30 p-6 md:p-8 rounded-2xl md:rounded-3xl animate-fade-in shadow-inner">
                  <div className="prose prose-invert max-w-none text-[#F9F6F0]/90 italic leading-relaxed whitespace-pre-wrap font-light text-sm md:text-base break-words">
                    {analisisIA}
                  </div>
                  <button onClick={() => setAnalisisIA("")} className="mt-6 md:mt-8 text-[#D1A65B] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:text-white transition-colors border border-[#D1A65B]/20 px-3 md:px-4 py-2 rounded-lg w-full sm:w-auto">Limpiar Consulta</button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* COLUMNA LATERAL: PATRÍSTICA */}
        <div className="space-y-6 md:space-y-8">
          <div className="bg-[#151715] border border-[#D1A65B]/20 rounded-[24px] md:rounded-[32px] p-6 md:p-8 lg:sticky lg:top-24 shadow-2xl">
            <h3 className="text-[#F9F6F0] font-serif text-xl md:text-2xl mb-6 md:mb-8 flex items-center gap-2 md:gap-3 border-b border-[#D1A65B]/10 pb-4">
              <History className="text-[#D1A65B]" size={20} /> Patrística
            </h3>
            <div className="space-y-6 md:space-y-8">
              {patristica.length === 0 ? (
                <p className="text-[#F9F6F0]/30 text-xs md:text-sm italic text-center py-4">Buscando citas en los archivos...</p>
              ) : (
                patristica.map((p) => (
                  <div key={p.id} className="relative group">
                    <Quote className="absolute -top-3 -left-3 text-[#D1A65B]/10 w-8 h-8 md:w-12 md:h-12 group-hover:text-[#D1A65B]/20 transition-colors" />
                    <p className="text-[#F9F6F0]/80 text-sm md:text-base italic mb-4 md:mb-6 relative z-10 leading-relaxed break-words">
                      "{p.cita}"
                    </p>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#D1A65B]/10 flex items-center justify-center border border-[#D1A65B]/20 shrink-0">
                        <Scroll size={14} className="text-[#D1A65B]" />
                      </div>
                      <div>
                        <p className="text-[#F9F6F0] text-xs md:text-sm font-bold uppercase tracking-wider">{p.autor_padre}</p>
                        <p className="text-[#D1A65B] text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5">{p.siglo}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}