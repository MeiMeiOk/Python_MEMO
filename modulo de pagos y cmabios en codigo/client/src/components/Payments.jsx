import { useMemo, useState } from 'react';
import '../styles/Payments.css';

const IVA_RATE = 0.16;

const paymentMethods = [
  { id: 'card', label: 'Tarjeta de credito' },
  { id: 'paypal', label: 'PayPal' },
  { id: 'transfer', label: 'Transferencia' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number(value || 0));
}

function buildVoucherId() {
  return `NM-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`;
}

function getLastFour(value) {
  const digits = value.replace(/\D/g, '');
  return digits.slice(-4).padStart(4, '*');
}

export function Payments({ carrito, onCerrar, onVolverCarrito, onPagoCompletado }) {
  const [metodo, setMetodo] = useState('card');
  const [pagado, setPagado] = useState(false);
  const [voucher, setVoucher] = useState(null);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    paypalEmail: '',
    transferName: '',
    transferReference: '',
  });

  const { items = [], total = 0, itemCount = 0 } = carrito || {};

  const resumen = useMemo(() => {
    const subtotal = Number(total || 0);
    const iva = subtotal * IVA_RATE;
    return {
      subtotal,
      iva,
      total: subtotal + iva,
    };
  }, [total]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const voucherData = {
      id: buildVoucherId(),
      fecha: new Date().toLocaleString('es-MX', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      metodo,
      resumen,
      items,
      detalle:
        metodo === 'card'
          ? `Tarjeta terminacion ${getLastFour(formData.cardNumber)}`
          : metodo === 'paypal'
            ? `Cuenta ${formData.paypalEmail}`
            : `Referencia ${formData.transferReference}`,
    };

    setVoucher(voucherData);
    setPagado(true);
    await onPagoCompletado?.();
  };

  const metodoActual = paymentMethods.find((item) => item.id === metodo);

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <section className="payment-modal" onClick={(event) => event.stopPropagation()}>
        <header className="payment-modal__header">
          <div>
            <p className="payment-modal__eyebrow">Checkout seguro</p>
            <h2>{pagado ? 'Voucher de compra' : 'Pago de productos'}</h2>
          </div>
          <button type="button" className="payment-modal__close" onClick={onCerrar}>
            CERRAR
          </button>
        </header>

        {!pagado ? (
          <div className="payment-layout">
            <aside className="payment-ticket" aria-label="Resumen de compra">
              <div className="payment-ticket__top">
                <span>NEOMART</span>
                <strong>{itemCount} productos</strong>
              </div>

              <ul className="payment-ticket__items">
                {items.map((item) => (
                  <li key={item.productId}>
                    <div>
                      <span>{item.title}</span>
                      <small>
                        {item.quantity} x {formatCurrency(item.price)}
                      </small>
                    </div>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>

              <div className="payment-ticket__totals">
                <p>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(resumen.subtotal)}</strong>
                </p>
                <p>
                  <span>IVA 16%</span>
                  <strong>{formatCurrency(resumen.iva)}</strong>
                </p>
                <p className="payment-ticket__grand-total">
                  <span>Total</span>
                  <strong>{formatCurrency(resumen.total)}</strong>
                </p>
              </div>
            </aside>

            <form className="payment-form" onSubmit={handleSubmit}>
              <div className="payment-methods" role="tablist" aria-label="Metodos de pago">
                {paymentMethods.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={metodo === item.id ? 'payment-method is-active' : 'payment-method'}
                    onClick={() => setMetodo(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="payment-form__panel">
                <h3>{metodoActual?.label}</h3>

                {metodo === 'card' && (
                  <>
                    <label>
                      Nombre del titular
                      <input
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        required
                      />
                    </label>
                    <label>
                      Numero de tarjeta
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        inputMode="numeric"
                        maxLength="19"
                        placeholder="4242 4242 4242 4242"
                        required
                      />
                    </label>
                    <div className="payment-form__row">
                      <label>
                        Vencimiento
                        <input
                          name="expiry"
                          value={formData.expiry}
                          onChange={handleChange}
                          placeholder="MM/AA"
                          required
                        />
                      </label>
                      <label>
                        CVV
                        <input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          inputMode="numeric"
                          maxLength="4"
                          placeholder="123"
                          required
                        />
                      </label>
                    </div>
                  </>
                )}

                {metodo === 'paypal' && (
                  <>
                    <label>
                      Correo de PayPal
                      <input
                        name="paypalEmail"
                        type="email"
                        value={formData.paypalEmail}
                        onChange={handleChange}
                        placeholder="correo@paypal.com"
                        required
                      />
                    </label>
                    <p className="payment-form__hint">
                      Se registrara la cuenta para confirmar el pago de la compra.
                    </p>
                  </>
                )}

                {metodo === 'transfer' && (
                  <>
                    <div className="payment-transfer">
                      <p>
                        <span>Banco</span>
                        <strong>NEOMART BANK</strong>
                      </p>
                      <p>
                        <span>CLABE</span>
                        <strong>646180000012345678</strong>
                      </p>
                      <p>
                        <span>Concepto</span>
                        <strong>NEOMART-{itemCount}</strong>
                      </p>
                    </div>
                    <label>
                      Nombre de quien transfiere
                      <input
                        name="transferName"
                        value={formData.transferName}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        required
                      />
                    </label>
                    <label>
                      Referencia bancaria
                      <input
                        name="transferReference"
                        value={formData.transferReference}
                        onChange={handleChange}
                        placeholder="Numero de referencia"
                        required
                      />
                    </label>
                  </>
                )}
              </div>

              <div className="payment-actions">
                <button type="button" className="btn-link" onClick={onVolverCarrito}>
                  VOLVER
                </button>
                <button type="submit" className="btn-auth-main">
                  PAGAR {formatCurrency(resumen.total)}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="voucher">
            <div className="voucher__paper">
              <div className="voucher__brand">
                <span>NEOMART</span>
                <strong>Pago aprobado</strong>
              </div>
              <p className="voucher__id">Voucher {voucher.id}</p>
              <p className="voucher__date">{voucher.fecha}</p>

              <ul className="voucher__items">
                {voucher.items.map((item) => (
                  <li key={item.productId}>
                    <span>
                      {item.quantity} x {item.title}
                    </span>
                    <strong>{formatCurrency(item.price * item.quantity)}</strong>
                  </li>
                ))}
              </ul>

              <div className="voucher__totals">
                <p>
                  <span>Subtotal</span>
                  <strong>{formatCurrency(voucher.resumen.subtotal)}</strong>
                </p>
                <p>
                  <span>IVA</span>
                  <strong>{formatCurrency(voucher.resumen.iva)}</strong>
                </p>
                <p>
                  <span>Total pagado</span>
                  <strong>{formatCurrency(voucher.resumen.total)}</strong>
                </p>
              </div>

              <div className="voucher__payment">
                <span>Metodo</span>
                <strong>{metodoActual?.label}</strong>
                <small>{voucher.detalle}</small>
              </div>
            </div>

            <button type="button" className="btn-auth-main voucher__done" onClick={onCerrar}>
              FINALIZAR
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
