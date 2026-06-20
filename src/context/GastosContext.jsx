import React, { createContext, useState, useEffect } from 'react';

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  // Estado del usuario activo
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // Estados financieros que se cargarán dinámicamente según el usuario logueado
  const [transacciones, setTransacciones] = useState([]);
  const [billeteras, setBilleteras] = useState({ efectivo: 0, banco: 0, chivoWallet: 0 });
  const [alerta, setAlerta] = useState(null);

  // EFECTO EFICAZ: Cada vez que el usuario inicia o cambia de sesión, se cargan SUS datos específicos
  useEffect(() => {
    if (usuario) {
      const tGuardadas = localStorage.getItem(`${usuario.nombre}_transacciones`);
      const bGuardadas = localStorage.getItem(`${usuario.nombre}_billeteras`);

      // Si es un usuario nuevo, se inicializa automáticamente todo en CERO ($0.00)
      setTransacciones(tGuardadas ? JSON.parse(tGuardadas) : []);
      setBilleteras(bGuardadas ? JSON.parse(bGuardadas) : { efectivo: 0, banco: 0, chivoWallet: 0 });
    } else {
      setTransacciones([]);
      setBilleteras({ efectivo: 0, banco: 0, chivoWallet: 0 });
    }
  }, [usuario]);

  // EFECTO CENTINELA: Sincroniza los movimientos en caliente solo en el espacio del usuario activo
  useEffect(() => {
    if (usuario) {
      localStorage.setItem(`${usuario.nombre}_transacciones`, JSON.stringify(transacciones));
      localStorage.setItem(`${usuario.nombre}_billeteras`, JSON.stringify(billeteras));
    }
  }, [transacciones, billeteras, usuario]);

  const iniciarSesion = (nombreUsuario) => {
    const datos = { nombre: nombreUsuario, loginAt: new Date().toLocaleString() };
    setUsuario(datos);
    localStorage.setItem('pro_usuario_activo', JSON.stringify(datos));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem('pro_usuario_activo');
  };

  const agregarTransaccion = (nuevaTransaccion) => {
    setTransacciones([nuevaTransaccion, ...transacciones]);
    
    setBilleteras(prev => {
      const copia = { ...prev };
      const montoNeto = parseFloat(nuevaTransaccion.monto);
      const comision = parseFloat(nuevaTransaccion.comision || 0);

      if (nuevaTransaccion.tipo === 'ingreso' || nuevaTransaccion.tipo === 'remesa') {
        copia[nuevaTransaccion.billetera] += (montoNeto - comision);
      } 
      else if (nuevaTransaccion.tipo === 'gasto') {
        copia[nuevaTransaccion.billetera] -= (montoNeto + comision);
      } 
      else if (nuevaTransaccion.tipo === 'transferencia' || nuevaTransaccion.tipo === 'envio_remesa') {
        copia[nuevaTransaccion.billeteraOrigen] -= (montoNeto + comision);
        if (nuevaTransaccion.tipo === 'transferencia') {
          copia[nuevaTransaccion.billeteraDestino] += montoNeto;
        }
      }
      return copia;
    });
  };

  useEffect(() => {
    if (transacciones.length === 0) { setAlerta(null); return; }
    const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso' || t.tipo === 'remesa').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
    const totalGastos = transacciones.filter(t => t.tipo === 'gasto' || t.tipo === 'envio_remesa').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
    const totalComisiones = transacciones.reduce((acc, curr) => acc + parseFloat(curr.comision || 0), 0);

    if (totalIngresos > 0 && ((totalGastos + totalComisiones) / totalIngresos) >= 0.8) {
      setAlerta(`¡Riesgo Financiero Alto! Has consumido el ${(((totalGastos + totalComisiones) / totalIngresos) * 100).toFixed(0)}% de tus ingresos.`);
    } else {
      setAlerta(null);
    }
  }, [transacciones]);

  const obtenerTotalComisiones = () => {
    return transacciones.reduce((acc, curr) => acc + parseFloat(curr.comision || 0), 0);
  };

  return (
    <GastosContext.Provider value={{ 
      transacciones, billeteras, agregarTransaccion, alerta, obtenerTotalComisiones,
      usuario, iniciarSesion, cerrarSesion 
    }}>
      {children}
    </GastosContext.Provider>
  );
};