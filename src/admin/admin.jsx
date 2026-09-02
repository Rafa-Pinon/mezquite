import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import "./admin.css";

// ========================================
// CLOUDINARY
// ========================================

const CLOUD_NAME = "kvnxitan";
const UPLOAD_PRESET = "mezquite_productos";

function Admin() {
  // ========================================
  // USUARIO / LOGIN
  // ========================================

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // ========================================
  // PRODUCTOS
  // ========================================

  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  const [mostrarNuevo, setMostrarNuevo] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "hamburguesas",
    descripcion: "",
    imagen: "",
    disponible: true,
    ingredientes: "",
  });

  // ========================================
  // SUBIDA DE IMÁGENES
  // ========================================

  const [subiendoImagenEditar, setSubiendoImagenEditar] = useState(false);

  const [subiendoImagenNueva, setSubiendoImagenNueva] = useState(false);

  // ========================================
  // COSTO DE ENVÍO
  // ========================================

  const [costoEnvio, setCostoEnvio] = useState("");
  const [guardandoCostoEnvio, setGuardandoCostoEnvio] = useState(false);

  // ========================================
  // AUTH
  // ========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // ========================================
  // LEER PRODUCTOS FIRESTORE
  // ========================================

  useEffect(() => {
    if (!usuario) return;

    const referencia = collection(db, "productos");

    const unsubscribe = onSnapshot(
      referencia,
      (snapshot) => {
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setProductos(lista);
      },
      (error) => {
        console.error("Error al leer productos:", error);
      },
    );

    return () => unsubscribe();
  }, [usuario]);

  // ========================================
  // LEER COSTO DE ENVÍO
  // configuracion / negocio / costoEnvio
  // ========================================

  useEffect(() => {
    if (!usuario) return;

    const referencia = doc(db, "configuracion", "negocio");

    const unsubscribe = onSnapshot(
      referencia,
      (documento) => {
        if (documento.exists()) {
          const datos = documento.data();

          setCostoEnvio(datos.costoEnvio !== undefined ? datos.costoEnvio : "");
        }
      },
      (error) => {
        console.error("Error al leer costo de envío:", error);
      },
    );

    return () => unsubscribe();
  }, [usuario]);

  // ========================================
  // LOGIN
  // ========================================

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      setErrorLogin("");

      await signInWithEmailAndPassword(auth, correo.trim(), password);
    } catch (error) {
      console.error(error);

      setErrorLogin("Correo o contraseña incorrectos.");
    }
  };

  // ========================================
  // CERRAR SESIÓN
  // ========================================

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  // ========================================
  // GUARDAR COSTO DE ENVÍO
  // ========================================

  const guardarCostoEnvio = async () => {
    if (costoEnvio === "") {
      alert("Escribe el costo de envío.");
      return;
    }

    const nuevoCosto = Number(costoEnvio);

    if (!Number.isFinite(nuevoCosto) || nuevoCosto < 0) {
      alert("Escribe un costo de envío válido.");
      return;
    }

    try {
      setGuardandoCostoEnvio(true);

      const referencia = doc(db, "configuracion", "negocio");

      await updateDoc(referencia, {
        costoEnvio: nuevoCosto,
      });

      alert(`Costo de envío actualizado a $${nuevoCosto}.`);
    } catch (error) {
      console.error("Error guardando costo de envío:", error);

      alert("No se pudo actualizar el costo de envío.");
    } finally {
      setGuardandoCostoEnvio(false);
    }
  };

  // ========================================
  // SUBIR IMAGEN A CLOUDINARY
  // ========================================

  const subirImagenCloudinary = async (archivo) => {
    if (!archivo) {
      throw new Error("No seleccionaste una imagen.");
    }

    if (!archivo.type.startsWith("image/")) {
      throw new Error("El archivo seleccionado no es una imagen.");
    }

    if (archivo.size > 10 * 1024 * 1024) {
      throw new Error("La imagen es demasiado grande. Máximo 10 MB.");
    }

    const datos = new FormData();

    datos.append("file", archivo);

    datos.append("upload_preset", UPLOAD_PRESET);

    const respuesta = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: datos,
      },
    );

    if (!respuesta.ok) {
      const errorCloudinary = await respuesta.text();

      console.error("Error Cloudinary:", errorCloudinary);

      throw new Error("Cloudinary no pudo subir la imagen.");
    }

    const resultado = await respuesta.json();

    if (!resultado.secure_url) {
      throw new Error("No se recibió la URL de la imagen.");
    }

    return resultado.secure_url;
  };

  // ========================================
  // SELECCIONAR IMAGEN AL EDITAR
  // ========================================

  const seleccionarImagenEditar = async (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    try {
      setSubiendoImagenEditar(true);

      const url = await subirImagenCloudinary(archivo);

      setProductoEditando((productoAnterior) => ({
        ...productoAnterior,
        imagen: url,
      }));
    } catch (error) {
      console.error(error);

      alert(error.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendoImagenEditar(false);

      e.target.value = "";
    }
  };

  // ========================================
  // SELECCIONAR IMAGEN NUEVO PRODUCTO
  // ========================================

  const seleccionarImagenNueva = async (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    try {
      setSubiendoImagenNueva(true);

      const url = await subirImagenCloudinary(archivo);

      setNuevoProducto((productoAnterior) => ({
        ...productoAnterior,
        imagen: url,
      }));
    } catch (error) {
      console.error(error);

      alert(error.message || "No se pudo subir la imagen.");
    } finally {
      setSubiendoImagenNueva(false);

      e.target.value = "";
    }
  };

  // ========================================
  // ABRIR EDITAR PRODUCTO
  // ========================================

  const abrirEditar = (producto) => {
    setProductoEditando({
      ...producto,

      ingredientesTexto: Array.isArray(producto.ingredientes)
        ? producto.ingredientes.join(", ")
        : "",
    });
  };

  // ========================================
  // GUARDAR CAMBIOS PRODUCTO
  // ========================================

  const guardarCambios = async () => {
    if (!productoEditando) return;

    if (subiendoImagenEditar) {
      alert("Espera a que termine de subir la imagen.");
      return;
    }

    if (
      productoEditando.nombre.trim() === "" ||
      productoEditando.precio === ""
    ) {
      alert("Nombre y precio son obligatorios.");
      return;
    }

    const ingredientesArray = (productoEditando.ingredientesTexto || "")
      .split(",")
      .map((ingrediente) => ingrediente.trim())
      .filter((ingrediente) => ingrediente !== "");

    try {
      const referencia = doc(db, "productos", productoEditando.id);

      await updateDoc(referencia, {
        nombre: productoEditando.nombre.trim(),

        precio: Number(productoEditando.precio),

        categoria: productoEditando.categoria,

        descripcion: productoEditando.descripcion || "",

        imagen: productoEditando.imagen || "",

        disponible: productoEditando.disponible,

        ingredientes: ingredientesArray,
      });

      setProductoEditando(null);

      alert("Producto actualizado correctamente.");
    } catch (error) {
      console.error("Error actualizando producto:", error);

      alert("No se pudo actualizar el producto.");
    }
  };

  // ========================================
  // AGREGAR NUEVO PRODUCTO
  // ========================================

  const agregarProducto = async () => {
    if (subiendoImagenNueva) {
      alert("Espera a que termine de subir la imagen.");
      return;
    }

    if (nuevoProducto.nombre.trim() === "" || nuevoProducto.precio === "") {
      alert("Escribe el nombre y precio.");
      return;
    }

    const ingredientesArray = (nuevoProducto.ingredientes || "")
      .split(",")
      .map((ingrediente) => ingrediente.trim())
      .filter((ingrediente) => ingrediente !== "");

    try {
      await addDoc(collection(db, "productos"), {
        nombre: nuevoProducto.nombre.trim(),

        precio: Number(nuevoProducto.precio),

        categoria: nuevoProducto.categoria,

        descripcion: nuevoProducto.descripcion || "",

        imagen: nuevoProducto.imagen || "",

        disponible: nuevoProducto.disponible,

        ingredientes: ingredientesArray,
      });

      setNuevoProducto({
        nombre: "",
        precio: "",
        categoria: "hamburguesas",
        descripcion: "",
        imagen: "",
        disponible: true,
        ingredientes: "",
      });

      setMostrarNuevo(false);

      alert("Producto agregado correctamente.");
    } catch (error) {
      console.error("Error agregando producto:", error);

      alert("No se pudo agregar el producto.");
    }
  };

  // ========================================
  // ELIMINAR PRODUCTO
  // ========================================

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?",
    );

    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "productos", id));
    } catch (error) {
      console.error("Error eliminando producto:", error);

      alert("No se pudo eliminar el producto.");
    }
  };

  // ========================================
  // CARGANDO
  // ========================================

  if (cargando) {
    return <div className="admin-cargando">Cargando...</div>;
  }

  // ========================================
  // LOGIN
  // ========================================

  if (!usuario) {
    return (
      <div className="admin-login-fondo">
        <div className="admin-login-card">
          <h1>🔥 Mezquite</h1>

          <h2>Administrador</h2>

          <form onSubmit={iniciarSesion}>
            <label>Correo</label>

            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo de administrador"
            />

            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />

            {errorLogin && <p className="admin-error">{errorLogin}</p>}

            <button type="submit">Iniciar sesión</button>
          </form>
        </div>
      </div>
    );
  }

  // ========================================
  // PANEL ADMIN
  // ========================================

  return (
    <div className="admin-panel">
      {/* =====================================
          ENCABEZADO
      ====================================== */}

      <header className="admin-header">
        <div>
          <h1>🔥 Mezquite Admin</h1>

          <p>{usuario.email}</p>
        </div>

        <div className="admin-header-botones">
          <button className="btn-nuevo" onClick={() => setMostrarNuevo(true)}>
            + Nuevo producto
          </button>

          <button className="btn-salir" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="admin-contenido">
        {/* =====================================
            CONFIGURACIÓN DEL NEGOCIO
        ====================================== */}

        <section className="configuracion-negocio-admin">
          <div>
            <h2>⚙️ Configuración del negocio</h2>

            <p>Cambia aquí el costo del servicio a domicilio.</p>
          </div>

          <div className="configuracion-envio-admin">
            <label>Costo de envío</label>

            <div className="costo-envio-admin-control">
              <span>$</span>

              <input
                type="number"
                min="0"
                step="1"
                value={costoEnvio}
                onChange={(e) => setCostoEnvio(e.target.value)}
              />

              <button
                type="button"
                className="btn-guardar-envio-admin"
                onClick={guardarCostoEnvio}
                disabled={guardandoCostoEnvio}
              >
                {guardandoCostoEnvio ? "Guardando..." : "💾 Guardar costo"}
              </button>
            </div>

            <p className="texto-envio-admin">
              Actualmente el cliente pagará <strong>${costoEnvio || 0}</strong>{" "}
              por envío a domicilio.
            </p>
          </div>
        </section>

        {/* =====================================
            PRODUCTOS
        ====================================== */}

        <h2>Productos</h2>

        {productos.length === 0 ? (
          <p>No hay productos.</p>
        ) : (
          <div className="admin-productos-grid">
            {productos.map((producto) => (
              <div className="admin-producto-card" key={producto.id}>
                {producto.imagen && (
                  <img src={producto.imagen} alt={producto.nombre} />
                )}

                <div className="admin-producto-info">
                  <span className="categoria-producto">
                    {producto.categoria}
                  </span>

                  <h3>{producto.nombre}</h3>

                  <h4>${producto.precio}</h4>

                  <p>{producto.descripcion}</p>

                  <p>
                    Estado:{" "}
                    <strong>
                      {producto.disponible ? "✅ Disponible" : "❌ Agotado"}
                    </strong>
                  </p>

                  {Array.isArray(producto.ingredientes) &&
                    producto.ingredientes.length > 0 && (
                      <div className="ingredientes-admin">
                        <strong>Ingredientes:</strong>

                        <p>{producto.ingredientes.join(", ")}</p>
                      </div>
                    )}

                  <div className="botones-producto-admin">
                    <button
                      className="btn-editar"
                      onClick={() => abrirEditar(producto)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      className="btn-eliminar-admin"
                      onClick={() => eliminarProducto(producto.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* =====================================
          MODAL EDITAR PRODUCTO
      ====================================== */}

      {productoEditando && (
        <div className="admin-modal-fondo">
          <div className="admin-modal">
            <button
              className="cerrar-admin-modal"
              onClick={() => setProductoEditando(null)}
            >
              ✕
            </button>

            <h2>Editar producto</h2>

            <label>Nombre</label>

            <input
              value={productoEditando.nombre}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  nombre: e.target.value,
                })
              }
            />

            <label>Precio</label>

            <input
              type="number"
              value={productoEditando.precio}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  precio: e.target.value,
                })
              }
            />

            <label>Categoría</label>

            <select
              value={productoEditando.categoria}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  categoria: e.target.value,
                })
              }
            >
              <option value="hamburguesas">Hamburguesas</option>

              <option value="alitas">Alitas</option>

              <option value="bebidas">Bebidas</option>
            </select>

            <label>Descripción</label>

            <textarea
              value={productoEditando.descripcion || ""}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  descripcion: e.target.value,
                })
              }
            />

            {/* =================================
                SUBIR IMAGEN
            ================================== */}

            <label>Subir nueva imagen</label>

            <input
              className="input-imagen-admin"
              type="file"
              accept="image/*"
              onChange={seleccionarImagenEditar}
              disabled={subiendoImagenEditar}
            />

            {subiendoImagenEditar && (
              <div className="subiendo-imagen-admin">⏳ Subiendo imagen...</div>
            )}

            {productoEditando.imagen && (
              <div className="preview-imagen-admin">
                <p>Imagen actual:</p>

                <img src={productoEditando.imagen} alt="Vista previa" />
              </div>
            )}

            {/* URL MANUAL COMO RESPALDO */}

            <label>URL de imagen</label>

            <input
              value={productoEditando.imagen || ""}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  imagen: e.target.value,
                })
              }
            />

            <label>Ingredientes separados por coma</label>

            <textarea
              value={productoEditando.ingredientesTexto || ""}
              onChange={(e) =>
                setProductoEditando({
                  ...productoEditando,
                  ingredientesTexto: e.target.value,
                })
              }
              placeholder="Carne, Queso, Lechuga..."
            />

            <label className="checkbox-admin">
              <input
                type="checkbox"
                checked={productoEditando.disponible}
                onChange={(e) =>
                  setProductoEditando({
                    ...productoEditando,
                    disponible: e.target.checked,
                  })
                }
              />
              Producto disponible
            </label>

            <button
              className="btn-guardar-admin"
              onClick={guardarCambios}
              disabled={subiendoImagenEditar}
            >
              {subiendoImagenEditar
                ? "⏳ Subiendo imagen..."
                : "💾 Guardar cambios"}
            </button>
          </div>
        </div>
      )}

      {/* =====================================
          MODAL NUEVO PRODUCTO
      ====================================== */}

      {mostrarNuevo && (
        <div className="admin-modal-fondo">
          <div className="admin-modal">
            <button
              className="cerrar-admin-modal"
              onClick={() => setMostrarNuevo(false)}
            >
              ✕
            </button>

            <h2>Nuevo producto</h2>

            <label>Nombre</label>

            <input
              value={nuevoProducto.nombre}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  nombre: e.target.value,
                })
              }
            />

            <label>Precio</label>

            <input
              type="number"
              value={nuevoProducto.precio}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  precio: e.target.value,
                })
              }
            />

            <label>Categoría</label>

            <select
              value={nuevoProducto.categoria}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  categoria: e.target.value,
                })
              }
            >
              <option value="hamburguesas">Hamburguesas</option>

              <option value="alitas">Alitas</option>

              <option value="bebidas">Bebidas</option>
            </select>

            <label>Descripción</label>

            <textarea
              value={nuevoProducto.descripcion}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  descripcion: e.target.value,
                })
              }
            />

            {/* =================================
                SUBIR IMAGEN
            ================================== */}

            <label>Subir imagen</label>

            <input
              className="input-imagen-admin"
              type="file"
              accept="image/*"
              onChange={seleccionarImagenNueva}
              disabled={subiendoImagenNueva}
            />

            {subiendoImagenNueva && (
              <div className="subiendo-imagen-admin">⏳ Subiendo imagen...</div>
            )}

            {nuevoProducto.imagen && (
              <div className="preview-imagen-admin">
                <p>Vista previa:</p>

                <img src={nuevoProducto.imagen} alt="Vista previa" />
              </div>
            )}

            {/* URL MANUAL COMO RESPALDO */}

            <label>URL de imagen</label>

            <input
              value={nuevoProducto.imagen}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  imagen: e.target.value,
                })
              }
            />

            <label>Ingredientes separados por coma</label>

            <textarea
              value={nuevoProducto.ingredientes}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  ingredientes: e.target.value,
                })
              }
              placeholder="Carne, Queso, Lechuga..."
            />

            <label className="checkbox-admin">
              <input
                type="checkbox"
                checked={nuevoProducto.disponible}
                onChange={(e) =>
                  setNuevoProducto({
                    ...nuevoProducto,
                    disponible: e.target.checked,
                  })
                }
              />
              Producto disponible
            </label>

            <button
              className="btn-guardar-admin"
              onClick={agregarProducto}
              disabled={subiendoImagenNueva}
            >
              {subiendoImagenNueva
                ? "⏳ Subiendo imagen..."
                : "➕ Agregar producto"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
