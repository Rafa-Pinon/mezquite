import React, { useEffect, useState } from "react";
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
  const [cargando, setCargando] = useState(true);

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

    return () => {
      unsubscribeHamburguesas();
      unsubscribeAlitas();
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
      ingredientesQuitados: [],
    });
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Nuestro Menú</h1>

        <button className="btn-bebidas" onClick={onBebidasClick}>
          🥤 Bebidas
        </button>
      </div>

      {cargando ? (
        <p>Cargando menú...</p>
      ) : (
        <>
          {/* =================================
              HAMBURGUESAS
          ================================= */}

          <h2 className="section-title">🍔 Hamburguesas</h2>

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

          <h2 className="section-title wings-title">🔥 Alitas</h2>

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
