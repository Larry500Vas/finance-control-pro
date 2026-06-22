import React, { useState, useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { PlusCircle } from 'lucide-react';

const BANCO_1_NOMBRE = "Banco Agrícola";
const BANCO_2_NOMBRE = "Banco Cuscatlán";

export const FormularioTransaccion = () => {
  const { agregarTransaccion } = useContext(GastosContext);
  
  const [tipo, setTipo] = useState('gasto');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [comision, setComision] = useState('');
  const [billetera, setBilletera] = useState('efectivo');
  const [billeteraOrigen, setBilleteraOrigen] = useState('efectivo');
  const [billeteraDestino, setBilleteraDestino] = useState('banco1');
  const [categoria, setCategoria] = useState('Comida');

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!descripcion.trim() || !monto || parseFloat(monto) <= 0) {
      alert("Por favor rellena los campos con valores correctos.");
      return;
    }

    if (tipo === 'transferencia' && billeteraOrigen === billeteraDestino) {
      alert("No puedes transferir fondos a la misma billetera.");
      return;
    }

    const transaccion = {
      id: Date.now(),
      tipo,
      descripcion: descripcion.trim(),
      monto: parseFloat(monto),
      comision: parseFloat(comision || 0),
      fecha: new Date().toLocaleDateString()
    };

    if (tipo === 'ingreso' || tipo === 'remesa') transaccion.billetera = billetera;
    if (tipo === 'gasto') { transaccion.billetera = billetera; transaccion.categoria = categoria; }
    if (tipo === 'transferencia') { transaccion.billeteraOrigen = billeteraOrigen; transaccion.billeteraDestino = billeteraDestino; }
    if (tipo === 'envio_remesa') transaccion.billeteraOrigen = billeteraOrigen;

    agregarTransaccion(transaccion);
    setDescripcion('');
    setMonto('');
    setComision('');
  };

  return (
    <form onSubmit={manejarEnvio} style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
      <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>Nueva Operación</h3>
      
      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Tipo de Flujo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
          <option value="gasto">🔻 Gasto Ordinario</option>
          <option value="ingreso">🟢 Ingreso / Depósito</option>
          <option value="transferencia">⇄ Transferencia Interna</option>
          <option value="remesa">📥 Recibir Remesa</option>
          <option value="envio_remesa">📤 Enviar Remesa Extranjero</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Descripción</label>
        <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej. Compra de súper, pago local" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Monto ($)</label>
          <input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#be123c', marginBottom: '5px' }}>Comisión ($)</label>
          <input type="number" step="0.01" value={comision} onChange={(e) => setComision(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
        </div>
      </div>

      {(tipo === 'gasto' || tipo === 'ingreso' || tipo === 'remesa') && (
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Billetera Ejecutora</label>
          <select value={billetera} onChange={(e) => setBilletera(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
            <option value="efectivo">EFECTIVO</option>
            <option value="banco1">{BANCO_1_NOMBRE.toUpperCase()}</option>
            <option value="banco2">{BANCO_2_NOMBRE.toUpperCase()}</option>
            <option value="chivoWallet">CHIVO WALLET</option>
          </select>
        </div>
      )}

      {tipo === 'gasto' && (
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Categoría</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
            <option value="Comida">Comida</option>
            <option value="Servicios">Servicios</option>
            <option value="Ropa">Ropa</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      )}

      {(tipo === 'transferencia' || tipo === 'envio_remesa') && (
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Billetera Origen</label>
          <select value={billeteraOrigen} onChange={(e) => setBilleteraOrigen(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
            <option value="efectivo">EFECTIVO</option>
            <option value="banco1">{BANCO_1_NOMBRE.toUpperCase()}</option>
            <option value="banco2">{BANCO_2_NOMBRE.toUpperCase()}</option>
            <option value="chivoWallet">CHIVO WALLET</option>
          </select>
        </div>
      )}

      {tipo === 'transferencia' && (
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: '#475569', marginBottom: '5px' }}>Billetera Destino</label>
          <select value={billeteraDestino} onChange={(e) => setBilleteraDestino(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
            <option value="efectivo">EFECTIVO</option>
            <option value="banco1">{BANCO_1_NOMBRE.toUpperCase()}</option>
            <option value="banco2">{BANCO_2_NOMBRE.toUpperCase()}</option>
            <option value="chivoWallet">CHIVO WALLET</option>
          </select>
        </div>
      )}

      <button type="submit" style={{ width: '100%', backgroundColor: '#0f172a', border: 'none', color: '#fff', padding: '12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', marginTop: '10px' }}>
        <PlusCircle size={18} /> Asentar Operación
      </button>
    </form>
  );
};