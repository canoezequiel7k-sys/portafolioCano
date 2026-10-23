// Entrada legacy; la aplicación Vite activa inicializa sus funciones desde src/main.ts.
document.addEventListener("DOMContentLoaded", function() {

  const menuItem = document.querySelector(".menu-item");
  const submenu = document.querySelector(".submenu-side");
  const menuLink = menuItem.querySelector("a");
  const main = document.querySelector("main");
  const sections = document.querySelectorAll(".seccion");
  const projects = document.querySelectorAll(".proyecto");
  const contratameBtn = document.querySelector(".contratame");

  // Abre y cierra la navegación lateral, y desplaza a la sección elegida.
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
      targetSection.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Marca como visibles las secciones y revela sus tarjetas al pasar por pantalla.
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

  // Dibuja partículas en movimiento y reacciona al puntero.
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

  // Representa y actualiza una partícula individual del fondo animado.
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
  // Ahora usa la variable CSS que cambia con el dark mode
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--particle-color");
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

  // Crea una nueva distribución de partículas para las dimensiones del canvas.
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

  // Limpia y vuelve a dibujar el canvas en cada fotograma.
  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => p.update());
    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Sigue el puntero con las pupilas del personaje.
  const ojoIzq = document.getElementById("ojo-izq");
  const ojoDer = document.getElementById("ojo-der");

  // Calcula la dirección de cada pupila manteniendo el movimiento dentro de los lentes.
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

  // Añade una inclinación 3D a la tarjeta de perfil y a los certificados.
  const aboutCard = document.querySelector(".about-card");
  const certCard = document.querySelector(".certificaciones-container");

  // Inclina una tarjeta según la posición del puntero y la devuelve al salir.
  function addTiltEffect(card, intensity = 12) {
  if (!card) return;
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * intensity;
    const rotateY = ((x - centerX) / centerX) * -intensity;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
  });
}

// aplicar con distinta intensidad
addTiltEffect(aboutCard, 8);
addTiltEffect(certCard, 12); // 💡 un poco más inclinado


// Alterna el tema, guarda la preferencia y anima el icono del botón.
const darkToggle = document.getElementById("dark-toggle");
darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // animación de ícono
  darkToggle.classList.add("animate");
  setTimeout(() => darkToggle.classList.remove("animate"), 600);

  // Guardar preferencia en localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }

  updateToggleIcon(); // ✅ para mantener el cambio de sol/luna
});

// Cargar preferencia guardada
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
}

// Sincroniza el icono del control con el tema aplicado.
function updateToggleIcon() {
  if (document.body.classList.contains("dark-mode")) {
    darkToggle.textContent = "🌙"; // en oscuro → mostrar sol (volver a claro)
  } else {
    darkToggle.textContent = "☀️"; // en claro → mostrar luna (ir a oscuro)
  }
}

// Inicializar icono según el modo actual o guardado
updateToggleIcon();

// Cada vez que se hace click, actualizamos el ícono también
darkToggle.addEventListener("click", () => {
  updateToggleIcon();
});

// Prepara el texto de introducción para escribirlo progresivamente.
const typewriterText = document.getElementById("typewriter-text");
const text = typewriterText.dataset.text || "Hola! soy Ezequiel...";
let i = 0;

// Añade un carácter por intervalo y oculta el cursor al completar la frase.
function typeWriter() {
  if (i < text.length) {
    typewriterText.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 120);
  } else {
    // cuando termina, sacar cursor
    typewriterText.style.borderRight = "none";
  }
}

// iniciar animación
typeWriter();

});