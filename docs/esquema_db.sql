CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    reputacion INT DEFAULT 0, -- Sube o baja tipo Reddit
    rol VARCHAR(20) DEFAULT 'usuario', -- 'usuario', 'admin', 'moderador'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE publicaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autor_id UUID REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL, -- Texto enriquecido guardado en formato Markdown/HTML
    tipo VARCHAR(50) NOT NULL, -- Enum: 'exegesis', 'pregunta', 'wiki_articulo'
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE versiculos (
    id SERIAL PRIMARY KEY,
    libro VARCHAR(50) NOT NULL,
    capitulo INT NOT NULL,
    versiculo INT NOT NULL,
    texto TEXT NOT NULL,
    testamento VARCHAR(20) -- 'Antiguo', 'Nuevo'
);

CREATE TABLE ia_cache_respuestas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pregunta_hash TEXT UNIQUE NOT NULL, -- Para detectar si alguien ya hizo esta pregunta
    respuesta_ia TEXT NOT NULL,
    modelo_usado VARCHAR(50), -- ej: 'gpt-4o', 'claude-3-opus'
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);