const images = document.querySelectorAll('.carrusel-img');
const prevBtn = document.querySelector('.carrusel-btn.prev');
const nextBtn = document.querySelector('.carrusel-btn.next');
let currentIndex = 0;

function showImage(index) {
    images.forEach((img, i) => {
        img.classList.remove('active');
        if (i === index) {
            img.classList.add('active');
        }
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    showImage(currentIndex);
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    showImage(currentIndex);
});

// Mostrar la primera imagen al cargar la página
showImage(currentIndex);

// Obtener elementos del DOM
const btnHorario = document.getElementById('btn-horario');
const btnContactos = document.getElementById('btn-contactos');
const modalHorario = document.getElementById('modal-horario');
const modalContactos = document.getElementById('modal-contactos');
const cerrarModal = document.querySelectorAll('.cerrar');

// Abrir modal de Horario
btnHorario.addEventListener('click', () => {
    modalHorario.style.display = 'flex';
});

// Abrir modal de Contactos
btnContactos.addEventListener('click', () => {
    modalContactos.style.display = 'flex';
});

// Cerrar modales
cerrarModal.forEach((cerrar) => {
    cerrar.addEventListener('click', () => {
        modalHorario.style.display = 'none';
        modalContactos.style.display = 'none';
    });
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    if (event.target === modalHorario) {
        modalHorario.style.display = 'none';
    }
    if (event.target === modalContactos) {
        modalContactos.style.display = 'none';
    }
});