import React, { useState } from "react";
import "./menu.css";

const Home = ({ onBebidasClick, onAgregarCarrito }) => {
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [ingredientesSeleccionados, setIngredientesSeleccionados] = useState(
    [],
  );

  const hamburguesas = [
    {
      nombre: "Hamburguesa Clásica",
      precio: 95,
      imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
      descripcion: "Carne, queso, lechuga, tomate, cebolla y aderezo especial.",
      ingredientes: [
        "Carne",
        "Queso",
        "Lechuga",
        "Tomate",
        "Cebolla",
        "Aderezo especial",
      ],
    },
    {
      nombre: "Hamburguesa Doble",
      precio: 125,
      imagen: "https://images.unsplash.com/photo-1550547660-d9450f859349",
      descripcion: "Doble carne, doble queso, lechuga, tomate y cebolla.",
      ingredientes: [
        "Doble carne",
        "Doble queso",
        "Lechuga",
        "Tomate",
        "Cebolla",
      ],
    },
    {
      nombre: "Hamburguesa BBQ",
      precio: 135,
      imagen: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5",
      descripcion: "Carne, queso, tocino, cebolla y deliciosa salsa BBQ.",
      ingredientes: ["Carne", "Queso", "Tocino", "Cebolla", "Salsa BBQ"],
    },
    {
      nombre: "Hamburguesa Especial",
      precio: 145,
      imagen: "https://images.unsplash.com/photo-1571091718767-18b5b1457add",
      descripcion:
        "Carne, queso, tocino, aguacate, jalapeño y aderezo de la casa.",
      ingredientes: [
        "Carne",
        "Queso",
        "Tocino",
        "Aguacate",
        "Jalapeño",
        "Aderezo de la casa",
      ],
    },
  ];

  const abrirProducto = (producto) => {
    setProductoSeleccionado(producto);

    // Todos los ingredientes aparecen seleccionados al principio
    setIngredientesSeleccionados(producto.ingredientes);
  };

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

  const ordenarProducto = () => {
    const ingredientesQuitados = productoSeleccionado.ingredientes.filter(
      (ingrediente) => !ingredientesSeleccionados.includes(ingrediente),
    );

    const productoParaCarrito = {
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      imagen: productoSeleccionado.imagen,
      ingredientesQuitados: ingredientesQuitados,
    };

    onAgregarCarrito(productoParaCarrito);

    setProductoSeleccionado(null);
  };

  return (
    <div className="menu-container">
      <div className="menu-header">
        <h1 className="menu-title">Nuestro Menú</h1>

        <button className="btn-bebidas" onClick={onBebidasClick}>
          🥤 Bebidas
        </button>
      </div>

      {/* HAMBURGUESAS */}

      <h2 className="section-title">🍔 Hamburguesas</h2>

      <div className="cards-container">
        {hamburguesas.map((hamburguesa, index) => (
          <div
            className="food-card hamburguesa-card"
            key={index}
            onClick={() => abrirProducto(hamburguesa)}
          >
            <img src={hamburguesa.imagen} alt={hamburguesa.nombre} />

            <div className="food-info">
              <h3>{hamburguesa.nombre}</h3>

              <p>{hamburguesa.descripcion}</p>

              <h4>${hamburguesa.precio}</h4>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  abrirProducto(hamburguesa);
                }}
              >
                Ordenar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ALITAS */}

      <h2 className="section-title wings-title">🔥 Alitas</h2>

      <div className="cards-container">
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1527477396000-e27163b481c2"
            alt="Alitas BBQ"
          />

          <div className="food-info">
            <h3>Alitas BBQ</h3>

            <p>Alitas crujientes bañadas en nuestra deliciosa salsa BBQ.</p>

            <h4>$110</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Alitas BBQ",
                  precio: 110,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1608039755401-742074f0548d"
            alt="Alitas Buffalo"
          />

          <div className="food-info">
            <h3>Alitas Buffalo</h3>

            <p>Alitas bañadas en salsa Buffalo con un toque picante.</p>

            <h4>$115</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Alitas Buffalo",
                  precio: 115,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1567620832903-9fc6debc209f"
            alt="Mango Habanero"
          />

          <div className="food-info">
            <h3>Mango Habanero</h3>

            <p>Una deliciosa combinación de mango dulce y chile habanero.</p>

            <h4>$120</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Mango Habanero",
                  precio: 120,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1606756790138-261d2b21cd75"
            alt="Lemon Pepper"
          />

          <div className="food-info">
            <h3>Lemon Pepper</h3>

            <p>Alitas crujientes con limón, pimienta y especias especiales.</p>

            <h4>$120</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Lemon Pepper",
                  precio: 120,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>
      </div>

      {/* VENTANA PARA PERSONALIZAR HAMBURGUESA */}

      {productoSeleccionado && (
        <div className="modal-fondo" onClick={cerrarProducto}>
          <div className="modal-producto" onClick={(e) => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={cerrarProducto}>
              ✕
            </button>

            <img
              className="modal-imagen"
              src={productoSeleccionado.imagen}
              alt={productoSeleccionado.nombre}
            />

            <h2>{productoSeleccionado.nombre}</h2>

            <h3 className="modal-precio">${productoSeleccionado.precio}</h3>

            <p className="modal-instruccion">
              Quita la palomita de los ingredientes que no deseas:
            </p>

            <div className="lista-ingredientes">
              {productoSeleccionado.ingredientes.map((ingrediente, index) => (
                <label className="ingrediente-item" key={index}>
                  <input
                    type="checkbox"
                    checked={ingredientesSeleccionados.includes(ingrediente)}
                    onChange={() => cambiarIngrediente(ingrediente)}
                  />

                  <span>{ingrediente}</span>
                </label>
              ))}
            </div>

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
