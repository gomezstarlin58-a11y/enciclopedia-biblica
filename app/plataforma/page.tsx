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
    <div className="max-w-7xl mx-auto p-6 md:p-10 w-full animate-fade-in-up">
      
      {/* EL BUSCADOR OMNISCIENTE */}
      <div className="relative z-50 mb-16">
        <div className="bg-gradient-to-r from-[#D1A65B]/20 to-transparent p-1 rounded-3xl">
          <div className="bg-[#080908] rounded-[22px] flex items-center px-6 py-4 border border-[#D1A65B]/30 shadow-2xl focus-within:border-[#D1A65B] transition-all">
            <Search className="text-[#D1A65B] mr-4" size={24} />
            <input 
              type="text" 
              placeholder="Busca cualquier concepto: Ej. Elohim, Justificación, Alfarero..."
              className="w-full bg-transparent text-xl text-[#F9F6F0] focus:outline-none placeholder-[#F9F6F0]/30"
              value={busquedaGlobal}
              onChange={(e) => ejecutarBusqueda(e.target.value)}
            />
            {buscando && <span className="w-5 h-5 border-2 border-[#D1A65B] border-t-transparent rounded-full animate-spin ml-4"></span>}
          </div>
        </div>

        {/* RESULTADOS DESPLEGABLES */}
        {resultados.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-4 bg-[#151715] border border-[#D1A65B]/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3 bg-[#D1A65B]/10 border-b border-[#D1A65B]/20">
              <span className="text-[#D1A65B] text-xs font-bold uppercase tracking-widest px-2">Archivos Encontrados en la Matriz</span>
            </div>
            {resultados.map((res) => (
              <Link 
                key={res.id} 
                href={`/plataforma/estudio/${res.id}`}
                className="block p-4 border-b border-white/5 hover:bg-[#D1A65B]/5 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F9F6F0] font-serif text-lg group-hover:text-[#D1A65B] transition-colors">{res.titulo_tema}</p>
                    <p className="text-[#F9F6F0]/50 text-sm flex items-center gap-2 mt-1">
                      <BookType size={14} className="text-[#D1A65B]" /> {res.libros_biblicos.nombre} • {res.capitulo_principal}
                    </p>
                  </div>
                  <ArrowRight className="text-[#D1A65B] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0" size={20} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* TITULAR DEL HUB */}
      <div className="mb-12">
        <h1 className="text-5xl md:text-7xl font-serif text-[#F9F6F0] mb-4 tracking-tight">
          La Sabiduría de <br/><span className="text-[#D1A65B] italic">los Siglos.</span>
        </h1>
        <p className="text-[#F9F6F0]/60 text-lg max-w-2xl font-light">
          Plataforma de estudio exegético y debate teológico. Sumérgete en el canon bíblico con el apoyo de la patrística y la Inteligencia Artificial.
        </p>
      </div>

      {/* TARJETAS DE ACCESO RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/plataforma/enciclopedia" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-8 rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden">
          <BookOpen className="text-[#D1A65B] mb-6 relative z-10" size={40} />
          <h2 className="text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">El Canon Textual</h2>
          <p className="text-[#F9F6F0]/50 text-sm relative z-10">Explora los 66 libros, exégesis por capítulos y documentos históricos.</p>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>

        <Link href="/plataforma/debates" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-8 rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden">
          <MessageSquare className="text-[#D1A65B] mb-6 relative z-10" size={40} />
          <h2 className="text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">Debates (Próximamente)</h2>
          <p className="text-[#F9F6F0]/50 text-sm relative z-10">Foros de discusión teológica, apologética y hermenéutica avanzada.</p>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>

        <Link href="/plataforma/tendencias" className="group bg-gradient-to-br from-[#151715] to-[#080908] p-8 rounded-3xl border border-[#D1A65B]/20 hover:border-[#D1A65B]/50 transition-all relative overflow-hidden">
          <Flame className="text-[#D1A65B] mb-6 relative z-10" size={40} />
          <h2 className="text-2xl font-serif text-[#F9F6F0] mb-2 relative z-10">Tendencias</h2>
          <p className="text-[#F9F6F0]/50 text-sm relative z-10">Los temas de estudio más consultados y debatidos por la comunidad.</p>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D1A65B] opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
        </Link>
      </div>
    </div>
  );
}