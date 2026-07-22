# AgentHub Admin Dashboard - SPECS

## 1. Dashboard
- Debe mostrar una cuadrícula 2x2 con cuatro métricas: ingresos totales, pérdidas por descuentos, agentes activos y agentes con fallos.
- Cada tarjeta de métrica debe incluir etiqueta, valor destacado y color de acento diferenciado por tipo de dato.
- Debe existir un bloque visual para actividad semanal con barras y etiquetas por día.

## 2. Gestión de Usuarios
- Debe renderizar una tabla con columnas: ID, Nombre, Email, Plan, Estado y Acciones.
- Cada fila debe incluir un dropdown de acciones con al menos: Ver detalle y Eliminar.
- Debe existir un campo de búsqueda que filtre por nombre, email, plan, estado o ID.

## 3. Gestión de Agentes
- Debe renderizar una lista de agentes con ID, nombre, cliente y badge de estado.
- La lista de skills de cada agente debe iniciar colapsada y expandirse/colapsarse con transición visible.
- Cada agente debe incluir acciones: Configurar prompt y Eliminar; Configurar prompt debe abrir modal con textarea editable.

## 4. Skills
- Debe mostrar tarjetas de skills con ID, nombre, descripción y métricas de uso/precio.
- Cada tarjeta debe incluir dropdown con acciones: Ver detalle y Eliminar.
- Debe existir un campo de búsqueda que filtre por nombre, descripción o ID de skill.

## 5. Contrataciones de Agentes
- Debe mostrar una tabla con columnas: ID, Cliente, Agente, Skills, Periodo, Pago total y Acciones.
- Cada fila debe incluir acción Ver detalle vía dropdown.
- Debe existir un campo de búsqueda que filtre por cliente, agente, skill, fechas o ID.

## 6. Log de Errores
- Debe mostrar una tabla con columnas: ID, Fecha, Agente, Tipo, Severidad, Descripción y Acciones.
- La severidad debe representarse con badges de color para low, medium y high.
- Cada fila debe incluir acciones Ver traza del error y Marcar resuelto vía dropdown.

## 7. Reglas Globales de UI
- Se debe usar Tailwind CSS exclusivamente por CDN, sin CSS externo y sin estilos inline.
- El layout debe incluir barra lateral persistente en desktop/tablet y drawer en móvil.
- El modo oscuro/claro debe aplicarse a todo el panel y persistir en localStorage.

## 8. Interacciones
- Todos los dropdowns deben abrirse al clic y cerrarse al seleccionar acción o al hacer clic fuera.
- Todos los modales deben cerrarse mediante botón X y clic sobre el backdrop.
- La navegación lateral debe activar visualmente la sección actual y mostrar su vista correspondiente.

## Inventario de Componentes
- Sidebar de navegación con estado activo
- Top bar con toggle dark/light
- Cards de métricas
- Tablas de datos con header semántico
- Dropdown de acciones (⋮)
- Modal reutilizable (título, contenido, footer)
- Badges de estado y severidad
- Bloques colapsables de skills
- Buscadores por sección
- Drawer móvil con backdrop

## Criterios de Aceptación
1. Existen seis vistas funcionales y accesibles desde la barra lateral.
2. Todas las vistas usan HTML semántico: nav, header, main, section y table cuando aplica.
3. El panel usa exclusivamente utilidades Tailwind por CDN.
4. No existen estilos inline ni hojas CSS externas de estilos personalizados.
5. Todos los listados con acciones tienen dropdown funcional por fila.
6. El dropdown se cierra al hacer clic fuera.
7. Ver detalle abre modal al menos en Usuarios, Skills, Contrataciones y Log de Errores.
8. Los modales se cierran con botón X y con backdrop.
9. Las skills de agentes están colapsadas por defecto y tienen transición al expandir/colapsar.
10. El modo oscuro/claro afecta todo el panel y persiste entre cambios de vista.
11. Los datos hardcodeados son consistentes entre Gestión de Agentes, Contrataciones y Log de Errores.
12. El layout es usable en desktop y tablet, con navegación clara y tablas desplazables cuando es necesario.
