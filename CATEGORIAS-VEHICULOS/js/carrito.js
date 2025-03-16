// Obtener los productos del carrito desde el localStorage y convertirlos a un array
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito) || []; // Si no hay productos, inicializar como array vacío

// Seleccionar elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const modalContactos = document.querySelector("#contactos-modal");

// Función para cargar los productos en el carrito
function cargarProductosCarrito() {
    if (productosEnCarrito && productosEnCarrito.length > 0) {
        // Mostrar el carrito con productos
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        // Limpiar el contenedor de productos
        contenedorCarritoProductos.innerHTML = "";

        // Recorrer cada producto y crear su representación en el DOM
        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <div class="carrito-producto-descripcion">
                    <small>Descripción</small>
                    <p>${producto.descripcion}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });

        // Actualizar botones de eliminar y el total
        actualizarBotonesEliminar();
        actualizarTotal();
    } else {
        // Mostrar el carrito vacío
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Llamar a la función para cargar los productos en el carrito al iniciar
cargarProductosCarrito();

// Función para actualizar los botones de eliminar
function actualizarBotonesEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    // Mostrar notificación de producto eliminado
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #4b33a8, #785ce9)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        },
        onClick: function(){}
    }).showToast();

    // Obtener el ID del producto a eliminar
    const idBoton = e.currentTarget.id;
    const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);

    // Eliminar el producto del array
    productosEnCarrito.splice(index, 1);

    // Actualizar el carrito en la UI y en el localStorage
    cargarProductosCarrito();
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para vaciar el carrito
function vaciarCarrito() {
    // Mostrar alerta de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el array de productos
            productosEnCarrito.length = 0;

            // Actualizar el localStorage
            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            // Actualizar la UI del carrito
            cargarProductosCarrito();

            // Mostrar notificación de carrito vaciado
            Toastify({
                text: "Carrito vaciado correctamente",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #4b33a8, #785ce9)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: {
                    x: '1.5rem',
                    y: '1.5rem'
                },
                onClick: function(){}
            }).showToast();
        }
    });
}

// Agregar evento de clic al botón "Vaciar vehículos"
botonVaciar.addEventListener("click", vaciarCarrito);

// Función para actualizar el total de la compra
function actualizarTotal() {
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    total.innerText = `$${totalCalculado}`;
}

// Función para abrir el modal de contactos
botonComprar.addEventListener("click", () => {
    modalContactos.classList.remove("disabled");
});

// Función para cerrar el modal de contactos
modalContactos.addEventListener("click", (e) => {
    if (e.target === modalContactos) {
        modalContactos.classList.add("disabled");
    }
});

// Función para redirigir a WhatsApp
document.querySelectorAll(".contacto-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const contacto = btn.getAttribute("data-contacto");

        if (productosEnCarrito && productosEnCarrito.length > 0) {
            let mensaje = "¡Hola! Estoy interesado en los siguientes vehículos:\n\n";

            productosEnCarrito.forEach((producto, index) => {
                mensaje += `*Vehículo ${index + 1}:*\n`; // Cambiado de "Producto" a "Vehículo"
                mensaje += `- Nombre: ${producto.titulo}\n`;
                mensaje += `- Precio: $${producto.precio}\n`;
                mensaje += `- Cantidad: ${producto.cantidad}\n`;
                mensaje += `- Descripción: ${producto.descripcion}\n`;
            });

            mensaje += "¿Podrías darme más información? ¡Gracias!";

            const mensajeCodificado = encodeURIComponent(mensaje);
            const url = `https://wa.me/${contacto}?text=${mensajeCodificado}`;
            window.open(url, '_blank');
        } else {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No hay productos en el carrito.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
        }
    });
});