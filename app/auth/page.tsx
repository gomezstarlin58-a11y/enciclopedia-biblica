"use client";

import { useState } from "react";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manejarAutenticacion = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      if (esRegistro) {
        // REGISTRO DE NUEVO USUARIO
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
        });
        if (err) throw err;
        if (data.user) {
          router.push("/plataforma"); // Lo mandamos al Hub Central
        }
      } else {
        // INICIO DE SESIÓN
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
        if (data.session) {
          router.push("/plataforma"); // Lo mandamos al Hub Central
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error en la autenticación.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0d0c] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Fondo decorativo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D1A65B] opacity-[0.03] blur-[100px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-md bg-gradient-to-b from-[#151715] to-[#080908] border border-[#D1A65B]/20 rounded-[32px] p-10 shadow-2xl relative z-10 animate-fade-in-up">
        
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D1A65B] to-[#8B6B3D] flex items-center justify-center shadow-[0_0_30px_rgba(209,166,91,0.2)] border border-[#F9F6F0]/20">
            <BookOpen size={32} className="text-[#080908]" />
          </div>
        </div>

        <h1 className="text-3xl font-serif text-[#F9F6F0] text-center mb-2">
          {esRegistro ? "Únete al Scriptorium" : "Acceso a la Bóveda"}
        </h1>
        <p className="text-[#F9F6F0]/50 text-center text-sm mb-8">
          {esRegistro ? "Crea tus credenciales de Erudito." : "Ingresa tus credenciales para continuar."}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 text-sm">
            <AlertTriangle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={manejarAutenticacion} className="space-y-5">
          <div>
            <label className="block text-[#D1A65B] text-xs font-bold uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F9F6F0]/30" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#080908] border border-[#D1A65B]/20 text-[#F9F6F0] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#D1A65B] transition-colors"
                placeholder="erudito@ejemplo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#D1A65B] text-xs font-bold uppercase tracking-widest mb-2 ml-1">Contraseña secreta</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F9F6F0]/30" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#080908] border border-[#D1A65B]/20 text-[#F9F6F0] rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#D1A65B] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={cargando}
            className="w-full bg-[#D1A65B] text-[#080908] font-bold uppercase tracking-widest py-4 rounded-xl mt-4 hover:bg-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {cargando ? "Verificando..." : (esRegistro ? "Forjar Credenciales" : "Abrir los Archivos")}
            {!cargando && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#D1A65B]/10 pt-6">
          <button 
            type="button"
            onClick={() => { setEsRegistro(!esRegistro); setError(null); }}
            className="text-[#F9F6F0]/50 hover:text-[#D1A65B] text-sm transition-colors"
          >
            {esRegistro ? "¿Ya tienes acceso? Inicia sesión aquí." : "¿No eres miembro? Solicita acceso aquí."}
          </button>
        </div>

      </div>
    </div>
  );
}