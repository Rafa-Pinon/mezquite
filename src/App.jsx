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
  const [mostrarAvisoPedido, setMostrarAvisoPedido] = useState(false);
  const handleLogoClick = () => {
    setShowHome(true);
  };

  const handleBebidasClick = () => {
    setShowBebidas(true);
  };

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
  };

  // AUMENTAR CANTIDAD
  const aumentarCantidad = (idProducto) => {
    setCarrito((carritoActual) =>
      carritoActual.map((item) =>
        item.idProducto === idProducto
          ? { ...item, cantidad: item.cantidad + 1 }
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
            ? { ...item, cantidad: item.cantidad - 1 }
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

  // TOTAL
  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  // TOTAL DE PRODUCTOS
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

    // CAMBIA ESTE NUMERO POR EL NUMERO DE TU NEGOCIO
    // México: 52 + número de 10 dígitos
    const numeroWhatsApp = "526361011255";

    let mensaje = "🍔 *NUEVO PEDIDO* 🍔\n\n";

    carrito.forEach((item) => {
      mensaje += `*${item.cantidad} x ${item.nombre}*\n`;
      mensaje += `Precio: $${item.precio}\n`;

      if (item.ingredientesQuitados && item.ingredientesQuitados.length > 0) {
        mensaje += `❌ Sin: ${item.ingredientesQuitados.join(", ")}\n`;
      }

      mensaje += `Subtotal: $${item.precio * item.cantidad}\n\n`;
    });

    mensaje += `💰 *TOTAL: $${total}*`;

    const url =
      `https://wa.me/${numeroWhatsApp}?text=` + encodeURIComponent(mensaje);

    window.open(url, "_blank");
  };

  return (
    <div className="mezquite">
      {/* BOTON FLOTANTE DEL CARRITO */}

      {showHome && (
        <button
          className="carrito-flotante"
          onClick={() => setMostrarCarrito(true)}
        >
          🛒
          <span className="contador-carrito">{cantidadProductos}</span>
        </button>
      )}

      {/* PANTALLAS */}

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
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {/* CARRITO */}

      {mostrarCarrito && (
        <div className="carrito-fondo" onClick={() => setMostrarCarrito(false)}>
          <div className="carrito-panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="cerrar-carrito"
              onClick={() => setMostrarCarrito(false)}
            >
              ✕
            </button>

            <h2>🛒 Tu Pedido</h2>

            {carrito.length === 0 ? (
              <p className="carrito-vacio">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="productos-carrito">
                  {carrito.map((item) => (
                    <div className="producto-carrito" key={item.idProducto}>
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

                      <strong className="subtotal-producto">
                        ${item.precio * item.cantidad}
                      </strong>

                      <button
                        className="eliminar-producto"
                        onClick={() => eliminarProducto(item.idProducto)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>

                <div className="carrito-total">
                  <span>Total</span>
                  <strong>${total}</strong>
                </div>

                {/* INFORMACION IMPORTANTE DEL PEDIDO */}

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
                    💵💳 Puedes pagar en <strong>efectivo o con tarjeta</strong>
                    al recoger tu pedido.
                  </p>

                  <p>
                    🛵 Si deseas <strong>servicio a domicilio</strong>, se
                    agregará un costo de envío.
                  </p>
                </div>

                <button className="btn-whatsapp" onClick={enviarWhatsApp}>
                  📱 Finalizar pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {mostrarAvisoPedido && (
        <div className="aviso-fondo">
          <div className="aviso-pedido">
            <div className="aviso-icono">⏰</div>

            <h2>¡TU PEDIDO ESTARÁ LISTO EN 1 HORA!</h2>

            <p className="aviso-importante">
              Puedes pasar a recoger tu pedido en:
            </p>

            <h3>🏪 Tienda Abarrotes Angostura</h3>

            <div className="aviso-detalles">
              <p>
                💵 Puedes pagar en <strong>efectivo</strong>
              </p>

              <p>
                💳 También aceptamos pago con <strong>tarjeta</strong>
              </p>

              <p>
                🛵 Si deseas tu pedido a domicilio, se agregará un
                <strong> costo de envío</strong>.
              </p>
            </div>

            <button
              className="btn-entendido"
              onClick={() => {
                setMostrarAvisoPedido(false);
                enviarWhatsApp();
              }}
            >
              ✓ Entendido, continuar con mi pedido
            </button>

            <button
              className="btn-regresar-carrito"
              onClick={() => setMostrarAvisoPedido(false)}
            >
              ← Regresar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
