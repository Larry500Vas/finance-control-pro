import React, { useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { Wallet, Landmark, Percent, AlertTriangle } from 'lucide-react';

// 📝 CONFIGURA AQUÍ LOS NOMBRES DE TUS BANCOS
const BANCO_1_NOMBRE = "Banco Agrícola";
const BANCO_2_NOMBRE = "Banco Cuscatlán";

export const Dashboard = () => {
  // Leemos el objeto billeteras directamente del contexto reactivo
  const { billeteras, transacciones, alerta, obtenerTotalComisiones } = useContext(GastosContext);

  // Extraemos los saldos con un fallback de 0 por seguridad para que React reaccione al instante
  const efectivo = parseFloat(billeteras?.efectivo ?? 0);
  const banco1 = parseFloat(billeteras?.banco1 ?? 0);
  const banco2 = parseFloat(billeteras?.banco2 ?? 0);
  const chivoWallet = parseFloat(billeteras?.chivoWallet ?? 0);

  // Balance global reactivo en tiempo real
  const totalGlobal = efectivo + banco1 + banco2 + chivoWallet;

  // Filtro exacto de gastos acumulados mapeado directamente del arreglo de transacciones activo
  const totalGastosAcumulados = transacciones
    .filter(t => t.tipo === 'gasto' || t.tipo === 'envio_remesa')
    .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      
      {alerta && (
        <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', color: '#991b1b', fontSize: '0.9rem', fontWeight: '500' }}>
          <AlertTriangle color="#ef4444" size={20} />
          <span>{alerta}</span>
        </div>
      )}

      {/* GRID DE BALANCES PRINCIPALES */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* BALANCE GLOBAL CARD */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance Total Disponible</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>
            ${totalGlobal.toFixed(2)}
          </h2>
        </div>

        {/* TARJETA DE TOTAL DE GASTOS */}
        <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fee2e2', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total Gastos Asentados</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#e11d48' }}>
            ${totalGastosAcumulados.toFixed(2)}
          </h2>
        </div>
      </div>

      {/* SUB-BILLETERAS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        
        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#f0fdf4', padding: '10px', borderRadius: '8px' }}><Wallet color="#16a34a" size={20} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Efectivo</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>${efectivo.toFixed(2)}</h4>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '10px', borderRadius: '8px' }}><Landmark color="#2563eb" size={20} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{BANCO_1_NOMBRE}</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>${banco1.toFixed(2)}</h4>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}><Landmark color="#0284c7" size={20} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{BANCO_2_NOMBRE}</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>${banco2.toFixed(2)}</h4>
          </div>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '15px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#fff7ed', padding: '10px', borderRadius: '8px' }}><Wallet color="#ea580c" size={20} /></div>
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Chivo Wallet</p>
            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>${chivoWallet.toFixed(2)}</h4>
          </div>
        </div>

      </div>

      {/* TOTAL COMISIONES */}
      <div style={{ backgroundColor: '#fff1f2', padding: '15px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ backgroundColor: '#ffe4e6', padding: '10px', borderRadius: '8px' }}><Percent color="#be123c" size={18} /></div>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#9f1239' }}>Pérdidas Absolutas por Comisión</p>
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#be123c', fontWeight: 'bold' }}>
            ${(obtenerTotalComisiones() || 0).toFixed(2)}
          </h4>
        </div>
      </div>

    </div>
  );
};