import type { ProfileContent } from "../types/content.ts";

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
  experience: [
    {
      role: {
        es: "Operador de TI",
        en: "IT Operator",
      },
      organization: "Coto CICSA",
      location: {
        es: "Av. Boedo",
        en: "Boedo Avenue",
      },
      description: {
        es: "Atención y soporte directo a usuarios, resolviendo incidencias de hardware y software de forma rápida y clara. Mantenimiento preventivo de equipos y redes, garantizando la continuidad operativa del negocio. Trabajo en equipo con otras áreas para optimizar procesos, utilizando Windows Server, Active Directory y sistemas de ticketing.",
        en: "Direct user support, resolving hardware and software incidents quickly and clearly. Preventive maintenance of equipment and networks to ensure business continuity. Collaboration with other teams to improve processes using Windows Server, Active Directory, and ticketing systems.",
      },
    },
    {
      role: {
        es: "Full Stack Developer",
        en: "Full Stack Developer",
      },
      organization: "Hotelera JH",
      location: {
        es: "Belgrano",
        en: "Belgrano",
      },
      description: {
        es: "Desarrollo de una aplicación de escritorio para hotelería, enfocada en la gestión de habitaciones. Incluye reservas, control de ocupación, check-in y check-out, registro de habitaciones en mantenimiento y generación de reportes de estadía. La herramienta mejoró la organización del personal y agilizó la atención a clientes, utilizando Python + MySQL.",
        en: "Development of a desktop application for hotel operations, focused on room management. It includes reservations, occupancy tracking, check-in and check-out, maintenance records, and stay reports. The tool improved staff organization and streamlined customer service, using Python + MySQL.",
      },
    },
  ],
  skillGroups: [
    {
      label: { es: "Lenguajes:", en: "Languages:" },
      details: { es: "Python, Java, C#, C++", en: "Python, Java, C#, C++" },
    },
    {
      label: { es: "Base de Datos:", en: "Databases:" },
      details: { es: "PostgreSQL, MySQL", en: "PostgreSQL, MySQL" },
    },
    {
      label: { es: "Desarrollo web:", en: "Web development:" },
      details: { es: "HTML, CSS, JavaScript", en: "HTML, CSS, JavaScript" },
    },
    {
      label: { es: "Frameworks / Mobile:", en: "Frameworks / Mobile:" },
      details: { es: "Flutter, Django, Dart", en: "Flutter, Django, Dart" },
    },
    {
      label: { es: "Manejo de", en: "Experience with" },
      details: { es: "Docker, Vagrant y Linux", en: "Docker, Vagrant, and Linux" },
    },
  ],
  skills: [
    { name: "GitHub", icon: "github.svg" },
    { name: "Python", icon: "python.svg" },
    { name: "Java", icon: "java.svg" },
    { name: "HTML", icon: "html.svg" },
    { name: "CSS", icon: "css.svg" },
    { name: "JavaScript", icon: "javascript.svg" },
    { name: "Django", icon: "django.svg" },
    { name: "Pygame", icon: "pygame.png" },
    { name: "C++", icon: "cpp.svg" },
    { name: "Dart", icon: "dart.svg" },
    { name: "Flutter", icon: "flutter.svg" },
    { name: "MySQL", icon: "mysql.svg" },
    { name: "PostgreSQL", icon: "postgresql.svg" },
    { name: "Linux", icon: "linux.svg" },
    { name: "Git", icon: "git.svg" },
    { name: "Vagrant", icon: "vagrant.png" },
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
      image: "/assets/images/proyecto1.jpg",
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
      image: "/assets/images/proyecto2.jpg",
      repository: "https://github.com/canoezequiel7k-sys/Imc_calculator_app.git",
    },
  ],
};
