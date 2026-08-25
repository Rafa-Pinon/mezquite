import { useState } from "react";
import "./App.css";
import logo from "./assets/logosinfondo.png";
import Home from "./components/home";

function App() {
  const [showHome, setShowHome] = useState(false);

  const handleLogoClick = () => {
    setShowHome(true);
  };

  return (
    <div className="mezquite">
      {showHome ? (
        // 👇 Solo se muestra el componente Home
        <Home />
      ) : (
        // 👇 Pantalla inicial con el logo
        <div className="intro-section">
          <img
            src={logo}
            alt="Logo Mezquite"
            className="logo"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          />

          <p>Haz clic en el logo para entrar</p>
        </div>
      )}
    </div>
  );
}

export default App;
