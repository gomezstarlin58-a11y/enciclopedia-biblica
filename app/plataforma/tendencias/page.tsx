"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Flame, Eye, TrendingUp, Activity, ScrollText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TendenciasPage() {
  const [topEstudios, setTopEstudios] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchTendencias = async () => {
      // Pedimos a Supabase los 5 temas con más 'vistas', ordenados de mayor a menor
      const { data } = await supabase
        .from('temas_estudio')
        .select('*, libros_biblicos(nombre)')
        .order('vistas', { ascending: false })
        .limit(5);

      if (data) setTopEstudios(data);
      setCargando(false);
    };

    fetchTendencias();
  }, []);

  if (cargando) {
    return <div className="flex justify-center items-center h-screen bg-[#0c0d0c]"><span className="w-8 h-8 border-4 border-[#D1A65B] border-t-transparent rounded-full animate-spin"></span></div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 w-full animate-fade-in-up pb-20">
      
      {/* HEADER TENDENCIAS */}
      <div className="mb-8 md:mb-12 border-b border-[#D1A65B]/10 pb-6 md:pb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#F9F6F0] mb-2 md:mb-3 flex items-center gap-3 md:gap-4 break-words">
            <Flame className="text-red-500 shrink-0 w-8 h-8 md:w-12 md:h-12" /> Tendencias
          </h1>
          <p className="text-[#F9F6F0]/50 text-sm md:text-lg font-light">
            El pulso teológico de la plataforma. Descubre qué está estudiando la comunidad.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 bg-[#D1A65B]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-[#D1A65B]/30 text-[#D1A65B] font-bold text-[10px] md:text-xs tracking-widest uppercase animate-pulse self-start md:self-auto">
          <Activity size={14} className="md:w-4 md:h-4 shrink-0" /> Actualizado en Tiempo Real
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* COLUMNA PRINCIPAL: TOP 5 MÁS LEÍDOS */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          <h2 className="text-xl md:text-2xl font-serif text-[#F9F6F0] flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            {/* CORREGIDO */}
            <TrendingUp size={24} className="text-[#D1A65B] w-5 h-5 md:w-6 md:h-6 shrink-0" /> Los Textos Más Leídos
          </h2>

          <div className="space-y-3 md:space-y-4">
            {topEstudios.map((estudio, index) => (
              <Link 
                key={estudio.id} 
                href={`/plataforma/estudio/${estudio.id}`}
                className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 bg-gradient-to-r from-[#151715] to-[#080908] p-5 md:p-6 rounded-[20px] md:rounded-3xl border border-[#D1A65B]/10 hover:border-[#D1A65B]/40 transition-all shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* El número de Ranking (1, 2, 3...) */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <div className={`w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center font-serif text-xl md:text-2xl font-bold shadow-inner ${index === 0 ? 'bg-[#D1A65B] text-[#080908]' : 'bg-[#080908] text-[#D1A65B] border border-[#D1A65B]/30'}`}>
                    #{index + 1}
                  </div>
                  
                  {/* CONTADOR DE VISTAS (Móvil) */}
                  <div className="flex sm:hidden items-center gap-1.5 text-[#F9F6F0]/80 bg-[#080908] px-3 py-1.5 rounded-lg border border-[#D1A65B]/20">
                    <Eye className="text-[#D1A65B]" size={14} />
                    <span className="font-bold font-mono text-sm">{estudio.vistas || 0}</span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1.5 md:mb-1">
                    <span className="text-[9px] md:text-[10px] text-[#080908] bg-[#D1A65B] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest">
                      {estudio.libros_biblicos.nombre}
                    </span>
                    <span className="text-[#F9F6F0]/40 text-[10px] md:text-xs font-mono uppercase">Capítulo {estudio.capitulo_principal}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-serif text-[#F9F6F0] group-hover:text-[#D1A65B] transition-colors leading-tight break-words">
                    {estudio.titulo_tema}
                  </h3>
                </div>

                {/* CONTADOR DE VISTAS (Desktop) */}
                <div className="hidden sm:flex items-center gap-2 text-[#F9F6F0]/80 bg-[#080908] px-4 py-2 rounded-xl border border-[#D1A65B]/20 shrink-0">
                  <Eye className="text-[#D1A65B]" size={18} />
                  <span className="font-bold font-mono text-lg">{estudio.vistas || 0}</span>
                </div>
              </Link>
            ))}
            
            {topEstudios.length === 0 && (
              <div className="p-8 md:p-10 text-center text-[#F9F6F0]/30 italic border border-dashed border-[#D1A65B]/20 rounded-[20px] md:rounded-3xl text-sm md:text-base">
                Aún no hay suficientes datos para generar tendencias.
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA LATERAL: WIDGETS INTERACTIVOS */}
        <div className="space-y-4 md:space-y-6">
          
          {/* Consultas Virales a la IA */}
          <div className="bg-[#151715] border border-blue-900/30 rounded-[20px] md:rounded-3xl p-5 md:p-6 relative overflow-hidden">
            <Sparkles className="absolute -top-6 -right-6 text-blue-500/10 w-24 h-24 md:w-32 md:h-32 rotate-12" />
            <h3 className="text-[#F9F6F0] font-serif text-base md:text-lg flex items-center gap-2 border-b border-blue-900/30 pb-2 md:pb-3 mb-3 md:mb-4">
              {/* CORREGIDO */}
              <Sparkles size={16} className="text-blue-400 w-4 h-4 md:w-5 md:h-5 shrink-0" /> Oráculo: Consultas Virales
            </h3>
            <ul className="space-y-3 md:space-y-4 relative z-10">
              <li className="text-[#F9F6F0]/70 text-xs md:text-sm hover:text-blue-400 cursor-pointer transition-colors leading-relaxed break-words">
                "¿Contradice Pablo a Santiago sobre la fe en Romanos?"
              </li>
              <li className="text-[#F9F6F0]/70 text-xs md:text-sm hover:text-blue-400 cursor-pointer transition-colors leading-relaxed break-words">
                "Exégesis de la simiente en Génesis 3:15"
              </li>
            </ul>
          </div>

          {/* Glosario Top */}
          <div className="bg-[#151715] border border-[#D1A65B]/20 rounded-[20px] md:rounded-3xl p-5 md:p-6">
            <h3 className="text-[#F9F6F0] font-serif text-base md:text-lg flex items-center gap-2 border-b border-[#D1A65B]/10 pb-2 md:pb-3 mb-3 md:mb-4">
              {/* CORREGIDO */}
              <ScrollText size={16} className="text-[#D1A65B] w-4 h-4 md:w-5 md:h-5 shrink-0" /> Raíces más Investigadas
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">Elohim</span>
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">Ágape</span>
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest">Elección</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}