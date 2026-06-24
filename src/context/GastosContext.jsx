import React, { createContext, useState, useEffect } from 'react';

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  
  // 1. ESTADO DEL USUARIO
  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  });

  // 2. ESTADO DE TRANSACCIONES
  const [transacciones, setTransacciones] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      const tGuardadas = localStorage.getItem(`${user.nombre}_transacciones`);
      return tGuardadas ? JSON.parse(tGuardadas) : [];
    }
    return [];
  });
  
  // 3. ESTADO DE BILLETERAS
  const [billeteras, setBilleteras] = useState(() => {
    const usuarioGuardado = localStorage.getItem('pro_usuario_activo');
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      const bGuardadas = localStorage.getItem(`${user.nombre}_billeteras`);
      return bGuardadas ? JSON.parse(bGuardadas) : { efectivo: 0, banco1: 0, banco2: 0, chivoWallet: 0 };
    }
    return { efectivo: 0, banco1: 0, banco2: 0, chivoWallet: 0 };
  });

  const [alerta, setAlerta] = useState(null);
  const LIMITE_GASTO_PORCENTAJE = 0.8; 

  // GUARDADO AUTOMÁTICO EN LOCALSTORAGE
  useEffect(() => {
    if (usuario) {
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
    setBilleteras(bGuardadas ? JSON.parse(bGuardadas) : { efectivo: 0, banco1: 0, banco2: 0, chivoWallet: 0 });
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

  const editarTransaccion = (idTransaccion, transaccionCorregida) => {
    const original = transacciones.find(t => t.id === idTransaccion);
    if (!original) return;

    setBilleteras(prev => {
      const copia = { ...prev };
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

    setTransacciones(prev => prev.map(t => t.id === idTransaccion ? { ...t, ...transaccionCorregida } : t));
  };

  const eliminarTransaccion = (idTransaccion) => {
    const objetivo = transacciones.find(t => t.id === idTransaccion);
    if (!objetivo) return;

    if (!window.confirm(`¿Deseas eliminar la operación: "${objetivo.descripcion}"? Saldo reajustado.`)) {
      return;
    }

    setBilleteras(prev => {
      const copia = { ...prev };
      const monto = parseFloat(objetivo.monto);
      const comision = parseFloat(objetivo.comision || 0);

      if (objetivo.tipo === 'ingreso' || objetivo.tipo === 'remesa') {
        copia[objetivo.billetera] -= (monto - comision);
      } 
      else if (objetivo.tipo === 'gasto') {
        copia[objetivo.billetera] += (monto + comision);
      } 
      else if (objetivo.tipo === 'transferencia' || objetivo.tipo === 'envio_remesa') {
        copia[objetivo.billeteraOrigen] += (monto + comision);
        if (objetivo.tipo === 'transferencia') {
          copia[objetivo.billeteraDestino] -= monto;
        }
      }
      return copia;
    });

    setTransacciones(prev => prev.filter(t => t.id !== idTransaccion));
  };

  // 💾 FUNCIÓN 1: CREAR Y DESCARGAR RESPALDO JSON
  const exportarRespaldoJSON = () => {
    if (!usuario) return alert("Inicia sesión primero.");
    
    const datosRespaldo = {
      billeteras,
      transacciones,
      fechaRespaldo: new Date().toLocaleString()
    };

    // Convertimos el objeto de JS en un string de texto formateado
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datosRespaldo, null, 2));
    const descargarAnchor = document.createElement('a');
    descargarAnchor.setAttribute("href", dataStr);
    descargarAnchor.setAttribute("download", `respaldo_finanzas_${usuario.nombre}.json`);
    document.body.appendChild(descargarAnchor);
    descargarAnchor.click(); // Fuerza la descarga en el navegador
    descargarAnchor.remove();
  };

  // 📥 FUNCIÓN 2: CARGAR RESPALDO JSON Y LEERLO
  const importarRespaldoJSON = (objetoDatos) => {
    if (!objetoDatos.billeteras || !objetoDatos.transacciones) {
      alert("El archivo subido no contiene un formato de respaldo válido.");
      return;
    }
    
    if (window.confirm("¿Estás seguro? Esto reemplazará todo tu historial y saldos actuales con los datos del archivo.")) {
      setBilleteras(objetoDatos.billeteras);
      setTransacciones(objetoDatos.transacciones);
      alert("¡Datos restaurados con éxito!");
    }
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
      transacciones, billeteras, agregarTransaccion, editarTransaccion, eliminarTransaccion, alerta, obtenerTotalComisiones,
      usuario, iniciarSesion, cerrarSesion, exportarRespaldoJSON, importarRespaldoJSON
    }}>
      {children}
    </GastosContext.Provider>
  );
};