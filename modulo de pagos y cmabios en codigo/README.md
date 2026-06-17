# Entrega del modulo de pagos

Copiar estos archivos sobre la nueva version respetando las mismas rutas.

## Archivos nuevos

- `client/src/components/Payments.jsx`
- `client/src/styles/Payments.css`
- `client/src/data/demoProducts.js`

## Archivos modificados

- `client/src/App.jsx`
- `client/src/components/CarritoModal.jsx`
- `client/src/styles/CarritoModal.css`
- `client/src/hooks/useCart.js`
- `client/src/hooks/useProducts.js`
- `client/src/services/cartService.js`

## Funcionamiento

- El carrito abre el checkout con `PAGAR PRODUCTOS`.
- El checkout muestra ticket, IVA 16%, total, pago con tarjeta, PayPal o transferencia.
- Al pagar, se genera un voucher con la compra.
- Despues de generar el voucher, el carrito se vacia automaticamente.
- Si no hay base de datos/API, se usan productos demo y carrito local.
