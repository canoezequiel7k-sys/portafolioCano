import type { Locale, Localized } from "../types/content.ts";

export interface UiCopy {
  readonly pageTitle: string;
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
  readonly changeTheme: string;
  readonly languageLink: string;
  readonly switchLanguage: string;
  readonly instagram: string;
  readonly linkedin: string;
  readonly github: string;
  readonly email: string;
  readonly draftNotice: string;
  readonly profilePhotoAlt: string;
  readonly desktopProjectAlt: string;
  readonly mobileProjectAlt: string;
  readonly footer: string;
}

export const ui: Readonly<Record<Locale, UiCopy>> = {
  es: {
    pageTitle: "Mi Portafolio",
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
    changeTheme: "Cambiar tema",
    languageLink: "English",
    switchLanguage: "Cambiar al inglés",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
    draftNotice: "",
    profilePhotoAlt: "Mi foto",
    desktopProjectAlt: "Proyecto 1",
    mobileProjectAlt: "Proyecto 2",
    footer: "© 2025 Ezequiel Cano · Desarrollador Web",
  },
  en: {
    pageTitle: "Portfolio | Ezequiel Cano",
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
    changeTheme: "Change theme",
    languageLink: "Español",
    switchLanguage: "Switch to Spanish",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    github: "GitHub",
    email: "Email",
    draftNotice: "English translation draft — pending Ezequiel's approval.",
    profilePhotoAlt: "Profile photo",
    desktopProjectAlt: "Desktop application project",
    mobileProjectAlt: "Mobile application project",
    footer: "© 2025 Ezequiel Cano · Web Developer",
  },
};

export const localeName: Readonly<Record<Locale, Localized>> = {
  es: { es: "Español", en: "Spanish" },
  en: { es: "English", en: "English" },
};
