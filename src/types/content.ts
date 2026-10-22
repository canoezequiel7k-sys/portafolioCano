export type Locale = "es" | "en";

export type Localized = Readonly<Record<Locale, string>>;

export interface Experience {
  readonly role: Localized;
  readonly organization: string;
  readonly location: Localized;
  readonly description: Localized;
}

export interface Skill {
  readonly name: string;
  readonly icon: string;
}

export interface SkillGroup {
  readonly label: Localized;
  readonly details: Localized;
}

export interface Project {
  readonly title: Localized;
  readonly description: Localized;
  readonly image: string;
  readonly repository: string;
}

export interface Certification {
  readonly title: Localized;
  readonly document: string;
}

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
