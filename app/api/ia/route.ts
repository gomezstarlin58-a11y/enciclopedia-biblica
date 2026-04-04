import { NextResponse } from 'next/server';
import { supabase } from "@/supabase"; 
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { pregunta, lente } = await req.json();

    // 1. EL ESCUDO CACHÉ: Buscamos en Supabase primero
    const { data: memoria } = await supabase
      .from('memoria_ia')
      .select('respuesta')
      .ilike('pregunta', pregunta) 
      .eq('lente', lente)
      .maybeSingle();

    if (memoria) {
      return NextResponse.json({ respuesta: memoria.respuesta, origen: 'memoria_caché' });
    }

    // 2. LLAMAMOS A LA IA (USANDO LA CAJA FUERTE SECRETA)
    // 👇 AQUÍ ESTÁ LA MAGIA: Ya no hay llave escrita, la lee en secreto de Vercel 👇
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    
    // Usamos el modelo ultrarrápido
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let promptContexto = "Eres un erudito bíblico doctoral. Rigor académico y exégesis profunda. Evita opiniones modernas o consejos de autoayuda.";
    
    if (lente === 'Raíces Originales') promptContexto += " Enfócate en griego koiné y hebreo bíblico.";
    else if (lente === 'Contexto Histórico') promptContexto += " Enfócate en el contexto del primer siglo.";
    else if (lente === 'Teología Sistemática') promptContexto += " Analiza desde la teología sistemática.";

    const promptFinal = `${promptContexto}\n\nPregunta: "${pregunta}"\nResponde de forma clara y profunda.`;

    // 3. GENERAMOS LA RESPUESTA
    const result = await model.generateContent(promptFinal);
    const respuestaIA = result.response.text();

    // 4. GUARDAMOS EN SUPABASE PARA EL FUTURO
    supabase.from('memoria_ia').insert([{ pregunta, respuesta: respuestaIA, lente }]).then();

    return NextResponse.json({ respuesta: respuestaIA, origen: 'gemini_api' });

  } catch (error: any) {
    console.error("--- ERROR EN LA API ---", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}