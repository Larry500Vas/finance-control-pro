import React, { createContext, useState, useEffect } from 'react';

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  
  // 1. ESTADO DEL USUARIO: Recupera la sesión activa
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // 2. ESTADO DE TRANSACCIONES: Precarga los datos del usuario activo al arrancar
  const [transacciones, setTransacciones] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      const tGuardadas = localStorage.getItem(`${user.nombre}_transacciones`);
      return tGuardadas ? JSON.parse(tGuardadas) : [];
    }
    return [];
  });
  
  // 3. ESTADO DE BILLETERAS: Inicializa los saldos correctos del usuario activo
  const [billeteras, setBilleteras] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      const bGuardadas = localStorage.getItem(`${user.nombre}_billeteras`);
      return bGuardadas ? JSON.parse(bGuardadas) : { efectivo: 0, banco: 0, chivoWallet: 0 };
    }
    return { efectivo: 0, banco: 0, chivoWallet: 0 };
  });

  const [alerta, setAlerta] = useState(null);
  const LIMITE_GASTO_PORCENTAJE = 0.8; 

  // GUARDADO EN CALIENTE: Sincroniza en LocalStorage evitando sobreescrituras en cero
  useEffect(() => {
    if (usuario && (transacciones.length > 0 || billeteras.efectivo !== 0 || billeteras.banco !== 0 || billeteras.chivoWallet !== 0)) {
      localStorage.setItem(`${usuario.nombre}_transacciones`, JSON.stringify(transacciones));
      localStorage.setItem(`${usuario.nombre}_billeteras`, JSON.stringify(billeteras));
    }
  }, [transacciones, billeteras, usuario]);

  const iniciarSesion = (nombreUsuario) => {
    const datosUsuario = { nombre: nombreUsuario, loginAt: new Date().toLocaleString() };
    localStorage.setItem('pro_usuario_activo', JSON.stringify(datosUsuario));
    
    const tGuardadas = localStorage.getItem(`${nombreUsuario}_transacciones`);
    const bGuardadas = localStorage.getItem(`${nombreUsuario}_billeteras`);
    
    setTransacciones(tGuardadas ? JSON.parse(tGuardadas) : []);
    setBilleteras(bGuardadas ? JSON.parse(bGuardadas) : { efectivo: 0, banco: 0, chivoWallet: 0 });
    setUsuario(datosUsuario);
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

  // REVERSOR TOTAL + REDIRECCIÓN: Deshace por completo el flujo viejo y aplica el nuevo
  const editarTransaccion = (idTransaccion, transaccionCorregida) => {
    const original = transacciones.find(t => t.id === idTransaccion);
    if (!original) return;

    setBilleteras(prev => {
      const copia = { ...prev };
      
      // STEP A: Deshacer contabilidad del flujo antiguo
      const montoOrig = parseFloat(original.monto);
      const comisionOrig = parseFloat(original.comision || 0);

      if (original.tipo === 'ingreso' || original.tipo === 'remesa') {
        copia[original.billetera] -= (montoOrig - comisionOrig);
      } else if (original.tipo === 'gasto') {
        copia[original.billetera] += (montoOrig + comisionOrig);
      } else if (original.tipo === 'transferencia' || original.tipo === 'envio_remesa') {
        copia[original.billeteraOrigen] += (montoOrig + comisionOrig);
        if (original.tipo === 'transferencia') {
          copia[original.billeteraDestino] -= montoOrig;
        }
      }

      // STEP B: Aplicar contabilidad del nuevo flujo corregido
      const montoNuevo = parseFloat(transaccionCorregida.monto);
      const comisionNueva = parseFloat(transaccionCorregida.comision || 0);

      if (transaccionCorregida.tipo === 'ingreso' || transaccionCorregida.tipo === 'remesa') {
        copia[transaccionCorregida.billetera] += (montoNuevo - comisionNueva);
      } else if (transaccionCorregida.tipo === 'gasto') {
        copia[transaccionCorregida.billetera] -= (montoNuevo + comisionNueva);
      } else if (transaccionCorregida.tipo === 'transferencia' || transaccionCorregida.tipo === 'envio_remesa') {
        copia[transaccionCorregida.billeteraOrigen] -= (montoNuevo + comisionNueva);
        if (transaccionCorregida.tipo === 'transferencia') {
          copia[transaccionCorregida.billeteraDestino] += montoNuevo;
        }
      }
      return copia;
    });

    // Mantener consistencia del ID y la fecha original
    setTransacciones(prev => prev.map(t => t.id === idTransaccion ? { ...t, ...transaccionCorregida } : t));
  };

  useEffect(() => {
    if (transacciones.length === 0) { setAlerta(null); return; }
    const totalIngresos = transacciones.filter(t => t.tipo === 'ingreso' || t.tipo === 'remesa').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
    const totalGastos = transacciones.filter(t => t.tipo === 'gasto' || t.tipo === 'envio_remesa').reduce((acc, curr) => acc + parseFloat(curr.monto), 0);
    const totalComisiones = transacciones.reduce((acc, curr) => acc + parseFloat(curr.comision || 0), 0);

    if (totalIngresos > 0 && ((totalGastos + totalComisiones) / totalIngresos) >= LIMITE_GASTO_PORCENTAJE) {
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
      transacciones, billeteras, agregarTransaccion, editarTransaccion, alerta, obtenerTotalComisiones,
      usuario, iniciarSesion, cerrarSesion 
    }}>
      {children}
    </GastosContext.Provider>
  );
};