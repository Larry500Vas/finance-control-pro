import React, { useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { Wallet, Landmark, Bitcoin, AlertTriangle, ArrowUpRight, ArrowDownLeft, DollarSign } from 'lucide-react';

export const Dashboard = () => {
  const { billeteras, transacciones, alerta, obtenerTotalComisiones } = useContext(GastosContext);

  // Cálculos dinámicos en tiempo real para los indicadores superiores
  const totalBalance = billeteras.efectivo + billeteras.banco + billeteras.chivoWallet;
  const totalComisiones = obtenerTotalComisiones();
  
  const totalIngresos = transacciones
    .filter(t => t.tipo === 'ingreso' || t.tipo === 'remesa')
    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  const totalGastos = transacciones
    .filter(t => t.tipo === 'gasto' || t.tipo === 'envio_remesa')
    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* SECCIÓN DE ALERTAS FINANCIERAS CRÍTICAS */}
      {alerta && (
        <div style={{
          backgroundColor: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#991b1b'
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ display: 'block' }}>¡Alerta de Margen de Riesgo!</strong>
            <span style={{ fontSize: '0.9rem' }}>{alerta}</span>
          </div>
        </div>
      )}

      {/* RECUADROS DE RESUMEN GLOBAL (ENTRADAS, SALIDAS Y PÉRDIDAS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Balance General */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.9rem' }}>
            <span>Balance Total General</span>
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: '10px 0 0 0', color: '#0f172a', fontWeight: 'bold' }}>
            ${totalBalance.toFixed(2)}
          </h2>
        </div>

        {/* Ingresos + Remesas Recibidas */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontSize: '0.9rem', fontWeight: '500' }}>
            <span>Total Entradas</span>
            <ArrowUpRight size={18} />
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: '10px 0 0 0', color: '#16a34a', fontWeight: 'bold' }}>
            ${totalIngresos.toFixed(2)}
          </h2>
        </div>

        {/* Gastos + Envíos */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontSize: '0.9rem', fontWeight: '500' }}>
            <span>Total Salidas</span>
            <ArrowDownLeft size={18} />
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: '10px 0 0 0', color: '#dc2626', fontWeight: 'bold' }}>
            ${totalGastos.toFixed(2)}
          </h2>
        </div>

        {/* TARJETA PRO: CONTROL DE PÉRDIDAS POR COMISIONES / COBROS */}
        <div style={{ backgroundColor: '#fff1f2', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #fecdd3' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#be123c', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span>Pérdidas por Comisiones</span>
            <DollarSign size={18} />
          </div>
          <h2 style={{ fontSize: '1.8rem', margin: '10px 0 0 0', color: '#be123c', fontWeight: 'bold' }}>
            ${totalComisiones.toFixed(2)}
          </h2>
        </div>

      </div>

      {/* SECCIÓN DE BILLETERAS / MONEDEROS REALES */}
      <h3 style={{ color: '#1e293b', marginBottom: '15px', fontSize: '1.1rem', fontWeight: 'bold' }}>Mis Billeteras (Monederos)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '10px' }}>
        
        {/* Efectivo Líquido */}
        <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(2, 132, 199, 0.2)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
            <Wallet size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', opacity: 0.9, display: 'block' }}>Efectivo</span>
            <h4 style={{ margin: '3px 0 0 0', fontSize: '1.35rem', fontWeight: 'bold' }}>${billeteras.efectivo.toFixed(2)}</h4>
          </div>
        </div>

        {/* Cuenta Bancaria */}
        <div style={{ backgroundColor: '#4f46e5', color: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
            <Landmark size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', opacity: 0.9, display: 'block' }}>Cuenta Bancaria</span>
            <h4 style={{ margin: '3px 0 0 0', fontSize: '1.35rem', fontWeight: 'bold' }}>${billeteras.banco.toFixed(2)}</h4>
          </div>
        </div>

        {/* Chivo Wallet / Criptoactivos */}
        <div style={{ backgroundColor: '#f59e0b', color: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.2)' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
            <Bitcoin size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', opacity: 0.9, display: 'block' }}>Chivo Wallet (BTC)</span>
            <h4 style={{ margin: '3px 0 0 0', fontSize: '1.35rem', fontWeight: 'bold' }}>${billeteras.chivoWallet.toFixed(2)}</h4>
          </div>
        </div>

      </div>
    </div>
  );
};