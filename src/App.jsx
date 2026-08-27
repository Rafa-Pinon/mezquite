import { useState } from "react";
import "./App.css";
import logo from "./assets/logosinfondo.png";
import Home from "./components/menu";
import Menubebidas from "./components/menubebidas";

function App() {
  const [showHome, setShowHome] = useState(false);
  const [showBebidas, setShowBebidas] = useState(false);

  // ABRIR MENU DE COMIDAS
  const handleLogoClick = () => {
    setShowHome(true);
  };

  // ABRIR MENU DE BEBIDAS
  const handleBebidasClick = () => {
    setShowBebidas(true);
  };

  // REGRESAR AL MENU DE COMIDAS
  const handleComidasClick = () => {
    setShowBebidas(false);
    setShowHome(true);
  };

  return (
    <div className="mezquite">
      {showBebidas ? (
        <Menubebidas onComidasClick={handleComidasClick} />
      ) : showHome ? (
        <Home onBebidasClick={handleBebidasClick} />
      ) : (
        <div className="intro-section">
          <img
            src={logo}
            alt="Logo Mezquite"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
