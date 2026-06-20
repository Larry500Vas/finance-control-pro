import React, { useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, DownloadCloud, UploadCloud, Percent } from 'lucide-react';

export const HistorialTransacciones = () => {
  const { transacciones } = useContext(GastosContext);

  if (transacciones.length === 0) {
    return (
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        No hay movimientos registrados en el ciclo actual. ¡Inicia operaciones!
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '30px' }}>
      <h3 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>Registro Histórico de Operaciones</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '0.85rem' }}>
              <th style={{ padding: '12px' }}>Flujo/Tipo</th>
              <th style={{ padding: '12px' }}>Descripción</th>
              <th style={{ padding: '12px' }}>Origen ➔ Destino / Cat</th>
              <th style={{ padding: '12px' }}>Monto Operación</th>
              <th style={{ padding: '12px', color: '#be123c' }}>Comisión / Pérdida</th>
              <th style={{ padding: '12px' }}>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t) => {
              let Icono = ArrowDownCircle;
              let colorMonto = '#dc2626';
              let prefijo = '-';
              let tagDestino = t.billetera ? t.billetera.toUpperCase() : '';
              let bgTag = '#f1f5f9';
              let colorTag = '#334155';

              // Evaluación de los nuevos tipos de movimientos
              if (t.tipo === 'ingreso') {
                Icono = ArrowUpCircle;
                colorMonto = '#16a34a';
                prefijo = '+';
              } else if (t.tipo === 'remesa') {
                Icono = DownloadCloud;
                colorMonto = '#0d9488';
                prefijo = '+';
                tagDestino = `REMUSA ➔ ${t.billetera.toUpperCase()}`;
                bgTag = '#ccfbf1';
                colorTag = '#115e59';
              } else if (t.tipo === 'envio_remesa') {
                Icono = UploadCloud;
                colorMonto = '#7c3aed';
                prefijo = '-';
                tagDestino = `${t.billeteraOrigen.toUpperCase()} ➔ EXTERNO`;
                bgTag = '#f3e8ff';
                colorTag = '#6b21a8';
              } else if (t.tipo === 'transferencia') {
                Icono = RefreshCw;
                colorMonto = '#2563eb';
                prefijo = '⇄ ';
                tagDestino = `${t.billeteraOrigen.toUpperCase()} ➔ ${t.billeteraDestino.toUpperCase()}`;
                bgTag = '#eff6ff';
                colorTag = '#1e40af';
              } else if (t.tipo === 'gasto') {
                tagDestino = `${t.categoria} (${t.billetera.toUpperCase()})`;
              }

              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '0.95rem' }}>
                  <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icono color={colorMonto} size={18} />
                    <span style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.8rem', color: colorMonto }}>
                      {t.tipo.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>{t.descripcion}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: bgTag, color: colorTag, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                      {tagDestino}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: colorMonto }}>
                    {prefijo}${t.monto.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', fontWeight: '500', color: t.comision > 0 ? '#be123c' : '#94a3b8' }}>
                    {t.comision > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Percent size={12} /> ${t.comision.toFixed(2)}
                      </span>
                    ) : (
                      '$0.00'
                    )}
                  </td>
                  <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>{t.fecha}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};