import React, { useState, useContext } from 'react';
import { GastosContext } from '../context/GastosContext';
import { ShieldCheck, Lock, UserPlus } from 'lucide-react';

export const Login = () => {
  const { iniciarSesion } = useContext(GastosContext);
  
  // Modo de pantalla: 'login' o 'registro'
  const [modo, setModo] = useState('login'); 
  
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');

  const manejarEnvio = (e) => {
    e.preventDefault();
    
    if (!nombre.trim() || !password.trim()) {
      alert("Por favor, rellena todos los campos.");
      return;
    }

    if (modo === 'registro') {
      // GUARDAR NUEVO USUARIO EN LOCALSTORAGE
      const nuevoUsuarioCredenciales = {
        nombre: nombre.trim(),
        password: password.trim()
      };
      localStorage.setItem('credenciales_sistema_pro', JSON.stringify(nuevoUsuarioCredenciales));
      alert("¡Usuario creado con éxito de forma local! Ya puedes iniciar sesión.");
      setModo('login'); // Cambiar automáticamente a login
      setPassword('');  // Limpiar clave por seguridad
    } else {
      // LOGIN: LEER LAS CREDENCIALES GUARDADAS
      const credencialesGuardadas = localStorage.getItem('credenciales_sistema_pro');
      
      if (!credencialesGuardadas) {
        alert("No hay ningún usuario registrado todavía. Cambia a la pestaña de 'Crear Cuenta'.");
        return;
      }

      const cuentaValida = JSON.parse(credencialesGuardadas);

      if (nombre.trim() === cuentaValida.nombre && password.trim() === cuentaValida.password) {
        iniciarSesion(cuentaValida.nombre);
      } else {
        alert("🔒 Usuario o Clave de seguridad incorrecta. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        
        <div style={{ backgroundColor: '#e0f2fe', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
          <ShieldCheck size={32} color="#0284c7" />
        </div>
        
        <h2 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '1.6rem', fontWeight: 'bold' }}>Finance Control Pro</h2>
        <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '0.9rem' }}>
          {modo === 'login' ? 'Ingresa para desbloquear tus monederos' : 'Configura tus credenciales maestras'}
        </p>

        {/* BOTONES DE PESTAÑA (LOGIN / REGISTRO) */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', backgroundColor: '#f1f5f9', padding: '5px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => setModo('login')}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer',
              backgroundColor: modo === 'login' ? '#ffffff' : 'transparent',
              color: modo === 'login' ? '#0f172a' : '#64748b',
              boxShadow: modo === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => setModo('registro')}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer',
              backgroundColor: modo === 'registro' ? '#ffffff' : 'transparent',
              color: modo === 'registro' ? '#0f172a' : '#64748b',
              boxShadow: modo === 'registro' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Crear Cuenta
          </button>
        </div>

        {/* FORMULARIO ÚNICO DINÁMICO */}
        <form onSubmit={manejarEnvio} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#334155', fontSize: '0.85rem', fontWeight: '600' }}>Usuario / Operador</label>
            <input 
              type="text" 
              placeholder="Ej: Juan" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)}
              style={{ width: '91%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '6px', color: '#334155', fontSize: '0.85rem', fontWeight: '600' }}>Clave de Seguridad</label>
            <input 
              type="password" 
              placeholder="Crea tu contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '91%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ 
              width: '100%', padding: '12px', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: modo === 'login' ? '#0284c7' : '#16a34a'
            }}
          >
            {modo === 'login' ? (
              <>
                <Lock size={16} /> Desbloquear Sistema
              </>
            ) : (
              <>
                <UserPlus size={16} /> Registrar Operador
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};