
export default function PlataformaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // overflow-x-hidden es un escudo mágico: 
    // Evita que cualquier elemento rebelde se salga de la pantalla hacia los lados en el celular
    <section className="w-full min-h-screen flex flex-col overflow-x-hidden">
      {/* Si en el futuro decides ponerle una barra de navegación arriba, iría aquí */}
      
      {/* Contenedor principal de la plataforma */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </section>
  );
}