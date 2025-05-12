// Array para almacenar los productos cargados desde el JSON
let productos = [];

// Cargar los productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        // Filtra para excluir "VEHÍCULOS VENDIDOS" al inicio
        const productosIniciales = productos.filter(
            producto => producto.categoria.id !== ""
        );
        cargarProductos(productosIniciales);
    });

// Seleccionar elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos"); // Contenedor de productos
const botonesCategorias = document.querySelectorAll(".boton-categoria"); // Botones de categorías
const tituloPrincipal = document.querySelector("#titulo-principal"); // Título principal de la página
let botonesAgregar = document.querySelectorAll(".producto-agregar"); // Botones para agregar productos al carrito
const numerito = document.querySelector("#numerito"); // Elemento que muestra la cantidad de productos en el carrito

// Ocultar el menú lateral al hacer clic en un botón de categoría
botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}));

// Función para cargar los productos en el contenedor
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor de productos

    // Recorrer cada producto y crear su representación en el DOM
    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}" data-url="${producto.urlDestino}">Información</button>
            </div>
        `;
        contenedorProductos.append(div); // Agregar el producto al contenedor
    });

    actualizarBotonesAgregar(); // Actualizar los botones de agregar
}

// Manejar el clic en los botones de categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        // Remover la clase "active" de todos los botones
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        // Agregar la clase "active" al botón clickeado
        e.currentTarget.classList.add("active");

        // Filtrar productos por categoría
        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre; // Cambiar el título de la categoría
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton); // Cargar productos de la categoría seleccionada
        } else {
            tituloPrincipal.innerText = "Todos los productos"; // Mostrar todos los productos
            cargarProductos(productos);
        }
    });
});

// Función para actualizar los botones de agregar al carrito
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar"); // Seleccionar todos los botones de agregar

    // Agregar un evento de clic a cada botón
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", function (e) {
            const urlDestino = boton.getAttribute("data-url"); // Obtener la URL de redirección
            window.location.href = urlDestino; // Redirigir a la página específica
        });
    });
}

// Seleccionar el campo de búsqueda y el botón
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("boton-buscar");

// Función para buscar productos
function buscarProductos() {
    if (!productos.length) return; // Asegurar que los productos están cargados
    
    const textoBusqueda = buscador.value.toLowerCase().trim().normalize("NFD").replace(/[̀-ͯ]/g, "");

    console.log("Texto de búsqueda:", textoBusqueda); // Depuración

    if (textoBusqueda === "") {
        cargarProductos(productos);
        return;
    }

    const productosFiltrados = productos.filter(producto => {
        const titulo = producto.titulo.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
        const descripcion = producto.descripcion ? producto.descripcion.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") : "";

        return titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
    });

    console.log("Productos filtrados:", productosFiltrados); // Depuración

    cargarProductos(productosFiltrados);
}

// Escuchar el evento de clic en el botón de búsqueda
botonBuscar.addEventListener("click", buscarProductos);

// Escuchar el evento de presionar "Enter" en el campo de búsqueda
buscador.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        buscarProductos();
    }
});

// Función debounce para mejorar el rendimiento en búsquedas continuas
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}


// Escuchar el evento de entrada en el campo de búsqueda con debounce
buscador.addEventListener("input", debounce(buscarProductos, 300));
