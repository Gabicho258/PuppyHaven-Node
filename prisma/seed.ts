import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Función para hashear contraseñas
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Función para generar fecha aleatoria de nacimiento (18-65 años)
const generateRandomBirthDate = () => {
  const currentYear = new Date().getFullYear();
  const minAge = 18;
  const maxAge = 65;
  const birthYear =
    currentYear - Math.floor(Math.random() * (maxAge - minAge + 1)) - minAge;
  const birthMonth = Math.floor(Math.random() * 12) + 1;
  const birthDay = Math.floor(Math.random() * 28) + 1; // Para evitar problemas con febrero

  return { ano: birthYear, mes: birthMonth, dia: birthDay };
};

// Datos de distritos de Lima
const distritos = [
  "Miraflores",
  "San Isidro",
  "Barranco",
  "Surco",
  "La Molina",
  "San Borja",
  "Magdalena",
  "Jesús María",
  "Lince",
  "Pueblo Libre",
  "Breña",
  "Lima Cercado",
  "Rímac",
  "San Martín de Porres",
  "Los Olivos",
  "Independencia",
  "Comas",
  "Carabayllo",
  "Puente Piedra",
  "Ancón",
  "Santa Anita",
  "Ate",
  "El Agustino",
  "San Luis",
  "La Victoria",
  "Chorrillos",
  "Villa María del Triunfo",
  "Villa El Salvador",
  "San Juan de Miraflores",
];

// Datos de ejemplo para usuarios
const usuariosData = [
  { nombre: "Ana García", email: "ana.garcia@email.com" },
  { nombre: "Carlos López", email: "carlos.lopez@email.com" },
  { nombre: "María Rodríguez", email: "maria.rodriguez@email.com" },
  { nombre: "Juan Pérez", email: "juan.perez@email.com" },
  { nombre: "Lucía Fernández", email: "lucia.fernandez@email.com" },
  { nombre: "Diego Silva", email: "diego.silva@email.com" },
  { nombre: "Sofía Morales", email: "sofia.morales@email.com" },
  { nombre: "Miguel Santos", email: "miguel.santos@email.com" },
  { nombre: "Valentina Cruz", email: "valentina.cruz@email.com" },
  { nombre: "Alejandro Vargas", email: "alejandro.vargas@email.com" },
  { nombre: "Camila Herrera", email: "camila.herrera@email.com" },
  { nombre: "Roberto Mendoza", email: "roberto.mendoza@email.com" },
  { nombre: "Isabella Torres", email: "isabella.torres@email.com" },
  { nombre: "Fernando Ruiz", email: "fernando.ruiz@email.com" },
  { nombre: "Natalia Jiménez", email: "natalia.jimenez@email.com" },
];

// Datos de ejemplo para paseadores
const paseadoresData = [
  {
    nombre: "Pedro Martínez",
    email: "pedro.martinez@paseador.com",
    descripcion:
      "Paseador profesional con 5 años de experiencia. Amo a los animales y me especializo en perros grandes.",
    disponibilidad:
      '{"lunes": "8:00-18:00", "martes": "8:00-18:00", "miercoles": "8:00-18:00", "jueves": "8:00-18:00", "viernes": "8:00-18:00", "sabado": "9:00-15:00"}',
  },
  {
    nombre: "Carmen Delgado",
    email: "carmen.delgado@paseador.com",
    descripcion:
      "Estudiante de veterinaria con gran amor por las mascotas. Especializada en cuidado de cachorros y perros pequeños.",
    disponibilidad:
      '{"lunes": "14:00-20:00", "martes": "14:00-20:00", "miercoles": "14:00-20:00", "jueves": "14:00-20:00", "viernes": "14:00-20:00", "sabado": "8:00-20:00", "domingo": "8:00-20:00"}',
  },
  {
    nombre: "José Ramírez",
    email: "jose.ramirez@paseador.com",
    descripcion:
      "Entrenador canino certificado. Ofrezco paseos educativos y entrenamiento básico durante los paseos.",
    disponibilidad:
      '{"lunes": "6:00-12:00", "martes": "6:00-12:00", "miercoles": "6:00-12:00", "jueves": "6:00-12:00", "viernes": "6:00-12:00", "sabado": "6:00-16:00", "domingo": "6:00-16:00"}',
  },
  {
    nombre: "Andrea Vega",
    email: "andrea.vega@paseador.com",
    descripcion:
      "Enfermera veterinaria con experiencia en cuidado de mascotas. Perfecta para perros con necesidades especiales.",
    disponibilidad:
      '{"lunes": "16:00-20:00", "martes": "16:00-20:00", "miercoles": "16:00-20:00", "jueves": "16:00-20:00", "viernes": "16:00-20:00", "sabado": "10:00-18:00"}',
  },
  {
    nombre: "Luis Castillo",
    email: "luis.castillo@paseador.com",
    descripcion:
      "Deportista y amante de los perros. Ideal para mascotas que necesitan mucho ejercicio y actividad física.",
    disponibilidad:
      '{"lunes": "5:30-8:30", "martes": "5:30-8:30", "miercoles": "5:30-8:30", "jueves": "5:30-8:30", "viernes": "5:30-8:30", "sabado": "7:00-19:00", "domingo": "7:00-19:00"}',
  },
  {
    nombre: "Patricia Moreno",
    email: "patricia.moreno@paseador.com",
    descripcion:
      "Jubilada con mucho tiempo y amor para dar a las mascotas. Especializada en perros mayores y tranquilos.",
    disponibilidad:
      '{"lunes": "9:00-17:00", "martes": "9:00-17:00", "miercoles": "9:00-17:00", "jueves": "9:00-17:00", "viernes": "9:00-17:00", "sabado": "10:00-14:00"}',
  },
  {
    nombre: "Ricardo Flores",
    email: "ricardo.flores@paseador.com",
    descripcion:
      "Trabajador remoto que puede ofrecer flexibilidad horaria. Experiencia con todo tipo de razas.",
    disponibilidad:
      '{"lunes": "12:00-14:00", "martes": "12:00-14:00", "miercoles": "12:00-14:00", "jueves": "12:00-14:00", "viernes": "12:00-14:00", "sabado": "8:00-18:00", "domingo": "8:00-18:00"}',
  },
  {
    nombre: "Elena Guerrero",
    email: "elena.guerrero@paseador.com",
    descripcion:
      "Psicóloga canina con enfoque en rehabilitación de perros con traumas. Paseos terapéuticos.",
    disponibilidad:
      '{"martes": "15:00-19:00", "jueves": "15:00-19:00", "sabado": "9:00-17:00", "domingo": "9:00-17:00"}',
  },
];

// Razas de perros populares
const razasPerros = [
  "Labrador Retriever",
  "Golden Retriever",
  "Pastor Alemán",
  "Bulldog Francés",
  "Poodle",
  "Beagle",
  "Rottweiler",
  "Yorkshire Terrier",
  "Dachshund",
  "Boxer",
  "Husky Siberiano",
  "Chihuahua",
  "Shih Tzu",
  "Maltés",
  "Border Collie",
  "Cocker Spaniel",
  "Mestizo",
  "Pitbull",
  "Schnauzer",
];

// Colores de mascotas
const coloresMascotas = [
  "Negro",
  "Blanco",
  "Marrón",
  "Dorado",
  "Gris",
  "Atigrado",
  "Negro y blanco",
  "Marrón y blanco",
  "Tricolor",
  "Crema",
];

// Nombres de mascotas
const nombresMascotas = [
  "Max",
  "Luna",
  "Charlie",
  "Bella",
  "Rocky",
  "Mia",
  "Buddy",
  "Lola",
  "Zeus",
  "Coco",
  "Toby",
  "Nala",
  "Simba",
  "Maya",
  "Bruno",
  "Kira",
  "Rex",
  "Princesa",
  "Duke",
  "Canela",
  "Thor",
  "Dulce",
  "Leo",
  "Nina",
  "Oliver",
  "Pinta",
  "Jack",
  "Miel",
  "Bear",
  "Chispa",
  "Cooper",
  "Zara",
];

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  try {
    // Limpiar datos existentes
    console.log("🧹 Limpiando datos existentes...");
    await prisma.comentario.deleteMany();
    await prisma.paseoMascota.deleteMany();
    await prisma.paseo.deleteMany();
    await prisma.tramite.deleteMany();
    await prisma.mascota.deleteMany();
    await prisma.usuario.deleteMany();
    await prisma.paseador.deleteMany();
    await prisma.calificacion.deleteMany();
    await prisma.distrito.deleteMany();

    // 1. Crear distritos
    console.log("🏙️ Creando distritos...");
    const distritosCreados = [];
    for (const nombreDistrito of distritos) {
      const distrito = await prisma.distrito.create({
        data: { nombre: nombreDistrito },
      });
      distritosCreados.push(distrito);
    }
    console.log(`✅ ${distritosCreados.length} distritos creados`);

    // 2. Crear calificaciones para paseadores
    console.log("⭐ Creando calificaciones...");
    const calificaciones = [];
    for (let i = 0; i < paseadoresData.length; i++) {
      const meGusta = Math.floor(Math.random() * 50) + 5; // 5-54 me gusta
      const noGusta = Math.floor(Math.random() * 10); // 0-9 no me gusta

      const calificacion = await prisma.calificacion.create({
        data: { meGusta, noGusta },
      });
      calificaciones.push(calificacion);
    }
    console.log(`✅ ${calificaciones.length} calificaciones creadas`);

    // 3. Crear usuarios
    console.log("👤 Creando usuarios...");
    const usuarios = [];
    for (const userData of usuariosData) {
      const birthDate = generateRandomBirthDate();
      const distritoAleatorio =
        distritosCreados[Math.floor(Math.random() * distritosCreados.length)];

      const usuario = await prisma.usuario.create({
        data: {
          nombre: userData.nombre,
          correo: userData.email,
          contrasena: await hashPassword("123456"), // Contraseña por defecto
          distritoId: distritoAleatorio.id,
          fotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.nombre
          )}&background=random`,
          fechaNacAno: birthDate.ano,
          fechaNacMes: birthDate.mes,
          fechaNacDia: birthDate.dia,
        },
      });
      usuarios.push(usuario);
    }
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // 4. Crear paseadores
    console.log("🚶 Creando paseadores...");
    const paseadores = [];
    for (let i = 0; i < paseadoresData.length; i++) {
      const paseadorData = paseadoresData[i];
      const birthDate = generateRandomBirthDate();
      const distritoAleatorio =
        distritosCreados[Math.floor(Math.random() * distritosCreados.length)];

      const paseador = await prisma.paseador.create({
        data: {
          nombre: paseadorData.nombre,
          correo: paseadorData.email,
          contrasena: await hashPassword("123456"), // Contraseña por defecto
          distritoId: distritoAleatorio.id,
          fotoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            paseadorData.nombre
          )}&background=random`,
          fechaNacAno: birthDate.ano,
          fechaNacMes: birthDate.mes,
          fechaNacDia: birthDate.dia,
          descripcion: paseadorData.descripcion,
          disponibilidad: paseadorData.disponibilidad,
          calificacionId: calificaciones[i].id,
        },
      });
      paseadores.push(paseador);
    }
    console.log(`✅ ${paseadores.length} paseadores creados`);

    // 5. Crear mascotas
    console.log("🐕 Creando mascotas...");
    const mascotas = [];
    const totalMascotas = 40; // Aproximadamente 2-3 mascotas por usuario

    for (let i = 0; i < totalMascotas; i++) {
      const usuarioAleatorio =
        usuarios[Math.floor(Math.random() * usuarios.length)];
      const nombreMascota =
        nombresMascotas[Math.floor(Math.random() * nombresMascotas.length)];
      const raza = razasPerros[Math.floor(Math.random() * razasPerros.length)];
      const color =
        coloresMascotas[Math.floor(Math.random() * coloresMascotas.length)];
      const edad = Math.floor(Math.random() * 15) + 1; // 1-15 años
      const paraAdopcion = Math.random() < 0.3; // 30% están en adopción

      const mascota = await prisma.mascota.create({
        data: {
          nombre: nombreMascota,
          color: color,
          raza: raza,
          edad: edad,
          fotoUrl: `https://dog.ceo/api/breeds/image/random`,
          descripcion: `${nombreMascota} es un ${raza.toLowerCase()} de ${edad} año${
            edad !== 1 ? "s" : ""
          } muy cariñoso y juguetón. Le encanta ${
            Math.random() < 0.5
              ? "correr en el parque"
              : "jugar con otros perros"
          }.`,
          paraAdopcion: paraAdopcion,
          usuarioId: usuarioAleatorio.id,
        },
      });
      mascotas.push(mascota);
    }
    console.log(`✅ ${mascotas.length} mascotas creadas`);

    // 6. Crear paseos
    console.log("🚶‍♂️ Creando paseos...");
    const totalPaseos = 60;
    const estados = ["P", "A", "C", "R"];
    const direcciones = [
      "Parque Kennedy",
      "Malecón de Miraflores",
      "Parque de la Reserva",
      "Campo de Marte",
      "Parque de la Amistad",
      "Parque El Olivar",
      "Parque María Reiche",
      "Parque Reducto",
      "Malecón de Barranco",
      "Parque de los Héroes Navales",
      "Parque Salazar",
      "Parque Central",
    ];

    for (let i = 0; i < totalPaseos; i++) {
      const paseadorAleatorio =
        paseadores[Math.floor(Math.random() * paseadores.length)];
      const usuarioAleatorio =
        usuarios[Math.floor(Math.random() * usuarios.length)];
      const direccionAleatoria =
        direcciones[Math.floor(Math.random() * direcciones.length)];

      // Generar fecha aleatoria en los últimos 3 meses
      const fechaBase = new Date();
      fechaBase.setMonth(fechaBase.getMonth() - 3);
      const fechaAleatoria = new Date(
        fechaBase.getTime() + Math.random() * (Date.now() - fechaBase.getTime())
      );

      const paseo = await prisma.paseo.create({
        data: {
          paseadorId: paseadorAleatorio.id,
          usuarioId: usuarioAleatorio.id,
          distrito:
            distritosCreados[
              Math.floor(Math.random() * distritosCreados.length)
            ].nombre,
          direccion: direccionAleatoria,
          fechaAno: fechaAleatoria.getFullYear(),
          fechaMes: fechaAleatoria.getMonth() + 1,
          fechaDia: fechaAleatoria.getDate(),
          hora: `${Math.floor(Math.random() * 12) + 6}:${
            Math.random() < 0.5 ? "00" : "30"
          }`,
          cantidadHoras: Math.floor(Math.random() * 4) + 1, // 1-4 horas
          estado: estados[Math.floor(Math.random() * estados.length)],
        },
      });

      // Asignar 1-3 mascotas del usuario al paseo
      const mascotasDelUsuario = mascotas.filter(
        (m) => m.usuarioId === usuarioAleatorio.id
      );
      if (mascotasDelUsuario.length > 0) {
        const numMascotas = Math.min(
          Math.floor(Math.random() * 3) + 1,
          mascotasDelUsuario.length
        );
        const mascotasSeleccionadas = mascotasDelUsuario
          .sort(() => 0.5 - Math.random())
          .slice(0, numMascotas);

        for (const mascota of mascotasSeleccionadas) {
          await prisma.paseoMascota.create({
            data: {
              paseoId: paseo.id,
              mascotaId: mascota.id,
            },
          });
        }
      }
    }
    console.log(`✅ ${totalPaseos} paseos creados`);

    // 7. Crear comentarios
    console.log("💬 Creando comentarios...");
    const comentariosTexto = [
      "Excelente paseador, muy responsable y cariñoso con mi mascota.",
      "Mi perro llegó muy feliz después del paseo. Definitivamente lo recomiendo.",
      "Puntual y profesional. Se nota que ama a los animales.",
      "Muy buen servicio, mi mascota se sintió cómoda desde el primer día.",
      "Perfecto para perros con mucha energía. Sabe cómo manejarlos.",
      "No cumplió con los horarios acordados.",
      "Mi perro no se sintió cómodo con el paseador.",
      "Excelente comunicación y envío de fotos durante el paseo.",
      "Muy recomendado para cachorros, tiene mucha paciencia.",
      "Profesional y confiable. Ya llevamos varios meses trabajando juntos.",
    ];

    const totalComentarios = 80;
    for (let i = 0; i < totalComentarios; i++) {
      const usuarioAleatorio =
        usuarios[Math.floor(Math.random() * usuarios.length)];
      const paseadorAleatorio =
        paseadores[Math.floor(Math.random() * paseadores.length)];
      const esLike = Math.random() < 0.8; // 80% son positivos
      const textoAleatorio =
        comentariosTexto[Math.floor(Math.random() * comentariosTexto.length)];

      await prisma.comentario.create({
        data: {
          usuarioId: usuarioAleatorio.id,
          paseadorId: paseadorAleatorio.id,
          esLike: esLike,
          texto: textoAleatorio,
        },
      });
    }
    console.log(`✅ ${totalComentarios} comentarios creados`);

    // 8. Crear trámites de adopción
    console.log("📋 Creando trámites de adopción...");
    const mascotasEnAdopcion = mascotas.filter((m) => m.paraAdopcion);
    const totalTramites = Math.min(20, mascotasEnAdopcion.length);
    const estadosTramite = ["P", "A", "R", "C"];

    for (let i = 0; i < totalTramites; i++) {
      const mascotaEnAdopcion = mascotasEnAdopcion[i];
      const adoptadorPotencial = usuarios.find(
        (u) => u.id !== mascotaEnAdopcion.usuarioId
      );

      if (adoptadorPotencial) {
        // Generar fecha aleatoria en el último mes
        const fechaBase = new Date();
        fechaBase.setMonth(fechaBase.getMonth() - 1);
        const fechaAleatoria = new Date(
          fechaBase.getTime() +
            Math.random() * (Date.now() - fechaBase.getTime())
        );

        await prisma.tramite.create({
          data: {
            usuarioAdoptadorId: adoptadorPotencial.id,
            usuarioDuenoId: mascotaEnAdopcion.usuarioId,
            fechaAno: fechaAleatoria.getFullYear(),
            fechaMes: fechaAleatoria.getMonth() + 1,
            fechaDia: fechaAleatoria.getDate(),
            mascotaId: mascotaEnAdopcion.id,
            estado:
              estadosTramite[Math.floor(Math.random() * estadosTramite.length)],
          },
        });
      }
    }
    console.log(`✅ ${totalTramites} trámites de adopción creados`);

    // Mostrar resumen
    console.log("\n📊 RESUMEN DEL SEED:");
    console.log(`├── Distritos: ${distritosCreados.length}`);
    console.log(`├── Usuarios: ${usuarios.length}`);
    console.log(`├── Paseadores: ${paseadores.length}`);
    console.log(`├── Mascotas: ${mascotas.length}`);
    console.log(`├── Paseos: ${totalPaseos}`);
    console.log(`├── Comentarios: ${totalComentarios}`);
    console.log(`└── Trámites: ${totalTramites}`);

    console.log("\n🔑 CREDENCIALES DE PRUEBA:");
    console.log("👤 Usuarios:");
    usuariosData.slice(0, 3).forEach((user) => {
      console.log(`   • ${user.email} - Contraseña: 123456`);
    });
    console.log("🚶 Paseadores:");
    paseadoresData.slice(0, 3).forEach((paseador) => {
      console.log(`   • ${paseador.email} - Contraseña: 123456`);
    });

    console.log("\n🎉 ¡Seed completado exitosamente!");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
