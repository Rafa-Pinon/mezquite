import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logosinfondo.png";
import Home from "./components/menu";
import Menubebidas from "./components/menubebidas";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [showHome, setShowHome] = useState(false);
  const [showBebidas, setShowBebidas] = useState(false);

  // =========================================
  // CARRITO
  // =========================================

  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // =========================================
  // ANIMACIONES
  // =========================================

  const [animacionCarrito, setAnimacionCarrito] = useState(null);
  const [carritoAnimado, setCarritoAnimado] = useState(false);

  // =========================================
  // DATOS DEL CLIENTE
  // =========================================

  const [nombreCliente, setNombreCliente] = useState("");
  const [tipoEntrega, setTipoEntrega] = useState("recoger");

  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  // =========================================
  // FORMA DE PAGO
  // =========================================

  const [formaPago, setFormaPago] = useState("efectivo");

  // =========================================
  // COSTO DE ENVÍO DESDE FIREBASE
  // =========================================

  const [costoEnvio, setCostoEnvio] = useState(0);

  useEffect(() => {
    const referenciaConfiguracion = doc(db, "configuracion", "negocio");

    const cancelarSuscripcion = onSnapshot(
      referenciaConfiguracion,
      (documento) => {
        if (documento.exists()) {
          const datos = documento.data();

          const costo = Number(datos.costoEnvio);

          setCostoEnvio(Number.isFinite(costo) ? costo : 0);
        } else {
          setCostoEnvio(0);
        }
      },
      (error) => {
        console.error("Error al leer costo de envío:", error);

        setCostoEnvio(0);
      },
    );

    return () => cancelarSuscripcion();
  }, []);

  // =========================================
  // ABRIR MENÚ
  // =========================================

  const handleLogoClick = () => {
    setShowHome(true);
  };

  // =========================================
  // BEBIDAS
  // =========================================

  const handleBebidasClick = () => {
    setShowBebidas(true);
  };

  // =========================================
  // COMIDAS
  // =========================================

  const handleComidasClick = () => {
    setShowBebidas(false);
    setShowHome(true);
  };

  // =========================================
  // AGREGAR AL CARRITO
  // =========================================

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

  // =========================================
  // AUMENTAR CANTIDAD
  // =========================================

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

  // =========================================
  // DISMINUIR CANTIDAD
  // =========================================

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

  // =========================================
  // ELIMINAR PRODUCTO
  // =========================================

  const eliminarProducto = (idProducto) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.idProducto !== idProducto),
    );
  };

  // =========================================
  // SUBTOTAL DE PRODUCTOS
  // =========================================

  const subtotal = carrito.reduce(
    (suma, item) => suma + Number(item.precio) * item.cantidad,
    0,
  );

  // =========================================
  // ENVÍO A COBRAR
  // =========================================

  const envio = tipoEntrega === "domicilio" ? costoEnvio : 0;

  // =========================================
  // TOTAL FINAL
  // =========================================

  const total = subtotal + envio;

  // =========================================
  // CANTIDAD TOTAL
  // =========================================

  const cantidadProductos = carrito.reduce(
    (suma, item) => suma + item.cantidad,
    0,
  );

  // =========================================
  // OBTENER UBICACIÓN ACTUAL
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

    // WHATSAPP DEL NEGOCIO
    const numeroWhatsApp = "526361011255";

    let mensaje = "🍔 *NUEVO PEDIDO - MEZQUITE* 🍔\n\n";

    // =========================================
    // CLIENTE
    // =========================================

    mensaje += "👤 *CLIENTE*\n";
    mensaje += nombreCliente.trim() + "\n\n";

    // =========================================
    // TIPO DE ENTREGA
    // =========================================

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

    // =========================================
    // FORMA DE PAGO
    // =========================================

    mensaje += "💳 *FORMA DE PAGO*\n";

    if (formaPago === "efectivo") {
      mensaje += "💵 Efectivo\n\n";
    }

    if (formaPago === "tarjeta") {
      mensaje += "💳 Tarjeta\n\n";
    }

    // =========================================
    // PRODUCTOS
    // =========================================

    mensaje += "🛒 *PEDIDO*\n\n";

    carrito.forEach((item) => {
      mensaje += "*" + item.cantidad + " x " + item.nombre + "*\n";

      mensaje += "Precio: $" + item.precio + " c/u\n";

      if (item.ingredientesQuitados && item.ingredientesQuitados.length > 0) {
        mensaje += "❌ Sin: " + item.ingredientesQuitados.join(", ") + "\n";
      }

      mensaje += "Subtotal: $" + Number(item.precio) * item.cantidad + "\n\n";
    });

    // =========================================
    // RESUMEN DE COBRO
    // =========================================

    mensaje += "💵 *RESUMEN DE COBRO*\n";

    mensaje += "Subtotal: $" + subtotal + "\n";

    if (tipoEntrega === "domicilio") {
      mensaje += "Envío: $" + envio + "\n";
    } else {
      mensaje += "Envío: $0\n";
    }

    mensaje += "💰 *TOTAL: $" + total + "*\n\n";

    // =========================================
    // INFORMACIÓN
    // =========================================

    mensaje += "⏰ *INFORMACIÓN*\n";

    mensaje += "Tu pedido estará listo en aproximadamente 1 hora.\n";

    if (tipoEntrega === "recoger") {
      mensaje += "🏪 Recoger en Tienda Abarrotes Angostura.\n";
    }

    if (tipoEntrega === "domicilio") {
      mensaje += "🛵 Costo de envío incluido: $" + envio + ".\n";
    }

    if (formaPago === "efectivo") {
      mensaje += "💵 Forma de pago: Efectivo.";
    }

    if (formaPago === "tarjeta") {
      mensaje += "💳 Forma de pago: Tarjeta.";
    }

    // =========================================
    // ABRIR WHATSAPP
    // =========================================

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
          CARRITO FLOTANTE
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
          PRODUCTO VOLANDO
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
                {/* =====================================
                    PRODUCTOS
                ====================================== */}

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
                        ${Number(item.precio) * item.cantidad}
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

                {/* =====================================
                    RESUMEN DE COBRO
                ====================================== */}

                <div className="carrito-total">
                  <span>Subtotal</span>

                  <strong>${subtotal}</strong>
                </div>

                <div className="carrito-total">
                  <span>Envío</span>

                  <strong>${envio}</strong>
                </div>

                <div className="carrito-total">
                  <span>Total</span>

                  <strong>${total}</strong>
                </div>

                {/* =====================================
                    DATOS DEL CLIENTE
                ====================================== */}

                <div className="datos-cliente">
                  <h3>👤 Datos para finalizar tu pedido</h3>

                  <label>Nombre completo</label>

                  <input
                    type="text"
                    placeholder="Escribe tu nombre completo"
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                  />

                  {/* =================================
                      ENTREGA
                  ================================== */}

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

                  {/* =================================
                      DATOS DE DOMICILIO
                  ================================== */}

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
                        🛵 Costo de envío:
                        <strong> ${costoEnvio}</strong>
                      </p>
                    </div>
                  )}

                  {/* =================================
                      FORMA DE PAGO
                  ================================== */}

                  <div className="forma-pago">
                    <h4>¿Cómo deseas pagar?</h4>

                    <div className="opciones-entrega">
                      <button
                        type="button"
                        className={
                          formaPago === "efectivo"
                            ? "opcion-entrega activa"
                            : "opcion-entrega"
                        }
                        onClick={() => setFormaPago("efectivo")}
                      >
                        💵 Efectivo
                      </button>

                      <button
                        type="button"
                        className={
                          formaPago === "tarjeta"
                            ? "opcion-entrega activa"
                            : "opcion-entrega"
                        }
                        onClick={() => setFormaPago("tarjeta")}
                      >
                        💳 Tarjeta
                      </button>
                    </div>
                  </div>
                </div>

                {/* =====================================
                    AVISO
                ====================================== */}

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
                        Envío:
                        <strong> $0</strong>
                      </p>
                    </>
                  )}

                  {tipoEntrega === "domicilio" && (
                    <>
                      <p>
                        🛵 Costo de envío:
                        <strong> ${envio}</strong>
                      </p>

                      <p>
                        Total con envío:
                        <strong> ${total}</strong>
                      </p>
                    </>
                  )}

                  <p>
                    {formaPago === "efectivo"
                      ? "💵 Forma de pago seleccionada: Efectivo."
                      : "💳 Forma de pago seleccionada: Tarjeta."}
                  </p>
                </div>

                {/* =====================================
                    FINALIZAR
                ====================================== */}

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
