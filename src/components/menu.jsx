import React, { useEffect, useRef, useState } from "react";
import "./menu.css";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../firebase";

const Home = ({ onBebidasClick, onAgregarCarrito }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(
    [],
  );

  const [hamburguesas, setHamburguesas] = useState([]);
  const [alitas, setAlitas] = useState([]);
  const [combos, setCombos] = useState([]);
  const [papas, setPapas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const hamburguesasRef = useRef(null);
  const alitasRef = useRef(null);
  const combosRef = useRef(null);
  const papasRef = useRef(null);

  const irASeccion = (referencia) => {
    referencia.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // =========================================
  // LEER PRODUCTOS DESDE FIRESTORE
  // =========================================

  useEffect(() => {
    const referencia = collection(db, "productos");

    const consultaHamburguesas = query(
      referencia,
      where("categoria", "==", "hamburguesas"),
    );

    const consultaAlitas = query(
      referencia,
      where("categoria", "==", "alitas"),
    );

    const consultaCombos = query(
      referencia,
      where("categoria", "==", "combos"),
    );

    const consultaPapas = query(referencia, where("categoria", "==", "papas"));

    const unsubscribeHamburguesas = onSnapshot(
      consultaHamburguesas,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setHamburguesas(lista);
        setCargando(false);
      },
    );

    const unsubscribeAlitas = onSnapshot(consultaAlitas, (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setAlitas(lista);
    });

    const unsubscribeCombos = onSnapshot(consultaCombos, (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setCombos(lista);
    });

    const unsubscribePapas = onSnapshot(consultaPapas, (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setPapas(lista);
    });

    return () => {
      unsubscribeHamburguesas();
      unsubscribeAlitas();
      unsubscribeCombos();
      unsubscribePapas();
    };
  }, []);

  // =========================================
  // ABRIR HAMBURGUESA
  // =========================================

  const abrirProducto = (producto) => {
    setProductoSeleccionado(producto);

    const ingredientesProducto = Array.isArray(producto.ingredientes)
      ? producto.ingredientes
      : [];

    setIngredientesSeleccionados(ingredientesProducto);
  };

  // =========================================
  // CAMBIAR INGREDIENTE
  // =========================================

  const cambiarIngrediente = (ingrediente) => {
    if (ingredientesSeleccionados.includes(ingrediente)) {
      setIngredientesSeleccionados(
        ingredientesSeleccionados.filter((item) => item !== ingrediente),
      );
    } else {
      setIngredientesSeleccionados([...ingredientesSeleccionados, ingrediente]);
    }
  };

  const cerrarProducto = () => {
    setProductoSeleccionado(null);
  };

  // =========================================
  // AGREGAR HAMBURGUESA PERSONALIZADA
  // =========================================

  const ordenarProducto = () => {
    if (!productoSeleccionado) return;

    const ingredientesProducto = Array.isArray(
      productoSeleccionado.ingredientes,
    )
      ? productoSeleccionado.ingredientes
      : [];

    const ingredientesQuitados = ingredientesProducto.filter(
      (ingrediente) => !ingredientesSeleccionados.includes(ingrediente),
    );

    const productoParaCarrito = {
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      imagen: productoSeleccionado.imagen,
      ingredientesQuitados,
    };

    onAgregarCarrito(productoParaCarrito);

    setProductoSeleccionado(null);
  };

  // =========================================
  // AGREGAR PRODUCTO SIMPLE
  // =========================================

  const agregarProductoSimple = (producto) => {
    onAgregarCarrito({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      categoria: producto.categoria || "",
      ingredientesQuitados: [],
    });
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Nuestro Menú</h1>
      </div>

      <div className="menu-nav-sticky">
        <div className="menu-nav-buttons">
          <button
            className="menu-nav-btn"
            onClick={() => irASeccion(hamburguesasRef)}
          >
            <span className="menu-nav-icon">🍔</span>
            <span>Hamburguesas</span>
          </button>

          <button
            className="menu-nav-btn"
            onClick={() => irASeccion(alitasRef)}
          >
            <span className="menu-nav-icon">🔥</span>
            <span>Alitas Y Boneless</span>
          </button>

          <button
            className="menu-nav-btn"
            onClick={() => irASeccion(combosRef)}
          >
            <span className="menu-nav-icon">🍟</span>
            <span>Combos</span>
          </button>

          <button className="menu-nav-btn" onClick={() => irASeccion(papasRef)}>
            <span className="menu-nav-icon">🍟</span>
            <span>Papas</span>
          </button>

          <button
            className="menu-nav-btn menu-nav-btn-bebidas"
            onClick={onBebidasClick}
          >
            <span className="menu-nav-icon">🥤</span>
            <span>Bebidas</span>
          </button>
        </div>
      </div>

      {cargando ? (
        <p>Cargando menú...</p>
      ) : (
        <>
          {/* =================================
              HAMBURGUESAS
          ================================= */}

          <h2
            ref={hamburguesasRef}
            className="section-title menu-scroll-target"
          >
            🍔 Hamburguesas
          </h2>

          <div className="cards-container">
            {hamburguesas.map((hamburguesa) => (
              <div
                className={`food-card hamburguesa-card ${
                  hamburguesa.disponible === false ? "producto-agotado" : ""
                }`}
                key={hamburguesa.id}
                onClick={() => {
                  if (hamburguesa.disponible !== false) {
                    abrirProducto(hamburguesa);
                  }
                }}
              >
                {hamburguesa.disponible === false && (
                  <div className="letrero-agotado">AGOTADO</div>
                )}

                {hamburguesa.imagen && (
                  <img src={hamburguesa.imagen} alt={hamburguesa.nombre} />
                )}

                <div className="food-info">
                  <h3>{hamburguesa.nombre}</h3>

                  <p>{hamburguesa.descripcion}</p>

                  <h4>${hamburguesa.precio}</h4>

                  <button
                    disabled={hamburguesa.disponible === false}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (hamburguesa.disponible !== false) {
                        abrirProducto(hamburguesa);
                      }
                    }}
                  >
                    {hamburguesa.disponible === false ? "Agotado" : "Ordenar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =================================
              ALITAS
          ================================= */}

          <h2
            ref={alitasRef}
            className="section-title wings-title menu-scroll-target"
          >
            🔥 Alitas Y Boneless
          </h2>

          <div className="cards-container">
            {alitas.map((alita) => (
              <div
                className={`food-card ${
                  alita.disponible === false ? "producto-agotado" : ""
                }`}
                key={alita.id}
              >
                {alita.disponible === false && (
                  <div className="letrero-agotado">AGOTADO</div>
                )}

                {alita.imagen && <img src={alita.imagen} alt={alita.nombre} />}

                <div className="food-info">
                  <h3>{alita.nombre}</h3>

                  <p>{alita.descripcion}</p>

                  <h4>${alita.precio}</h4>

                  <button
                    disabled={alita.disponible === false}
                    onClick={() => {
                      if (alita.disponible !== false) {
                        agregarProductoSimple(alita);
                      }
                    }}
                  >
                    {alita.disponible === false ? "Agotado" : "Ordenar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =================================
              PAPAS
          ================================= */}

          <h2 ref={papasRef} className="section-title menu-scroll-target">
            🍟 Papas
          </h2>

          <div className="cards-container">
            {papas.map((papa) => (
              <div
                className={`food-card ${
                  papa.disponible === false ? "producto-agotado" : ""
                }`}
                key={papa.id}
              >
                {papa.disponible === false && (
                  <div className="letrero-agotado">AGOTADO</div>
                )}

                {papa.imagen && <img src={papa.imagen} alt={papa.nombre} />}

                <div className="food-info">
                  <h3>{papa.nombre}</h3>

                  <p>{papa.descripcion}</p>

                  <h4>${papa.precio}</h4>

                  <button
                    disabled={papa.disponible === false}
                    onClick={() => {
                      if (papa.disponible !== false) {
                        agregarProductoSimple(papa);
                      }
                    }}
                  >
                    {papa.disponible === false ? "Agotado" : "Ordenar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* =================================
              COMBOS
          ================================= */}

          <h2
            ref={combosRef}
            className="section-title wings-title menu-scroll-target"
          >
            🍟 Combos
          </h2>

          <div className="cards-container">
            {combos.map((combo) => (
              <div
                className={`food-card ${
                  combo.disponible === false ? "producto-agotado" : ""
                }`}
                key={combo.id}
              >
                {combo.disponible === false && (
                  <div className="letrero-agotado">AGOTADO</div>
                )}

                {combo.imagen && <img src={combo.imagen} alt={combo.nombre} />}

                <div className="food-info">
                  <h3>{combo.nombre}</h3>

                  <p>{combo.descripcion}</p>

                  <h4>${combo.precio}</h4>

                  <button
                    disabled={combo.disponible === false}
                    onClick={() => {
                      if (combo.disponible !== false) {
                        agregarProductoSimple(combo);
                      }
                    }}
                  >
                    {combo.disponible === false ? "Agotado" : "Ordenar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* =====================================
          MODAL PERSONALIZAR HAMBURGUESA
      ====================================== */}

      {productoSeleccionado && (
        <div className="modal-fondo" onClick={cerrarProducto}>
          <div className="modal-producto" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarProducto}>
              ✕
            </button>

            {productoSeleccionado.imagen && (
              <img
                className="modal-imagen"
                src={productoSeleccionado.imagen}
                alt={productoSeleccionado.nombre}
              />
            )}

            <h2>{productoSeleccionado.nombre}</h2>

            <h3 className="modal-precio">${productoSeleccionado.precio}</h3>

            {Array.isArray(productoSeleccionado.ingredientes) &&
            productoSeleccionado.ingredientes.length > 0 ? (
              <>
                <p className="modal-instruccion">
                  Quita la palomita de los ingredientes que no deseas:
                </p>

                <div className="lista-ingredientes">
                  {productoSeleccionado.ingredientes.map(
                    (ingrediente, index) => (
                      <label className="ingrediente-item" key={index}>
                        <input
                          type="checkbox"
                          checked={ingredientesSeleccionados.includes(
                            ingrediente,
                          )}
                          onChange={() => cambiarIngrediente(ingrediente)}
                        />

                        <span>{ingrediente}</span>
                      </label>
                    ),
                  )}
                </div>
              </>
            ) : (
              <p className="modal-instruccion">
                Este producto todavía no tiene ingredientes configurados.
              </p>
            )}

            <button className="btn-confirmar-pedido" onClick={ordenarProducto}>
              Agregar al pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
