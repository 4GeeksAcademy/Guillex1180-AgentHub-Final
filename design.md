# AgentHub - Especificaciones de Diseño e Interfaz

## Requisitos de Estilo y Maquetación
- **Framework CSS:** Tailwind CSS (exclusivamente vía CDN). No se permite CSS personalizado ni estilos en línea.
- **HTML Semántico:** Uso obligatorio de etiquetas como `<nav>`, `<header>`, `<main>`, `<section>`, y `<table>`.
- **Modo Oscuro:** Soporte global mediante las clases `dark:` de Tailwind. El estado debe controlarse mediante un toggle en la barra superior.
- **Layout:** El diseño debe ser responsive, optimizado para viewports de escritorio y tablet. Debe incluir una barra lateral (sidebar) persistente.

## Inventario de Componentes UI
1. **Sidebar:** Navegación persistente con indicador de vista activa.
2. **Top Bar:** Barra superior con el toggle de modo claro/oscuro.
3. **Métricas (Cards):** Tarjetas con sombra sutil, iconos, etiquetas y valores. Colores de acento dependientes de la métrica.
4. **Dropdown de Acciones (⋮):** Menú contextual para tablas y listas. Debe cerrarse automáticamente al hacer clic fuera del elemento.
5. **Modales:** Ventanas superpuestas (overlays). Deben cerrarse mediante un botón "X" o haciendo clic en el fondo oscuro (backdrop).
6. **Badges:** Indicadores visuales con código de color para estados y gravedades de error.
7. **Colapsables:** Contenedores expansibles con transición suave (ej. listas de skills).

## Vistas Requeridas
1. **Dashboard:** Cuadrícula 2x2 con métricas principales (ingresos, pérdidas, agentes activos, fallos) y un espacio reservado para un gráfico semanal.
2. **Gestión de Usuarios:** Tabla de usuarios registrados con dropdown de acciones (Ver detalle, Eliminar).
3. **Gestión de Agentes:** Lista de agentes con estado y lista de skills colapsada por defecto. Acciones (Configurar prompt en textarea, Eliminar).
4. **Skills:** Catálogo de habilidades disponibles con métricas de uso y explicación del concepto. Acciones (Ver detalle, Eliminar).
5. **Contrataciones de Agentes:** Historial de alquileres con desglose financiero. Acciones (Ver detalle).
6. **Log de Errores:** Registro de incidencias categorizadas por severidad mediante badges. Acciones (Ver traza del error, Marcar resuelto).