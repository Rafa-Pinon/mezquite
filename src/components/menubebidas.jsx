import React, { useEffect, useState } from "react";
import "./menubebidas.css";

import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const Menubebidas = ({ onComidasClick, onAgregarCarrito }) => {
  const [bebidas, setBebidas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const referencia = collection(db, "productos");
    const consultaBebidas = query(
      referencia,
      where("categoria", "==", "bebidas"),
    );

    const unsubscribe = onSnapshot(
      consultaBebidas,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setBebidas(
          lista.sort(
            (a, b) => Number(a.orden ?? 999999) - Number(b.orden ?? 999999),
          ),
        );
        setCargando(false);
      },
      (error) => {
        console.error("Error al cargar bebidas:", error);
        setCargando(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const agregarBebida = (bebida) => {
    if (bebida.disponible === false) return;

    onAgregarCarrito({
      ...bebida,
      categoria: "bebidas",
      ingredientesQuitados: [],
    });
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Menú de Bebidas</h1>

        <button className="btn-comidas" onClick={onComidasClick}>
          🍔 Menú Comidas
        </button>
      </div>

      <h2 className="section-title">🥤 Bebidas</h2>

      {cargando ? (
        <p style={{ textAlign: "center", padding: "30px" }}>
          Cargando bebidas...
        </p>
      ) : bebidas.length === 0 ? (
        <p style={{ textAlign: "center", padding: "30px" }}>
          Por el momento no hay bebidas disponibles en el menú.
        </p>
      ) : (
        <div className="cards-container">
          {bebidas.map((bebida) => {
            const agotada = bebida.disponible === false;

            return (
              <div
                className={`food-card ${agotada ? "producto-agotado" : ""}`}
                key={bebida.id}
              >
                {bebida.imagen && (
                  <img src={bebida.imagen} alt={bebida.nombre} />
                )}

                {agotada && (
                  <div className="agotado-overlay">
                    <span>AGOTADO</span>
                  </div>
                )}

                <div className="food-info">
                  <h3>{bebida.nombre}</h3>
                  {bebida.descripcion && <p>{bebida.descripcion}</p>}
                  <h4>${Number(bebida.precio)}</h4>

                  <button
                    onClick={() => agregarBebida(bebida)}
                    disabled={agotada}
                  >
                    {agotada ? "Agotado" : "Ordenar"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Menubebidas;
