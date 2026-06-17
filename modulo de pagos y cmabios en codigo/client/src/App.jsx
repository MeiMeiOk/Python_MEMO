import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Registro } from './components/Registro.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { CatalogSection } from './components/CatalogSection.jsx';
import { BenefitsSection } from './components/BenefitsSection.jsx';
import { CarritoModal } from './components/CarritoModal.jsx';
import { Payments } from './components/Payments.jsx';
import { useProducts } from './hooks/useProducts';
import { useCart } from './hooks/useCart';
import './styles/globals.css';

function decodeJwtToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function App() {
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const { productos, cargando, error } = useProducts();
  const {
    carrito,
    cargandoCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    vaciarCarrito,
    cargarCarrito,
  } = useCart();

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPagos, setMostrarPagos] = useState(false);

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('user_session');
    return guardado ? JSON.parse(guardado) : null;
  });

  const onGoogleLoginSuccess = (credentialResponse) => {
    const perfil = decodeJwtToken(credentialResponse?.credential || '');
    if (perfil) {
      setUsuario(perfil);
      localStorage.setItem('user_session', JSON.stringify(perfil));
      setMostrarLogin(false);
    }
  };

  const onGoogleLoginError = () => {
    console.error('Error al iniciar sesion con Google');
  };

  const manejarLogout = () => {
    localStorage.removeItem('user_session');
    setUsuario(null);
  };

  const abrirCarrito = async () => {
    await cargarCarrito();
    setMostrarCarrito(true);
  };

  const abrirPagos = () => {
    setMostrarCarrito(false);
    setMostrarPagos(true);
  };

  return (
    <div className="shop-container">
      <Header
        onOpenRegister={() => setMostrarRegistro(true)}
        onOpenLogin={() => setMostrarLogin(true)}
        onLogout={manejarLogout}
        onOpenCart={abrirCarrito}
        cartCount={carrito.itemCount}
        usuario={usuario}
      />

      <main>
        <HeroSection />
        <CatalogSection
          cargando={cargando}
          productos={productos}
          error={error}
          onAgregarAlCarrito={agregarProducto}
        />
        <BenefitsSection />
      </main>

      {mostrarRegistro && <Registro alCerrar={() => setMostrarRegistro(false)} />}

      {mostrarCarrito && (
        <CarritoModal
          carrito={carrito}
          cargando={cargandoCarrito}
          onActualizarCantidad={actualizarCantidad}
          onEliminarProducto={eliminarProducto}
          onPagar={abrirPagos}
          onCerrar={() => setMostrarCarrito(false)}
        />
      )}

      {mostrarPagos && (
        <Payments
          carrito={carrito}
          onPagoCompletado={vaciarCarrito}
          onCerrar={() => setMostrarPagos(false)}
          onVolverCarrito={() => {
            setMostrarPagos(false);
            setMostrarCarrito(true);
          }}
        />
      )}

      {mostrarLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>INICIAR_SESION_GOOGLE</h2>
            <p style={{ margin: '10px 0 20px' }}>
              Usa tu cuenta de Google para continuar.
            </p>
            {hasGoogleClientId ? (
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginError}
                theme="filled_black"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            ) : (
              <p>
                Falta configurar <strong>VITE_GOOGLE_CLIENT_ID</strong> en tu
                archivo .env para habilitar el login con Google.
              </p>
            )}
            <div style={{ marginTop: '16px' }}>
              <button className="btn-link" onClick={() => setMostrarLogin(false)}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
