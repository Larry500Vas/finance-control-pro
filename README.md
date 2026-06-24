# 💰 Sistema de Control de Gastos y Finanzas Personales

¡Bienvenido! Este es un sistema web reactivo y moderno diseñado para gestionar flujos de dinero en efectivo, billeteras digitales y cuentas bancarias en tiempo real. La aplicación permite registrar ingresos, gastos ordinarios, transferencias internas y flujos de remesas, ofreciendo un control absoluto sobre el capital disponible y las pérdidas por comisiones.

---

## 🚀 Características Principales

* **⚡ Balance Reactivo al Instante:** Visualización del saldo global y saldos independientes actualizados en el microsegundo en que se asienta una operación mediante React Context y operadores de fusión nula.
* **🏦 Bancos Personalizados:** Configuración centralizada de los nombres de tus entidades financieras (Ej. Banco Agrícola, Banco Cuscatlán) reflejada automáticamente en toda la interfaz.
* **📊 Tarjeta de Gastos Asentados:** Un panel exclusivo que suma el total de gastos ordinarios y envíos de remesas del ciclo actual para un monitoreo rápido.
* **⚙️ CRUD Completo de Operaciones:** Historial interactivo que permite asentar, editar campos en caliente y eliminar transacciones espurias con reversión matemática automática de los saldos.
* **🚨 Alerta de Riesgo Financiero:** Sistema inteligente que dispara una alerta visual en pantalla si tus gastos y comisiones superan el **80%** de tus ingresos totales.
* **🛡️ Respaldo de Seguridad Local (Anti-pérdidas):** Funcionalidad nativa para exportar toda tu base de datos en un archivo portátil `.json` y restaurarla en cualquier otra PC o navegador al instante.

---

## 🛠️ Arquitectura y Tecnologías Utilizadas

* **Frontend:** React (Vite)
* **Gestión de Estado global:** React Context API (arquitectura reactiva pura de componentes interconectados)
* **Iconografía:** `lucide-react`
* **Estilos:** CSS en línea estructurado (Modular y limpio)
* **Persistencia Local:** `LocalStorage` amarrado por sesión de usuario único

---

## 📂 Estructura de Componentes Clave

```text
src/
├── context/
│   └── GastosContext.jsx         # Cerebro matemático: maneja estados, CRUD y lógica de archivos JSON.
└── components/
    ├── Dashboard.jsx             # Tarjetas de balances globales, sub-billeteras y botones de respaldo.
    ├── FormularioTransaccion.jsx  # Selector dinámico para ingresar flujos (Ingresos, Gastos, Transferencias).
    └── HistorialTransacciones.jsx # Tabla interactiva con edición en línea y borrado de registros.