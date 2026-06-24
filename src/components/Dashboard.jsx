import React, { useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { Wallet, Landmark, Percent, AlertTriangle, DownloadCloud, UploadCloud } from 'lucide-react';

const BANCO_1_NOMBRE = "Banco Agrícola";
const BANCO_2_NOMBRE = "Banco Cuscatlán";

export const Dashboard = () => {
  const { billeteras, transacciones, alerta, obtenerTotalComisiones, exportarRespaldoJSON, importarRespaldoJSON } = useContext(GastosContext);

  const efectivo = parseFloat(billeteras?.efectivo ?? 0);
  const banco1 = parseFloat(billeteras?.banco1 ?? 0);
  const banco2 = parseFloat(billeteras?.banco2 ?? 0);
  const chivoWallet = parseFloat(billeteras?.chivoWallet ?? 0);

  const totalGlobal = efectivo + banco1 + banco2 + chivoWallet;

  const totalGastosAcumulados = transacciones
    .filter(t => t.tipo === 'gasto' || t.tipo === 'envio_remesa')
    .reduce((acc, curr) => acc + parseFloat(curr.monto || 0), 0);

  // Captura el archivo subido por el usuario, lo lee y lo manda al contexto
  const manejarSubidaArchivo = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = (evento) => {
      try {
        const datosParseados = JSON.parse(evento.target.result);
        importarRespaldoJSON(datosParseados);
      } catch (error) {
        alert("Error al leer el archivo. Asegúrate de subir el archivo .json correcto.");
      }
    };
    lector.readAsText(archivo);
  };

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
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Balance Total Disponible</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#38bdf8' }}>${totalGlobal.toFixed(2)}</h2>
        </div>

        <div style={{ backgroundColor: '#fff5f5', border: '1px solid #fee2e2', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Total Gastos Asentados</p>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#e11d48' }}>${totalGastosAcumulados.toFixed(2)}</h2>
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
          <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#be123c', fontWeight: 'bold' }}>${(obtenerTotalComisiones() || 0).toFixed(2)}</h4>
        </div>
      </div>

      {/* 🛡️ NUEVA SECCIÓN: PANEL DE RESPALDO DE SEGURIDAD */}
      <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '20px', borderRadius: '12px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem' }}>Respaldo y Seguridad de Datos</h4>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>
          Para no perder tus balances si tu laptop se daña, exporta tu copia de seguridad periódicamente. Puedes guardarla en una USB o en la nube.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* BOTÓN EXPORTAR */}
          <button onClick={exportarRespaldoJSON} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
            <DownloadCloud size={16} /> Descargar Respaldo (.json)
          </button>

          {/* BOTÓN IMPORTAR FALSO (Activa el input oculto) */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#475569', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer' }}>
            <UploadCloud size={16} /> Subir y Restaurar Copia
            <input type="file" accept=".json" onChange={manejarSubidaArchivo} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

    </div>
  );
};