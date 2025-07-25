// ScrollSmoother activo desde el inicio
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true
});

const volverA = localStorage.getItem("volverASeccion");
if (volverA && document.querySelector(volverA)) {
  setTimeout(() => {
    smoother.scrollTo(volverA, true, "top top");
    localStorage.removeItem("volverASeccion");
  }, 500); // delay para asegurarte que todo se haya cargado
}

// Si usás imágenes con data-speed o data-lag (como .programas1), podés aplicar:
smoother.effects(".programas1", {
  speed: 0.5,
  lag: (i) => i * 1
});

// Typewriter
const textElement = document.getElementById('type-text');
const sentence = "nos sincronizamos";
let index = 0;
let isDeleting = false;

function typeWriter() {
  if (!isDeleting && index < sentence.length) {
    textElement.innerHTML += sentence.charAt(index);
    index++;
    setTimeout(typeWriter, 100);
  } else if (isDeleting && index > 0) {
    textElement.innerHTML = sentence.substring(0, index - 1);
    index--;
    setTimeout(typeWriter, 50);
  } else {
    // Cambio de dirección (escribir -> borrar -> escribir)
    isDeleting = !isDeleting;
    setTimeout(typeWriter, isDeleting ? 1000 : 500); // espera antes de borrar o escribir
  }
}

// Movimiento imagen que sigue al cursor
const img = document.getElementById("cursor-img");
const fijaImg = document.querySelector(".fija-img");

let ensamblado = false;
let seguirCursor = true;
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;
const offsetX = 50;
const offsetY = 50;

document.addEventListener("mousemove", (e) => {
  if (!ensamblado) {
    mouseX = e.clientX - offsetX;
    mouseY = e.clientY - offsetY;
  }
});

function moverImagen() {
  if (seguirCursor && !ensamblado) {
    const speed = 0.1;
    currentX += (mouseX - currentX) * speed;
    currentY += (mouseY - currentY) * speed;
    img.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(moverImagen);
  }
}

function inicializarScrollHorizontal() {
  const filaUno = document.querySelector(".imagenes-scroll");
  const filaDos = document.querySelector(".imagenes-scroll-invertida");

  if (!filaUno || !filaDos) return;

  const filaUnoAncho = filaUno.scrollWidth;
  const viewportAncho = window.innerWidth;
  const maxScroll = filaUnoAncho - viewportAncho;

  gsap.timeline({
    scrollTrigger: {
      trigger: ".seccion-horizontal-doble",
      start: "top 0%",
      end: `+=${maxScroll}`,
      scrub: true,
      pin: true,
    }
  })
  .to(filaUno, { x: -maxScroll, ease: "none" }, 0)
  .fromTo(filaDos, { x: -maxScroll }, { x: 0, ease: "none" }, 0);
}

fijaImg.addEventListener("mouseenter", () => {
  if (!ensamblado) {
    ensamblado = true;
    seguirCursor = false;

    img.style.opacity = 0;
    fijaImg.style.opacity = 0;

    const ensambleSection = document.querySelector(".section-ensamble");
    const videoEns = document.getElementById("background-video-ensamble");

    ensambleSection.style.display = "none";
    videoEns.pause();
    videoEns.style.display = "none";

    const nextSection = document.getElementById("secciones-finales");
    const nextVideo = document.getElementById("background-video-next");

    nextSection.style.display = "block";
    nextSection.style.opacity = 1;

    nextVideo.style.display = "block";
    nextVideo.style.opacity = 1;
    nextVideo.load();
    nextVideo.play();

    inicializarScrollHorizontal();
    ScrollTrigger.refresh();

    const videoWrapper = document.getElementById("next-section");

    ScrollTrigger.create({
      trigger: "#next-section",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => videoWrapper.classList.add("visible"),
      onLeave: () => videoWrapper.classList.remove("visible"),
      onEnterBack: () => videoWrapper.classList.add("visible"),
      onLeaveBack: () => videoWrapper.classList.remove("visible")
    });

    requestAnimationFrame(() => {
      gsap.to(".imagen1", {
        scrollTrigger: {
          trigger: ".imagen1",
          start: "top 0%",
          end: "+=800",
          scrub: 1,
        },
        x: "-100vw",
        opacity: 0,
        ease: "none",
      });

      gsap.to(".imagenes2 img", {
        scrollTrigger: {
          trigger: ".imagen1",
          start: "bottom center",
          end: "+=1000",
          scrub: 1,
        },
        x: "0vw",
        opacity: 1,
        ease: "none",
        stagger: 0.2
      });
    });
  }

  
});

window.addEventListener("load", () => {
  img.style.opacity = 1;
  typeWriter();
  moverImagen();
});


// PROGRAMAS - Animación e interacciones
const video = document.getElementById("programas-video");
const videoWrapper = document.querySelector(".programas-video-wrapper");
const playButton = document.getElementById("play-button");

const tlProgramas = gsap.timeline({
  scrollTrigger: {
    trigger: ".programas-scroll-seccion",
    start: "top -400%",
    end: "bottom bottom",
    scrub: true,
  }
});

tlProgramas
  .to(".img-left", { x: "-70vw", ease: "none" }, 0.2)
  .to(".img-right", { x: "70vw", ease: "none" }, 0.2, "<")
  .to(videoWrapper, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "power2.out",
    onStart: () => {
      videoWrapper.style.pointerEvents = "auto";
      videoWrapper.style.zIndex = "100"; // ✅ subilo cuando entra
      playButton.style.opacity = 1;
    }
  }, 0.5);
  

playButton.addEventListener("click", () => {
  if (video.paused) {
    video.play().then(() => {
      playButton.style.display = "none";
    }).catch(e => console.error("Error al reproducir video:", e));
  }
});

videoWrapper.addEventListener("click", (e) => {
  if (e.target.id === "programas-video" && !video.paused) {
    video.pause();
    playButton.style.display = "flex";
  }
});

// MOTION - Texto izquierda/derecha
gsap.fromTo(".texto-izquierda", { x: "-100vw" }, {
  x: "0vw",
  duration: 1.5,
  ease: "power4.out",
  scrollTrigger: {
    trigger: "#motion-graphics",
    start: "top 80%",
    end: "top 20%",
    scrub: true,
  }
});

gsap.fromTo(".texto-derecha", { x: "100vw" }, {
  x: "0vw",
  duration: 1.5,
  ease: "power4.out",
  scrollTrigger: {
    trigger: "#motion-graphics",
    start: "top 80%",
    end: "top 20%",
    scrub: true,
  }
});

gsap.fromTo(
  "#campañas .campañass",
  { x: "-100vw" },
  {
    x: "0vw",
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#campañas",
      start: "top+=100px center",
      end: "top 20%",
      scrub: 1.5
    }
  }
);

gsap.fromTo(
  "#campañas .publicitarias",
  { x: "100vw" },
  {
    x: "0vw",
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: {
      trigger: "#campañas",
      start: "top+=100px center",
      end: "top 20%",
      scrub: 1.5
    }
  }
);


// Carrusel de videos (arrastre)
const carousel = document.querySelector('.video-carousel');
let isDown = false, startX, scrollLeft;

carousel.addEventListener('mousedown', (e) => {
  isDown = true;
  carousel.classList.add('active');
  startX = e.pageX - carousel.offsetLeft;
  scrollLeft = carousel.scrollLeft;
});

carousel.addEventListener('mouseleave', () => {
  isDown = false;
  carousel.classList.remove('active');
});

carousel.addEventListener('mouseup', () => {
  isDown = false;
  carousel.classList.remove('active');
});

carousel.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - carousel.offsetLeft;
  const walk = (x - startX) * 1.5;
  carousel.scrollLeft = scrollLeft - walk;
});

// Hover activa sonido en videos
document.querySelectorAll('.video-item video').forEach(video => {
  const parent = video.parentElement;
  parent.addEventListener('mouseenter', () => {
    video.currentTime = 0;
    video.play();
  });
  parent.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0;
  });
});


// Frases WWW.CONTRAPUNTO scroll
const frases = gsap.utils.toArray(".frase");
const primeraFrase = frases[0];

gsap.to(primeraFrase, {
  y: 1900,
  ease: "none",
  scrollTrigger: {
    trigger: ".web-section",
    start: "top 0%",
    end: "bottom top",
    scrub: true,
  }
});

gsap.to(primeraFrase, {
  opacity: 0,
  scrollTrigger: {
    trigger: ".web-section",
    start: "bottom bottom",
    end: "bottom +=600",
    scrub: true,
  }
});

frases.slice(1).forEach((frase, i) => {
  gsap.to(frase, {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".web-section",
      start: () => "top+=" + (100 + i * 80) + " top",
      end: () => "top+=" + (100 + i * 50 + 20) + " top",
      scrub: true,
    }
  });
});

// Video sección WEB
const videoWeb = document.getElementById("video-web");
const playButtonWeb = document.getElementById("play-button-web");

playButtonWeb.addEventListener("click", () => {
  videoWeb.play().then(() => {
    playButtonWeb.style.display = "none";
    videoWeb.classList.add("zoomed");
  }).catch(e => console.error("No se pudo reproducir el video:", e));
});

videoWeb.addEventListener("click", () => {
  if (!videoWeb.paused) {
    videoWeb.pause();
    playButtonWeb.style.display = "flex";
    videoWeb.classList.remove("zoomed");
  }
});

// Video DG autoplay
const videodg = document.getElementById("video-dg");

ScrollTrigger.create({
  trigger: ".video-dg",
  start: "top center",
  onEnter: () => videodg.play(),
  onLeaveBack: () => videodg.pause(),
});


gsap.utils.toArray(".scroll-palabras").forEach((el, i) => {
  gsap.fromTo(el,
    { y: 400, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: "power3.out",
      duration: 1.5,
      stagger: 1, // 👈 delay entre palabras
      scrollTrigger: {
        trigger: ".contenedor-3d",
        start: "top center",
        toggleActions: "play none none reverse", // ✅ no scrub
      }
    }
  );
});

gsap.to(".img-3d-extra", {
  x: 0,
  opacity: 1,
  duration: 1.5,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".contenedor-3d",
    start: "top center",
    toggleActions: "play none none reverse", // ✅ no scrub
  }
});



const proyectos = [
  {
    video3d: "resource/videos/3d-compu.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@NERE_RUSSO",
    nombre: "COMPU CUTE",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/auto.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@MARTIINA.KS",
    nombre: "AUTO ANTIGUO",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/coser.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@RENII_PP",
    nombre: "MAQUINA DE COSER",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/van.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@MILISTAFFOLANI",
    nombre: "VAN",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/moto.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@MARTIINA.KS",
    nombre: "MOTO VINTAGE",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/kitty.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@RENII_PP",
    nombre: "HELLO KITTY ROBOT",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/ballena.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@NERE_RUSSO",
    nombre: "BALLENA",
    herramientas: "BLENDER, SUBSTANCE PAINTER y RIZOM"
  },
  {
    video3d: "resource/videos/conejo.mp4",
    imagen: "resource/images/codigo.png",
    autor: "@MILISTAFFOLANI",
    nombre: "CONEJO",
    herramientas: "BLENDER, SUBSTANCE PAINTER Y RIZOM"
  }
];



const video3d = document.getElementById("video3d");
const imagen = document.getElementById("imagen");
const autor = document.getElementById("autor");
const nombre = document.getElementById("nombre");
const herramientas = document.getElementById("herramientas");
let indexx = 0;
let cambiandoProyecto = false;

function actualizarProyecto(callback) {
  const p = proyectos[indexx];
  const contenidoActual = document.getElementById("marco");

  contenidoActual.innerHTML = `
    <div class="video-container">
      <video id="video-proyecto" src="${p.video3d}" muted loop playsinline></video>
    </div>
    <div class="bottom-section">
      <div class="col-izq">
        <img src="${p.imagen}" alt="autor" />
        <p class="autor">BY ${p.autor}</p>
      </div>
      <div class="col-der">
        <h3 class="nombre-proyecto">${p.nombre}</h3>
        <h3 class="titulo-herramientas">HERRAMIENTAS</h3>
        <span class="herramientas">${p.herramientas}</span>
      </div>
    </div>
  `;

  const nuevoVideo = document.getElementById("video-proyecto");
  nuevoVideo.load();

  // ✅ Cuando el video ya cargó
  nuevoVideo.addEventListener("loadeddata", () => {
    nuevoVideo.play();
    if (callback) callback(); // continuar solo cuando esté listo
  });
}

function cambiarProyecto(direccion) {
  if (cambiandoProyecto) return;
  cambiandoProyecto = true;

  const contenidoActual = document.getElementById("marco");

  gsap.to(contenidoActual, {
    x: direccion > 0 ? "-100%" : "100%",
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
    onComplete: () => {

      // ✅ Actualizamos indexx correctamente
      if (direccion > 0) {
        indexx++;
        if (indexx >= proyectos.length) indexx = 0;
      } else {
        indexx--;
        if (indexx < 0) indexx = proyectos.length - 1;
      }

      actualizarProyecto(() => {
        // ✅ Cuando el video cargó → animamos entrada
        gsap.set(contenidoActual, {
          x: direccion > 0 ? "100%" : "-100%",
          opacity: 0
        });

        gsap.to(contenidoActual, {
          x: "0%",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          onComplete: () => {
            cambiandoProyecto = false;
          }
        });
      });
    }
  });
}

// Inicializar al cargar la página
actualizarProyecto();
window.cambiarProyecto = cambiarProyecto;




const navDots = document.querySelectorAll(".nav-dot");
const triggerSections = document.querySelectorAll("[data-dot]");

triggerSections.forEach(section => {
  const dotIndex = section.getAttribute("data-dot") - 1;

  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activateDot(dotIndex),
    onEnterBack: () => activateDot(dotIndex)
  });
});

function activateDot(index) {
  navDots.forEach(dot => dot.classList.remove("active"));
  if (navDots[index]) {
    navDots[index].classList.add("active");
  }
}

window.addEventListener("load", () => {
  ScrollTrigger.refresh();

  setTimeout(() => {
    triggerSections.forEach((section, index) => {
      const bounds = section.getBoundingClientRect();
      if (bounds.top <= window.innerHeight / 2 && bounds.bottom >= window.innerHeight / 2) {
        activateDot(index);
      }
    });

    // ✅ Cuando ya está listo, mostrar el navbar
    document.querySelector('.navbar-secciones').classList.add('visible');

  }, 500);
});


  // Si hay una posición guardada, scroll automático
  window.addEventListener("DOMContentLoaded", () => {
    const savedScroll = localStorage.getItem("scrollY");
    if (savedScroll) {
      window.scrollTo({ top: parseInt(savedScroll), behavior: "smooth" });
      localStorage.removeItem("scrollY");
    }
  });

// Esperar hasta que ScrollSmoother esté listo y hacer scroll al destino
window.addEventListener("load", () => {
  const destino = localStorage.getItem("volverASeccion");

  if (destino && window.smoother && document.querySelector(destino)) {
    const intentarScroll = () => {
      if (smoother && typeof smoother.scrollTo === "function") {
        smoother.scrollTo(destino, true, "top top");
        localStorage.removeItem("volverASeccion");
      } else {
        requestAnimationFrame(intentarScroll);
      }
    };

    // Intentar después de un pequeño delay inicial
    setTimeout(() => {
      intentarScroll();
    }, 300);
  }
});

  
  
  



  
  
  





















