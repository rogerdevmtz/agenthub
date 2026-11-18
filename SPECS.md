# AgentHub · Especificación del panel de administración

AgentHub alquila agentes de IA a empresas. El personal de operaciones usa el panel para revisar ingresos, consultar usuarios y contratos, configurar agentes y diagnosticar errores de ejecución. El prototipo usa datos ficticios incluidos en el proyecto.

## Stack y alcance

- Un `index.html` semántico y JavaScript vanilla. Usar `header`, `nav`, `main`, `section`, `table` y `dialog` según su función.
- Tailwind CSS cargado vía CDN con variantes `dark:`. Usar clases utilitarias para el diseño, sin CSS propio, atributos `style`, frameworks, jQuery ni compilación.
- Abrir el prototipo localmente en el navegador. Los registros se declaran en el código y las acciones de demostración operan en memoria, sin llamadas a API ni backend. Conservar el tema elegido al navegar y al volver a abrir el panel cuando el navegador permita almacenamiento local.

## Dirección visual

Panel oscuro de estilo SaaS, sobrio y denso en datos, con un único color de acento lima. La marca es el logotipo de Roger Martínez (`assets/roger-martinez.webp`): la R se coloca sobre el nombre, con su punto en verde. Conservar el archivo original y aplicar el color al mostrarlo.

- **Tema oscuro de inicio.** Fondo casi negro `#0C0D0F`, superficies grafito `#17191C`, bordes discretos `#303338`, texto marfil `#F5F6F3` y texto secundario gris plata `#B5B8BF`. Usar el lima `#C7FF4F` en la selección, el foco y los acentos del Dashboard. El tema claro usa fondo blanco frío con bordes gris azulados, texto carbón y acentos lima.
- **Composición de escritorio.** Barra lateral fija de 72 px con la marca encima de los seis iconos, nombres accesibles y ayudas al pasar el cursor. El selector de tema está a la derecha en la cabecera. Mantener unos 24 px de margen y 16 px entre tarjetas. El destino seleccionado se distingue con fondo lima y texto carbón.
- **Tipografía y superficies.** Sans serif de sistema, valores de métricas de 26–28 px con cifras tabulares y texto de datos de 14 px. Alinear los encabezados y paneles al mismo margen. Usar bordes finos, radios de 16 px y separación consistente en tarjetas, tablas y modales. Reservar los efectos de luz para las métricas del Dashboard.
- **Adaptación.** A partir de 1280 px, mostrar cuatro métricas en fila. En tablet, usar una cuadrícula de dos columnas y una barra lateral de iconos con nombres accesibles. En móvil estrecho, llevar la marca a la cabecera, permitir una columna de métricas, mantener acceso a las seis vistas y contener el desplazamiento horizontal de las tablas dentro de su panel.
- **Marcadores de estado.** Combinar texto y color. Usar verde para estados activos o resueltos, ámbar para advertencias, rojo para fallos y gris para inactivos. Mantener foco visible y contraste en ambos temas.

## Vistas

### Dashboard

1. Mostrar tarjetas para ingresos totales del mes, pérdidas por descuentos y cupones, agentes activos y agentes fallando. Cada tarjeta lleva icono, etiqueta y valor de ejemplo.
2. Dar a cada tarjeta un acento semántico, una superficie grafito con textura que se desvanece desde la esquina superior derecha y una línea decorativa con relleno sutil. Mantener alineados iconos, etiquetas y cifras.
3. Debajo de las cuatro tarjetas, mostrar «Actividad semanal» en un panel de ancho completo. Identificar el marcador como gráfico de ejemplo y mostrar una barra ilustrativa por día, una escala vertical y una sola guía discontinua para el promedio diario.
4. En la cabecera, mostrar un saludo, el mes de la demostración y un resplandor verde tenue en escritorio. Debajo de la actividad, mostrar el desglose de ingresos por agente calculado con los importes pagados de las contrataciones iniciadas en el periodo. Mostrar el total en el centro del anillo, el importe y el porcentaje por agente al lado, y un enlace a Contrataciones. En móvil, colocar la lista debajo del anillo.

### Usuarios

1. Mostrar una tabla con al menos cinco usuarios. Incluir nombre, correo, plan y estado. Representar el estado con un badge con texto.
2. Añadir un menú ⋮ por fila con «Ver detalle» y «Eliminar». Pedir confirmación dentro del prototipo antes de retirar una fila de la lista de demostración.
3. Abrir un modal de detalle con nombre, correo, plan, estado, identificador y fecha de alta del usuario seleccionado.

### Agentes

1. Listar al menos cuatro agentes con nombre, propietario y un badge de estado «Activo», «Inactivo» o «Fallando».
2. Mantener las skills plegadas inicialmente. El control «Ver skills» alterna la expansión con una transición breve y cambia su indicador visual. Respetar la preferencia de movimiento reducido.
3. Añadir un menú ⋮ con «Configurar» y «Eliminar». La configuración abre un modal identificado con el nombre del agente, con el prompt de sistema en un `textarea` editable y una acción para guardar el cambio en memoria. La eliminación pide confirmación dentro del prototipo.

### Skills

1. Incluir una explicación breve de que una skill es una capacidad que se puede habilitar en un agente.
2. Mostrar al menos cuatro skills con nombre, descripción y número de agentes que las tienen habilitadas. Calcular el recuento a partir de las asignaciones de los agentes visibles.
3. Añadir menú ⋮ con «Ver detalle» y «Eliminar». El detalle muestra la descripción y los agentes que la usan. La eliminación pide confirmación y retira la skill del catálogo y de las asignaciones actuales, conservando el registro histórico de contratos.

### Contrataciones

1. Mostrar al menos cuatro contratos, con ejemplos activos y pasados. La tabla incluye cliente, agente, skills contratadas, fechas de inicio y fin e importe pagado.
2. Presentar fechas de forma uniforme y alinear los importes en euros a la derecha. Mantener visibles los nombres de las skills mediante etiquetas de texto.
3. Añadir menú ⋮ con «Ver detalle». El modal muestra cliente, agente, fechas, importe base, cada skill con su precio y el total. El desglose suma el importe de la tabla.

### Log de errores

1. Mostrar al menos seis errores con fecha y hora, nombre del agente, tipo de error y descripción breve. Ordenarlos del más reciente al más antiguo.
2. Usar badges con texto y color para distinguir los tipos o severidades. Mostrar de forma visible cuándo una entrada está resuelta.
3. Añadir menú ⋮ con «Ver detalle» y «Marcar como resuelto». El detalle muestra la traza completa en texto monoespaciado. Resolver una entrada actualiza su estado en la lista y desactiva esa acción para el mismo error.

## Inventario de componentes

- **Sidebar.** Navegación lateral persistente con seis destinos y un único destino activo identificado con `aria-current` y fondo lima.
- **Toggle de modo oscuro.** Botón en la barra superior que alterna la clase `dark` en `<html>`, expone su estado con `aria-pressed`, guarda la preferencia en `localStorage` y aplica el tema a todas las vistas, menús y modales.
- **Tarjeta de métrica.** Icono, etiqueta y valor. Permite configurar el color de acento según la métrica.
- **Tabla.** Encabezados de columna y filas con un menú de acciones accesible.
- **Badge.** Etiqueta compacta que combina texto y color: verde para activo o resuelto, ámbar para advertencias o pendientes, rojo para fallos o permisos, gris para inactivos o finalizados, y azul o violeta para los tipos de error de conexión y datos inválidos.
- **Menú de acciones.** Botón ⋮ con nombre específico para el registro y estado expandido. Un segundo clic, un clic fuera o Escape cierran el menú. Abrir otro menú cierra el anterior. El teclado lleva el foco a la primera acción y las flechas permiten recorrerlas.
- **Modal.** Un patrón común para detalles, configuración y confirmaciones, con encabezado, contenido y acciones diferenciados. Cierra con el botón de cierre, clic en el fondo o Escape. El foco regresa al control de origen.
- **Movimiento.** Los menús y modales que se abren con el puntero aparecen con un fundido breve. Al usar el teclado o activar movimiento reducido, los controles responden al instante.
- **Lista de skills desplegable.** Control con `aria-expanded` y panel asociado. Se mantiene la altura natural al expandir el contenido.

## Criterios de aceptación

1. El historial contiene un commit dedicado a `SPECS.md` anterior a la primera implementación HTML de AgentHub.
2. Las seis vistas son accesibles desde la barra lateral y esta indica cuál está activa.
3. El Dashboard muestra sus cuatro métricas y el espacio para actividad semanal. Las otras vistas cumplen los mínimos de 5 usuarios, 4 agentes, 4 skills, 4 contratos y 6 errores.
4. Los menús de cada fila o tarjeta abren con su botón, se cierran al volver a pulsarlo y se cierran al pulsar fuera.
5. «Ver detalle» abre el registro correcto en Usuarios, Skills, Contrataciones y Log de errores. «Configurar» abre el prompt editable en Agentes.
6. Todos los modales se cierran desde el botón de cierre y al pulsar el fondo. Los datos se pueden leer sin desbordar el modal.
7. Las skills empiezan plegadas y alternan entre estados con una transición visible cuando el movimiento reducido está desactivado.
8. El selector aplica el tema a todas las vistas, menús y modales. Navegar por el panel conserva el tema.
9. Los contratos y errores muestran nombres de agentes coherentes con el conjunto de datos inicial. Las métricas de estado y los recuentos de skills coinciden con los registros de demostración.
10. En escritorio y tablet se pueden consultar las seis vistas y usar sus controles. En móvil se conserva el acceso a todos los datos y acciones.
11. Los estilos se aplican con utilidades de Tailwind vía CDN. Las interacciones se ejecutan con JavaScript vanilla y los datos funcionan desde el propio prototipo.
