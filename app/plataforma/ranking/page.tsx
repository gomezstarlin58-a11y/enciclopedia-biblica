"use client";
import { Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RankingCompletoPage() {
  return (
    <div className="p-8 text-[#F9F6F0]">
      <Link href="/plataforma/tendencias" className="flex items-center gap-2 text-[#D1A65B] mb-8">
        <ArrowLeft size={20} /> Volver a Tendencias
      </Link>
      <h1 className="text-4xl font-serif flex items-center gap-4">
        <Trophy className="text-[#D1A65B]" /> Salón de la Fama Completo
      </h1>
      <p className="mt-4 text-[#F9F6F0]/60">Aquí aparecerán todos los eruditos del Scriptorium...</p>
    </div>
  );
}