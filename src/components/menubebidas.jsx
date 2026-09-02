import React, { useEffect, useState } from "react";

import "./menubebidas.css";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { db } from "../firebase";

const Menubebidas = ({ onComidasClick, onAgregarCarrito }) => {
  const [bebidas, setBebidas] = useState([]);

  const [cargando, setCargando] = useState(true);

  // =========================================
  // LEER BEBIDAS DESDE FIRESTORE
  // =========================================

  useEffect(() => {
    const referencia = collection(db, "productos");

    const consulta = query(referencia, where("categoria", "==", "bebidas"));

    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      const lista = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      setBebidas(lista);

      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // =========================================
  // AGREGAR AL CARRITO
  // =========================================

  const agregarBebida = (bebida) => {
    onAgregarCarrito({
      nombre: bebida.nombre,
      precio: bebida.precio,
      imagen: bebida.imagen,
      ingredientesQuitados: [],
    });
  };

  return (
    <div className="menu-container">
      {/* ENCABEZADO */}

      <div className="menu-header">
        <h1 className="menu-title">Menú de Bebidas</h1>

        <button className="btn-comidas" onClick={onComidasClick}>
          🍔 Menú Comidas
        </button>
      </div>

      <h2 className="section-title">🥤 Bebidas Saludables</h2>

      {cargando ? (
        <p>Cargando bebidas...</p>
      ) : bebidas.length === 0 ? (
        <p>No hay bebidas disponibles.</p>
      ) : (
        <div className="cards-container">
          {bebidas.map((bebida) => (
            <div
              className={`food-card ${
                bebida.disponible === false ? "producto-agotado" : ""
              }`}
              key={bebida.id}
            >
              {bebida.disponible === false && (
                <div className="letrero-agotado">AGOTADO</div>
              )}

              {bebida.imagen && <img src={bebida.imagen} alt={bebida.nombre} />}

              <div className="food-info">
                <h3>{bebida.nombre}</h3>

                <p>{bebida.descripcion}</p>

                <h4>${bebida.precio}</h4>

                <button
                  disabled={bebida.disponible === false}
                  onClick={() => {
                    if (bebida.disponible !== false) {
                      agregarBebida(bebida);
                    }
                  }}
                >
                  {bebida.disponible === false ? "Agotado" : "Ordenar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menubebidas;
