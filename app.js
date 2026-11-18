'use strict';

const icons = {
  dashboard: '<path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z"/>',
  usuarios: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M15 3.2a4 4 0 0 1 0 7.6"/><circle cx="9" cy="7" r="4"/>',
  agentes: '<rect x="4" y="7" width="16" height="13" rx="3"/><path d="M12 7V3m-3 9h.01m6 0h.01M9 16h6M2 12v4m20-4v4"/>',
  skills: '<path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Zm7 13 1.2 2.8L23 19l-2.8 1.2L19 23l-1.2-2.8L15 19l2.8-1.2L19 15Z"/>',
  contrataciones: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6m-6 4h6m-6 4h4"/>',
  errores: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 4h.01"/>',
  money: '<path d="M18 6a7 7 0 1 0 0 12M4 10h10m-10 4h9"/>',
  discount: '<path d="m5 19 14-14"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
  moon: '<path d="M20.5 15.3A8.6 8.6 0 0 1 8.7 3.5a9 9 0 1 0 11.8 11.8Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
};

const views = {
  dashboard: { title: 'Dashboard', short: 'Inicio', description: 'Resumen de ingresos y estado de los agentes.' },
  usuarios: { title: 'Usuarios', short: 'Usuarios', description: 'Usuarios registrados, planes y estados de cuenta.' },
  agentes: { title: 'Agentes', short: 'Agentes', description: 'Estado, habilidades y configuración de cada agente.' },
  skills: { title: 'Skills', short: 'Skills', description: 'Una skill es una capacidad que puedes habilitar en un agente.' },
  contrataciones: { title: 'Contrataciones', short: 'Contratos', description: 'Contratos de alquiler activos e históricos.' },
  errores: { title: 'Log de errores', short: 'Errores', description: 'Incidencias de ejecución y estado de resolución.' },
};

const surface = 'rounded-2xl border border-black/10 bg-white dark:border-[#303338] dark:bg-[#17191c]';
const muted = 'text-[#576052] dark:text-[#b5b8bf]';
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-700 dark:focus-visible:outline-lime-300';
const button = `inline-flex min-h-10 items-center justify-center rounded-xl border border-black/10 px-3.5 text-sm font-medium hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10 ${focus}`;
const primary = `inline-flex min-h-10 items-center justify-center rounded-xl bg-[#c7ff4f] px-4 text-sm font-semibold text-[#1a220b] hover:bg-lime-300 ${focus}`;
const divider = 'divide-y divide-black/10 dark:divide-white/10';
const dashboardPanel = `${surface} shadow-sm dark:bg-[linear-gradient(153deg,#242628_0%,#151719_49%,#131517_100%)]`;

const nav = document.querySelector('#navigation');
const view = document.querySelector('#view');
const dialog = document.querySelector('#record-dialog');
const dialogPanel = document.querySelector('#dialog-panel');
const themeToggle = document.querySelector('#theme-toggle');
const announcement = document.querySelector('#announcement');
const expandedAgents = new Set();
let currentView;
let openMenu;
let openerId;

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const date = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Europe/Madrid' });
const dateTime = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid' });
const formatDate = value => date.format(new Date(value));
const nameOf = (list, id) => list.find(record => record.id === id).name;
const visibleRecords = records => records.filter(record => !record.removed);
const contractTotal = contract => contract.base + contract.skills.reduce((total, skill) => total + skill.price, 0);

function icon(name, extra = '') {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-5 shrink-0 ${extra}">${icons[name]}</svg>`;
}

function badge(label) {
  const colors = {
    Activo: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300',
    Resuelto: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300',
    Fallando: 'bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300',
    Permisos: 'bg-rose-50 text-rose-800 dark:bg-rose-400/10 dark:text-rose-300',
    Pendiente: 'bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300',
    'Tiempo de espera': 'bg-amber-50 text-amber-900 dark:bg-amber-400/10 dark:text-amber-300',
    Conexión: 'bg-sky-50 text-sky-900 dark:bg-sky-400/10 dark:text-sky-300',
    'Datos inválidos': 'bg-violet-50 text-violet-900 dark:bg-violet-400/10 dark:text-violet-300',
  };
  const color = colors[label] ?? 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300';
  return `<span class="inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${color}">${label}</span>`;
}

function chips(labels) {
  return labels.map(label => `<span class="inline-block rounded-lg border border-black/10 px-2 py-1 text-xs dark:border-white/10">${label}</span>`).join('');
}

function actionMenu(record, label, actions, opensUp = false) {
  return `<div class="relative inline-flex text-left" data-menu>
    <button id="action-${record.id}" type="button" data-menu-button aria-label="Acciones de ${label}" aria-controls="menu-${record.id}" aria-expanded="false" class="grid size-10 place-items-center rounded-xl text-xl leading-none hover:bg-black/5 dark:hover:bg-white/10 ${focus}">⋮</button>
    <div hidden id="menu-${record.id}" data-menu-panel class="absolute right-0 ${opensUp ? 'bottom-full mb-1' : 'top-full mt-1'} z-10 w-48 rounded-xl border border-black/10 bg-white p-1 shadow-lg dark:border-white/15 dark:bg-[#222528]">
      ${actions.map(([action, title, disabled]) => `<button type="button" data-action="${action}" data-id="${record.id}" ${disabled ? 'disabled' : ''} class="block min-h-9 w-full rounded-lg px-3 text-left text-sm enabled:hover:bg-black/5 disabled:opacity-50 dark:enabled:hover:bg-white/10 ${focus}">${title}</button>`).join('')}
    </div>
  </div>`;
}

function table(headers, rows, emptyText) {
  if (!rows.length) {
    return `<p class="${surface} ${muted} p-5 text-sm">${emptyText}</p>`;
  }
  return `<div class="${surface} overflow-x-auto ${rows.length <= 2 ? 'min-h-[190px]' : ''}" role="region" aria-label="Listado de ${views[currentView].title}" tabindex="0">
    <table class="w-full min-w-max text-left text-sm">
      <thead class="border-b border-black/10 bg-black/[0.025] dark:border-white/10 dark:bg-white/[0.025]">
        <tr>${headers.map((header, i) => `<th scope="col" class="px-4 py-4 text-xs font-semibold ${muted} ${i === headers.length - 1 ? 'text-right' : ''}">${header}</th>`).join('')}</tr>
      </thead>
      <tbody class="${divider}">
        ${rows.map(cells => `<tr class="hover:bg-black/[0.02] dark:hover:bg-white/[0.025]">
          <th scope="row" class="px-4 py-3 font-semibold">${cells[0]}</th>
          ${cells.slice(1).map((cell, i) => `<td class="px-4 py-2.5 ${i === cells.length - 2 ? 'w-20 text-right' : ''}">${cell}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function dashboard() {
  const visible = visibleRecords(agents);
  const revenue = contracts.filter(item => item.start.startsWith('2026-11')).reduce((total, contract) => total + contractTotal(contract), 0);
  const metrics = [
    { name: 'Ingresos del mes', value: euros.format(revenue), detail: 'Noviembre de 2026', key: 'money', color: 'text-lime-800 dark:text-[#c7ff4f]' },
    { name: 'Descuentos y cupones', value: euros.format(-620), detail: 'Pérdida acumulada del mes', key: 'discount', color: 'text-amber-800 dark:text-amber-300' },
    { name: 'Agentes activos', value: visible.filter(agent => agent.status === 'Activo').length, detail: `De ${visible.length} agentes registrados`, key: 'agentes', color: 'text-emerald-800 dark:text-emerald-300' },
    { name: 'Agentes fallando', value: visible.filter(agent => agent.status === 'Fallando').length, detail: 'Requieren revisión', key: 'errores', color: 'text-rose-800 dark:text-rose-300' },
  ];
  const trends = [
    'M3 34C15 37 18 15 29 21S41 36 50 24S60 15 69 19S78 7 95 5',
    'M3 25C16 31 21 11 32 19S47 36 57 29S71 16 80 20S89 19 95 14',
    'M3 35C15 37 20 13 30 19S42 40 52 28S65 26 72 17S82 19 95 7',
    'M3 19C17 26 20 1 30 13S38 29 48 25S61 40 73 30S87 35 95 23',
  ];
  return `<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Métricas principales">
    ${metrics.map((metric, index) => `<article data-metric class="${dashboardPanel} relative isolate min-h-[126px] overflow-hidden px-4 py-3.5 sm:px-5">
      <div data-metric-texture class="pointer-events-none absolute inset-0 -z-10 hidden bg-[radial-gradient(circle,#ffffff_0.7px,transparent_1px)] bg-[length:3px_3px] opacity-[0.19] [mask-image:radial-gradient(ellipse_80%_130%_at_100%_0%,black_0%,rgba(0,0,0,0.82)_25%,rgba(0,0,0,0.25)_63%,rgba(0,0,0,0.04)_87%,transparent_100%)] dark:block" aria-hidden="true"></div>
      <svg viewBox="0 0 98 48" class="pointer-events-none absolute bottom-4 right-3 -z-10 h-12 w-[29%] min-w-16 text-[#578600] dark:text-[#c7ff4f]" aria-hidden="true">
        <defs>
          <linearGradient id="metric-fill-${index}" x2="0" y2="1">
            <stop stop-color="currentColor" stop-opacity=".29"/>
            <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${trends[index]}V48H3Z" fill="url(#metric-fill-${index})"/>
        <path d="${trends[index]}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" class="dark:drop-shadow-[0_0_4px_#a3f52d]"/>
      </svg>
      <h2 class="flex items-center gap-2.5 text-sm font-medium"><span class="grid size-8 shrink-0 place-items-center rounded-lg bg-black/5 ${metric.color} dark:bg-white/[0.075]">${icon(metric.key)}</span>${metric.name}</h2>
      <p class="mt-2.5 text-[26px] font-semibold leading-tight tracking-tight tabular-nums">${metric.value}</p>
      <p class="mt-1 pr-[24%] text-xs ${muted}">${metric.detail}</p>
    </article>`).join('')}
  </div>
  ${weeklyActivity()}`;
}

function weeklyActivity() {
  const activityPath = 'M1 177C25 177 38 175 62 163S92 133 123 131S157 139 183 114S216 82 245 96S286 121 318 96S354 70 381 79S426 96 451 71S484 49 511 53S541 69 569 48S610 21 640 33S674 49 704 28S737 24 759 17';
  const otherPath = 'M1 186C26 187 45 187 71 177S101 155 128 157S155 172 184 152S218 132 247 142S279 155 305 137S338 122 367 129S410 141 438 120S476 101 505 107S539 119 564 99S600 82 631 92S671 105 698 83S729 80 759 68';
  return `<figure id="activity" class="${dashboardPanel} mt-5 min-w-0 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
    <figcaption class="mb-4 flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-[22px] font-semibold tracking-tight">Actividad semanal</h2>
      <span class="rounded-full border border-black/15 px-3 py-1.5 text-[11px] ${muted} dark:border-white/15">Gráfico de ejemplo</span>
    </figcaption>
    <div class="rounded-xl border border-dashed border-black/15 bg-black/[0.015] p-3 dark:border-white/15 dark:bg-black/15 sm:p-4" aria-hidden="true">
        <svg viewBox="0 0 760 195" preserveAspectRatio="none" class="block h-[164px] w-full sm:h-[230px]">
          <defs>
            <pattern id="activity-grid" width="108.6" height="32.3" patternUnits="userSpaceOnUse">
              <path d="M108.6 0H0V32.3" class="stroke-black/20 dark:stroke-white/25" stroke-dasharray="2 4" stroke-width="1" fill="none"/>
            </pattern>
            <linearGradient id="activity-fill" x1="0" y1="0" x2="0" y2="1">
              <stop class="text-[#88b333] dark:text-[#9de223]" stop-color="currentColor" stop-opacity=".48"/>
              <stop offset="100%" class="text-[#8eb734] dark:text-[#a4ec23]" stop-color="currentColor" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <rect width="760" height="193" fill="url(#activity-grid)"/>
          <path d="${activityPath}V195H1Z" fill="url(#activity-fill)"/>
          <path d="${activityPath}" fill="none" stroke="currentColor" stroke-width="2" vector-effect="non-scaling-stroke" class="text-[#578600] dark:text-[#c7ff4f]"/>
          <path d="${otherPath}" fill="none" stroke="currentColor" stroke-width="1.7" vector-effect="non-scaling-stroke" class="text-slate-600 dark:text-slate-100"/>
          <path d="M0 194H760" class="stroke-black/25 dark:stroke-white/25" stroke-width="1"/>
        </svg>
        <div class="mt-2 grid grid-cols-7 text-center text-[11px] ${muted}"><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span></div>
    </div>
  </figure>`;
}

function userList() {
  const records = visibleRecords(users);
  return table(['Nombre', 'Correo', 'Plan', 'Estado', 'Acciones'], records.map((user, index) => [
    user.name, user.email, user.plan, badge(user.status),
    actionMenu(user, user.name, [['detail', 'Ver detalle'], ['delete', 'Eliminar']], index > 0 && index >= records.length - 2),
  ]), 'No hay usuarios registrados.');
}

function agentList() {
  const records = visibleRecords(agents);
  if (!records.length) return `<p class="${surface} ${muted} p-5 text-sm">No hay agentes registrados.</p>`;
  return `<ul class="grid gap-3">${records.map(agent => {
    const expanded = expandedAgents.has(agent.id);
    const labels = visibleRecords(skills).filter(skill => agent.skills.includes(skill.id)).map(skill => skill.name);
    return `<li class="${surface} px-4 py-3 sm:px-5">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-lime-100 text-lime-900 dark:bg-[#c7ff4f]/10 dark:text-[#c7ff4f]">${icon('agentes')}</span>
          <div><h2 class="font-semibold">${agent.name}</h2><p class="text-sm ${muted}">${nameOf(users, agent.owner)}</p></div>
        </div>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3">
          ${badge(agent.status)}
          <button id="skills-toggle-${agent.id}" data-expand="${agent.id}" type="button" aria-label="Skills de ${agent.name}" aria-controls="skills-${agent.id}" aria-expanded="${expanded}" class="${button} gap-1.5">
            <span data-expand-label>${expanded ? 'Ocultar skills' : 'Ver skills'}</span>${icon('chevron', `size-4 transition-transform motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`)}
          </button>
          ${actionMenu(agent, agent.name, [['configure', 'Configurar'], ['delete', 'Eliminar']])}
        </div>
      </div>
      <div id="skills-${agent.id}" aria-hidden="${!expanded}" class="grid transition-all duration-200 motion-reduce:transition-none ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}">
        <div class="overflow-hidden"><div class="flex flex-wrap gap-2 pt-3">${labels.length ? chips(labels) : `<p class="text-sm ${muted}">Sin skills habilitadas.</p>`}</div></div>
      </div>
    </li>`;
  }).join('')}</ul>`;
}

function skillList() {
  const records = visibleRecords(skills);
  if (!records.length) return `<p class="${surface} ${muted} p-5 text-sm">No hay skills en el catálogo.</p>`;
  return `<ul class="grid gap-4 lg:grid-cols-2">${records.map(skill => {
    const count = agentsUsing(skill).length;
    return `<li class="${surface} p-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-lime-100 text-lime-900 dark:bg-[#c7ff4f]/10 dark:text-[#c7ff4f]">${icon('skills')}</span>
          <h2 class="font-semibold">${skill.name}</h2>
        </div>
        ${actionMenu(skill, skill.name, [['detail', 'Ver detalle'], ['delete', 'Eliminar']])}
      </div>
      <p class="my-3 text-sm ${muted}">${skill.description}</p>
      <p class="text-xs font-medium text-lime-900 dark:text-[#c7ff4f]">${count} ${count === 1 ? 'agente usa esta skill' : 'agentes usan esta skill'}</p>
    </li>`;
  }).join('')}</ul>`;
}

function contractList() {
  return table(['Cliente', 'Agente', 'Skills contratadas', 'Inicio', 'Fin', 'Importe', 'Estado', 'Acciones'], contracts.map((contract, index) => [
    nameOf(users, contract.user),
    nameOf(agents, contract.agent),
    `<div class="flex max-w-60 flex-wrap gap-1.5">${chips(contract.skills.map(skill => nameOf(skills, skill.id)))}</div>`,
    formatDate(contract.start), formatDate(contract.end),
    `<span class="block text-right font-medium tabular-nums">${euros.format(contractTotal(contract))}</span>`,
    badge(contract.status), actionMenu(contract, `contrato ${contract.id}`, [['detail', 'Ver detalle']], index > 1),
  ]), 'No hay contratos.');
}

function errorList() {
  return table(['Fecha y hora', 'Agente', 'Tipo de error', 'Descripción', 'Estado', 'Acciones'], errors.map((error, index) => [
    `<time datetime="${error.timestamp}" class="whitespace-nowrap tabular-nums">${dateTime.format(new Date(error.timestamp))}</time>`,
    nameOf(agents, error.agent), badge(error.type), `<p class="max-w-60 whitespace-normal">${error.description}</p>`,
    badge(error.resolved ? 'Resuelto' : 'Pendiente'),
    actionMenu(error, `error ${error.id}`, [['detail', 'Ver detalle'], ['resolve', 'Marcar como resuelto', error.resolved]], index >= 3),
  ]), 'No hay errores registrados.');
}

const renderers = { dashboard, usuarios: userList, agentes: agentList, skills: skillList, contrataciones: contractList, errores: errorList };
const recordsByView = { usuarios: users, agentes: agents, skills, contrataciones: contracts, errores: errors };

function agentsUsing(skill) {
  return visibleRecords(agents).filter(agent => agent.skills.includes(skill.id));
}

function render() {
  const key = location.hash.slice(1);
  currentView = Object.hasOwn(views, key) ? key : 'dashboard';
  document.title = `AgentHub | ${views[currentView].title}`;
  document.querySelector('#heading').textContent = views[currentView].title;
  document.querySelector('#description').textContent = views[currentView].description;
  nav.innerHTML = Object.entries(views).map(([name, data]) => {
    const active = name === currentView;
    const tone = active ? 'bg-[#c7ff4f] text-[#1a220b]' : `${muted} hover:bg-black/5 dark:hover:bg-white/10`;
    return `<a href="#${name}" aria-label="${data.title}" title="${data.title}" ${active ? 'aria-current="page"' : ''} class="flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-[15px] px-1 text-center font-medium sm:w-12 sm:px-0 ${focus} ${tone}">
      ${icon(name)}<span class="text-[9px] leading-none sm:hidden">${data.short}</span>
    </a>`;
  }).join('');
  openMenu = undefined;
  view.innerHTML = renderers[currentView]();
}

function closeMenu(restoreFocus = false) {
  if (!openMenu) return;
  const trigger = openMenu.querySelector('[data-menu-button]');
  trigger.setAttribute('aria-expanded', 'false');
  openMenu.querySelector('[data-menu-panel]').hidden = true;
  openMenu = undefined;
  if (restoreFocus) trigger.focus();
}

function toggleMenu(trigger) {
  const menu = trigger.closest('[data-menu]');
  const wasOpen = menu === openMenu;
  closeMenu();
  if (wasOpen) return;
  openMenu = menu;
  trigger.setAttribute('aria-expanded', 'true');
  menu.querySelector('[data-menu-panel]').hidden = false;
}

function toggleSkills(trigger) {
  const id = trigger.dataset.expand;
  const willOpen = !expandedAgents.has(id);
  if (willOpen) expandedAgents.add(id);
  else expandedAgents.delete(id);
  trigger.setAttribute('aria-expanded', String(willOpen));
  trigger.querySelector('[data-expand-label]').textContent = willOpen ? 'Ocultar skills' : 'Ver skills';
  trigger.querySelector('svg').classList.toggle('rotate-180', willOpen);
  const panel = document.getElementById(`skills-${id}`);
  panel.setAttribute('aria-hidden', String(!willOpen));
  panel.classList.toggle('grid-rows-[1fr]', willOpen);
  panel.classList.toggle('grid-rows-[0fr]', !willOpen);
  panel.classList.toggle('opacity-100', willOpen);
  panel.classList.toggle('opacity-0', !willOpen);
}

function detailRows(rows) {
  return `<dl class="${divider}">${rows.map(([label, value]) => `<div class="grid grid-cols-[minmax(6rem,1fr)_2fr] gap-3 py-2.5 text-sm"><dt class="${muted}">${label}</dt><dd class="break-words font-medium">${value}</dd></div>`).join('')}</dl>`;
}

function showDialog(title, body, id, footer = '') {
  openerId = `action-${id}`;
  dialogPanel.innerHTML = `<div class="mb-4 flex items-start justify-between gap-4">
    <h2 id="dialog-title" class="pt-1 text-xl font-semibold tracking-tight">${title}</h2>
    <button data-dialog-close type="button" aria-label="Cerrar" autofocus class="grid size-9 shrink-0 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 ${focus}">${icon('close')}</button>
  </div>
  ${body}
  ${footer ? `<footer class="mt-5 flex flex-wrap justify-end gap-2">${footer}</footer>` : ''}`;
  dialog.showModal();
}

function showDetail(record) {
  const details = {
    usuarios: () => detailRows([['ID', record.id], ['Nombre', record.name], ['Correo', record.email], ['Plan', record.plan], ['Estado', badge(record.status)], ['Alta', formatDate(record.since)]]),
    skills: () => detailRows([['ID', record.id], ['Descripción', record.description], ['Agentes', agentsUsing(record).map(agent => agent.name).join(', ') || 'Sin asignaciones']]),
    contrataciones: () => detailRows([
      ['Cliente', nameOf(users, record.user)], ['Agente', nameOf(agents, record.agent)],
      ['Inicio', formatDate(record.start)], ['Fin', formatDate(record.end)], ['Importe base', euros.format(record.base)],
      ...record.skills.map(skill => [nameOf(skills, skill.id), euros.format(skill.price)]), ['Total pagado', euros.format(contractTotal(record))],
    ]),
    errores: () => detailRows([['Agente', nameOf(agents, record.agent)], ['Fecha y hora', dateTime.format(new Date(record.timestamp))], ['Tipo', badge(record.type)], ['Descripción', record.description], ['Estado', badge(record.resolved ? 'Resuelto' : 'Pendiente')]]) +
      '<h3 class="mb-2 mt-3 text-sm font-semibold">Traza</h3><pre id="error-trace" class="whitespace-pre-wrap break-words rounded-xl bg-black/5 p-3 text-xs dark:bg-black/30"></pre>',
  };
  showDialog(record.name ?? record.id, details[currentView](), record.id);
  if (currentView === 'errores') document.querySelector('#error-trace').textContent = record.trace;
}

function updateRecords(message, record) {
  render();
  announcement.textContent = message;
  (document.getElementById(`action-${record.id}`) ?? document.querySelector('#contenido')).focus();
}

function handleAction(action, id) {
  const record = recordsByView[currentView].find(item => item.id === id);
  closeMenu(true);
  if (action === 'detail') {
    showDetail(record);
  } else if (action === 'configure') {
    showDialog(`Configurar ${record.name}`, `<form id="agent-config"><label for="system-prompt" class="mb-2 block text-sm font-medium">Prompt de sistema</label><textarea id="system-prompt" required rows="5" class="w-full rounded-xl border border-black/15 bg-black/[0.025] p-3 text-sm dark:border-white/15 dark:bg-black/20 ${focus}"></textarea></form>`, id,
      `<button data-dialog-close type="button" class="${button}">Cancelar</button><button type="submit" form="agent-config" class="${primary}">Guardar</button>`);
    const form = document.querySelector('#agent-config');
    const prompt = form.querySelector('textarea');
    prompt.value = record.prompt;
    form.addEventListener('submit', event => {
      event.preventDefault();
      record.prompt = prompt.value;
      dialog.close();
      announcement.textContent = `Configuración de ${record.name} guardada.`;
    });
  } else if (action === 'delete') {
    showDialog(`Eliminar ${record.name}`, `<p class="text-sm ${muted}">¿Quieres retirar este registro del listado de demostración?</p>`, id,
      `<button data-dialog-close type="button" class="${button}">Cancelar</button><button data-confirm-delete type="button" class="${primary}">Eliminar</button>`);
    dialogPanel.querySelector('[data-confirm-delete]').addEventListener('click', () => {
      record.removed = true;
      dialog.close();
      updateRecords(`${record.name} se retiró del listado.`, record);
    });
  } else if (action === 'resolve') {
    record.resolved = true;
    updateRecords(`El error ${record.id} se marcó como resuelto.`, record);
  }
}

function updateTheme() {
  const dark = document.documentElement.classList.contains('dark');
  themeToggle.setAttribute('aria-pressed', String(dark));
  themeToggle.innerHTML = icon(dark ? 'moon' : 'sun');
}

themeToggle.addEventListener('click', () => {
  const dark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('agenthub-theme', dark ? 'dark' : 'light'); } catch {}
  updateTheme();
});

document.addEventListener('click', event => {
  if (!event.target.closest('[data-menu]')) closeMenu();
  const menuButton = event.target.closest('[data-menu-button]');
  const skillButton = event.target.closest('[data-expand]');
  const actionButton = event.target.closest('[data-action]');
  if (menuButton) toggleMenu(menuButton);
  if (skillButton) toggleSkills(skillButton);
  if (actionButton) handleAction(actionButton.dataset.action, actionButton.dataset.id);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && openMenu) closeMenu(true);
});

dialog.addEventListener('click', event => {
  if (event.target === dialog || event.target.closest('[data-dialog-close]')) dialog.close();
});

dialog.addEventListener('close', () => {
  document.getElementById(openerId)?.focus();
});

nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link) document.querySelector('#contenido').focus();
});

document.querySelector('#skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#contenido').focus();
});

window.addEventListener('hashchange', () => {
  if (dialog.open) dialog.close();
  render();
});

updateTheme();
render();
