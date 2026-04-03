"use client";
import Link from "next/link";
import { BookOpen, Sparkles, Users, BrainCircuit, ArrowRight, Mail } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen bg-[#0c0d0c] overflow-x-hidden">
      
      {/* SECCIÓN 1: HERO (IMPACTO INICIAL A PANTALLA COMPLETA) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo (Manuscrito Antiguo) con animación de zoom lento */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=2500&auto=format&fit=crop')" }}
        ></div>
        
        {/* Capas de oscuridad para resaltar el texto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0d0c]/40 via-[#0c0d0c]/60 to-[#0c0d0c]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0c0d0c_100%)] opacity-80"></div>

        {/* Contenido Central */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
          <div className="mb-6 flex items-center gap-3 px-4 py-2 rounded-full border border-[#D1A65B]/30 bg-[#D1A65B]/10 backdrop-blur-md">
            <Sparkles size={16} className="text-[#D1A65B]" />
            <span className="text-xs md:text-sm font-medium text-[#D1A65B] tracking-widest uppercase">El nuevo estándar teológico</span>
          </div>
          
          {/* Ajuste aquí: text-4xl para celular, text-7xl para PC */}
          <h1 className="text-4xl md:text-7xl font-serif text-[#F9F6F0] mb-6 leading-tight drop-shadow-2xl">
            La Sabiduría de los Siglos, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D1A65B] to-[#F4E8D1] italic">
              Iluminada por la Inteligencia
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-[#F9F6F0]/70 mb-10 max-w-2xl font-light px-4">
            Una plataforma donde el rigor enciclopédico, el debate comunitario y la Inteligencia Artificial se unen para decodificar los textos sagrados.
          </p>

          <Link href="/plataforma" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-base md:text-lg font-bold text-[#0c0d0c] bg-gradient-to-r from-[#D1A65B] to-[#8B6B3D] rounded-full overflow-hidden shadow-[0_0_40px_rgba(209,166,91,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(209,166,91,0.5)]">
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative flex items-center gap-2">Entrar al Scriptorium <ArrowRight size={20} /></span>
          </Link>
        </div>
      </section>

      {/* SECCIÓN 2: NUESTRO OBJETIVO (PILARES) */}
      <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-serif text-[#F9F6F0] mb-4">El Propósito de la Plataforma</h2>
          <div className="w-24 h-1 bg-[#D1A65B] mx-auto rounded-full opacity-50"></div>
        </div>

        {/* 📱 AQUÍ ESTÁ LA MAGIA PARA CELULAR: grid-cols-1 md:grid-cols-3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full">
          {/* Tarjeta 1 */}
          <div className="bg-[#151715]/80 backdrop-blur-sm border border-[#D1A65B]/10 p-6 md:p-8 rounded-3xl hover:border-[#D1A65B]/40 transition-all duration-500 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-[#D1A65B]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={28} className="text-[#D1A65B]" />
            </div>
            <h3 className="text-xl font-serif text-[#F9F6F0] mb-3">Conocimiento Estructurado</h3>
            <p className="text-[#F9F6F0]/60 leading-relaxed font-light">Una enciclopedia viva donde organizamos milenios de teología, raíces hebreas y contextos históricos en un formato moderno y accesible.</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="bg-[#151715]/80 backdrop-blur-sm border border-[#D1A65B]/10 p-6 md:p-8 rounded-3xl hover:border-[#D1A65B]/40 transition-all duration-500 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-[#D1A65B]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={28} className="text-[#D1A65B]" />
            </div>
            <h3 className="text-xl font-serif text-[#F9F6F0] mb-3">Comunidad de Exégesis</h3>
            <p className="text-[#F9F6F0]/60 leading-relaxed font-light">Un espacio de rigor y respeto mutuo. Publica tus estudios, debate doctrinas complejas y construye reputación basada en la calidad de tus aportes.</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="bg-[#151715]/80 backdrop-blur-sm border border-[#D1A65B]/10 p-6 md:p-8 rounded-3xl hover:border-[#D1A65B]/40 transition-all duration-500 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-[#D1A65B]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit size={28} className="text-[#D1A65B]" />
            </div>
            <h3 className="text-xl font-serif text-[#F9F6F0] mb-3">Sinergia con IA</h3>
            <p className="text-[#F9F6F0]/60 leading-relaxed font-light">Nuestro motor RAG no adivina; sintetiza. Analiza los debates de la comunidad y los cruza con la base de datos bíblica para darte respuestas precisas.</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: REFLEXIÓN PARALLAX */}
      <section className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden my-12">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2000&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-[#0c0d0c]/80 mix-blend-multiply"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <Sparkles size={40} className="mx-auto text-[#D1A65B] mb-8 opacity-50" />
          <h2 className="text-2xl md:text-5xl font-serif text-[#F9F6F0] leading-snug italic drop-shadow-lg">
            "La verdad no teme al examen profundo, y el conocimiento divino florece cuando es compartido en comunidad."
          </h2>
        </div>
      </section>

      {/* FOOTER: CONTACTOS Y CIERRE */}
      <footer className="border-t border-[#D1A65B]/10 bg-[#050605] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex items-center gap-3">
             <BookOpen size={24} className="text-[#D1A65B]" />
             <span className="font-serif text-2xl text-[#F9F6F0]">Biblia<span className="text-[#D1A65B] italic">IA</span></span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-[#F9F6F0]/60 text-sm">
             <a href="#" className="hover:text-[#D1A65B] transition-colors">Manifiesto</a>
             <a href="#" className="hover:text-[#D1A65B] transition-colors">Reglas de la Comunidad</a>
             <a href="#" className="hover:text-[#D1A65B] transition-colors">Privacidad</a>
          </div>

          <div className="flex items-center gap-4">
             <a href="mailto:contacto@bibliaia.com" className="flex items-center gap-2 text-[#D1A65B] hover:text-[#F4E8D1] transition-colors border border-[#D1A65B]/30 px-4 py-2 rounded-full text-sm">
               <Mail size={16} /> contacto@bibliaia.com
             </a>
          </div>
        </div>
      </footer>

    </main>
  );
}