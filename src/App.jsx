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

  // ANIMACIONES
  const [animacionCarrito, setAnimacionCarrito] = useState(null);
  const [carritoAnimado, setCarritoAnimado] = useState(false);

  // DATOS DEL CLIENTE
  const [nombreCliente, setNombreCliente] = useState("");

  // "recoger" o "domicilio"
  const [tipoEntrega, setTipoEntrega] = useState("recoger");

  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  // ABRIR MENU
  const handleLogoClick = () => {
    setShowHome(true);
  };

  // BEBIDAS
  const handleBebidasClick = () => {
    setShowBebidas(true);
  };

  // COMIDAS
  const handleComidasClick = () => {
    setShowBebidas(false);
    setShowHome(true);
  };

  // AGREGAR AL CARRITO
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

    // PRODUCTO VOLANDO
    setAnimacionCarrito({
      imagen: producto.imagen,
      nombre: producto.nombre,
    });

    // CARRITO BRINCA
    setCarritoAnimado(true);

    setTimeout(() => {
      setCarritoAnimado(false);
    }, 600);

    setTimeout(() => {
      setAnimacionCarrito(null);
    }, 900);
  };

  // AUMENTAR
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

  // DISMINUIR
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

  // ELIMINAR
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

  // CANTIDAD TOTAL
  const cantidadProductos = carrito.reduce(
    (suma, item) => suma + item.cantidad,
    0,
  );

  // =========================================
  // OBTENER UBICACION ACTUAL
  // =========================================

  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      alert("Tu dispositivo no permite obtener la ubicación.");
      return;
    }

    setObteniendoUbicacion(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitud = position.coords.latitude;

        const longitud = position.coords.longitude;

        const enlaceMaps =
          "https://www.google.com/maps?q=" + latitud + "," + longitud;

        setUbicacion(enlaceMaps);

        setObteniendoUbicacion(false);
      },

      (error) => {
        console.log(error);

        setObteniendoUbicacion(false);

        alert(
          "No se pudo obtener tu ubicación. Revisa que tengas activado el GPS y permite el acceso a la ubicación.",
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // =========================================
  // ENVIAR PEDIDO POR WHATSAPP
  // =========================================

  const enviarWhatsApp = () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    if (nombreCliente.trim() === "") {
      alert("Por favor escribe tu nombre completo.");
      return;
    }

    if (
      tipoEntrega === "domicilio" &&
      direccion.trim() === "" &&
      ubicacion === ""
    ) {
      alert(
        "Para envío a domicilio escribe tu dirección o comparte tu ubicación actual.",
      );
      return;
    }

    // CAMBIA ESTE NUMERO POR EL WHATSAPP REAL
    const numeroWhatsApp = "526361011255";

    let mensaje = "🍔 *NUEVO PEDIDO - MEZQUITE* 🍔\n\n";

    // CLIENTE
    mensaje += "👤 *CLIENTE*\n";

    mensaje += nombreCliente.trim() + "\n\n";

    // TIPO DE ENTREGA
    mensaje += "📦 *TIPO DE ENTREGA*\n";

    if (tipoEntrega === "recoger") {
      mensaje += "🏪 Recoger en Tienda Abarrotes Angostura\n\n";
    }

    if (tipoEntrega === "domicilio") {
      mensaje += "🛵 Envío a domicilio\n";

      if (direccion.trim() !== "") {
        mensaje += "🏠 Dirección: " + direccion.trim() + "\n";
      }

      if (ubicacion !== "") {
        mensaje += "📍 Ubicación:\n" + ubicacion + "\n";
      }

      mensaje += "\n";
    }

    // PRODUCTOS
    mensaje += "🛒 *PEDIDO*\n\n";

    carrito.forEach((item) => {
      mensaje += "*" + item.cantidad + " x " + item.nombre + "*\n";

      mensaje += "Precio: $" + item.precio + "\n";

      if (item.ingredientesQuitados && item.ingredientesQuitados.length > 0) {
        mensaje += "❌ Sin: " + item.ingredientesQuitados.join(", ") + "\n";
      }

      mensaje += "Subtotal: $" + item.precio * item.cantidad + "\n\n";
    });

    // TOTAL
    mensaje += "💰 *TOTAL: $" + total + "*\n\n";

    // INFORMACION
    mensaje += "⏰ *INFORMACIÓN*\n";

    mensaje += "Tu pedido estará listo en aproximadamente 1 hora.\n";

    if (tipoEntrega === "recoger") {
      mensaje += "🏪 Recoger en Tienda Abarrotes Angostura.\n";

      mensaje += "💵💳 Pago en efectivo o con tarjeta.";
    }

    if (tipoEntrega === "domicilio") {
      mensaje += "🛵 El servicio a domicilio tendrá un costo de envío.";
    }

    const url =
      "https://wa.me/" +
      numeroWhatsApp +
      "?text=" +
      encodeURIComponent(mensaje);

    window.open(url, "_blank");
  };

  return (
    <div className="mezquite">
      {/* CARRITO FLOTANTE */}

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

      {/* PRODUCTO VOLANDO */}

      {animacionCarrito && (
        <div className="producto-volando">
          {animacionCarrito.imagen ? (
            <img src={animacionCarrito.imagen} alt={animacionCarrito.nombre} />
          ) : (
            <span>🍔</span>
          )}
        </div>
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
            style={{
              cursor: "pointer",
            }}
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
                {/* PRODUCTOS */}

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

                      {/* CANTIDAD */}

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

                {/* TOTAL */}

                <div className="carrito-total">
                  <span>Total</span>

                  <strong>${total}</strong>
                </div>

                {/* ==================================
                    DATOS DEL CLIENTE
                =================================== */}

                <div className="datos-cliente">
                  <h3>👤 Datos para finalizar tu pedido</h3>

                  <label>Nombre completo</label>

                  <input
                    type="text"
                    placeholder="Escribe tu nombre completo"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                  />

                  {/* ENTREGA */}

                  <h4>¿Cómo deseas recibir tu pedido?</h4>

                  <div className="opciones-entrega">
                    <button
                      type="button"
                      className={
                        tipoEntrega === "recoger"
                          ? "opcion-entrega activa"
                          : "opcion-entrega"
                      }
                      onClick={() => setTipoEntrega("recoger")}
                    >
                      🏪 Recoger en tienda
                    </button>

                    <button
                      type="button"
                      className={
                        tipoEntrega === "domicilio"
                          ? "opcion-entrega activa"
                          : "opcion-entrega"
                      }
                      onClick={() => setTipoEntrega("domicilio")}
                    >
                      🛵 Envío a domicilio
                    </button>
                  </div>

                  {/* DATOS DE DOMICILIO */}

                  {tipoEntrega === "domicilio" && (
                    <div className="datos-domicilio">
                      <label>Dirección de entrega</label>

                      <textarea
                        placeholder="Ejemplo: Calle, número, colonia, referencias..."
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                      />

                      <div className="separador-ubicacion">
                        <span>O</span>
                      </div>

                      <button
                        type="button"
                        className="btn-ubicacion"
                        onClick={obtenerUbicacionActual}
                      >
                        {obteniendoUbicacion
                          ? "📍 Obteniendo ubicación..."
                          : ubicacion
                            ? "✅ Ubicación agregada"
                            : "📍 Usar mi ubicación actual"}
                      </button>

                      {ubicacion && (
                        <p className="ubicacion-correcta">
                          ✅ Tu ubicación se enviará junto con el pedido.
                        </p>
                      )}

                      <p className="costo-envio">
                        🛵 El servicio a domicilio tendrá un costo adicional de
                        envío.
                      </p>
                    </div>
                  )}
                </div>

                {/* AVISO */}

                <div className="aviso-carrito">
                  <h3>⏰ ¡Importante!</h3>

                  <p>
                    Tu pedido estará listo en aproximadamente
                    <strong> 1 hora.</strong>
                  </p>

                  {tipoEntrega === "recoger" && (
                    <>
                      <p>
                        🏪 Puedes pasar a recogerlo en
                        <strong> Tienda Abarrotes Angostura.</strong>
                      </p>

                      <p>
                        💵💳 Puedes pagar en{" "}
                        <strong>efectivo o con tarjeta</strong> al recoger tu
                        pedido.
                      </p>
                    </>
                  )}

                  {tipoEntrega === "domicilio" && (
                    <p>
                      🛵 El servicio a domicilio tendrá un{" "}
                      <strong>costo adicional de envío.</strong>
                    </p>
                  )}
                </div>

                {/* FINALIZAR */}

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
