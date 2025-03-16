// Array para almacenar los productos cargados desde el JSON
let productos = [];

// Cargar los productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json()) // Convertir la respuesta a JSON
    .then(data => {
        productos = data; // Almacenar los productos en el array
        cargarProductos(productos); // Llamar a la función para cargar los productos en la página
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
                <p class="producto-descripcion">${producto.descripcion}</p> <!-- Nuevo campo -->
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div); // Agregar el producto al contenedor
    });

    actualizarBotonesAgregar(); // Actualizar los botones de agregar al carrito
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
        boton.addEventListener("click", agregarAlCarrito);
    });
}

// Array para almacenar los productos en el carrito
let productosEnCarrito;

// Obtener los productos del carrito desde el localStorage
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

// Si hay productos en el localStorage, cargarlos; de lo contrario, inicializar un array vacío
if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito(); // Actualizar el número de productos en el carrito
} else {
    productosEnCarrito = [];
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
    // Mostrar una notificación con Toastify
    Toastify({
        text: "Vehículo agregado",
        duration: 3000,
        close: true,
        gravity: "top", // Posición de la notificación
        position: "right", // Alineación de la notificación
        stopOnFocus: true, // Evitar que se cierre al hacer hover
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // Desplazamiento horizontal
            y: '1.5rem' // Desplazamiento vertical
        },
        onClick: function(){} // Callback al hacer clic en la notificación
    }).showToast();

    // Obtener el ID del producto agregado
    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    // Verificar si el producto ya está en el carrito
    if (productosEnCarrito.some(producto => producto.id === idBoton)) {
        // Si ya está, incrementar la cantidad
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        // Si no está, agregarlo al carrito con cantidad 1
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito(); // Actualizar el número de productos en el carrito

    // Guardar el carrito en el localStorage
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para actualizar el número de productos en el carrito
function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito; // Actualizar el texto del elemento
}

// Seleccionar el campo de búsqueda y el botón
const buscador = document.getElementById("buscador");
const botonBuscar = document.getElementById("boton-buscar");

// Función para buscar productos
function buscarProductos() {
    const textoBusqueda = buscador.value.toLowerCase().trim(); // Obtener el texto de búsqueda y normalizarlo

    if (textoBusqueda === "") {
        // Si el campo de búsqueda está vacío, mostrar todos los productos
        cargarProductos(productos);
        return;
    }

    // Filtrar los productos que coincidan con la búsqueda
    const productosFiltrados = productos.filter(producto => {
        const titulo = producto.titulo.toLowerCase();
        const descripcion = producto.descripcion ? producto.descripcion.toLowerCase() : ""; // Si no hay descripción, usar una cadena vacía

        // Verificar si el texto de búsqueda está en el título o en la descripción
        return titulo.includes(textoBusqueda) || descripcion.includes(textoBusqueda);
    });

    // Mostrar los productos filtrados
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