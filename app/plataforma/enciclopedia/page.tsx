"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import { Library, ChevronRight, Scroll, Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function EnciclopediaPage() {
  const [libros, setLibros] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorInterno, setErrorInterno] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setCargando(true);
        // Pedimos los libros a la base de datos
        const { data, error } = await supabase
          .from('libros_biblicos')
          .select('*')
          .order('orden_biblico', { ascending: true });

        if (error) throw error;
        if (data) setLibros(data);
        
      } catch (err: any) {
        console.error("Error conectando con la Bóveda:", err);
        setErrorInterno(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchLibros();
  }, []);

  const librosFiltrados = libros.filter((libro) => 
    libro.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    libro.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 🚨 EL SEGURO DE VIDA: Si hay un error, lo mostramos en lugar de colgar la página
  if (errorInterno) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-10 animate-fade-in">
        <AlertTriangle size={64} className="mb-4 opacity-50" />
        <h2 className="text-3xl font-serif font-bold text-white mb-2">Error en la Matriz</h2>
        <p className="text-red-400 mb-6 text-center max-w-lg">{errorInterno}</p>
        <button onClick={() => window.location.reload()} className="bg-[#D1A65B] text-[#080908] px-6 py-2 rounded-xl font-bold uppercase tracking-widest">
          Reintentar Conexión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 w-full animate-fade-in-up">
      
      {/* HEADER DE LA ENCICLOPEDIA */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-[#D1A65B]/20 pb-8 gap-6">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-serif text-[#F9F6F0] mb-4 flex items-center gap-4">
            <Library className="text-[#D1A65B]" size={40} /> El Canon Textual
          </h1>
          <p className="text-[#F9F6F0]/60 font-light text-lg max-w-2xl">
            Explora los 66 libros inspirados. Cada volumen contiene estudios exegéticos, contexto histórico y conexiones patrísticas.
          </p>
        </div>

        {/* LA BARRA DE BÚSQUEDA */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-[#D1A65B]/50" size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar libro o categoría..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#080908] border border-[#D1A65B]/30 text-[#F9F6F0] rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#D1A65B] transition-colors placeholder-[#F9F6F0]/30 shadow-inner"
          />
        </div>
      </div>

      {cargando ? (
        <div className="flex justify-center items-center h-64 w-full">
          <span className="w-12 h-12 border-4 border-[#D1A65B] border-t-transparent rounded-full animate-spin"></span>
        </div>
      ) : (
        <>
          {librosFiltrados.length === 0 ? (
            <div className="text-center py-12 text-[#F9F6F0]/50 italic">
              No se encontraron manuscritos que coincidan con tu búsqueda.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {librosFiltrados.map((libro) => (
                <Link 
                  key={libro.id} 
                  href={`/plataforma/enciclopedia/${libro.id}`}
                  className="group bg-[#080908] border border-[#D1A65B]/20 rounded-2xl p-6 hover:border-[#D1A65B]/60 hover:bg-[#151715] transition-all shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[200px]"
                >
                  <Scroll className="absolute -bottom-6 -right-6 w-32 h-32 text-[#D1A65B]/5 group-hover:text-[#D1A65B]/10 transition-colors rotate-12" />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] text-[#080908] bg-[#D1A65B] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                        {libro.testamento === 'Antiguo Testamento' ? 'A.T.' : 'N.T.'}
                      </span>
                      <span className="text-[#F9F6F0]/30 font-serif text-sm">Libro {libro.orden_biblico}</span>
                    </div>
                    
                    <h2 className="text-2xl font-serif text-[#F9F6F0] mb-1 group-hover:text-[#D1A65B] transition-colors">
                      {libro.nombre}
                    </h2>
                    <p className="text-[#F9F6F0]/50 text-sm">{libro.categoria} • Autor: {libro.autor_tradicional}</p>
                  </div>

                  <div className="relative z-10 flex items-center gap-2 text-[#D1A65B] font-bold text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all mt-6">
                    Entrar al Estudio <ChevronRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}