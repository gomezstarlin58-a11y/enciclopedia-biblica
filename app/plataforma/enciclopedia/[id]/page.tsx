"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, Layers, ScrollText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LibroDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [libro, setLibro] = useState<any>(null);
  const [temas, setTemas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorInterno, setErrorInterno] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setCargando(true);
        
        // 1. Traer datos del libro
        const { data: dataLibro, error: errLibro } = await supabase
          .from('libros_biblicos')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        if (errLibro) throw errLibro;
        if (dataLibro) setLibro(dataLibro);

        // 2. Traer temas
        const { data: dataTemas, error: errTemas } = await supabase
          .from('temas_estudio')
          .select('*')
          .eq('libro_id', id)
          .order('numero_tema', { ascending: true });

        if (errTemas) throw errTemas;
        if (dataTemas) setTemas(dataTemas);

      } catch (err: any) {
        console.error("Error cargando el Scriptorium:", err);
        setErrorInterno(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchData();
  }, [id]);

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-[#0c0d0c]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-10 h-10 border-4 border-[#D1A65B] border-t-transparent rounded-full animate-spin"></span>
          <p className="text-[#D1A65B] font-serif animate-pulse text-sm tracking-widest uppercase">Abriendo Manuscritos...</p>
        </div>
      </div>
    );
  }

  if (errorInterno) {
    return (
      <div className="p-20 text-center text-red-500 font-bold bg-[#0c0d0c] h-screen">
        <p className="text-2xl mb-4">⚠️ ERROR EN LA MATRIZ</p>
        <p className="text-white/50">{errorInterno}</p>
        <button onClick={() => window.location.reload()} className="mt-8 bg-[#D1A65B] text-black px-6 py-2 rounded-lg">Reintentar</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 w-full animate-fade-in pb-20">
      
      <button 
        onClick={() => router.push("/plataforma/enciclopedia")}
        className="inline-flex items-center gap-2 text-[#D1A65B] hover:text-white transition-colors mb-10 text-xs font-bold tracking-widest uppercase"
      >
        <ArrowLeft size={16} /> Volver al Canon
      </button>

      {libro && (
        <div className="bg-gradient-to-br from-[#151715] to-[#080908] border border-[#D1A65B]/30 rounded-[40px] p-10 md:p-16 mb-12 shadow-2xl relative overflow-hidden">
          <BookOpen className="absolute -top-10 -right-10 w-80 h-80 text-[#D1A65B]/5 rotate-12 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex gap-3 mb-6">
              <span className="text-[10px] text-[#080908] bg-[#D1A65B] px-3 py-1 rounded-full font-bold uppercase tracking-[0.2em]">
                {libro.testamento}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-[#F9F6F0] mb-6 drop-shadow-xl italic">
              {libro.nombre}
            </h1>
            <p className="text-[#F9F6F0]/60 text-xl font-light">
              Crónica de <span className="text-[#F9F6F0] font-medium border-b border-[#D1A65B]/40">{libro.autor_tradicional}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mb-10 flex items-center justify-between border-b border-[#D1A65B]/10 pb-6">
        <h2 className="text-4xl font-serif text-[#F9F6F0] flex items-center gap-4">
          <Layers className="text-[#D1A65B]" size={32} /> Estudios Disponibles
        </h2>
        <span className="text-[#D1A65B] text-xs font-bold tracking-[0.3em] uppercase bg-[#D1A65B]/10 px-4 py-2 rounded-full border border-[#D1A65B]/20">
          {temas.length} Artículos
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {temas.length === 0 ? (
          <div className="p-20 text-center border border-dashed border-[#D1A65B]/20 rounded-[32px] bg-[#080908]">
            <ScrollText className="w-16 h-16 text-[#D1A65B]/20 mx-auto mb-6" />
            <p className="text-[#F9F6F0]/40 italic text-xl">Este volumen aún no ha sido redactado por los eruditos.</p>
          </div>
        ) : (
          temas.map((tema) => (
            <Link 
              key={tema.id} 
              href={`/plataforma/estudio/${tema.id}`} 
              className="group block bg-[#080908] border border-[#D1A65B]/10 hover:border-[#D1A65B]/50 hover:bg-[#151715] rounded-[24px] p-8 transition-all shadow-xl hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-[#151715] border border-[#D1A65B]/20 rounded-2xl flex items-center justify-center text-[#D1A65B] font-bold font-serif text-2xl group-hover:bg-[#D1A65B] group-hover:text-[#080908] transition-all duration-500 shadow-inner">
                    {tema.numero_tema}
                  </div>
                  <div>
                    <h3 className="text-[#F9F6F0] text-2xl font-serif mb-2 group-hover:text-[#D1A65B] transition-colors leading-tight">
                      {tema.titulo_tema}
                    </h3>
                    <p className="text-[#D1A65B]/60 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <ScrollText size={14} /> {tema.capitulo_principal}
                    </p>
                  </div>
                </div>
                <div className="text-[#D1A65B] opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                  Abrir Estudio <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}