import { useState } from "react";
import "./App.css";
import logo from "./assets/logosinfondo.png";
import Home from "./components/menu";
import Menubebidas from "./components/menubebidas";

function App() {
  const [showHome, setShowHome] = useState(false);
  const [showBebidas, setShowBebidas] = useState(false);

  // CARRITO
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // ANIMACION DEL PRODUCTO HACIA EL CARRITO
  const [animacionCarrito, setAnimacionCarrito] = useState(null);

  // ANIMACION DEL ICONO DEL CARRITO
  const [carritoAnimado, setCarritoAnimado] = useState(false);

  // ABRIR MENU DE COMIDAS
  const handleLogoClick = () => {
    setShowHome(true);
  };

  // ABRIR MENU DE BEBIDAS
  const handleBebidasClick = () => {
    setShowBebidas(true);
  };

  // REGRESAR AL MENU DE COMIDAS
  const handleComidasClick = () => {
    setShowBebidas(false);
    setShowHome(true);
  };

  // AGREGAR PRODUCTO AL CARRITO
  const agregarAlCarrito = (producto) => {
    const idProducto =
      producto.nombre + JSON.stringify(producto.ingredientesQuitados || []);

    setCarrito((carritoActual) => {
      const existente = carritoActual.find(
        (item) => item.idProducto === idProducto,
      );

      if (existente) {
        return carritoActual.map((item) =>
          item.idProducto === idProducto
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item,
        );
      }

      return [
        ...carritoActual,
        {
          ...producto,
          idProducto,
          cantidad: 1,
        },
      ];
    });

    // INICIA ANIMACION DEL PRODUCTO
    setAnimacionCarrito({
      imagen: producto.imagen,
      nombre: producto.nombre,
    });

    // HACE BRINCAR EL CARRITO
    setCarritoAnimado(true);

    setTimeout(() => {
      setCarritoAnimado(false);
    }, 600);

    // TERMINA ANIMACION DEL PRODUCTO
    setTimeout(() => {
      setAnimacionCarrito(null);
    }, 900);
  };

  // AUMENTAR CANTIDAD
  const aumentarCantidad = (idProducto) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.idProducto === idProducto
          ? {
              ...item,
              cantidad: item.cantidad + 1,
            }
          : item,
      ),
    );
  };

  // DISMINUIR CANTIDAD
  const disminuirCantidad = (idProducto) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item.idProducto === idProducto
            ? {
                ...item,
                cantidad: item.cantidad - 1,
              }
            : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  // ELIMINAR PRODUCTO
  const eliminarProducto = (idProducto) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.idProducto !== idProducto),
    );
  };

  // CALCULAR TOTAL
  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  // CONTADOR TOTAL DE PRODUCTOS
  const cantidadProductos = carrito.reduce(
    (suma, item) => suma + item.cantidad,
    0,
  );

  // ENVIAR PEDIDO POR WHATSAPP
  const enviarWhatsApp = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    // CAMBIA ESTE NUMERO POR EL WHATSAPP DE TU NEGOCIO
    const numeroWhatsApp = "526361234567";

    let mensaje = "🍔 *NUEVO PEDIDO - MEZQUITE* 🍔\n\n";

    carrito.forEach((item) => {
      mensaje += "*" + item.cantidad + " x " + item.nombre + "*\n";
      mensaje += "Precio: $" + item.precio + "\n";

      if (item.ingredientesQuitados && item.ingredientesQuitados.length > 0) {
        mensaje += "❌ Sin: " + item.ingredientesQuitados.join(", ") + "\n";
      }

      mensaje += "Subtotal: $" + item.precio * item.cantidad + "\n\n";
    });

    mensaje += "💰 *TOTAL: $" + total + "*\n\n";

    mensaje += "⏰ *IMPORTANTE*\n";
    mensaje += "Tu pedido estará listo en aproximadamente 1 hora.\n\n";

    mensaje += "🏪 Puedes recogerlo en Tienda Abarrotes Angostura.\n\n";

    mensaje += "💵💳 Puedes pagar en efectivo o con tarjeta.\n\n";

    mensaje += "🛵 Si deseas servicio a domicilio, se agregará costo de envío.";

    const url =
      "https://wa.me/" +
      numeroWhatsApp +
      "?text=" +
      encodeURIComponent(mensaje);

    window.open(url, "_blank");
  };
  return (
    <div className="mezquite">
      {/* =====================================
          BOTON FLOTANTE DEL CARRITO
      ====================================== */}

      {showHome && (
        <button
          className={`carrito-flotante ${
            carritoAnimado ? "carrito-recibe" : ""
          }`}
          onClick={() => setMostrarCarrito(true)}
        >
          🛒
          <span className="contador-carrito">{cantidadProductos}</span>
        </button>
      )}

      {/* =====================================
          PRODUCTO VOLANDO HACIA EL CARRITO
      ====================================== */}

      {animacionCarrito && (
        <div className="producto-volando">
          {animacionCarrito.imagen ? (
            <img src={animacionCarrito.imagen} alt={animacionCarrito.nombre} />
          ) : (
            <span>🍔</span>
          )}
        </div>
      )}

      {/* =====================================
          PANTALLAS
      ====================================== */}

      {showBebidas ? (
        <Menubebidas
          onComidasClick={handleComidasClick}
          onAgregarCarrito={agregarAlCarrito}
        />
      ) : showHome ? (
        <Home
          onBebidasClick={handleBebidasClick}
          onAgregarCarrito={agregarAlCarrito}
        />
      ) : (
        <div className="intro-section">
          <img
            src={logo}
            alt="Logo Mezquite"
            className="logo"
            onClick={handleLogoClick}
            style={{
              cursor: "pointer",
            }}
          />
        </div>
      )}

      {/* =====================================
          CARRITO
      ====================================== */}

      {mostrarCarrito && (
        <div className="carrito-fondo" onClick={() => setMostrarCarrito(false)}>
          <div className="carrito-panel" onClick={(e) => e.stopPropagation()}>
            {/* CERRAR CARRITO */}

            <button
              className="cerrar-carrito"
              onClick={() => setMostrarCarrito(false)}
            >
              ✕
            </button>

            <h2>🛒 Tu Pedido</h2>

            {/* CARRITO VACIO */}

            {carrito.length === 0 ? (
              <p className="carrito-vacio">Tu carrito está vacío</p>
            ) : (
              <>
                {/* PRODUCTOS */}

                <div className="productos-carrito">
                  {carrito.map((item) => (
                    <div className="producto-carrito" key={item.idProducto}>
                      {/* INFORMACION */}

                      <div className="producto-carrito-info">
                        <h3>{item.nombre}</h3>

                        <p>${item.precio} c/u</p>

                        {item.ingredientesQuitados &&
                          item.ingredientesQuitados.length > 0 && (
                            <p className="sin-ingredientes">
                              Sin: {item.ingredientesQuitados.join(", ")}
                            </p>
                          )}
                      </div>

                      {/* CANTIDADES */}

                      <div className="cantidad-controles">
                        <button
                          onClick={() => disminuirCantidad(item.idProducto)}
                        >
                          −
                        </button>

                        <span>{item.cantidad}</span>

                        <button
                          onClick={() => aumentarCantidad(item.idProducto)}
                        >
                          +
                        </button>
                      </div>

                      {/* SUBTOTAL */}

                      <strong className="subtotal-producto">
                        ${item.precio * item.cantidad}
                      </strong>

                      {/* ELIMINAR */}

                      <button
                        className="eliminar-producto"
                        onClick={() => eliminarProducto(item.idProducto)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}

                <div className="carrito-total">
                  <span>Total</span>

                  <strong>${total}</strong>
                </div>

                {/* AVISO IMPORTANTE */}

                <div className="aviso-carrito">
                  <h3>⏰ ¡Importante!</h3>

                  <p>
                    Tu pedido estará listo en aproximadamente
                    <strong> 1 hora.</strong>
                  </p>

                  <p>
                    🏪 Puedes pasar a recogerlo en
                    <strong> Tienda Abarrotes Angostura.</strong>
                  </p>

                  <p>
                    💵💳 Puedes pagar en <strong>efectivo o con tarjeta</strong>{" "}
                    al recoger tu pedido.
                  </p>

                  <p>
                    🛵 Si deseas <strong>servicio a domicilio</strong>, se
                    agregará un costo de envío.
                  </p>
                </div>

                {/* FINALIZAR PEDIDO */}

                <button className="btn-whatsapp" onClick={enviarWhatsApp}>
                  📱 Finalizar pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
