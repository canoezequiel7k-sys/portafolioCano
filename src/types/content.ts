/** Idiomas que el sitio renderiza como páginas independientes. */
export type Locale = "es" | "en";

/** Texto obligatorio en todos los idiomas disponibles. */
export type Localized = Readonly<Record<Locale, string>>;

/** Datos de una experiencia laboral del perfil. */
export interface Experience {
  readonly role: Localized;
  readonly organization: string;
  readonly location: Localized;
  readonly description: Localized;
}

/** Nombre visible e icono de una tecnología. */
export interface Skill {
  readonly name: string;
  readonly icon: string;
}

/** Grupo de habilidades con su etiqueta y descripción traducibles. */
export interface SkillGroup {
  readonly label: Localized;
  readonly details: Localized;
}

/** Contenido, imagen y enlace de un proyecto mostrado en el portafolio. */
export interface Project {
  readonly title: Localized;
  readonly description: Localized;
  readonly imageAlt: Localized;
  readonly imageWidth: number;
  readonly imageHeight: number;
  readonly image: string;
  readonly repository: string;
}

/** Título localizado y ruta de un certificado. */
export interface Certification {
  readonly title: Localized;
  readonly document: string;
}

/** Contrato de todos los datos profesionales usados para renderizar el sitio. */
export interface ProfileContent {
  readonly introduction: Localized;
  readonly role: Localized;
  readonly summary: Localized;
  readonly experience: readonly Experience[];
  readonly skillGroups: readonly SkillGroup[];
  readonly skills: readonly Skill[];
  readonly about: Localized;
  readonly education: readonly Localized[];
  readonly languageLevel: Localized;
  readonly certifications: readonly Certification[];
  readonly projects: readonly Project[];
}
