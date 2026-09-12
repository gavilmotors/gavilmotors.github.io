/* Mobile Navigation Toggle */
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

/* Modal Helpers */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
    }
}

/* Image Carousel Logic */
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const thumbs = document.querySelectorAll('.thumb-btn');
const slideNumDisplay = document.getElementById('current-slide-num');

function updateCarousel() {
    slides.forEach((slide, idx) => {
        if (idx === currentSlide) {
            slide.classList.remove('opacity-0', 'pointer-events-none');
            slide.classList.add('opacity-100');
        } else {
            slide.classList.remove('opacity-100');
            slide.classList.add('opacity-0', 'pointer-events-none');
        }
    });

    thumbs.forEach((thumb, idx) => {
        if (idx === currentSlide) {
            thumb.classList.remove('border-transparent', 'opacity-60');
            thumb.classList.add('border-brand-red', 'opacity-100');
        } else {
            thumb.classList.remove('border-brand-red', 'opacity-100');
            thumb.classList.add('border-transparent', 'opacity-60');
        }
    });

    if (slideNumDisplay) {
        slideNumDisplay.textContent = currentSlide + 1;
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

document.addEventListener('DOMContentLoaded', updateCarousel);

/* Mobile Video Safety Initialization */
document.addEventListener("DOMContentLoaded", function() {
    const mainVideo = document.getElementById("main-cinema-video");
    if (mainVideo) {
        mainVideo.muted = true;
        mainVideo.setAttribute('playsinline', '');
    }
});

/* Dynamic Cinema Video Aspect Ratio Switcher */
function setVideoRatio(ratio) {
    const cinemaContainer = document.getElementById('cinema-container');
    const btn169 = document.getElementById('btn-ratio-16-9');
    const btn916 = document.getElementById('btn-ratio-9-16');
    const badgeText = document.getElementById('badge-ratio-text');

    if (ratio === '9-16') {
        cinemaContainer.classList.remove('video-wrapper-16-9');
        cinemaContainer.classList.add('video-wrapper-9-16');

        btn916.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-red transition-all flex items-center gap-1.5 shadow-md";
        btn169.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-all flex items-center gap-1.5";

        if (badgeText) badgeText.textContent = "Modo Vertical 9:16 (Reel)";
    } else {
        cinemaContainer.classList.remove('video-wrapper-9-16');
        cinemaContainer.classList.add('video-wrapper-16-9');

        btn169.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-red transition-all flex items-center gap-1.5 shadow-md";
        btn916.className = "px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-white transition-all flex items-center gap-1.5";

        if (badgeText) badgeText.textContent = "Modo Horizontal 16:9";
    }
}

/* Password Verification Flow */
document.addEventListener('DOMContentLoaded', () => {
    const btnAcceso = document.getElementById('btnAcceso');
    if (btnAcceso) {
        btnAcceso.addEventListener('click', function(e) {
            e.preventDefault();
            
            const claveCorrecta = "gavilmotors";
            const claveIngresada = prompt("🔒 ACCESO AL SISTEMA LEGAL VEHICULAR\nIngrese la clave de autorización:");
            
            if (claveIngresada === claveCorrecta) {
                const alerta = document.createElement('div');
                alerta.id = 'alerta-temporal';
                alerta.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md";
                
                alerta.innerHTML = `
                    <div class="glass-panel max-w-md w-full rounded-3xl p-6 border-2 border-amber-500 text-center space-y-4 shadow-2xl">
                        <div class="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 text-3xl flex items-center justify-center mx-auto border border-amber-500/40">
                            ⚠️
                        </div>
                        <h3 class="font-display font-extrabold text-xl text-amber-400">VERIFICACIÓN REQUERIDA</h3>
                        <p class="text-xs text-gray-300 leading-relaxed">
                            Antes de mencionar valores de matrícula, <strong>verifique transferencia de dominio</strong> ya que el valor de deuda puede variar.
                        </p>
                        <div id="cuenta-regresiva" class="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-extrabold text-2xl flex items-center justify-center mx-auto">
                            5
                        </div>
                        <p class="text-[11px] text-gray-400">El reporte legal se abrirá en <span id="segundos-texto" class="text-white font-bold">5</span> segundos</p>
                    </div>
                `;
                
                document.body.appendChild(alerta);
                
                let segundos = 5;
                const cuentaRegresiva = setInterval(() => {
                    segundos--;
                    const counterElem = document.getElementById('cuenta-regresiva');
                    const textElem = document.getElementById('segundos-texto');
                    
                    if (counterElem) counterElem.textContent = segundos;
                    if (textElem) textElem.textContent = segundos;
                    
                    if(segundos <= 3 && counterElem) {
                        counterElem.classList.remove('bg-amber-500/20', 'text-amber-400', 'border-amber-500/40');
                        counterElem.classList.add('bg-red-500/20', 'text-red-500', 'border-red-500/40');
                    }
                    
                    if(segundos <= 0) {
                        clearInterval(cuentaRegresiva);
                        const alertaElement = document.getElementById('alerta-temporal');
                        if(alertaElement) {
                            document.body.removeChild(alertaElement);
                        }
                        
                        const fechaActual = new Date().toLocaleDateString('es-EC', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        
                        const fechaElem = document.getElementById('fecha-actual');
                        if(fechaElem) fechaElem.textContent = fechaActual;
                        
                        openModal('modal-pendientes');
                    }
                }, 1000);
                
            } else if (claveIngresada !== null) {
                alert("❌ ERROR: Clave incorrecta\nAcceso denegado");
            }
        });
    }
});