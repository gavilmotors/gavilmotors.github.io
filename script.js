// Efecto Navbar al hacer scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Smooth Scroll para los enlaces
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animación de contador para las especificaciones (ejemplo)
function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Lanzar animaciones cuando el elemento es visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Ejemplo: animar contador de autos vendidos
            // animateValue('autos-vendidos', 0, 1243, 2000);
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Clona los elementos para un efecto infinito perfecto
document.addEventListener('DOMContentLoaded', () => {
    const marquesina = document.querySelector('.marquesina-contenido');
    if (marquesina) {
        // Clonamos el contenido original
        marquesina.innerHTML += marquesina.innerHTML;
    }
});

// Video de fondo alternativo si no soporta autoplay
const videoBg = document.getElementById('video-bg');
if (videoBg) {
    videoBg.play().catch(error => {
        // Si el autoplay falla, mostrar imagen de fondo
        document.querySelector('.hero').style.background = 'url("assets/images/hero-fallback.jpg") center/cover';
        videoBg.style.display = 'none';
    });
}