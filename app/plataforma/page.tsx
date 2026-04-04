"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import { Search, BookOpen, Flame, MessageSquare, ArrowRight, BookType } from "lucide-react";
import Link from "next/link";

export default function HubCentralPage() {
  const [busquedaGlobal, setBusquedaGlobal] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);

  // FUNCIÓN DEL BUSCADOR OMNISCIENTE
  const ejecutarBusqueda = async (texto: string) => {
    setBusquedaGlobal(texto);
    if (texto.length < 3) {
      setResultados([]); // No busca si hay menos de 3 letras
      return;
    }

    setBuscando(true);
    // Busca en el título o dentro del contenido del estudio
    const { data } = await supabase
      .from('temas_estudio')
      .select('*, libros_biblicos(nombre)')
      .or(`titulo_tema.ilike.%${texto}%,contenido_central.ilike.%${texto}%`)
      .limit(5); // Trae los 5 mejores resultados

    if (data) setResultados(data);
    setBuscando(false);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 w-full animate-fade-in-up pb-20">
      
      {/* EL BUSCADOR OMNISCIENTE */}
      <div className="relative z-50 mb-10 md:mb-16">
        <div className="bg-gradient-to-r from-[#D1A65B]/20 to-transparent p-[2px] md:p-1 rounded-[24px] md:rounded-3xl">
          <div className="bg-[#080908] rounded-[22px] flex items-center px-4 md:px-6 py-3 md:py-4 border border-[#D1A65B]/30 shadow-2xl focus-within:border-[#D1A65B] transition-all">
            <Search className="text-[#D1A65B] mr-3 md:mr-4 w-5 h-5 md:w-6 md:h-6 shrink-0" />
            <input 
              type="text" 
              placeholder="Busca un concepto (Ej. Elohim, Alfarero)..."
              className="w-full bg-transparent text-base md:text-xl text-[#F9F6F0] focus:outline-none placeholder-[#F9F6F0]/30"
              value={busquedaGlobal}
              onChange={(e) => ejecutarBusqueda(e.target.value)}
            />
            {buscando && <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#D1A65B] border-t-transparent rounded-full animate-spin ml-3 md:ml-4 shrink-0"></span>}
          </div>
        </div>

        {/* RESULTADOS DESPLEGABLES */}
        {resultados.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 md:mt-4 bg-[#151715] border border-[#D1A65B]/30 rounded-[20px] md:rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-2 md:p-3 bg-[#D1A65B]/10 border-b border-[#D1A65B]/20">
              <span className="text-[#D1A65B] text-[10px] md:text-xs font-bold uppercase tracking-widest px-2">Archivos Encontrados en la Matriz</span>
            </div>
            {resultados.map((res) => (
              <Link 
                key={res.id} 
                href={`/plataforma/estudio/${res.id}`}
                className="block p-3 md:p-4 border-b border-white/5 hover:bg-[#D1A65B]/5 transition-colors group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[#F9F6F0] font-serif text-base md:text-lg group-hover:text-[#D1A65B] transition-colors truncate">{res.titulo_tema}</p>
                    <p className="text-[#F9F6F0]/50 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 mt-1 truncate">
                      <BookType size={14} className="text-[#D1A65B] shrink-0" /> {res.libros_biblicos.nombre} • {res.capitulo_principal}
                    </p>
                  </div>
                  <ArrowRight className="text-[#D1A65B] md:opacity-0 md:group-hover:opacity-100 transition-opacity md:-translate-x-4 md:group-hover:translate-x-0 shrink-0 w-4 h-4 md:w-5 md:h-5" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* TITULAR DEL HUB */}
      <div className="mb-10 md:mb-12">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-[#F9F6F0] mb-3 md:mb-4 tracking-tight leading-tight">
          La Sabiduría de <br className="hidden sm:block"/><span className="text-[#D1A65B] italic">los Siglos.</span>
        </h1>
        <p className="text-[#F9F6F0]/60 text-sm md:text-lg max-w-2xl font-light leading-relaxed">
          Plataforma de estudio exegético y debate teológico. Sumérgete en el canon bíblico con el apoyo de la patrística y la Inteligencia Artificial.

        </p>
      </div>



      {/* TARJETAS DE ACCESO RÁPIDO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Link href="/plataforma/enciclopedia" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-6 md:p-8 rounded-[24px] md:rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">
          <BookOpen className="text-[#D1A65B] mb-4 md:mb-6 relative z-10 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-xl md:text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">El Canon Textual</h2>
          <p className="text-[#F9F6F0]/50 text-xs md:text-sm relative z-10 leading-relaxed">Explora los 66 libros, exégesis por capítulos y documentos históricos.</p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>

        <Link href="/plataforma/debates" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-6 md:p-8 rounded-[24px] md:rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1">
          <MessageSquare className="text-[#D1A65B] mb-4 md:mb-6 relative z-10 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-xl md:text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">Debates <span className="text-[10px] bg-[#D1A65B]/20 text-[#D1A65B] px-2 py-0.5 rounded-full ml-1 align-middle">PRONTO</span></h2>
          <p className="text-[#F9F6F0]/50 text-xs md:text-sm relative z-10 leading-relaxed">Foros de discusión teológica, apologética y hermenéutica avanzada.</p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>

        <Link href="/plataforma/tendencias" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-6 md:p-8 rounded-[24px] md:rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
          <Flame className="text-[#D1A65B] mb-4 md:mb-6 relative z-10 w-8 h-8 md:w-10 md:h-10" />
          <h2 className="text-xl md:text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">Tendencias</h2>
          <p className="text-[#F9F6F0]/50 text-xs md:text-sm relative z-10 leading-relaxed">Los temas de estudio más consultados y debatidos por la comunidad.</p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 md:w-32 md:h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>
      </div>
    </div>
  );
}