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
    <div className="max-w-7xl mx-auto p-6 md:p-10 w-full animate-fade-in-up pb-20">
      
      {/* HEADER TENDENCIAS */}
      <div className="mb-12 border-b border-[#D1A65B]/10 pb-8 flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-serif text-[#F9F6F0] mb-3 flex items-center gap-4">
            <Flame className="text-red-500" size={48} /> Tendencias
          </h1>
          <p className="text-[#F9F6F0]/50 text-lg font-light">
            El pulso teológico de la plataforma. Descubre qué está estudiando la comunidad.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#D1A65B]/10 px-4 py-2 rounded-full border border-[#D1A65B]/30 text-[#D1A65B] font-bold text-xs tracking-widest uppercase animate-pulse">
          <Activity size={16} /> Actualizado en Tiempo Real
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA PRINCIPAL: TOP 5 MÁS LEÍDOS */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-serif text-[#F9F6F0] flex items-center gap-3 mb-6">
            <TrendingUp className="text-[#D1A65B]" size={24} /> Los Textos Más Leídos
          </h2>

          <div className="space-y-4">
            {topEstudios.map((estudio, index) => (
              <Link 
                key={estudio.id} 
                href={`/plataforma/estudio/${estudio.id}`}
                className="group flex flex-col md:flex-row items-start md:items-center gap-6 bg-gradient-to-r from-[#151715] to-[#080908] p-6 rounded-3xl border border-[#D1A65B]/10 hover:border-[#D1A65B]/40 transition-all shadow-xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* El número de Ranking (1, 2, 3...) */}
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold shadow-inner ${index === 0 ? 'bg-[#D1A65B] text-[#080908]' : 'bg-[#080908] text-[#D1A65B] border border-[#D1A65B]/30'}`}>
                  #{index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] text-[#080908] bg-[#D1A65B] px-2 py-0.5 rounded-sm font-bold uppercase tracking-widest">
                      {estudio.libros_biblicos.nombre}
                    </span>
                    <span className="text-[#F9F6F0]/40 text-xs font-mono uppercase">Capítulo {estudio.capitulo_principal}</span>
                  </div>
                  <h3 className="text-xl font-serif text-[#F9F6F0] group-hover:text-[#D1A65B] transition-colors">
                    {estudio.titulo_tema}
                  </h3>
                </div>

                {/* CONTADOR DE VISTAS REAL */}
                <div className="flex items-center gap-2 text-[#F9F6F0]/80 bg-[#080908] px-4 py-2 rounded-xl border border-[#D1A65B]/20">
                  <Eye className="text-[#D1A65B]" size={18} />
                  <span className="font-bold font-mono text-lg">{estudio.vistas || 0}</span>
                </div>
              </Link>
            ))}
            
            {topEstudios.length === 0 && (
              <div className="p-10 text-center text-[#F9F6F0]/30 italic border border-dashed border-[#D1A65B]/20 rounded-3xl">
                Aún no hay suficientes datos para generar tendencias.
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA LATERAL: WIDGETS INTERACTIVOS */}
        <div className="space-y-6">
          
          {/* Consultas Virales a la IA (Próximamente real) */}
          <div className="bg-[#151715] border border-blue-900/30 rounded-3xl p-6 relative overflow-hidden">
            <Sparkles className="absolute -top-6 -right-6 text-blue-500/10 w-32 h-32 rotate-12" />
            <h3 className="text-[#F9F6F0] font-serif text-lg flex items-center gap-2 border-b border-blue-900/30 pb-3 mb-4">
              <Sparkles className="text-blue-400" size={18} /> Oráculo: Consultas Virales
            </h3>
            <ul className="space-y-4 relative z-10">
              <li className="text-[#F9F6F0]/70 text-sm hover:text-blue-400 cursor-pointer transition-colors leading-relaxed">
                "¿Contradice Pablo a Santiago sobre la fe en Romanos?"
              </li>
              <li className="text-[#F9F6F0]/70 text-sm hover:text-blue-400 cursor-pointer transition-colors leading-relaxed">
                "Exégesis de la simiente en Génesis 3:15"
              </li>
            </ul>
          </div>

          {/* Glosario Top */}
          <div className="bg-[#151715] border border-[#D1A65B]/20 rounded-3xl p-6">
            <h3 className="text-[#F9F6F0] font-serif text-lg flex items-center gap-2 border-b border-[#D1A65B]/10 pb-3 mb-4">
              <ScrollText className="text-[#D1A65B]" size={18} /> Raíces más Investigadas
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Elohim</span>
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Ágape</span>
              <span className="bg-[#080908] border border-[#D1A65B]/30 text-[#D1A65B] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Elección</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}















