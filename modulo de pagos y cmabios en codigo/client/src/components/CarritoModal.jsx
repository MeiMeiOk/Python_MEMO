import { useState } from 'react';
import '../styles/CarritoModal.css';

export function CarritoModal({
  carrito,
  cargando,
  onCerrar,
  onPagar,
  onActualizarCantidad,
  onEliminarProducto,
}) {
  const { items = [], total = 0, itemCount = 0 } = carrito || {};
  const [productoActivo, setProductoActivo] = useState(null);

  const editarCantidad = async (item, nuevaCantidad) => {
    if (!onActualizarCantidad || nuevaCantidad < 1) return;

    setProductoActivo(item.productId);
    try {
      await onActualizarCantidad(item.productId, nuevaCantidad);
    } finally {
      setProductoActivo(null);
    }
  };

  const eliminarProducto = async (productId) => {
    if (!onEliminarProducto) return;

    setProductoActivo(productId);
    try {
      await onEliminarProducto(productId);
    } finally {
      setProductoActivo(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content carrito-modal" onClick={(e) => e.stopPropagation()}>
        <div className="carrito-modal__head">
          <h2>MI_CARRITO</h2>
          <span className="carrito-modal__count">{itemCount} productos</span>
        </div>

        {cargando && <p className="carrito-modal__status">Cargando carrito...</p>}

        {!cargando && items.length === 0 && (
          <p className="carrito-modal__status">Aun no has agregado productos.</p>
        )}

        {!cargando && items.length > 0 && (
          <ul className="carrito-lista">
            {items.map((item) => (
              <li key={item.productId} className="carrito-item">
                <div className="carrito-item__media">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="carrito-item__img" />
                  ) : (
                    <span className="carrito-item__img-placeholder">IMG</span>
                  )}
                </div>

                <div className="carrito-item__info">
                  <h3>{item.title}</h3>
                  <p className="carrito-item__precio">
                    ${Number(item.price).toFixed(2)} c/u
                  </p>
                  <div className="carrito-item__acciones">
                    <div className="carrito-item__cantidad" aria-label={`Cantidad de ${item.title}`}>
                      <button
                        type="button"
                        onClick={() => editarCantidad(item, item.quantity - 1)}
                        disabled={productoActivo === item.productId || item.quantity <= 1}
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => editarCantidad(item, item.quantity + 1)}
                        disabled={productoActivo === item.productId}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      className="carrito-item__eliminar"
                      onClick={() => eliminarProducto(item.productId)}
                      disabled={productoActivo === item.productId}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <p className="carrito-item__subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {!cargando && items.length > 0 && (
          <div className="carrito-modal__total">
            <span>Total</span>
            <strong>${Number(total).toFixed(2)}</strong>
          </div>
        )}

        {!cargando && items.length > 0 && (
          <button type="button" className="btn-auth-main carrito-modal__pagar" onClick={onPagar}>
            PAGAR PRODUCTOS
          </button>
        )}

        <button type="button" className="btn-link carrito-modal__cerrar" onClick={onCerrar}>
          CERRAR
        </button>
      </div>
    </div>
  );
}
