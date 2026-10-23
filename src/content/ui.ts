import type { Locale, Localized } from "../types/content.ts";

/** Textos de navegación, controles, accesibilidad y metadatos en cada idioma. */
export interface UiCopy {
  readonly pageTitle: string;
  readonly ownerName: string;
  readonly skipToContent: string;
  readonly menu: string;
  readonly navigationLabel: string;
  readonly home: string;
  readonly experience: string;
  readonly about: string;
  readonly projects: string;
  readonly workHistory: string;
  readonly skills: string;
  readonly aboutHeading: string;
  readonly downloadCv: string;
  readonly certifications: string;
  readonly cv: string;
  readonly languageCertificate: string;
  readonly freeCodeCampCertificate: string;
  readonly coderhouseCertificate: string;
  readonly desktopApp: string;
  readonly mobileApp: string;
  readonly viewOnGitHub: string;
  readonly contact: string;
  readonly activateDarkMode: string;
  readonly activateLightMode: string;
  readonly languageLink: string;
  readonly instagram: string;
  readonly linkedin: string;
  readonly github: string;
  readonly email: string;
  readonly profilePhotoAlt: string;
  readonly footer: string;
}

// Copia de interfaz aprobada; al añadir una clave debe completarse en ambos idiomas.
export const ui: Readonly<Record<Locale, UiCopy>> = {
  es: {
    pageTitle: "Ezequiel Cano | Desarrollador Web y Full Stack Junior",
    ownerName: "Ezequiel Cano",
    skipToContent: "Saltar al contenido principal",
    menu: "Menu ☰",
    navigationLabel: "Navegación principal",
    home: "Inicio",
    experience: "Trabajos",
    about: "Acerca de mí",
    projects: "Proyectos",
    workHistory: "Experiencia Laboral",
    skills: "Herramientas y Habilidades",
    aboutHeading: "Sobre mí 👨‍💻",
    downloadCv: "📄 Descargar mi CV",
    certifications: "📜 Certificaciones & Logros",
    cv: "CV",
    languageCertificate: "Inglés B1 – Certificado Oficial",
    freeCodeCampCertificate: "Introducción C# – freeCodeCamp",
    coderhouseCertificate: "Curso de Desarrollo Web – CoderHouse",
    desktopApp: "Aplicacion de Escritorio",
    mobileApp: "Aplicacion Móvil",
    viewOnGitHub: "Ver en GitHub",
    contact: "Contrátame",
    activateDarkMode: "Activar modo oscuro",
    activateLightMode: "Activar modo claro",
    languageLink: "English",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
    profilePhotoAlt: "Retrato de Ezequiel Cano",
    footer: "© 2025 Ezequiel Cano · Desarrollador Web",
  },
  en: {
    pageTitle: "Ezequiel Cano | Junior Web and Full Stack Developer",
    ownerName: "Ezequiel Cano",
    skipToContent: "Skip to main content",
    menu: "Menu ☰",
    navigationLabel: "Main navigation",
    home: "Home",
    experience: "Experience",
    about: "About me",
    projects: "Projects",
    workHistory: "Work experience",
    skills: "Tools and skills",
    aboutHeading: "About me 👨‍💻",
    downloadCv: "📄 Download my CV",
    certifications: "📜 Certifications & achievements",
    cv: "CV",
    languageCertificate: "English B1 – Official certificate",
    freeCodeCampCertificate: "Introduction to C# – freeCodeCamp",
    coderhouseCertificate: "Web development course – CoderHouse",
    desktopApp: "Desktop application",
    mobileApp: "Mobile application",
    viewOnGitHub: "View on GitHub",
    contact: "Contact me",
    activateDarkMode: "Enable dark mode",
    activateLightMode: "Enable light mode",
    languageLink: "Español",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
    profilePhotoAlt: "Portrait of Ezequiel Cano",
    footer: "© 2025 Ezequiel Cano · Web Developer",
  },
};

/** Nombres de idioma localizados para etiquetas y mensajes de interfaz. */
export const localeName: Readonly<Record<Locale, Localized>> = {
  es: { es: "Español", en: "Spanish" },
  en: { es: "English", en: "English" },
};
