import React from "react";
import "./menubebidas.css";

const Menubebidas = ({ onComidasClick, onAgregarCarrito }) => {
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

      <div className="cards-container">
        {/* 1 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1623065422902-30a2d299bbe4"
            alt="Limonada natural"
          />

          <div className="food-info">
            <h3>Limonada Natural</h3>
            <p>Limón recién exprimido, agua y un toque ligero de miel.</p>

            <h4>$45</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Limonada Natural",
                  precio: 45,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 2 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1600271886742-f049cd451bba"
            alt="Agua de naranja"
          />

          <div className="food-info">
            <h3>Jugo de Naranja</h3>
            <p>
              Jugo natural de naranja recién exprimida, sin azúcar agregada.
            </p>

            <h4>$55</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Jugo de Naranja",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 3 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1610970881699-44a5587cabec"
            alt="Smoothie de fresa"
          />

          <div className="food-info">
            <h3>Smoothie de Fresa</h3>
            <p>Fresas naturales, yogurt y leche con un toque de miel.</p>

            <h4>$70</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Smoothie de Fresa",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 4 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1553530666-ba11a7da3888"
            alt="Smoothie de mango"
          />

          <div className="food-info">
            <h3>Smoothie de Mango</h3>
            <p>Mango natural, yogurt y leche preparado al momento.</p>

            <h4>$70</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Smoothie de Mango",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 5 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8"
            alt="Jugo verde"
          />

          <div className="food-info">
            <h3>Jugo Verde</h3>
            <p>Espinaca, pepino, apio, manzana verde, limón y piña.</p>

            <h4>$65</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Jugo Verde",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 6 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1603569283847-aa295f0d016a"
            alt="Jugo de zanahoria"
          />

          <div className="food-info">
            <h3>Jugo de Zanahoria</h3>
            <p>Zanahoria fresca con naranja natural y un toque de limón.</p>

            <h4>$60</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Jugo de Zanahoria",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 7 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1613478223719-2ab802602423"
            alt="Jugo de piña"
          />

          <div className="food-info">
            <h3>Jugo de Piña</h3>
            <p>Piña natural preparada al momento sin azúcar agregada.</p>

            <h4>$55</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Jugo de Piña",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 8 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1577805947697-89e18249d767"
            alt="Agua de jamaica"
          />

          <div className="food-info">
            <h3>Agua de Jamaica</h3>
            <p>
              Jamaica natural preparada con poca azúcar y servida bien fría.
            </p>

            <h4>$40</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Agua de Jamaica",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 9 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1523362628745-0c100150b504"
            alt="Agua de pepino"
          />

          <div className="food-info">
            <h3>Agua de Pepino y Limón</h3>
            <p>Pepino fresco, limón y agua natural con un toque de menta.</p>

            <h4>$45</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Agua de Pepino y Limón",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 10 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1595981267035-7b04ca84a82d"
            alt="Smoothie de frutos rojos"
          />

          <div className="food-info">
            <h3>Smoothie Frutos Rojos</h3>
            <p>Fresa, mora y frutos rojos mezclados con yogurt natural.</p>

            <h4>$75</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Smoothie Frutos Rojos",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 11 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1497534446932-c925b458314e"
            alt="Agua mineral con limón"
          />

          <div className="food-info">
            <h3>Mineral con Limón</h3>
            <p>Agua mineral fría con limón natural y hielo.</p>

            <h4>$45</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Mineral con Limón",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 12 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1544145945-f90425340c7e"
            alt="Té verde frío"
          />

          <div className="food-info">
            <h3>Té Verde Frío</h3>
            <p>Té verde servido frío con limón y un ligero toque de miel.</p>

            <h4>$50</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Té Verde Frío",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 13 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1546173159-315724a31696"
            alt="Agua de coco"
          />

          <div className="food-info">
            <h3>Agua de Coco</h3>
            <p>Agua de coco refrescante servida fría y sin azúcar agregada.</p>

            <h4>$55</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Agua de Coco",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 14 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1556881286-fc6915169721"
            alt="Smoothie de plátano"
          />

          <div className="food-info">
            <h3>Smoothie de Plátano</h3>
            <p>Plátano, leche, avena y canela preparados al momento.</p>

            <h4>$70</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Smoothie de Plátano",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>

        {/* 15 */}
        <div className="food-card">
          <img
            src="https://images.unsplash.com/photo-1505252585461-04db1eb84625"
            alt="Smoothie tropical"
          />

          <div className="food-info">
            <h3>Smoothie Tropical</h3>
            <p>Mango, piña, naranja y plátano en una mezcla refrescante.</p>

            <h4>$75</h4>

            <button
              onClick={() =>
                onAgregarCarrito({
                  nombre: "Smoothie Tropical",
                  precio: 55,
                  ingredientesQuitados: [],
                })
              }
            >
              Ordenar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menubebidas;
