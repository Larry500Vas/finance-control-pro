import React, { useContext, useState } from 'react';
import { GastosContext } from '../context/GastosContext';
import { ArrowUpCircle, ArrowDownCircle, RefreshCw, DownloadCloud, UploadCloud, Percent, Edit2, Check, X } from 'lucide-react';

export const HistorialTransacciones = () => {
  const { transacciones, editarTransaccion } = useContext(GastosContext);
  
  // Estado de edición extendida
  const [idEditando, setIdEditando] = useState(null);
  const [tipoEditado, setTipoEditado] = useState('gasto');
  const [descEditada, setDescEditada] = useState('');
  const [montoEditado, setMontoEditado] = useState('');
  const [comisionEditada, setComisionEditada] = useState('');
  const [billeteraEditada, setBilleteraEditada] = useState('efectivo');
  const [billeteraOrigenEditada, setBilleteraOrigenEditada] = useState('efectivo');
  const [billeteraDestinoEditada, setBilleteraDestinoEditada] = useState('banco');
  const [categoriaEditada, setCategoriaEditada] = useState('Comida');

  const activarEdicion = (t) => {
    setIdEditando(t.id);
    setTipoEditado(t.tipo);
    setDescEditada(t.descripcion);
    setMontoEditado(t.monto);
    setComisionEditada(t.comision || 0);
    setBilleteraEditada(t.billetera || 'efectivo');
    setBilleteraOrigenEditada(t.billeteraOrigen || 'efectivo');
    setBilleteraDestinoEditada(t.billeteraDestino || 'banco');
    setCategoriaEditada(t.categoria || 'Comida');
  };

  const cancelarEdicion = () => {
    setIdEditando(null);
  };

  const guardarCambios = (id) => {
    if (!descEditada.trim() || parseFloat(montoEditado) <= 0) {
      alert("Por favor ingresa montos y datos válidos.");
      return;
    }

    if ((tipoEditado === 'transferencia' || tipoEditado === 'envio_remesa') && billeteraOrigenEditada === billeteraDestinoEditada && tipoEditado === 'transferencia') {
      alert("La billetera de origen y destino no pueden ser iguales.");
      return;
    }

    const objetoCorregido = {
      tipo: tipoEditado,
      descripcion: descEditada.trim(),
      monto: parseFloat(montoEditado),
      comision: parseFloat(comisionEditada || 0)
    };

    // Estructurar campos según el tipo de flujo dinámico
    if (tipoEditado === 'ingreso' || tipoEditado === 'remesa') {
      objetoCorregido.billetera = billeteraEditada;
    } else if (tipoEditado === 'gasto') {
      objetoCorregido.billetera = billeteraEditada;
      objetoCorregido.categoria = categoriaEditada;
    } else if (tipoEditado === 'transferencia') {
      objetoCorregido.billeteraOrigen = billeteraOrigenEditada;
      objetoCorregido.billeteraDestino = billeteraDestinoEditada;
    } else if (tipoEditado === 'envio_remesa') {
      objetoCorregido.billeteraOrigen = billeteraOrigenEditada;
    }

    editarTransaccion(id, objetoCorregido);
    setIdEditando(null);
  };

  if (transacciones.length === 0) {
    return (
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '12px', textAlign: 'center', color: '#64748b', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginTop: '30px' }}>
        No hay movimientos registrados en el ciclo actual.
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
              <th className="no-print" style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t) => {
              const esFilaEditando = idEditando === t.id;

              let Icono = ArrowDownCircle;
              let colorMonto = '#dc2626';
              let prefijo = '-';
              let tagDestino = t.billetera ? t.billetera.toUpperCase() : '';
              let bgTag = '#f1f5f9';
              let colorTag = '#334155';

              if (t.tipo === 'ingreso') {
                Icono = ArrowUpCircle; colorMonto = '#16a34a'; prefijo = '+';
              } else if (t.tipo === 'remesa') {
                Icono = DownloadCloud; colorMonto = '#0d9488'; prefijo = '+';
                tagDestino = `REMASA ➔ ${t.billetera.toUpperCase()}`; bgTag = '#ccfbf1'; colorTag = '#115e59';
              } else if (t.tipo === 'envio_remesa') {
                Icono = UploadCloud; colorMonto = '#7c3aed'; prefijo = '-';
                tagDestino = `${t.billeteraOrigen.toUpperCase()} ➔ EXTERNO`; bgTag = '#f3e8ff'; colorTag = '#6b21a8';
              } else if (t.tipo === 'transferencia') {
                Icono = RefreshCw; colorMonto = '#2563eb'; prefijo = '⇄ ';
                tagDestino = `${t.billeteraOrigen.toUpperCase()} ➔ ${t.billeteraDestino.toUpperCase()}`; bgTag = '#eff6ff'; colorTag = '#1e40af';
              } else if (t.tipo === 'gasto') {
                tagDestino = `${t.categoria} (${t.billetera.toUpperCase()})`;
              }

              return (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: '0.95rem', backgroundColor: esFilaEditando ? '#fbfdbb' : 'transparent' }}>
                  
                  {/* TIPO DE OPERACIÓN (EDITABLE) */}
                  <td style={{ padding: '12px' }}>
                    {esFilaEditando ? (
                      <select 
                        value={tipoEditado} 
                        onChange={(e) => setTipoEditado(e.target.value)}
                        style={{ padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 'bold' }}
                      >
                        <option value="gasto">GASTO</option>
                        <option value="ingreso">INGRESO</option>
                        <option value="transferencia">TRANSFERENCIA</option>
                        <option value="remesa">REMASA</option>
                        <option value="envio_remesa">ENVÍO REMASA</option>
                      </select>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icono color={colorMonto} size={18} />
                        <span style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '0.8rem', color: colorMonto }}>
                          {t.tipo.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* DESCRIPCIÓN (EDITABLE) */}
                  <td style={{ padding: '12px' }}>
                    {esFilaEditando ? (
                      <input 
                        type="text" 
                        value={descEditada} 
                        onChange={(e) => setDescEditada(e.target.value)}
                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '90%' }}
                      />
                    ) : t.descripcion}
                  </td>

                  {/* BILLETERAS / CATEGORÍAS EN CASO DE EDICIÓN */}
                  <td style={{ padding: '12px' }}>
                    {esFilaEditando ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        
                        {/* INPUTS SEGÚN EL TIPO ELEGIDO AL EDITAR */}
                        {(tipoEditado === 'gasto' || tipoEditado === 'ingreso' || tipoEditado === 'remesa') && (
                          <div style={{ fontSize: '0.8rem' }}>
                            <label>Billetera: </label>
                            <select value={billeteraEditada} onChange={(e) => setBilleteraEditada(e.target.value)}>
                              <option value="efectivo">EFECTIVO</option>
                              <option value="banco">BANCO</option>
                              <option value="chivoWallet">CHIVO WALLET</option>
                            </select>
                          </div>
                        )}

                        {tipoEditado === 'gasto' && (
                          <div style={{ fontSize: '0.8rem' }}>
                            <label>Cat: </label>
                            <select value={categoriaEditada} onChange={(e) => setCategoriaEditada(e.target.value)}>
                              <option value="Comida">Comida</option>
                              <option value="Servicios">Servicios</option>
                              <option value="Ropa">Ropa</option>
                              <option value="Entretenimiento">Entretenimiento</option>
                              <option value="Otros">Otros</option>
                            </select>
                          </div>
                        )}

                        {(tipoEditado === 'transferencia' || tipoEditado === 'envio_remesa') && (
                          <div style={{ fontSize: '0.8rem' }}>
                            <label>Origen: </label>
                            <select value={billeteraOrigenEditada} onChange={(e) => setBilleteraOrigenEditada(e.target.value)}>
                              <option value="efectivo">EFECTIVO</option>
                              <option value="banco">BANCO</option>
                              <option value="chivoWallet">CHIVO WALLET</option>
                            </select>
                          </div>
                        )}

                        {tipoEditado === 'transferencia' && (
                          <div style={{ fontSize: '0.8rem' }}>
                            <label>Destino: </label>
                            <select value={billeteraDestinoEditada} onChange={(e) => setBilleteraDestinoEditada(e.target.value)}>
                              <option value="efectivo">EFECTIVO</option>
                              <option value="banco">BANCO</option>
                              <option value="chivoWallet">CHIVO WALLET</option>
                            </select>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ backgroundColor: bgTag, color: colorTag, padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {tagDestino}
                      </span>
                    )}
                  </td>

                  {/* MONTO (EDITABLE) */}
                  <td style={{ padding: '12px', fontWeight: 'bold', color: esFilaEditando ? '#0f172a' : colorMonto }}>
                    {esFilaEditando ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={montoEditado} 
                          onChange={(e) => setMontoEditado(e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '70px', marginLeft: '4px' }}
                        />
                      </div>
                    ) : `${prefijo}$${t.monto.toFixed(2)}`}
                  </td>

                  {/* COMISIÓN (EDITABLE) */}
                  <td style={{ padding: '12px', fontWeight: '500', color: t.comision > 0 || esFilaEditando ? '#be123c' : '#94a3b8' }}>
                    {esFilaEditando ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span>$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={comisionEditada} 
                          onChange={(e) => setComisionEditada(e.target.value)}
                          style={{ padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '60px', marginLeft: '4px' }}
                        />
                      </div>
                    ) : t.comision > 0 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Percent size={12} /> ${t.comision.toFixed(2)}
                      </span>
                    ) : '$0.00'}
                  </td>

                  {/* FECHA */}
                  <td style={{ padding: '12px', color: '#64748b', fontSize: '0.85rem' }}>{t.fecha}</td>

                  {/* ACCIONES */}
                  <td className="no-print" style={{ padding: '12px', textAlign: 'center' }}>
                    {esFilaEditando ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => guardarCambios(t.id)}
                          style={{ padding: '6px 10px', backgroundColor: '#16a34a', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          title="Guardar Todo"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={cancelarEdicion}
                          style={{ padding: '6px 10px', backgroundColor: '#dc2626', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          title="Cancelar"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => activarEdicion(t)}
                        style={{ padding: '6px 10px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '6px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit2 size={13} /> <span style={{ fontSize: '0.8rem', fontWeight: '500' }}>Editar</span>
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};