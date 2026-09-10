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
  const [mostrarAvisoDomicilio, setMostrarAvisoDomicilio] = useState(false);

  const [direccion, setDireccion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  // =========================================
  // FORMA DE PAGO
  // =========================================

  const [formaPago, setFormaPago] = useState("efectivo");

  // =========================================
  // CONFIGURACIÓN DEL NEGOCIO DESDE FIREBASE
  // =========================================

  const [costoEnvio, setCostoEnvio] = useState(0);
  const [modoNegocio, setModoNegocio] = useState("automatico");
  const [horaApertura, setHoraApertura] = useState("07:00");
  const [horaCierre, setHoraCierre] = useState("19:00");
  const [diasAbiertos, setDiasAbiertos] = useState([1, 2, 3, 4, 5, 6]);
  const [relojHorario, setRelojHorario] = useState(Date.now());

  useEffect(() => {
    const referenciaConfiguracion = doc(db, "configuracion", "negocio");

    const cancelarSuscripcion = onSnapshot(
      referenciaConfiguracion,
      (documento) => {
        if (documento.exists()) {
          const datos = documento.data();
          const costo = Number(datos.costoEnvio);

          setCostoEnvio(Number.isFinite(costo) ? costo : 0);

          // Compatibilidad con el cierre manual anterior
          if (datos.modoNegocio) {
            setModoNegocio(datos.modoNegocio);
          } else if (datos.cerradoManual === true) {
            setModoNegocio("cerrado");
          } else {
            setModoNegocio("automatico");
          }

          setHoraApertura(datos.horaApertura || "07:00");
          setHoraCierre(datos.horaCierre || "19:00");
          setDiasAbiertos(
            Array.isArray(datos.diasAbiertos)
              ? datos.diasAbiertos.map(Number)
              : [1, 2, 3, 4, 5, 6],
          );
        }
      },
      (error) => {
        console.error("Error al leer configuración del negocio:", error);
      },
    );

    return () => cancelarSuscripcion();
  }, []);

  // Actualiza el estado del horario sin necesidad de recargar la app
  useEffect(() => {
    const intervalo = setInterval(() => {
      setRelojHorario(Date.now());
    }, 30000);

    return () => clearInterval(intervalo);
  }, []);

  const nombresDias = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
  };

  const convertirHoraAMPM = (hora24) => {
    const [horaTexto, minutoTexto] = (hora24 || "00:00").split(":");
    const hora = Number(horaTexto);
    const minuto = minutoTexto || "00";
    const periodo = hora >= 12 ? "PM" : "AM";
    const hora12 = hora % 12 || 12;
    return `${hora12}:${minuto} ${periodo}`;
  };

  const horarioTexto =
    diasAbiertos.length > 0
      ? `${diasAbiertos
          .slice()
          .sort((a, b) => a - b)
          .map((dia) => nombresDias[dia])
          .join(
            ", ",
          )} • ${convertirHoraAMPM(horaApertura)} - ${convertirHoraAMPM(horaCierre)}`
      : "Sin días de apertura configurados";

  const obtenerEstadoNegocio = () => {
    // El administrador puede forzar abierto o cerrado sin importar día/hora.
    if (modoNegocio === "abierto") {
      return {
        abierto: true,
        motivo: "Abierto manualmente por administración",
        forzado: true,
      };
    }

    if (modoNegocio === "cerrado") {
      return {
        abierto: false,
        motivo: "Cerrado temporalmente por administración",
        forzado: true,
      };
    }

    const fecha = new Date(relojHorario);
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chihuahua",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(fecha);

    const valor = (tipo) =>
      partes.find((parte) => parte.type === tipo)?.value || "";

    const mapaDia = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    const diaActual = mapaDia[valor("weekday")];
    const horaActual = Number(valor("hour"));
    const minutoActual = Number(valor("minute"));
    const minutosActuales = horaActual * 60 + minutoActual;

    const [horaInicio, minutoInicio] = horaApertura.split(":").map(Number);
    const [horaFin, minutoFin] = horaCierre.split(":").map(Number);
    const minutosInicio = horaInicio * 60 + minutoInicio;
    const minutosFin = horaFin * 60 + minutoFin;

    const diaPermitido = diasAbiertos.includes(diaActual);
    const dentroDelHorario =
      minutosActuales >= minutosInicio && minutosActuales < minutosFin;

    if (!diaPermitido) {
      return {
        abierto: false,
        motivo: "Hoy no tenemos servicio según el horario configurado",
        forzado: false,
      };
    }

    if (!dentroDelHorario) {
      return {
        abierto: false,
        motivo: "Fuera del horario de servicio",
        forzado: false,
      };
    }

    return {
      abierto: true,
      motivo: "Abierto y recibiendo pedidos",
      forzado: false,
    };
  };

  const estadoNegocio = obtenerEstadoNegocio();
  const negocioAbierto = estadoNegocio.abierto;

  const mostrarAlertaCerrado = () => {
    alert(
      `🔴 MEZQUITE ESTÁ CERRADO

${estadoNegocio.motivo}.

Horario configurado:
${horarioTexto}`,
    );
  };

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
    if (!negocioAbierto) {
      mostrarAlertaCerrado();
      return;
    }

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
  // SELECCIONAR ENVÍO A DOMICILIO
  // =========================================

  const seleccionarEnvioDomicilio = () => {
    setTipoEntrega("domicilio");
    setMostrarAvisoDomicilio(true);
  };

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
    if (!negocioAbierto) {
      mostrarAlertaCerrado();
      return;
    }

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
      {showHome && (
        <div
          className={`estado-negocio ${
            negocioAbierto ? "estado-negocio-abierto" : "estado-negocio-cerrado"
          }`}
        >
          <div className="estado-negocio-contenido">
            <strong>{negocioAbierto ? "🟢 ABIERTO" : "🔴 CERRADO"}</strong>

            <span>Horario: {horarioTexto}</span>

            {modoNegocio === "abierto" && (
              <span className="estado-negocio-motivo">
                Apertura manual activa por administración.
              </span>
            )}

            {!negocioAbierto && (
              <span className="estado-negocio-motivo">
                {estadoNegocio.motivo}. No estamos recibiendo pedidos en este
                momento.
              </span>
            )}
          </div>
        </div>
      )}

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
                      onClick={seleccionarEnvioDomicilio}
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

                <button
                  className="btn-whatsapp"
                  onClick={enviarWhatsApp}
                  disabled={!negocioAbierto}
                >
                  {negocioAbierto
                    ? "📱 Finalizar pedido"
                    : "🔴 Cerrado - No se reciben pedidos"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* =====================================
          AVISO DE COBERTURA A DOMICILIO
      ====================================== */}

      {mostrarAvisoDomicilio && (
        <div
          className="aviso-domicilio-fondo"
          onClick={() => setMostrarAvisoDomicilio(false)}
        >
          <div
            className="aviso-domicilio-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aviso-domicilio-icono">🛵</div>

            <h2>¡Importante!</h2>

            <p>
              Por el momento, nuestro servicio a domicilio está disponible
              únicamente en los{" "}
              <strong>poblados del municipio de Galeana.</strong>
            </p>

            <p className="aviso-domicilio-gracias">
              ¡Gracias por tu comprensión! 😊
            </p>

            <button
              type="button"
              className="btn-aviso-domicilio"
              onClick={() => setMostrarAvisoDomicilio(false)}
            >
              👍 Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
