import type { ProfileContent } from "../types/content.ts";

// Fuente única de datos profesionales y proyectos en español e inglés.
export const profile: ProfileContent = {
  introduction: {
    es: "Hola! soy Ezequiel...",
    en: "Hi! I'm Ezequiel...",
  },
  role: {
    es: "Desarrollador Web y Full Stack Junior",
    en: "Junior Web and Full Stack Developer",
  },
  summary: {
    es: "Diseño y desarrollo aplicaciones y sitios web, priorizando rendimiento como la experiencia del usuario.",
    en: "I design and develop applications and websites, prioritizing performance and user experience.",
  },
  // Trayectoria laboral presentada en la sección de experiencia.
  experience: [
    {
      role: {
        es: "Desarrollador de aplicaciones",
        en: "Application Developer",
      },
      organization: "COTO",
      period: {
        es: "ago. 2025 – may. 2026 · 10 meses",
        en: "Aug 2025 – May 2026 · 10 months",
      },
      description: {
        es: "Mantenimiento y actualización de las aplicaciones utilizadas en distintas sucursales de COTO.",
        en: "Maintained and updated applications used across selected COTO branches.",
      },
    },
    {
      role: {
        es: "Desarrollador Full Stack",
        en: "Full Stack Developer",
      },
      organization: "Apart JH Belgrano Nordic",
      location: {
        es: "José Hernández 2730, Belgrano · Remoto",
        en: "José Hernández 2730, Belgrano · Remote",
      },
      period: {
        es: "sept. 2025 · 1 mes",
        en: "Sep 2025 · 1 month",
      },
      description: {
        es: "Desarrollo de una aplicación de escritorio para gestionar habitaciones, reservas, ocupación, check-in/check-out y reportes de estadía, utilizando Java, Python y MySQL.",
        en: "Developed a desktop application for room management, reservations, occupancy, check-in/check-out, and stay reports using Java, Python, and MySQL.",
      },
    },
    {
      role: {
        es: "Desarrollador web independiente",
        en: "Independent Web Developer",
      },
      organization: "Profesional independiente",
      location: {
        es: "Remoto",
        en: "Remote",
      },
      period: {
        es: "may. 2023 – sept. 2025 · 2 años y 5 meses",
        en: "May 2023 – Sep 2025 · 2 years and 5 months",
      },
      description: {
        es: "Creación de sitios y aplicaciones web funcionales y atractivos, adaptados a las necesidades de cada cliente.",
        en: "Created functional, engaging websites and web applications tailored to each client's needs.",
      },
    },
    {
      role: {
        es: "Desarrollador Frontend",
        en: "Frontend Developer",
      },
      organization: "Enta Consulting",
      location: {
        es: "Argentina · Remoto",
        en: "Argentina · Remote",
      },
      period: {
        es: "nov. 2023 – feb. 2024 · 4 meses",
        en: "Nov 2023 – Feb 2024 · 4 months",
      },
      description: {
        es: "Edición y mejora del sitio web de la empresa, con foco en optimizar el diseño, la funcionalidad y la experiencia de usuario.",
        en: "Updated and improved the company's website, focusing on design, functionality, and user experience.",
      },
    },
  ],
  // Resumen textual de tecnologías; complementa los iconos animados.
  skillGroups: [
    {
      label: { es: "Desarrollo móvil:", en: "Mobile development:" },
      details: {
        es: "Kotlin, Java, Dart, Flutter, Jetpack Compose, Android SDK, MVVM, Clean Architecture",
        en: "Kotlin, Java, Dart, Flutter, Jetpack Compose, Android SDK, MVVM, Clean Architecture",
      },
    },
    {
      label: { es: "Frontend:", en: "Frontend:" },
      details: {
        es: "HTML5, CSS3, JavaScript, TypeScript",
        en: "HTML5, CSS3, JavaScript, TypeScript",
      },
    },
    {
      label: { es: "Backend:", en: "Backend:" },
      details: {
        es: "Python, FastAPI, Node.js, APIs REST",
        en: "Python, FastAPI, Node.js, REST APIs",
      },
    },
    {
      label: { es: "Bases de datos:", en: "Databases:" },
      details: { es: "PostgreSQL, MySQL, Room", en: "PostgreSQL, MySQL, Room" },
    },
    {
      label: { es: "Herramientas y tecnologías:", en: "Tools and technologies:" },
      details: {
        es: "Git / GitHub, Docker, Linux / Ubuntu, Gradle, Android Studio, Visual Studio Code",
        en: "Git / GitHub, Docker, Linux / Ubuntu, Gradle, Android Studio, Visual Studio Code",
      },
    },
  ],
  // Iconos usados en la marquesina duplicada para el bucle visual.
  skills: [
    { name: "GitHub", icon: "github.svg" },
    { name: "Kotlin", icon: "kotlin.svg" },
    { name: "Python", icon: "python.svg" },
    { name: "Java", icon: "java.svg" },
    { name: "HTML", icon: "html.svg" },
    { name: "CSS", icon: "css.svg" },
    { name: "JavaScript", icon: "javascript.svg" },
    { name: "Dart", icon: "dart.svg" },
    { name: "Flutter", icon: "flutter.svg" },
    { name: "MySQL", icon: "mysql.svg" },
    { name: "PostgreSQL", icon: "postgresql.svg" },
    { name: "Linux", icon: "linux.svg" },
    { name: "Git", icon: "git.svg" },
    { name: "Docker", icon: "docker.svg" },
  ],
  about: {
    es: "Me adapto rápido a nuevas herramientas y proyectos, buscando siempre soluciones eficientes y organizadas. Disfruto trabajar en equipo y aprender constantemente para que cada proyecto sea de calidad.",
    en: "I adapt quickly to new tools and projects, always looking for efficient and organized solutions. I enjoy teamwork and continuous learning to help make every project high quality.",
  },
  education: [
    {
      es: "🎓 Estudiante de Licenciatura en Sistemas (UNLa)",
      en: "🎓 Systems degree student (UNLa)",
    },
    {
      es: "💻 Técnico en Programación (UTN)",
      en: "💻 Programming Technician (UTN)",
    },
  ],
  languageLevel: {
    es: "🌍 Inglés B1 | Portugués A2",
    en: "🌍 English B1 | Portuguese A2",
  },
  // Certificados descargables y sus nombres por idioma.
  certifications: [
    {
      title: {
        es: "Inglés B1 – Certificado Oficial",
        en: "English B1 – Official certificate",
      },
      document: "/ingles_certificado.pdf",
    },
    {
      title: {
        es: "Introducción C# – freeCodeCamp",
        en: "Introduction to C# – freeCodeCamp",
      },
      document: "/freecodecamp.pdf",
    },
    {
      title: {
        es: "Curso de Desarrollo Web – CoderHouse",
        en: "Web development course – CoderHouse",
      },
      document: "/coderhause.pdf",
    },
  ],
  // Proyectos del portafolio; las imágenes incluyen texto alternativo localizado.
  projects: [
    {
      title: {
        es: "Aplicacion de Escritorio",
        en: "Desktop application",
      },
      description: {
        es: "Aplicación de escritorio para la gestión de habitaciones para Hotelera JH, Belgrano.",
        en: "Desktop application for room management at Hotelera JH, Belgrano.",
      },
      imageAlt: {
        es: "Captura de la aplicación de escritorio para gestionar habitaciones del Hotelera JH.",
        en: "Screenshot of the Hotelera JH desktop room-management application.",
      },
      imageWidth: 1698,
      imageHeight: 995,
      image: "/assets/images/proyecto1.webp",
      repository: "https://github.com/canoezequiel7k-sys/BelgranoJH.git",
    },
    {
      title: {
        es: "Aplicacion Móvil",
        en: "Mobile application",
      },
      description: {
        es: "App sencilla en Flutter para calcular el IMC. Permite ingresar datos y muestra el resultado con una breve descripción.",
        en: "A simple Flutter app for calculating BMI. It lets users enter data and shows the result with a short description.",
      },
      imageAlt: {
        es: "Captura de la aplicación móvil en Flutter para calcular el índice de masa corporal.",
        en: "Screenshot of the Flutter mobile app for calculating body mass index.",
      },
      imageWidth: 1411,
      imageHeight: 865,
      image: "/assets/images/proyecto2.webp",
      repository: "https://github.com/canoezequiel7k-sys/Imc_calculator_app.git",
    },
    {
      title: {
        es: "Mimun — Diario emocional",
        en: "Mimun — Emotional journal",
      },
      description: {
        es: "Aplicación móvil de bienestar emocional con registro de estados de ánimo, notas y estadísticas. Desarrollada con Kotlin, Jetpack Compose, FastAPI y PostgreSQL.",
        en: "A mobile emotional-wellbeing app with mood tracking, notes, and statistics, built with Kotlin, Jetpack Compose, FastAPI, and PostgreSQL.",
      },
      imageAlt: {
        es: "Imagen ilustrativa temporal para Mimun; pendiente de reemplazar por una captura.",
        en: "Temporary illustration for Mimun; replace with a project screenshot.",
      },
      imageWidth: 1200,
      imageHeight: 750,
      image: "/assets/images/project-placeholder.svg",
      repository: "https://github.com/canoezequiel7k-sys/Mimun",
    },
    {
      title: {
        es: "Somphie Zúrich",
        en: "Somphie Zurich",
      },
      description: {
        es: "Sistema de gestión para cafetería que integra pedidos de clientes mediante QR, una app para el personal y un panel administrativo. Proyecto en desarrollo con React, Kotlin, Spring Boot y PostgreSQL.",
        en: "A café-management system connecting QR-based customer orders, a staff app, and an admin panel. In development with React, Kotlin, Spring Boot, and PostgreSQL.",
      },
      imageAlt: {
        es: "Imagen ilustrativa temporal para Somphie Zúrich; pendiente de reemplazar por una captura.",
        en: "Temporary illustration for Somphie Zurich; replace with a project screenshot.",
      },
      imageWidth: 1200,
      imageHeight: 750,
      image: "/assets/images/project-placeholder.svg",
      repository: "https://github.com/canoezequiel7k-sys/SomphieZurich",
    },
    {
      title: {
        es: "Webcam Object Detector",
        en: "Webcam Object Detector",
      },
      description: {
        es: "Detector de objetos en tiempo real desde la webcam, con opción de guardar capturas. Desarrollado con Python, YOLOv8 y OpenCV.",
        en: "Detects objects in real time through a webcam and can save image captures. Built with Python, YOLOv8, and OpenCV.",
      },
      imageAlt: {
        es: "Imagen ilustrativa temporal para Webcam Object Detector; pendiente de reemplazar por una captura.",
        en: "Temporary illustration for Webcam Object Detector; replace with a project screenshot.",
      },
      imageWidth: 1200,
      imageHeight: 750,
      image: "/assets/images/project-placeholder.svg",
      repository: "https://github.com/canoezequiel7k-sys/webcam_detecter",
    },
    {
      title: {
        es: "Mimirn't — Asistente anti-sueño",
        en: "Mimirn't — Anti-sleep assistant",
      },
      description: {
        es: "Aplicación de escritorio que detecta ojos cerrados y activa alarmas y notificaciones para ayudar a mantenerse despierto frente a la computadora.",
        en: "A desktop app that detects closed eyes and triggers alarms and notifications to help users stay alert at their computer.",
      },
      imageAlt: {
        es: "Imagen ilustrativa temporal para Mimirn't; pendiente de reemplazar por una captura.",
        en: "Temporary illustration for Mimirn't; replace with a project screenshot.",
      },
      imageWidth: 1200,
      imageHeight: 750,
      image: "/assets/images/project-placeholder.svg",
      repository: "https://github.com/canoezequiel7k-sys/Mimirnt",
    },
  ],
};
