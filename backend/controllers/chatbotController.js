const db = require('../config/db');

const generateResponse = async (text) => {
  const input = text.toLowerCase().trim();

  // ── 1. Saludos ──────────────────────────────────────────────────────────────
  if (input.match(/^(hola|buen(os)?|saludos|hey|qué tal|buenas|hi|buenos días|buenas tardes)/i)) {
    return {
      text: "¡Hola! Soy el asistente virtual de LearnUp 👋. Puedo ayudarte a:\n• Buscar cursos por tema o categoría\n• Ver cursos gratis o económicos\n• Conocer las modalidades disponibles\n• Guiarte en tu inscripción\n• Darte el contacto de soporte\n\n¿Por dónde empezamos?"
    };
  }

  // ── 2. Contacto / Soporte ────────────────────────────────────────────────────
  if (input.match(/(número|llamar|whatsapp|contacto|soporte|teléfono|comunicarme|hablar con|escribir a|correo|email|ayuda humana)/i)) {
    return {
      text: "¡Con gusto te ayudo a contactar al equipo! 📞\n\n• **WhatsApp de soporte:** 70000000\n• **Email:** soporte@learnup.bo\n• **Horario de atención:** Lun–Vie, 9:00–18:00 hrs\n\n¿Hay algo más en lo que pueda ayudarte directamente?"
    };
  }

  // ── 3. Inscripción / Cómo funciona ──────────────────────────────────────────
  if (input.match(/(cómo me inscribo|inscripción|cómo funciona|anotarme|registrarme|cómo empiezo|quiero inscribirme|pasos para)/i)) {
    return {
      text: "¡Inscribirte en LearnUp es muy fácil! 🎓\n\n1️⃣ Regístrate o inicia sesión como **Cliente**.\n2️⃣ Busca el curso que te interesa en el catálogo.\n3️⃣ Haz clic en **\"Solicitar Cupo\"**.\n4️⃣ El instructor revisará tu solicitud y recibirás confirmación.\n5️⃣ El curso aparecerá en tu **Panel de Cliente**.\n\n¿Necesitas ayuda para encontrar un curso específico?"
    };
  }

  // ── 4. Certificados ──────────────────────────────────────────────────────────
  if (input.match(/(certificado|diploma|constancia|certificación)/i)) {
    return {
      text: "¡Sí! LearnUp emite certificados de finalización 🏆\n\nCuando completas un curso al **100%**, aparece el botón **\"Ver Certificado\"** en tu Panel de Cliente. El certificado incluye:\n• Tu nombre completo\n• El nombre del curso\n• El instructor\n• La fecha de finalización\n• Un código de verificación único\n\n¿Estás buscando algún curso en particular para certificarte?"
    };
  }

  // ── 5. Precios / Qué incluye ─────────────────────────────────────────────────
  if (input.match(/(qué incluye|qué aprendo|temario|contenido|qué cubre|qué se enseña|precio|cuánto cuesta|cuánto vale)/i)) {
    return {
      text: "Los detalles de cada curso (temario, precio y duración) los encuentras en la **página de detalle del curso** 📄.\n\nHaz clic en cualquier curso del catálogo y verás toda la información.\n\n¿Quieres que te muestre algunos cursos disponibles?"
    };
  }

  // ── 6. Cursos baratos / gratis ───────────────────────────────────────────────
  if (input.match(/(barato(s)?|económico(s)?|gratis|gratuitos|bajo costo|sin costo|accesible)/i)) {
    try {
      const [courses] = await db.execute(`
        SELECT id, titulo, categoria, precio 
        FROM cursos 
        WHERE estado_validacion = 'APROBADO' 
        ORDER BY precio ASC 
        LIMIT 3
      `);
      if (courses.length > 0) {
        return {
          text: "¡Aprender no tiene por qué ser caro! 💸 Aquí tienes los cursos más accesibles:",
          courses
        };
      }
      return { text: "En este momento no tenemos cursos gratuitos disponibles, pero el catálogo se actualiza constantemente. ¿Te interesa buscar por categoría?" };
    } catch (e) {
      console.error('Chatbot error (baratos):', e);
      return { text: "Hubo un problema buscando cursos económicos. Puedes ver el catálogo completo en la página principal." };
    }
  }

  // ── 7. Cursos por Modalidad ──────────────────────────────────────────────────
  const modeMatch = input.match(/cursos?\s+(virtuales?|en\s*línea|online|presenciales?|híbrid[oa]s?)/i);
  if (modeMatch) {
    const raw = modeMatch[1].toLowerCase();
    const mode = raw.startsWith('virtual') ? 'Virtual'
                : (raw.startsWith('online') || raw.includes('línea')) ? 'Online'
                : raw.startsWith('presencial') ? 'Presencial'
                : 'Híbrido';
    try {
      const [courses] = await db.execute(`
        SELECT id, titulo, categoria, precio 
        FROM cursos 
        WHERE estado_validacion = 'APROBADO' AND modalidad = ?
        LIMIT 3
      `, [mode]);
      if (courses.length > 0) {
        return {
          text: `¡Claro! Aquí tienes opciones en modalidad **${mode}** 👇`,
          courses
        };
      }
      return {
        text: `Actualmente no tenemos cursos activos en modalidad **${mode}**. Prueba con:\n• "Cursos virtuales"\n• "Cursos presenciales"\n• "Cursos online"\n\n¿Puedo ayudarte a buscar algo más?`
      };
    } catch (e) {
      return { text: "Hubo un error buscando por modalidad. ¿Puedes intentarlo de nuevo?" };
    }
  }

  // ── 8. Modalidades (información general) ─────────────────────────────────────
  if (input.match(/(modalidad(es)?|cómo (se pasan|son) las clases|qué modalidades)/i)) {
    return {
      text: "En LearnUp ofrecemos varias modalidades 🎯\n\n• 🏫 **Presencial** — Clases en persona en Sucre\n• 💻 **Online** — Clases en vivo por videollamada\n• 🎬 **Virtual** — Clases grabadas, a tu ritmo\n• 🔀 **Híbrido** — Combina presencial y virtual\n\nPuedes filtrar por modalidad en el catálogo. ¿Te busco cursos de alguna modalidad específica?"
    };
  }

  // ── 9. Catálogo general ──────────────────────────────────────────────────────
  if (input.match(/(qué cursos (tienes|hay|ofrecen)|mostrar cursos|ver cursos|catálogo|todos los cursos|cursos disponibles)/i)) {
    try {
      const [courses] = await db.execute(`
        SELECT id, titulo, categoria, precio 
        FROM cursos 
        WHERE estado_validacion = 'APROBADO' 
        ORDER BY id DESC 
        LIMIT 3
      `);
      if (courses.length > 0) {
        return {
          text: "¡Tenemos una gran variedad! Aquí algunos de los cursos más recientes 🚀",
          courses
        };
      }
      return { text: "Aún no tenemos cursos publicados, pero pronto habrá novedades. Vuelve a consultarme en unos días 😊" };
    } catch (e) {
      console.error('Chatbot error (catálogo):', e);
      return { text: "Hubo un error cargando el catálogo. Intenta ver la sección de cursos directamente en la página principal." };
    }
  }

  // ── 10. Búsqueda por categoría: Tecnología, Arte, etc. ──────────────────────
  const categoryMatch = input.match(/\b(tecnología|arte|negocio|idioma|repostería|gastronomía|fotografía|educación|cocina|música|diseño|marketing|finanzas|programación|python|excel|inglés|dibujo)\b/i);
  if (categoryMatch) {
    const keyword = categoryMatch[1];
    try {
      const [courses] = await db.execute(`
        SELECT id, titulo, categoria, precio 
        FROM cursos 
        WHERE estado_validacion = 'APROBADO' 
        AND (titulo LIKE ? OR categoria LIKE ? OR descripcion LIKE ?)
        LIMIT 3
      `, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
      if (courses.length > 0) {
        return {
          text: `¡Encontré cursos relacionados con **"${keyword}"**! 🎯`,
          courses
        };
      }
      return {
        text: `No encontré cursos de **"${keyword}"** por el momento. ¿Quieres que busque algo parecido?\n\nCategorías disponibles: Tecnología, Arte, Gastronomía, Idiomas, Negocios, Fotografía, Educación, Repostería.`
      };
    } catch (e) {
      return { text: "Hubo un error al buscar. Inténtalo de nuevo o usa los filtros del catálogo." };
    }
  }

  // ── 11. Búsqueda genérica por tema ───────────────────────────────────────────
  const topicMatch = input.match(/(quiero aprender|cursos? de|estoy buscando|busco|enseñan|tienen algo de|hay algo de)\s+(.+)/i);
  if (topicMatch) {
    let topic = topicMatch[2].trim().replace(/[?!.]+$/, '').split(' ')[0];
    try {
      const [courses] = await db.execute(`
        SELECT id, titulo, categoria, precio 
        FROM cursos 
        WHERE estado_validacion = 'APROBADO' 
        AND (titulo LIKE ? OR categoria LIKE ? OR descripcion LIKE ?)
        LIMIT 3
      `, [`%${topic}%`, `%${topic}%`, `%${topic}%`]);
      if (courses.length > 0) {
        return {
          text: `¡Sí! Tenemos opciones sobre **"${topic}"** 📚`,
          courses
        };
      }
      return {
        text: `No encontré cursos de **"${topic}"** en este momento, pero el catálogo crece constantemente.\n\n¿Te ayudo con algo diferente? Por ejemplo:\n• "Cursos de tecnología"\n• "Cursos gratis"\n• "¿Cómo me inscribo?"`
      };
    } catch (e) {
      console.error('Chatbot error (topic):', e);
      return { text: "Hubo un error buscando en el catálogo. ¿Puedes intentarlo de nuevo?" };
    }
  }

  // ── 12. Fallback con opciones concretas ──────────────────────────────────────
  return {
    text: "No estoy seguro de entenderte 🤔 — ¡pero puedo ayudarte! Intenta con alguna de estas opciones:\n\n🔍 **Buscar cursos:**\n• \"¿Qué cursos tienen?\"\n• \"Quiero aprender cocina\"\n• \"Cursos de tecnología\"\n\n💰 **Por precio:**\n• \"Cursos gratis\"\n• \"Cursos económicos\"\n\n📍 **Por modalidad:**\n• \"Cursos virtuales\"\n• \"Cursos presenciales\"\n\n📋 **Otros:**\n• \"¿Cómo me inscribo?\"\n• \"¿Dan certificados?\"\n• \"Número de WhatsApp\""
  };
};

const handleChatbotRequest = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Mensaje vacío' });
    const response = await generateResponse(message);
    res.json(response);
  } catch (error) {
    console.error('Error en chatbot:', error);
    res.status(500).json({ error: 'Error interno del chatbot' });
  }
};

module.exports = { handleChatbotRequest };
