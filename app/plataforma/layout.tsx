"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Home, Flame, MessageSquare, ScrollText, Sparkles, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/supabase";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });

export default function PlataformaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [usuario, setUsuario] = useState<any>(null);
  const [cargandoAuth, setCargandoAuth] = useState(true);

  // 🛡️ VIGILANCIA DE SEGURIDAD
  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth");
      } else {
        setUsuario(session.user);
        setCargandoAuth(false);
      }
    };

    verificarSesion();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (cargandoAuth) {
    return (
      <div className="h-screen w-full bg-[#0c0d0c] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#D1A65B] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#D1A65B] font-serif tracking-[0.3em] uppercase text-xs animate-pulse">Verificando Credenciales...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0c0d0c] overflow-hidden">
      
      {/* SIDEBAR (Computadora) */}
      <aside className="w-[280px] border-r border-[#D1A65B]/10 bg-[#080908] hidden md:flex flex-col h-full relative z-20 shadow-2xl shrink-0">
        <div className="h-20 flex items-center px-6 flex-shrink-0 border-b border-[#D1A65B]/[0.05]">
          <Link href="/plataforma" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#D1A65B] flex items-center justify-center">
              <BookOpen size={16} className="text-[#080908]" />
            </div>
            <span className={`font-semibold text-xl text-[#F9F6F0] ${playfair.className}`}>Biblia<span className="text-[#D1A65B] italic">IA</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8">
          <div className="space-y-1.5">
            <p className="px-3 text-[10px] font-bold text-[#D1A65B]/40 uppercase tracking-widest mb-4">Menú Principal</p>
            
            <Link href="/plataforma" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname === '/plataforma' ? 'bg-[#D1A65B]/10 text-[#D1A65B] border border-[#D1A65B]/20' : 'text-[#F9F6F0]/50 hover:text-[#F9F6F0] hover:bg-white/5'}`}>
              <Home size={18} /> Hub Central
            </Link>
            
            <Link href="/plataforma/enciclopedia" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname.includes('/enciclopedia') ? 'bg-[#D1A65B]/10 text-[#D1A65B] border border-[#D1A65B]/20' : 'text-[#F9F6F0]/50 hover:text-[#F9F6F0] hover:bg-white/5'}`}>
              <ScrollText size={18} /> Enciclopedia
            </Link>

            <Link href="/plataforma/debates" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname.includes('/debates') ? 'bg-[#D1A65B]/10 text-[#D1A65B] border border-[#D1A65B]/20' : 'text-[#F9F6F0]/50 hover:text-[#F9F6F0] hover:bg-white/5'}`}>
              <MessageSquare size={18} /> Ágora / Debates
            </Link>

            <Link href="/plataforma/ia" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname.includes('/ia') ? 'bg-[#D1A65B]/10 text-[#D1A65B] border border-[#D1A65B]/20' : 'text-[#F9F6F0]/50 hover:text-[#F9F6F0] hover:bg-white/5'}`}>
              <Sparkles size={18} /> Oráculo IA
            </Link>

            <Link href="/plataforma/tendencias" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${pathname === '/plataforma/tendencias' ? 'bg-[#D1A65B]/10 text-[#D1A65B] border border-[#D1A65B]/20' : 'text-[#F9F6F0]/50 hover:text-[#F9F6F0] hover:bg-white/5'}`}>
              <Flame size={18} /> Tendencias
            </Link>
          </div>
        </nav>

        {/* PERFIL DEL USUARIO REAL */}
        <div className="p-4 border-t border-[#D1A65B]/10 bg-[#080908]">
          <div className="bg-[#151715] p-4 rounded-2xl border border-[#D1A65B]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D1A65B] flex items-center justify-center text-[#080908] font-bold shrink-0">
                {usuario?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-[#F9F6F0] truncate">{usuario?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-[#D1A65B] font-bold uppercase tracking-tighter flex items-center gap-1">
                   <ShieldCheck size={10}/> Nivel Erudito
                </p>
              </div>
            </div>
            <button 
              onClick={cerrarSesion}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest text-red-400/70 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-[#0c0d0c] relative pb-20 md:pb-0">
          {children}
        </main>

        {/* MENÚ INFERIOR (Solo para Celular) */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#080908]/90 backdrop-blur-md border-t border-[#D1A65B]/20 flex justify-around items-center h-16 z-50">
          <Link href="/plataforma" className={`p-2 ${pathname === '/plataforma' ? 'text-[#D1A65B]' : 'text-[#F9F6F0]/40'}`}>
            <Home size={24} />
          </Link>
          <Link href="/plataforma/enciclopedia" className={`p-2 ${pathname.includes('/enciclopedia') ? 'text-[#D1A65B]' : 'text-[#F9F6F0]/40'}`}>
            <ScrollText size={24} />
          </Link>
          <Link href="/plataforma/ia" className={`p-2 ${pathname.includes('/ia') ? 'text-[#D1A65B]' : 'text-[#F9F6F0]/40'}`}>
            <Sparkles size={24} />
          </Link>
          <Link href="/plataforma/tendencias" className={`p-2 ${pathname.includes('/tendencias') ? 'text-[#D1A65B]' : 'text-[#F9F6F0]/40'}`}>
            <Flame size={24} />
          </Link>
        </nav>
      </div>

    </div>
  );
}