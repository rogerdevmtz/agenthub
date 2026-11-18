# AgentHub

Prototipo del panel de administración de una plataforma de alquiler de agentes de IA. Incluye Dashboard, Usuarios, Agentes, Skills, Contrataciones y Log de errores.

## Capturas del Dashboard

- [Modo oscuro (1920 × 1080)](docs/screenshots/agenthub-black.png).
- [Modo claro (1920 × 1080)](docs/screenshots/agenthub-light.png).

## Abrir en local

Abre `index.html` en Chrome o Edge. El navegador necesita conexión a Internet para cargar Tailwind desde su CDN.

También puedes servir la carpeta con el servidor de desarrollo de Python, sin instalar dependencias.

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Abre [http://127.0.0.1:4173/](http://127.0.0.1:4173/).

## Probar el panel

- Navega entre las seis secciones y cambia el tema con el control de la barra superior.
- Abre el menú ⋮ de un registro y prueba el detalle, la configuración o la acción disponible.
- En Agentes, despliega las skills y edita el prompt de sistema desde «Configurar».
- En Log de errores, consulta la traza y marca una incidencia como resuelta.

Los registros son ficticios. Las acciones de demostración se reinician al recargar y el tema elegido se conserva si el navegador permite almacenamiento local.

Consulta [SPECS.md](SPECS.md) para ver los requisitos y criterios de aceptación. El diseño de partida se generó en Google Stitch y se adaptó al prototipo.

El historial de trabajo registra primero la especificación (`e73f577`) y después la primera implementación de AgentHub (`3061c18`).

Proyecto basado en la [plantilla HTML Hello de 4Geeks Academy](https://github.com/4GeeksAcademy/html-hello), de Alejandro Sánchez y sus colaboradores.
