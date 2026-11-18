'use strict';

const users = [
  { id: 'U-001', name: 'Marina Soler', email: 'marina@example.com', plan: 'Empresa', status: 'Activo', since: '2026-06-12' },
  { id: 'U-002', name: 'Iker Vidal', email: 'iker@example.com', plan: 'Pro', status: 'Activo', since: '2026-07-08' },
  { id: 'U-003', name: 'Nora Ruiz', email: 'nora@example.com', plan: 'Empresa', status: 'Activo', since: '2026-08-24' },
  { id: 'U-004', name: 'Ada Ferrer', email: 'ada@example.com', plan: 'Pro', status: 'Pendiente', since: '2026-09-15' },
  { id: 'U-005', name: 'Leo Martín', email: 'leo@example.com', plan: 'Básico', status: 'Inactivo', since: '2026-10-03' },
];

const skills = [
  { id: 'S-001', name: 'Navegación web', description: 'Consulta fuentes públicas, extrae datos y guarda las referencias.' },
  { id: 'S-002', name: 'Lectura de documentos', description: 'Localiza y resume información en documentos de trabajo.' },
  { id: 'S-003', name: 'Gestión de calendario', description: 'Consulta disponibilidad y prepara propuestas de agenda.' },
  { id: 'S-004', name: 'Clasificación de tickets', description: 'Ordena solicitudes por tema y sugiere su prioridad.' },
];

const agents = [
  { id: 'A-001', name: 'Atlas', owner: 'U-001', status: 'Activo', skills: ['S-001', 'S-002'], prompt: 'Revisa fuentes públicas y prepara un resumen. Incluye las referencias y señala los datos que necesitan verificación.' },
  { id: 'A-002', name: 'Vega', owner: 'U-002', status: 'Activo', skills: ['S-003', 'S-002'], prompt: 'Organiza la agenda semanal. Indica los posibles conflictos de horario y prepara propuestas para revisión.' },
  { id: 'A-003', name: 'Prisma', owner: 'U-003', status: 'Fallando', skills: ['S-004', 'S-002'], prompt: 'Clasifica los tickets por categoría y prioridad. Deriva los casos ambiguos a un operador.' },
  { id: 'A-004', name: 'Lumen', owner: 'U-004', status: 'Inactivo', skills: ['S-001'], prompt: 'Busca contexto en fuentes públicas y entrega una lista concisa de hallazgos con referencias.' },
];

const contracts = [
  { id: 'C-104', user: 'U-001', agent: 'A-001', start: '2026-11-04', end: '2026-12-04', status: 'Activo', base: 3900, skills: [{ id: 'S-001', price: 280 }, { id: 'S-002', price: 200 }] },
  { id: 'C-103', user: 'U-002', agent: 'A-002', start: '2026-11-03', end: '2026-12-03', status: 'Activo', base: 3200, skills: [{ id: 'S-003', price: 300 }, { id: 'S-002', price: 200 }] },
  { id: 'C-102', user: 'U-003', agent: 'A-003', start: '2026-11-01', end: '2026-11-30', status: 'Activo', base: 3750, skills: [{ id: 'S-004', price: 450 }, { id: 'S-002', price: 200 }] },
  { id: 'C-101', user: 'U-004', agent: 'A-004', start: '2026-10-01', end: '2026-10-31', status: 'Finalizado', base: 2350, skills: [{ id: 'S-001', price: 280 }] },
];

const errors = [
  { id: 'E-006', timestamp: '2026-11-18T10:42:00+01:00', agent: 'A-003', type: 'Tiempo de espera', description: 'La clasificación superó el límite de 30 segundos.', trace: 'TimeoutError: ejecución superior a 30 s\n  en classifyTicket (skills/tickets.js:42)\n  en executeSkill (runtime/agent.js:87)' },
  { id: 'E-005', timestamp: '2026-11-17T16:35:00+01:00', agent: 'A-003', type: 'Datos inválidos', description: 'El ticket llegó sin asunto.', trace: 'ValidationError: falta el campo asunto\n  en validateTicket (skills/tickets.js:16)\n  en executeSkill (runtime/agent.js:87)' },
  { id: 'E-004', timestamp: '2026-11-17T09:12:00+01:00', agent: 'A-001', type: 'Conexión', description: 'Una fuente externa devolvió un error temporal.', trace: 'ConnectionError: respuesta HTTP 503\n  en readSource (skills/web.js:61)\n  en executeSkill (runtime/agent.js:87)' },
  { id: 'E-003', timestamp: '2026-11-16T14:18:00+01:00', agent: 'A-002', type: 'Permisos', description: 'El calendario compartido no estaba disponible.', trace: 'PermissionError: acceso al calendario denegado\n  en readCalendar (skills/calendar.js:21)\n  en executeSkill (runtime/agent.js:87)', resolved: true },
  { id: 'E-002', timestamp: '2026-11-15T11:27:00+01:00', agent: 'A-001', type: 'Datos inválidos', description: 'El documento tenía un formato incompatible.', trace: 'ValidationError: formato de documento no admitido\n  en parseDocument (skills/documents.js:39)\n  en executeSkill (runtime/agent.js:87)', resolved: true },
  { id: 'E-001', timestamp: '2026-11-14T08:50:00+01:00', agent: 'A-004', type: 'Tiempo de espera', description: 'La consulta web agotó el tiempo disponible.', trace: 'TimeoutError: lectura de origen agotada\n  en readSource (skills/web.js:61)\n  en executeSkill (runtime/agent.js:87)', resolved: true },
];
