let productos = [];

async function cargarProductos() {
    try {
        const response = await fetch('./js/productos.json');
        if (!response.ok) {
            throw new Error(`Error al cargar el archivo JSON: ${response.status}`);
        }
        productos = await response.json();
        
        generarMarcasMenu(productos);
        mostrarProductos(productos);
        activarEventosFiltros();
        activarSedesRapidas();
        inicializarBuscador();
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        const contenedor = document.getElementById('contenedor-productos');
        if (contenedor) {
            contenedor.innerHTML = `<p style="color: #ef4444; text-align: center; grid-column: 1/-1; padding: 2rem;">Error al cargar el catálogo. Asegúrate de abrir el proyecto mediante un servidor local (Live Server).</p>`;
        }
    }
}

// Extraer la ubicación del objeto o por palabras clave en la ruta de imagen
function obtenerUbicacion(prod) {
    if (prod.ubicacion) return prod.ubicacion.toUpperCase();
    const rutaImagen = (prod.imagen || '').toLowerCase();
    if (rutaImagen.includes('otavalo')) return 'OTAVALO';
    if (rutaImagen.includes('quito')) return 'QUITO';
    return 'QUITO'; // Por defecto si no especifica
}

// Renderizar tarjetas de vehículos
function mostrarProductos(lista) {
    const contenedor = document.getElementById('contenedor-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--text-muted); text-align: center; grid-column: 1/-1; padding: 3rem;">No se encontraron vehículos que coincidan con la búsqueda.</p>';
        return;
    }

    lista.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        const precioFormateado = prod.precio 
            ? `$${Number(prod.precio).toLocaleString('en-US')}` 
            : 'Consultar';

        const ubicacion = obtenerUbicacion(prod);

        card.innerHTML = `
            <div class="producto-imagen-wrapper">
                <img src="${prod.imagen}" alt="${prod.titulo}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=GAVIL+MOTORS'">
                <span class="badge-cat">${prod.categoria?.nombre || 'Vehículo'}</span>
                <span class="badge-ubicacion"><i class="bi bi-geo-alt"></i> ${ubicacion}</span>
            </div>
            <div class="producto-info">
                <h3 class="producto-titulo">${prod.titulo}</h3>
                <div class="producto-specs">
                    <span><i class="bi bi-speedometer2"></i> ${prod.descripcion || 'Especificaciones estándar'}</span>
                </div>
                <div class="producto-footer">
                    <div class="precio-box">
                        <span class="precio-label">Precio</span>
                        <span class="precio-valor">${precioFormateado}</span>
                    </div>
                    <a href="${prod.urlDestino || '#'}" class="btn-informacion">
                        MÁS INFO <i class="bi bi-arrow-right-short"></i>
                    </a>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Generar solo la lista de marcas automáticamente desde el JSON
function generarMarcasMenu(lista) {
    const menuUl = document.getElementById('menu-marcas');
    if (!menuUl) return;

    const marcasMap = new Map();
    lista.forEach(item => {
        if (item.categoria && item.categoria.id) {
            const idUpper = item.categoria.id.toUpperCase();
            if (!idUpper.includes('VENDIDO') && !idUpper.includes('CHOCADO')) {
                marcasMap.set(item.categoria.id, item.categoria.nombre.toUpperCase());
            }
        }
    });

    let htmlMarcas = '';
    marcasMap.forEach((nombre, id) => {
        htmlMarcas += `
            <li>
                <button id="${id}" class="boton-menu boton-categoria">
                    <i class="bi bi-chevron-right"></i> ${nombre}
                </button>
            </li>
        `;
    });

    menuUl.innerHTML = htmlMarcas;
}

// Manejo de clics de filtro en la barra lateral
function activarEventosFiltros() {
    const todosLosBotones = document.querySelectorAll('.boton-menu');
    const tituloPrincipal = document.getElementById('titulo-principal');

    todosLosBotones.forEach(boton => {
        boton.addEventListener('click', () => {
            todosLosBotones.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');

            // Resetear visualmente los botones de sede rápida si se elige un filtro lateral
            document.querySelectorAll('.btn-sede').forEach(b => b.classList.remove('active'));

            const idBtn = boton.id.toLowerCase();
            const textoBtn = boton.innerText.trim();

            if (idBtn === 'todos') {
                if (tituloPrincipal) tituloPrincipal.innerText = 'Todos los productos';
                document.querySelector('.btn-sede[data-sede="todos"]')?.classList.add('active');
                mostrarProductos(productos);
            } else {
                if (tituloPrincipal) tituloPrincipal.innerText = textoBtn;
                const filtrados = productos.filter(p => {
                    const catId = p.categoria?.id?.toLowerCase() || '';
                    const catNombre = p.categoria?.nombre?.toLowerCase() || '';
                    return catId === idBtn || catNombre === idBtn || catId.includes(idBtn);
                });
                mostrarProductos(filtrados);
            }

            // Cerrar menú automático en móviles al hacer clic
            const aside = document.getElementById('aside-menu');
            if (aside) {
                aside.classList.remove('active');
            }
        });
    });
}

// Filtro rápido de sedes (Todos, Quito, Otavalo) debajo del buscador
function activarSedesRapidas() {
    const botonesSede = document.querySelectorAll('.btn-sede');
    const tituloPrincipal = document.getElementById('titulo-principal');

    botonesSede.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesSede.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Sincronizar selección con la barra lateral
            document.querySelectorAll('.boton-menu').forEach(b => b.classList.remove('active'));

            const sede = btn.getAttribute('data-sede');

            if (sede === 'todos') {
                if (tituloPrincipal) tituloPrincipal.innerText = 'Todos los productos';
                document.getElementById('todos')?.classList.add('active');
                mostrarProductos(productos);
            } else {
                const nombreSede = sede.charAt(0).toUpperCase() + sede.slice(1);
                if (tituloPrincipal) tituloPrincipal.innerText = `Vehículos en ${nombreSede}`;
                
                const filtrados = productos.filter(p => obtenerUbicacion(p).toLowerCase() === sede);
                mostrarProductos(filtrados);
            }
        });
    });
}

// Configurar el buscador de texto en tiempo real
function inicializarBuscador() {
    const inputBuscar = document.getElementById('buscador');
    const btnBuscar = document.getElementById('boton-buscar');

    const realizarBusqueda = () => {
        const query = inputBuscar.value.toLowerCase().trim();
        const filtrados = productos.filter(p => 
            p.titulo.toLowerCase().includes(query) || 
            (p.descripcion && p.descripcion.toLowerCase().includes(query)) ||
            (p.categoria?.nombre && p.categoria.nombre.toLowerCase().includes(query)) ||
            obtenerUbicacion(p).toLowerCase().includes(query)
        );
        mostrarProductos(filtrados);
    };

    if (inputBuscar) {
        inputBuscar.addEventListener('input', realizarBusqueda);
    }
    if (btnBuscar) {
        btnBuscar.addEventListener('click', realizarBusqueda);
    }
}

document.addEventListener('DOMContentLoaded', cargarProductos);