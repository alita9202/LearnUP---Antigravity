const db = require('./config/db');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seed...');

    // 1. Limpiar o asegurar que no existan para evitar duplicados (opcional, pero útil para testing)
    // No haremos TRUNCATE para no romper todo si ya hay datos, pero podemos ignorar errores o verificar.
    
    // 2. Crear Usuarios Demo
    const adminPassword = await bcrypt.hash('Admin123', 10);
    const colaboradorPassword = await bcrypt.hash('Colaborador123', 10);
    const clientePassword = await bcrypt.hash('Cliente123', 10);

    const users = [
      { nombre: 'Administrador Demo', email: 'admin@learnup.com', pwd: adminPassword, rol: 'ADMINISTRADOR' },
      { nombre: 'Colaborador Demo', email: 'colaborador@learnup.com', pwd: colaboradorPassword, rol: 'COLABORADOR' },
      { nombre: 'Cliente Demo', email: 'cliente@learnup.com', pwd: clientePassword, rol: 'CLIENTE' }
    ];

    for (const u of users) {
      await db.execute(
        `INSERT IGNORE INTO usuarios (nombre, email, password_hash, rol, estado) VALUES (?, ?, ?, ?, 'ACTIVO')`,
        [u.nombre, u.email, u.pwd, u.rol]
      );
    }
    console.log('✅ Usuarios creados');

    // 3. Crear Solicitud Pendiente
    await db.execute(
      `INSERT INTO solicitudes_colaborador (nombre, email, telefono, especialidad, experiencia, descripcion, estado) 
       VALUES (?, ?, ?, ?, ?, ?, 'PENDIENTE')`,
      ['Luis Fernández', 'luis.demo@learnup.com', '71234567', 'Fotografía', '5 años en bodas y eventos', 'Quiero dar clases de foto.']
    );
    console.log('✅ Solicitud pendiente creada');

    // Obtener ID del colaborador
    const [colabs] = await db.execute("SELECT id FROM usuarios WHERE email = 'colaborador@learnup.com'");
    if (colabs.length > 0) {
      const colabId = colabs[0].id;

      // 4. Crear 3 Cursos Demo
      const courses = [
        {
          titulo: 'Taller de Fotografía Básica',
          descripcion: 'Aprende los conceptos básicos de la fotografía: apertura, ISO, velocidad de obturación.',
          categoria: 'Fotografía', precio: 80, modalidad: 'Presencial', ubicacion: 'Sucre', cupos: 20
        },
        {
          titulo: 'Curso de Cocina Tradicional',
          descripcion: 'Descubre los secretos de la gastronomía chuquisaqueña y boliviana.',
          categoria: 'Gastronomía', precio: 100, modalidad: 'Presencial', ubicacion: 'Sucre', cupos: 15
        },
        {
          titulo: 'Taller de Marketing Digital para Emprendedores',
          descripcion: 'Posiciona tu negocio en redes sociales y atrae más clientes.',
          categoria: 'Marketing', precio: 120, modalidad: 'Presencial', ubicacion: 'Sucre', cupos: 25
        }
      ];

      for (const c of courses) {
        await db.execute(
          `INSERT INTO cursos (titulo, descripcion, categoria, precio, fecha, modalidad, ubicacion, cupos, estado, colaborador_id) 
           VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, 'ACTIVO', ?)`,
          [c.titulo, c.descripcion, c.categoria, c.precio, c.modalidad, c.ubicacion, c.cupos, colabId]
        );
      }
      console.log('✅ Cursos creados');
    }

    console.log('🎉 Seed finalizado correctamente.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedData();
