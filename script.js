// SCRIPT.JS

document.addEventListener("DOMContentLoaded", function() {

  const menuItem = document.querySelector(".menu-item");
  const submenu = document.querySelector(".submenu-side");
  const menuLink = menuItem.querySelector("a");
  const main = document.querySelector("main");
  const sections = document.querySelectorAll(".seccion");
  const projects = document.querySelectorAll(".proyecto");
  const contratameBtn = document.querySelector(".contratame");

  // ============================
  // MENÚ LATERAL
  // ============================
  menuLink.addEventListener("click", function(e) {
    e.preventDefault();
    menuItem.classList.toggle("active");
  });

  document.addEventListener("click", function(e) {
    if (menuItem.classList.contains("active") && !submenu.contains(e.target) && !menuLink.contains(e.target)) {
      menuItem.classList.remove("active");
    }
  });

  const submenuLinks = submenu.querySelectorAll("a[href^='#']");
  submenuLinks.forEach(link => {
    link.addEventListener("click", function() {
      menuItem.classList.remove("active");
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      scrollToSection(targetSection);
    });
  });

  // ============================
  // SCROLL SNAP + ANIMACIONES
  // ============================
  let isScrolling = false;

  main.addEventListener("wheel", function(e) {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;

    const delta = e.deltaY;
    let currentIndex = Array.from(sections).findIndex(
      sec => sec.getBoundingClientRect().top >= -10
    );

    if (delta > 0 && currentIndex < sections.length - 1) currentIndex++;
    else if (delta < 0 && currentIndex > 0) currentIndex--;

    const nextSection = sections[currentIndex];
    scrollToSection(nextSection);
  }, { passive: false });

  function scrollToSection(section) {
    section.scrollIntoView({ behavior: "smooth" });
    section.classList.add("visible");
    setTimeout(() => { isScrolling = false; }, 800);
  }

  function handleScroll() {
    const scrollMiddle = window.innerHeight / 2;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= scrollMiddle && rect.bottom >= scrollMiddle) {
        section.classList.add("visible");

        // Animar proyectos de esta sección
        const secProjects = section.querySelectorAll(".proyecto");
        secProjects.forEach((proj, i) => {
          setTimeout(() => {
            proj.classList.add("visible");
          }, i * 150);
        });
      }
    });
  }

  main.addEventListener("scroll", handleScroll);
  handleScroll();

  // ============================
  // FONDO ANIMADO CON CANVAS
  // ============================
  const canvas = document.getElementById("background-canvas");
  const ctx = canvas.getContext("2d");
  let particlesArray = [];
  let mouse = { x: null, y: null };

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  class Particle {
    constructor(x, y, size, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedX = speedX;
      this.speedY = speedY;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(121, 176, 185, 0.6)";
      ctx.fill();
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

      // Reacción ligera al mouse
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        this.x += dx / dist;
        this.y += dy / dist;
      }

      this.draw();
    }
  }

  function initParticles() {
    particlesArray = [];
    const numParticles = 180;
    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 3 + 1;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const speedX = (Math.random() - 0.5) * 1;
      const speedY = (Math.random() - 0.5) * 1;
      particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => p.update());
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // ============================
  // OJOS DEL PERSONAJE SIGUEN AL MOUSE
  // ============================
  const ojoIzq = document.getElementById("ojo-izq");
  const ojoDer = document.getElementById("ojo-der");

  function moverOjos(e) {
    const rectIzq = ojoIzq.getBoundingClientRect();
    const rectDer = ojoDer.getBoundingClientRect();

    // Centro de cada ojo
    const centerIzq = { x: rectIzq.left + rectIzq.width / 2, y: rectIzq.top + rectIzq.height / 2 };
    const centerDer = { x: rectDer.left + rectDer.width / 2, y: rectDer.top + rectDer.height / 2 };

    const maxOffset = 6; // cuánto se pueden mover las pupilas

    // Calcular ángulo y mover pupilas
    const angleIzq = Math.atan2(e.clientY - centerIzq.y, e.clientX - centerIzq.x);
    const angleDer = Math.atan2(e.clientY - centerDer.y, e.clientX - centerDer.x);

    ojoIzq.setAttribute("cx", 45 + Math.cos(angleIzq) * maxOffset);
    ojoIzq.setAttribute("cy", 45 + Math.sin(angleIzq) * maxOffset);

    ojoDer.setAttribute("cx", 155 + Math.cos(angleDer) * maxOffset);
    ojoDer.setAttribute("cy", 45 + Math.sin(angleDer) * maxOffset);
  }

  window.addEventListener("mousemove", moverOjos);

});
