import { profile } from "../content/profile.ts";
import { ui } from "../content/ui.ts";
import type { Locale, Localized } from "../types/content.ts";

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Readonly<Record<string, string>> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function text(value: Localized, locale: Locale): string {
  return escapeHtml(value[locale]);
}

export function renderPage(locale: Locale): string {
  const copy = ui[locale];
  const intro = profile.introduction;
  const experiences = profile.experience
    .map(
      (item) => `
        <div class="proyecto">
          <p><b>${text(item.role, locale)} – ${escapeHtml(item.organization)}, ${text(item.location, locale)}:</b></p><br>
          <p>${text(item.description, locale)}</p>
        </div>`,
    )
    .join("");
  const skills = profile.skills
    .map(
      (skill) =>
        `<img src="/assets/icons/${escapeHtml(skill.icon)}" alt="${escapeHtml(skill.name)}">`,
    )
    .join("");
  const repeatedSkills = profile.skills
    .map(
      (skill) =>
        `<img src="/assets/icons/${encodeURIComponent(skill.icon)}" alt="" aria-hidden="true">`,
    )
    .join("");
  const skillGroups = profile.skillGroups
    .map(
      (group, index) =>
        `<p class="fade-in-seq" style="--delay:${index * 0.5}s"><b>${text(group.label, locale)}</b> ${text(group.details, locale)}</p>`,
    )
    .join("");
  const education = profile.education.map((item) => `<li>${text(item, locale)}</li>`).join("");
  const certifications = profile.certifications
    .map(
      (item) =>
        `<li><a href="${escapeHtml(item.document)}" target="_blank" class="cert-link">${text(item.title, locale)}</a></li>`,
    )
    .join("");
  const projects = profile.projects
    .map(
      (project, index) => `
        <div class="proyecto">
          <img src="${escapeHtml(project.image)}" alt="${escapeHtml(index === 0 ? copy.desktopProjectAlt : copy.mobileProjectAlt)}">
          <h3>${text(project.title, locale)}</h3><br>
          <p>${text(project.description, locale)}<br><br>
            <a href="${escapeHtml(project.repository)}" target="_blank">${escapeHtml(copy.viewOnGitHub)}</a>
          </p>
        </div>`,
    )
    .join("");
  const languageCert = profile.languageLevel[locale];
  const languageLabel = locale === "es" ? "Inglés B1" : "English B1";
  const languageText = `<a href="/ingles_certificado.pdf" target="_blank" class="cert-link">${escapeHtml(languageLabel)}</a>${escapeHtml(languageCert.replace(languageLabel, ""))}`;

  return `
    <canvas id="background-canvas" aria-hidden="true"></canvas>
    <header>
      <nav aria-label="${escapeHtml(copy.navigationLabel)}">
        <ul class="menu">
          <li class="menu-item">
            <a href="#" aria-label="${escapeHtml(copy.menu)}">${escapeHtml(copy.menu)}</a>
            <div class="submenu-side">
              <ul>
                <li><a href="#inicio">${escapeHtml(copy.home)}</a></li>
                <li><a href="#trabajos">${escapeHtml(copy.experience)}</a></li>
                <li><a href="#acerca">${escapeHtml(copy.about)}</a></li>
                <li><a href="#proyectos">${escapeHtml(copy.projects)}</a></li>
              </ul>
              <div class="redes">
                <a href="https://www.instagram.com/canoezequiel7k/" target="_blank"><img src="/assets/icons/instagram.png" alt="${escapeHtml(copy.instagram)}"></a>
                <a href="https://www.linkedin.com/in/canoezequiel7k-sys/" target="_blank"><img src="/assets/icons/linkedin.png" alt="${escapeHtml(copy.linkedin)}"></a>
                <a href="https://github.com/canoezequiel7k-sys" target="_blank"><img src="/assets/icons/github.png" alt="${escapeHtml(copy.github)}"></a>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      <h1 class="titulo-header">${escapeHtml(copy.pageTitle)}</h1>
      <div class="acciones-header">
        <a href="mailto:canoezequiel63@gmail.com" class="contratame">${escapeHtml(copy.contact)}</a>
        <button id="dark-toggle" aria-label="${escapeHtml(copy.changeTheme)}">🌙</button>
      </div>
    </header>
    <main>
      <section id="inicio" class="seccion inicio">
        <div class="contenido-centrado">
          <div class="personaje" aria-hidden="true">
            <svg width="120" height="60" viewBox="0 0 200 100">
              <rect x="10" y="20" width="70" height="50" rx="15" ry="15" stroke="#000" stroke-width="4" fill="transparent"/>
              <rect x="120" y="20" width="70" height="50" rx="15" ry="15" stroke="#000" stroke-width="4" fill="transparent"/>
              <line x1="80" y1="45" x2="120" y2="45" stroke="#000" stroke-width="4"/>
              <circle id="ojo-izq" cx="45" cy="45" r="10" fill="#000"/>
              <circle id="ojo-der" cx="155" cy="45" r="10" fill="#000"/>
            </svg>
          </div>
          <h2 class="typewriter" id="typewriter-text" data-text="${text(intro, locale)}"></h2>
          <p class="fade-text delay2">${text(profile.role, locale)}</p>
          <p class="fade-text delay3">${text(profile.summary, locale)}</p>
        </div>
      </section>
      <section id="trabajos" class="seccion trabajos">
        <div class="contenido-centrado">
          <h2>${escapeHtml(copy.workHistory)}</h2><br>
          <div class="cajas-dos">${experiences}</div><br>
          <h3>${escapeHtml(copy.skills)}</h3><br>
          <div class="skills-marquee" aria-label="${escapeHtml(copy.skills)}">
            <div class="marquee-content">${skills}${repeatedSkills}</div>
          </div>
          <div class="skills-text">${skillGroups}</div>
        </div>
      </section>
      <section id="acerca" class="seccion acerca">
        <div class="contenido-centrado">
          <h2>${escapeHtml(copy.about)}</h2><br>
          <div class="about-card">
            <div class="about-left"><img src="/assets/images/foto-perfil.jpg" alt="${escapeHtml(copy.profilePhotoAlt)}" class="perfil-img"></div>
            <div class="about-right">
              <h3 class="fade-text delay1">${escapeHtml(copy.aboutHeading)}</h3>
              <p class="fade-text delay2">${text(profile.about, locale)}</p>
              <ul class="about-info fade-text delay3">
                ${education}
                <li>${languageText}</li>
              </ul>
            </div>
          </div>
          <div class="cv-container fade-text delay4">
            <a href="/cv_ezequiel.pdf" target="_blank" class="btn-cv">📄 ${escapeHtml(copy.downloadCv.replace("📄 ", ""))}</a>
          </div>
          <div class="card-wrapper fade-text delay5">
            <div class="certificaciones-container">
              <h3>${escapeHtml(copy.certifications)}</h3>
              <ul class="cert-list">${certifications}</ul>
            </div>
          </div>
        </div>
      </section>
      <section id="proyectos" class="seccion proyectos">
        <div class="contenido-centrado">
          <h2>${escapeHtml(copy.projects)}</h2>
          <div class="proyectos-container">${projects}</div>
        </div>
      </section>
      <footer id="contacto" class="seccion footer-seccion">
        <div class="contenido-centrado">
          <p>${escapeHtml(copy.footer)}</p>
          <div class="redes-footer">
            <a href="https://github.com/canoezequiel7k-sys" target="_blank">${escapeHtml(copy.github)}</a> ·
            <a href="https://www.linkedin.com/in/canoezequiel7k-sys/" target="_blank">${escapeHtml(copy.linkedin)}</a> ·
            <a href="mailto:canoezequiel63@gmail.com">${escapeHtml(copy.email)}</a>
          </div>
        </div>
      </footer>
    </main>
    ${locale === "en" ? `<p class="translation-notice" role="status">${escapeHtml(copy.draftNotice)}</p>` : ""}
  `;
}
