import React, { useState, useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { PlusCircle, ArrowLeftRight, Landmark, DollarSign } from 'lucide-react';

export const FormularioTransaccion = () => {
  const { agregarTransaccion, billeteras } = useContext(GastosContext);

  const [tipo, setTipo] = useState('gasto'); // gasto, ingreso, transferencia, remesa, envio_remesa
  const [monto, setMonto] = useState('');
  const [comision, setComision] = useState(''); // Nueva: Pérdida por depósito/envío
  const [descripcion, setDescripcion] = useState('');
  const [billetera, setBilletera] = useState('efectivo'); 
  const [billeteraOrigen, setBilleteraOrigen] = useState('efectivo'); 
  const [billeteraDestino, setBilleteraDestino] = useState('chivoWallet'); 
  const [categoria, setCategoria] = useState('Comida');

  const manejarEnvio = (e) => {
    e.preventDefault();
    const vMonto = parseFloat(monto) || 0;
    const vComision = parseFloat(comision) || 0;

    if (vMonto <= 0) {
      alert("Ingresa un monto válido mayor a 0.");
      return;
    }

    // Validaciones de fondos con comisiones incluidas
    if (tipo === 'gasto' && billeteras[billetera] < (vMonto + vComision)) {
      alert(`Fondos insuficientes en ${billetera}. ¡Necesitas $${(vMonto + vComision).toFixed(2)} incluyendo comisión!`);
      return;
    }
    if ((tipo === 'transferencia' || tipo === 'envio_remesa') && billeteras[billeteraOrigen] < (vMonto + vComision)) {
      alert(`Fondos insuficientes en ${billeteraOrigen} para realizar la operación.`);
      return;
    }

    const nuevaTransaccion = {
      id: Date.now(),
      tipo,
      monto: vMonto,
      comision: vComision,
      descripcion: descripcion || `${tipo.toUpperCase().replace('_', ' ')}`,
      categoria: tipo === 'transferencia' || tipo === 'envio_remesa' ? 'Remesas/Envíos' : categoria,
      billetera: (tipo !== 'transferencia' && tipo !== 'envio_remesa') ? billetera : null,
      billeteraOrigen: (tipo === 'transferencia' || tipo === 'envio_remesa') ? billeteraOrigen : null,
      billeteraDestino: tipo === 'transferencia' ? billeteraDestino : null,
      fecha: new Date().toLocaleDateString()
    };

    agregarTransaccion(nuevaTransaccion);
    setMonto('');
    setComision('');
    setDescripcion('');
  };

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <PlusCircle color="#4f46e5" /> Panel Financiero Avanzado
      </h3>

      <form onSubmit={manejarEnvio}>
        {/* SELECTOR DE OPERACIONES GLOBAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '8px', marginBottom: '15px' }}>
          {[
            { id: 'gasto', label: 'Gasto', color: '#dc2626' },
            { id: 'ingreso', label: 'Ingreso', color: '#16a34a' },
            { id: 'transferencia', label: 'Transferir', color: '#2563eb' },
            { id: 'remesa', label: 'Recibir Remesa', color: '#0d9488' },
            { id: 'envio_remesa', label: 'Enviar Remesa', color: '#7c3aed' }
          ].map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setTipo(btn.id)}
              style={{
                padding: '10px 5px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: tipo === btn.id ? btn.color : '#e2e8f0',
                color: tipo === btn.id ? '#ffffff' : '#475569',
                transition: 'all 0.2s'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* INPUTS PRINCIPALES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>Monto Principal ($)</label>
            <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#e11d48', fontSize: '0.85rem', fontWeight: 'bold' }}>Cobro / Comisión ($)</label>
            <input type="number" step="0.01" value={comision} onChange={(e) => setComision(e.target.value)} placeholder="0.00" style={{ width: '90%', padding: '10px', borderRadius: '8px', border: '1px solid #f43f5e', backgroundColor: '#fff1f2' }} />
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>Descripción / Concepto</label>
          <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Retiro cajero, Comisión Chivo, Remesa de Dallas" style={{ width: '95%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
        </div>

        {/* SELECTORES DINÁMICOS SEGÚN LA OPERACIÓN */}
        <div style={{ marginBottom: '20px' }}>
          {tipo !== 'transferencia' && tipo !== 'envio_remesa' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>Destino/Origen Fondos</label>
                <select value={billetera} onChange={(e) => setBilletera(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <option value="efectivo">💰 Efectivo</option>
                  <option value="banco">🏦 Cuenta Bancaria</option>
                  <option value="chivoWallet">⚡ Chivo Wallet (BTC)</option>
                </select>
              </div>
              {tipo === 'gasto' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                    <option value="Comida">Comida</option>
                    <option value="Servicios">Servicios Básicos</option>
                    <option value="Inversión">Inversión / Activos</option>
                    <option value="Comisiones">Comisiones / Pérdidas</option>
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>Monedero Origen</label>
                <select value={billeteraOrigen} onChange={(e) => setBilleteraOrigen(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                  <option value="efectivo">💰 Efectivo</option>
                  <option value="banco">🏦 Cuenta Bancaria</option>
                  <option value="chivoWallet">⚡ Chivo Wallet (BTC)</option>
                </select>
              </div>
              <ArrowLeftRight style={{ marginTop: '15px', color: '#64748b' }} />
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#64748b', fontSize: '0.85rem' }}>
                  {tipo === 'envio_remesa' ? 'Canal de Salida Externo' : 'Monedero Destino'}
                </label>
                {tipo === 'envio_remesa' ? (
                  <select style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#e2e8f0' }} disabled>
                    <option>Enviado Externamente ➔</option>
                  </select>
                ) : (
                  <select value={billeteraDestino} onChange={(e) => setBilleteraDestino(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="chivoWallet">⚡ Chivo Wallet (BTC)</option>
                    <option value="efectivo">💰 Efectivo</option>
                    <option value="banco">🏦 Cuenta Bancaria</option>
                  </select>
                )}
              </div>
            </div>
          )}
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
          Ejecutar Operación Financiera
        </button>
      </form>
    </div>
  );
};