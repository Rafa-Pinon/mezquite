import React from "react";
import "./menu.css";

const Home = ({ onBebidasClick }) => {
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
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd"
            alt="Hamburguesa clásica"
          />

          <div className="food-info">
            <h3>Hamburguesa Clásica</h3>
            <p>Carne, queso, lechuga, tomate, cebolla y aderezo especial.</p>

            <h4>$95</h4>

            <button>Ordenar</button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1550547660-d9450f859349"
            alt="Hamburguesa doble"
          />

          <div className="food-info">
            <h3>Hamburguesa Doble</h3>
            <p>Doble carne, doble queso, lechuga, tomate y cebolla.</p>

            <h4>$125</h4>

            <button>Ordenar</button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5"
            alt="Hamburguesa BBQ"
          />

          <div className="food-info">
            <h3>Hamburguesa BBQ</h3>
            <p>Carne, queso, tocino, cebolla y deliciosa salsa BBQ.</p>

            <h4>$135</h4>

            <button>Ordenar</button>
          </div>
        </div>

        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1571091718767-18b5b1457add"
            alt="Hamburguesa especial"
          />

          <div className="food-info">
            <h3>Hamburguesa Especial</h3>

            <p>
              Carne, queso, tocino, aguacate, jalapeño y aderezo de la casa.
            </p>

            <h4>$145</h4>

            <button>Ordenar</button>
          </div>
        </div>
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

            <button>Ordenar</button>
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

            <button>Ordenar</button>
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

            <button>Ordenar</button>
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

            <button>Ordenar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
