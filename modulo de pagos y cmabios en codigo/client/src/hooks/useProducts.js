import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { demoProducts } from '../data/demoProducts';

export function useProducts() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;

    async function cargarProductos() {
      try {
        setCargando(true);
        setError(null);
        const data = await productService.getAllProducts();
        if (activo) {
          setProductos(data);
        }
      } catch {
        if (activo) {
          setError(null);
          setProductos(demoProducts);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarProductos();
    return () => {
      activo = false;
    };
  }, []);

  return { productos, cargando, error };
}
