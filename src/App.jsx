import React, { useContext } from 'react';
import { GastosProvider, GastosContext } from './context/GastosContext';
import { Dashboard } from './components/Dashboard';
import { FormularioTransaccion } from './components/FormularioTransaccion';
import { HistorialTransacciones } from './components/HistorialTransacciones';
import { Login } from './components/Login';
import { LogOut, User, FileText, Code } from 'lucide-react';

function ContenidoApp() {
  const { usuario, cerrarSesion } = useContext(GastosContext);

  if (!usuario) {
    return <Login />;
  }

  const imprimirReporte = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER PRINCIPAL */}
      <header className="no-print" style={{ backgroundColor: '#335094', color: '#ffffff', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}> Finance Control Pro</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={imprimirReporte}
            style={{ backgroundColor: '#0284c7', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 'bold' }}
          >
            <FileText size={15} /> Exportar Reporte PDF
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem' }}>
            <User size={14} color="#38bdf8" />
            <span>Operador: <strong style={{ color: '#38bdf8' }}>{usuario.nombre}</strong></span>
          </div>

          <button 
            onClick={cerrarSesion}
            style={{ backgroundColor: '#b91c1c', border: 'none', color: '#fff', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 'bold' }}
          >
            <LogOut size={14} /> Salir
          </button>
        </div>
      </header>

      {/* ENCABEZADO EXCLUSIVO PARA EL REPORTE IMPRESO (Solo se activa en el PDF) */}
      <div className="print-only" style={{ display: 'none', borderBottom: '3px solid #0f172a', paddingBottom: '15px', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', color: '#0f172a' }}>REPORTE FINANCIERO DE AUDITORÍA</h1>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>Ecosistema de Control de Activos y Pérdidas por Comisiones</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h3 style={{ margin: 0, color: '#0284c7' }}>Finance Control Pro v2.5</h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Software de Transacciones Globales</p>
          </div>
        </div>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem', color: '#334155' }}>
          <strong>Desarrollador Responsable:</strong> Larry Fuentes | <strong>Operador Activo:</strong> {usuario.nombre} | <strong>Fecha de Emisión:</strong> {new Date().toLocaleString()}
        </div>
      </div>

      {/* INYECCIÓN DE ESTILOS CSS RECONFIGURADOS */}
      <style>{`
        /* Por defecto, el encabezado de impresión está oculto en la web */
        .print-only { display: none !important; }

        @media print {
          .no-print, .no-print * {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          table { page-break-inside: avoid; }
        }
      `}</style>

      {/* CONTENIDO PRINCIPAL RESPONSIVE */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px', flex: 1, width: '90%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', alignItems: 'start' }}>
          <div className="no-print">
            <FormularioTransaccion />
          </div>
          <Dashboard />
        </div>
        <HistorialTransacciones />
      </main>

      {/* FOOTER DE MARCA PERSONAL (Oculto en impresión, visible en web) */}
      <footer className="no-print" style={{ backgroundColor: '#0f172a', color: '#94a3b8', padding: '20px text-align', textAlign: 'center', fontSize: '0.9rem', borderTop: '1px solid #1e293b', marginTop: '40px', paddingBottom: '20px', paddingTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <Code size={16} color="#38bdf8" />
          <span style={{ color: '#f1f5f9', fontWeight: '600' }}>Desarrollador Frontend Larry Fuentes</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>© 2026 Core Finance Architecture. Todos los derechos reservados. Sistema Pro Responsive.</p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <GastosProvider>
      <ContenidoApp />
    </GastosProvider>
  );
}

export default App;