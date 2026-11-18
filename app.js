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
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 10h18"/>',
};

const views = {
  dashboard: { title: 'Dashboard', heading: 'Hola, Roger', short: 'Inicio', description: 'Aquí tienes el resumen de ingresos y el estado de tus agentes.' },
  usuarios: { title: 'Usuarios', short: 'Usuarios', description: 'Usuarios registrados, planes y estados de cuenta.' },
  agentes: { title: 'Agentes', short: 'Agentes', description: 'Estado, habilidades y configuración de cada agente.' },
  skills: { title: 'Skills', short: 'Skills', description: 'Una skill es una capacidad que puedes habilitar en un agente.' },
  contrataciones: { title: 'Contrataciones', short: 'Contratos', description: 'Contratos de alquiler activos e históricos.' },
  errores: { title: 'Log de errores', short: 'Errores', description: 'Incidencias de ejecución y estado de resolución.' },
};

const surface = 'rounded-2xl border border-[#dce2ee] bg-[#fcfdff] shadow-[0_5px_18px_#26375012] dark:border-[#303338] dark:bg-[#17191c] dark:shadow-[0_5px_18px_#00000020]';
const muted = 'text-[#465065] dark:text-[#b5b8bf]';
const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-700 dark:focus-visible:outline-lime-300';
const controlHover = 'hover:bg-[#edf2fa] dark:hover:bg-white/10';
const button = `inline-flex min-h-10 items-center justify-center rounded-xl border border-[#dce2ee] px-3.5 text-sm font-medium dark:border-white/15 ${controlHover} ${focus}`;
const primary = `inline-flex min-h-10 items-center justify-center rounded-xl bg-[#c7ff4f] px-4 text-sm font-semibold text-[#1a220b] hover:bg-[#b9f642] dark:bg-[#c7ff4f] dark:hover:bg-lime-300 ${focus}`;
const border = 'border-[#e3e8f2] dark:border-white/10';
const divider = 'divide-y divide-[#e3e8f2] dark:divide-white/10';
const panelInset = 'px-4 sm:px-5';
const tileIcon = 'grid size-10 shrink-0 place-items-center rounded-xl bg-lime-50 text-lime-900 dark:bg-[#c7ff4f]/10 dark:text-[#c7ff4f]';
const dashboardPanel = `${surface} bg-[linear-gradient(145deg,#ffffff_21%,#f7f9fd_100%)] dark:bg-[linear-gradient(153deg,#242628_0%,#151719_49%,#131517_100%)]`;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const enterEasing = 'cubic-bezier(0.23, 1, 0.32, 1)';

const nav = document.querySelector('#navigation');
const view = document.querySelector('#view');
const dialog = document.querySelector('#record-dialog');
const dialogPanel = document.querySelector('#dialog-panel');
const themeToggle = document.querySelector('#theme-toggle');
const themeTooltip = document.querySelector('#theme-tooltip');
const dashboardPeriod = document.querySelector('#dashboard-period');
const dashboardAccent = document.querySelector('#dashboard-accent');
const announcement = document.querySelector('#announcement');
const heading = document.querySelector('#heading');
const expandedAgents = new Set();
let currentView;
let openMenu;
let openerId;

const euros = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', useGrouping: 'always' });
const percent = new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 });
const billingMonth = '2026-11';
const billingLabel = 'Noviembre 2026';
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
  return `<span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${color}"><span class="size-1.5 rounded-full bg-current opacity-75" aria-hidden="true"></span>${label}</span>`;
}

function chips(labels) {
  return labels.map(label => `<span class="inline-block rounded-lg border ${border} bg-[#f4f7fc] px-2.5 py-1.5 text-xs ${muted} dark:bg-white/5">${label}</span>`).join('');
}

function actionMenu(record, label, actions, opensUp = false) {
  return `<div class="relative inline-flex text-left" data-menu>
    <button id="action-${record.id}" type="button" data-menu-button aria-label="Acciones de ${label}" aria-controls="menu-${record.id}" aria-expanded="false" class="grid size-10 place-items-center rounded-xl text-xl leading-none ${controlHover} aria-expanded:bg-[#edf2fa] dark:aria-expanded:bg-white/10 ${focus}">⋮</button>
    <div hidden id="menu-${record.id}" data-menu-panel class="absolute right-0 ${opensUp ? 'bottom-full mb-1 origin-bottom-right' : 'top-full mt-1 origin-top-right'} z-10 w-48 rounded-xl border border-[#dce2ee] bg-[#fcfdff] p-1 shadow-lg dark:border-white/15 dark:bg-[#222528]">
      ${actions.map(([action, title, disabled]) => `<button type="button" data-action="${action}" data-id="${record.id}" ${disabled ? 'disabled' : ''} class="block min-h-9 w-full rounded-lg px-3 text-left text-sm enabled:hover:bg-[#edf2fa] disabled:opacity-50 dark:enabled:hover:bg-white/10 ${focus}">${title}</button>`).join('')}
    </div>
  </div>`;
}

function table(headers, rows, emptyText) {
  if (!rows.length) {
    return `<p class="${surface} ${muted} p-5 text-sm">${emptyText}</p>`;
  }
  const amountColumn = headers.indexOf('Importe');
  return `<div class="${surface} ${focus} overflow-x-auto ${rows.length <= 2 ? 'min-h-[190px]' : ''}" role="region" aria-label="Listado de ${views[currentView].title}" tabindex="0">
    <table class="w-full min-w-max text-left text-sm">
      <thead class="border-b border-[#dce2ee] bg-[#f0f4fa] dark:border-white/10 dark:bg-white/[0.025]">
        <tr>${headers.map((header, i) => `<th scope="col" class="${panelInset} whitespace-nowrap py-3.5 text-xs font-semibold ${muted} ${i === amountColumn ? 'text-right' : ''} ${i === headers.length - 1 ? 'text-center' : ''}">${header}</th>`).join('')}</tr>
      </thead>
      <tbody class="${divider}">
        ${rows.map(cells => `<tr class="hover:bg-[#f5f8fd] dark:hover:bg-white/[0.025]">
          <th scope="row" class="${panelInset} py-3 align-middle font-semibold">${cells[0]}</th>
          ${cells.slice(1).map((cell, i) => `<td class="${panelInset} py-3 align-middle ${i === cells.length - 2 ? 'w-20 text-center' : ''}">${cell}</td>`).join('')}
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function dashboard() {
  const visible = visibleRecords(agents);
  const monthContracts = contracts.filter(item => item.start.startsWith(billingMonth));
  const revenue = monthContracts.reduce((total, contract) => total + contractTotal(contract), 0);
  const metrics = [
    { name: 'Ingresos del mes', value: euros.format(revenue), detail: 'Contrataciones del periodo', key: 'money', color: 'bg-lime-50 text-lime-800 dark:text-[#c7ff4f]' },
    { name: 'Descuentos y cupones', value: euros.format(-620), detail: 'Pérdida acumulada del mes', key: 'discount', color: 'bg-amber-50 text-amber-800 dark:text-amber-300' },
    { name: 'Agentes activos', value: visible.filter(agent => agent.status === 'Activo').length, detail: `De ${visible.length} agentes registrados`, key: 'agentes', color: 'bg-emerald-50 text-emerald-800 dark:text-emerald-300' },
    { name: 'Agentes fallando', value: visible.filter(agent => agent.status === 'Fallando').length, detail: 'Requieren revisión', key: 'errores', color: 'bg-rose-50 text-rose-800 dark:text-rose-300' },
  ];
  const trends = [
    'M3 34C15 37 18 15 29 21S41 36 50 24S60 15 69 19S78 7 95 5',
    'M3 25C16 31 21 11 32 19S47 36 57 29S71 16 80 20S89 19 95 14',
    'M3 35C15 37 20 13 30 19S42 40 52 28S65 26 72 17S82 19 95 7',
    'M3 19C17 26 20 1 30 13S38 29 48 25S61 40 73 30S87 35 95 23',
  ];
  return `<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Métricas principales">
    ${metrics.map((metric, index) => `<article data-metric class="${dashboardPanel} relative isolate min-h-[126px] overflow-hidden px-4 py-3.5 sm:px-5">
      <div data-metric-texture class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle,#8c9bb5_0.7px,transparent_1px)] bg-[length:3px_3px] opacity-[0.21] [mask-image:radial-gradient(ellipse_80%_130%_at_100%_0%,black_0%,rgba(0,0,0,0.82)_25%,rgba(0,0,0,0.25)_63%,rgba(0,0,0,0.04)_87%,transparent_100%)] dark:bg-[radial-gradient(circle,#ffffff_0.7px,transparent_1px)] dark:opacity-[0.19]" aria-hidden="true"></div>
      <svg viewBox="0 0 98 48" class="pointer-events-none absolute bottom-4 right-3 -z-10 h-12 w-[29%] min-w-16 text-[#84bb12] dark:text-[#c7ff4f]" aria-hidden="true">
        <defs>
          <linearGradient id="metric-fill-${index}" x2="0" y2="1">
            <stop stop-color="currentColor" stop-opacity=".29"/>
            <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <path d="${trends[index]}V48H3Z" fill="url(#metric-fill-${index})"/>
        <path d="${trends[index]}" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" class="dark:drop-shadow-[0_0_4px_#a3f52d]"/>
      </svg>
      <h2 class="flex items-center gap-2.5 text-sm font-medium"><span class="grid size-8 shrink-0 place-items-center rounded-lg ${metric.color} dark:bg-white/[0.075]">${icon(metric.key)}</span>${metric.name}</h2>
      <p class="mt-2.5 text-[26px] font-semibold leading-tight tracking-tight tabular-nums">${metric.value}</p>
      <p class="mt-1 pr-[24%] text-xs ${muted}">${metric.detail}</p>
    </article>`).join('')}
  </div>
  <div id="dashboard-analysis" class="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
    ${weeklyActivity()}
    ${incomeBreakdown(monthContracts, revenue)}
  </div>`;
}

function weeklyActivity() {
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const runs = [32, 44, 68, 96, 74, 89, 59];
  const ticks = [120, 90, 60, 30, 0];
  const average = runs.reduce((sum, value) => sum + value, 0) / runs.length;
  const plotWidth = 700;
  const plotHeight = 196;
  const columnWidth = plotWidth / days.length;
  const position = value => plotHeight * (1 - value / ticks[0]);
  return `<figure id="activity" class="${dashboardPanel} min-w-0 px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
    <figcaption class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-[22px] font-semibold tracking-tight">Actividad semanal</h2>
      <span class="rounded-full border border-[#dce2ed] bg-[#f6f8fc] px-3 py-1.5 text-[11px] ${muted} dark:border-white/15 dark:bg-transparent">Gráfico de ejemplo</span>
    </figcaption>
    <div class="mb-4 mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs ${muted}">
      <span class="inline-flex items-center gap-2"><span class="size-2 rounded-sm bg-[#669d0a] dark:bg-[#c7ff4f]" aria-hidden="true"></span>Ejecuciones</span>
      <span class="inline-flex items-center gap-2"><span class="w-4 border-t border-dashed border-[#648b24] dark:border-[#a9d55e]" aria-hidden="true"></span>Promedio diario: <strong class="-ml-1 font-semibold tabular-nums">${average}</strong></span>
    </div>
    <ul class="sr-only" aria-label="Ejecuciones de ejemplo por día">${days.map((day, index) => `<li>${day}: ${runs[index]}</li>`).join('')}</ul>
    <div class="grid grid-cols-[2rem_minmax(0,1fr)] gap-2 rounded-xl border border-dashed border-[#d5dce8] bg-[#f8fafd] p-3 dark:border-white/15 dark:bg-black/15 sm:gap-3 sm:p-4" aria-hidden="true">
      <div class="flex h-[172px] flex-col justify-between text-right text-[11px] leading-none tabular-nums ${muted} sm:h-[222px]">
        ${ticks.map(tick => `<span>${tick}</span>`).join('')}
      </div>
      <div class="min-w-0">
        <svg viewBox="0 0 ${plotWidth} 198" preserveAspectRatio="none" class="block h-[172px] w-full sm:h-[222px]">
          <defs>
            <linearGradient id="activity-fill" x2="0" y2="1">
              <stop class="text-[#a4df29] dark:text-[#a4d946]" stop-color="currentColor" stop-opacity=".58"/>
              <stop offset="100%" class="text-[#b1e64c] dark:text-[#8abc2e]" stop-color="currentColor" stop-opacity=".035"/>
            </linearGradient>
          </defs>
          ${runs.map((value, index) => {
            const left = index * columnWidth + 3;
            const width = columnWidth - 6;
            const top = position(value);
            return `<rect x="${left}" y="${top}" width="${width}" height="${plotHeight - top}" fill="url(#activity-fill)"/>
            <path d="M${left} ${top}h${width}" class="stroke-[#82b91c] dark:stroke-[#b9ed63]" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`;
          }).join('')}
          <path d="M0 ${position(average)}H${plotWidth}" class="stroke-[#648b24] dark:stroke-[#a9d55e]" stroke-width="1.25" stroke-dasharray="5 5" vector-effect="non-scaling-stroke"/>
          <path d="M0 ${plotHeight}H${plotWidth}" class="stroke-[#c4cddc] dark:stroke-white/25" stroke-width="1" vector-effect="non-scaling-stroke"/>
        </svg>
        <div class="mt-2 grid grid-cols-7 text-center text-[11px] ${muted}">${days.map(day => `<span>${day}</span>`).join('')}</div>
      </div>
    </div>
  </figure>`;
}

function incomeBreakdown(monthContracts, revenue) {
  const totals = new Map();
  for (const contract of monthContracts) {
    totals.set(contract.agent, (totals.get(contract.agent) ?? 0) + contractTotal(contract));
  }
  const tones = [
    'text-[#669b13] dark:text-[#c7ff4f]',
    'text-[#8da664] dark:text-[#86b247]',
    'text-[#b6c29b] dark:text-[#bdd3a2]',
  ];
  let offset = 0;
  const rows = [...totals].sort((first, second) => second[1] - first[1]).map(([id, amount], index) => {
    const part = revenue ? amount / revenue : 0;
    const length = part * 100;
    const start = offset;
    offset += length;
    return { name: nameOf(agents, id), amount, part, length, start, tone: tones[index % tones.length] };
  });

  return `<section id="income-breakdown" aria-labelledby="income-heading" class="${dashboardPanel} ${panelInset} flex min-w-0 flex-col py-4 sm:py-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 id="income-heading" class="text-[22px] font-semibold tracking-tight">Ingresos por agente</h2>
        <p class="mt-0.5 text-sm ${muted}">Contrataciones iniciadas en el mes</p>
      </div>
      <a href="#contrataciones" class="${button} !min-h-8 !rounded-full !px-3 !text-xs">Ver contrataciones</a>
    </div>
    <div class="mt-4 grid flex-1 items-center gap-4 sm:grid-cols-[9.75rem_minmax(0,1fr)] xl:grid-cols-[11.5rem_minmax(0,1fr)]">
      <div class="relative mx-auto size-[9.75rem] xl:size-[11.5rem]">
        <svg viewBox="0 0 160 160" class="size-full" aria-hidden="true">
          <circle cx="80" cy="80" r="69" fill="none" stroke-width="18" class="stroke-[#e4e9de] dark:stroke-white/10"/>
          ${rows.filter(row => row.length > 0).map(row => `<circle data-income-segment cx="80" cy="80" r="69" pathLength="100" fill="none" stroke-width="18" stroke="currentColor" class="${row.tone}" transform="rotate(-90 80 80)" stroke-dasharray="${row.length} ${100 - row.length}" stroke-dashoffset="${-row.start}"/>`).join('')}
        </svg>
        <div class="absolute inset-0 grid place-content-center gap-0.5 text-center">
          <p class="text-base font-semibold tracking-tight tabular-nums xl:text-lg">${euros.format(revenue)}</p>
          <p class="text-xs ${muted}">Total del mes</p>
        </div>
      </div>
      ${rows.length ? `<ul aria-label="Importe y participación por agente">${rows.map(row => `<li class="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 py-2.5 text-sm sm:gap-3">
        <span class="flex min-w-0 items-center gap-2 font-medium"><span class="size-2.5 shrink-0 rounded-full bg-current ${row.tone}" aria-hidden="true"></span><span class="min-w-0 break-words">${row.name}</span></span>
        <span class="whitespace-nowrap font-semibold tabular-nums">${euros.format(row.amount)}</span>
        <span class="w-[6ch] whitespace-nowrap text-right text-xs tabular-nums ${muted}">${percent.format(row.part)}</span>
      </li>`).join('')}</ul>` : `<p class="text-sm ${muted}">No hay contrataciones para este periodo.</p>`}
    </div>
  </section>`;
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
    return `<li class="${surface} ${panelInset} py-4">
      <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <span class="${tileIcon}">${icon('agentes')}</span>
          <div class="min-w-0"><h2 class="font-semibold leading-tight">${agent.name}</h2><p class="mt-0.5 text-sm ${muted}">${nameOf(users, agent.owner)}</p></div>
        </div>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
          <span class="mr-auto sm:mr-1">${badge(agent.status)}</span>
          <button id="skills-toggle-${agent.id}" data-expand="${agent.id}" type="button" aria-label="Skills de ${agent.name}" aria-controls="skills-${agent.id}" aria-expanded="${expanded}" class="${button} group min-w-[134px] !justify-between gap-1.5">
            <span data-expand-label>${expanded ? 'Ocultar skills' : 'Ver skills'}</span>${icon('chevron', `size-4 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none group-data-[instant]:transition-none ${expanded ? 'rotate-180' : ''}`)}
          </button>
          ${actionMenu(agent, agent.name, [['configure', 'Configurar'], ['delete', 'Eliminar']])}
        </div>
      </div>
      <div id="skills-${agent.id}" aria-hidden="${!expanded}" class="grid transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none data-[instant]:transition-none ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}">
        <div class="overflow-hidden"><div class="mt-4 flex flex-wrap gap-2 border-t ${border} pt-3">${labels.length ? chips(labels) : `<p class="text-sm ${muted}">Sin skills habilitadas.</p>`}</div></div>
      </div>
    </li>`;
  }).join('')}</ul>`;
}

function skillList() {
  const records = visibleRecords(skills);
  if (!records.length) return `<p class="${surface} ${muted} p-5 text-sm">No hay skills en el catálogo.</p>`;
  return `<ul class="grid gap-4 lg:grid-cols-2">${records.map(skill => {
    const count = agentsUsing(skill).length;
    return `<li class="${surface} ${panelInset} flex flex-col py-4 sm:py-5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <span class="${tileIcon}">${icon('skills')}</span>
          <h2 class="font-semibold leading-tight">${skill.name}</h2>
        </div>
        ${actionMenu(skill, skill.name, [['detail', 'Ver detalle'], ['delete', 'Eliminar']])}
      </div>
      <p class="mb-4 mt-3 max-w-prose text-sm leading-relaxed ${muted}">${skill.description}</p>
      <p class="mt-auto border-t ${border} pt-3 text-xs font-medium text-lime-900 dark:text-[#c7ff4f]"><span class="font-semibold tabular-nums">${count}</span> ${count === 1 ? 'agente usa esta skill' : 'agentes usan esta skill'}</p>
    </li>`;
  }).join('')}</ul>`;
}

function contractList() {
  return table(['Cliente', 'Agente', 'Skills contratadas', 'Inicio', 'Fin', 'Importe', 'Estado', 'Acciones'], contracts.map((contract, index) => [
    nameOf(users, contract.user),
    nameOf(agents, contract.agent),
    `<div class="flex max-w-60 flex-wrap gap-1.5 xl:max-w-72">${chips(contract.skills.map(skill => nameOf(skills, skill.id)))}</div>`,
    `<time datetime="${contract.start}" class="whitespace-nowrap tabular-nums">${formatDate(contract.start)}</time>`,
    `<time datetime="${contract.end}" class="whitespace-nowrap tabular-nums">${formatDate(contract.end)}</time>`,
    `<span class="block whitespace-nowrap text-right font-medium tabular-nums">${euros.format(contractTotal(contract))}</span>`,
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
  const isDashboard = currentView === 'dashboard';
  heading.textContent = views[currentView].heading ?? views[currentView].title;
  document.querySelector('#description').textContent = views[currentView].description;
  dashboardAccent.classList.toggle('sm:block', isDashboard);
  dashboardPeriod.hidden = !isDashboard;
  dashboardPeriod.innerHTML = isDashboard ? `<time datetime="${billingMonth}" class="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-xl border border-[#dce2ee] bg-[#f8faff] px-2.5 text-xs font-medium ${muted} shadow-sm dark:border-white/15 dark:bg-[#1b1d20] dark:shadow-none sm:min-h-12 sm:px-4 sm:text-sm">${icon('calendar', 'size-4')}${billingLabel}</time>` : '';
  nav.innerHTML = Object.entries(views).map(([name, data]) => {
    const active = name === currentView;
    const tone = active ? 'bg-[#c7ff4f] text-[#233516] dark:bg-[#c7ff4f] dark:text-[#1a220b]' : `${muted} hover:bg-[#eaf0f8] dark:hover:bg-white/10`;
    return `<a href="#${name}" aria-label="${data.title}" ${active ? 'aria-current="page"' : ''} class="group relative flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-[15px] px-1 text-center font-medium sm:w-12 sm:px-0 sm:[@media(max-height:500px)]:min-h-9 ${focus} ${tone}">
      ${icon(name)}<span class="text-[9px] leading-none sm:hidden">${data.short}</span>
      <span aria-hidden="true" class="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-[#dce2ee] bg-[#fcfdff] px-2.5 py-1.5 text-xs text-[#20293a] shadow-sm dark:border-white/15 dark:bg-[#222528] dark:text-[#f5f6f3] sm:[@media(hover:hover)]:group-hover:block sm:group-focus-visible:block">${data.title}</span>
    </a>`;
  }).join('');
  openMenu = undefined;
  view.innerHTML = renderers[currentView]();
}

function animateEntrance(element, fromPointer, scale, duration) {
  element.getAnimations().forEach(animation => animation.cancel());
  if (!fromPointer || reduceMotion.matches) return;
  element.animate([
    { opacity: 0, transform: `scale(${scale})` },
    { opacity: 1, transform: 'none' },
  ], { duration, easing: enterEasing });
}

function closeMenu(restoreFocus = false) {
  if (!openMenu) return;
  const trigger = openMenu.querySelector('[data-menu-button]');
  const panel = openMenu.querySelector('[data-menu-panel]');
  openMenu = undefined;
  trigger.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
  panel.getAnimations().forEach(animation => animation.cancel());
  if (restoreFocus) trigger.focus();
}

function toggleMenu(trigger, fromPointer) {
  const menu = trigger.closest('[data-menu]');
  const wasOpen = menu === openMenu;
  closeMenu();
  if (wasOpen) return;
  openMenu = menu;
  const panel = menu.querySelector('[data-menu-panel]');
  trigger.setAttribute('aria-expanded', 'true');
  panel.hidden = false;
  animateEntrance(panel, fromPointer, 0.95, 150);
  if (!fromPointer) panel.querySelector('button:not(:disabled)')?.focus();
}

function toggleSkills(trigger, fromPointer) {
  const id = trigger.dataset.expand;
  const willOpen = !expandedAgents.has(id);
  if (willOpen) expandedAgents.add(id);
  else expandedAgents.delete(id);
  trigger.toggleAttribute('data-instant', !fromPointer);
  trigger.setAttribute('aria-expanded', String(willOpen));
  trigger.querySelector('[data-expand-label]').textContent = willOpen ? 'Ocultar skills' : 'Ver skills';
  trigger.querySelector('svg').classList.toggle('rotate-180', willOpen);
  const panel = document.getElementById(`skills-${id}`);
  panel.toggleAttribute('data-instant', !fromPointer);
  panel.setAttribute('aria-hidden', String(!willOpen));
  panel.classList.toggle('grid-rows-[1fr]', willOpen);
  panel.classList.toggle('grid-rows-[0fr]', !willOpen);
  panel.classList.toggle('opacity-100', willOpen);
  panel.classList.toggle('opacity-0', !willOpen);
}

function detailRows(rows) {
  return `<dl class="${divider}">${rows.map(([label, value]) => `<div class="grid grid-cols-[minmax(6rem,1fr)_2fr] gap-3 py-2.5 text-sm"><dt class="${muted}">${label}</dt><dd class="break-words font-medium">${value}</dd></div>`).join('')}</dl>`;
}

function showDialog(title, body, id, fromPointer, footer = '') {
  openerId = `action-${id}`;
  dialogPanel.innerHTML = `<header class="flex items-center justify-between gap-4 border-b ${border} px-4 py-4 sm:px-6">
    <div class="flex min-w-0 items-center gap-3">
      <span class="${tileIcon}">${icon(currentView)}</span>
      <h2 id="dialog-title" class="min-w-0 break-words text-xl font-semibold tracking-tight">${title}</h2>
    </div>
    <button data-dialog-close type="button" aria-label="Cerrar" autofocus class="grid size-10 shrink-0 place-items-center rounded-xl ${controlHover} ${focus}">${icon('close')}</button>
  </header>
  <div class="px-4 py-4 sm:px-6">${body}</div>
  ${footer ? `<footer class="flex flex-wrap justify-end gap-2 border-t ${border} px-4 py-4 sm:px-6">${footer}</footer>` : ''}`;
  dialog.showModal();
  animateEntrance(dialog, fromPointer, 0.96, 200);
}

function showDetail(record, fromPointer) {
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
  showDialog(record.name ?? record.id, details[currentView](), record.id, fromPointer);
  if (currentView === 'errores') document.querySelector('#error-trace').textContent = record.trace;
}

function updateRecords(message, record) {
  render();
  announcement.textContent = message;
  (document.getElementById(`action-${record.id}`) ?? document.querySelector('#contenido')).focus();
}

function handleAction(action, id, fromPointer) {
  const record = recordsByView[currentView].find(item => item.id === id);
  closeMenu(true);
  if (action === 'detail') {
    showDetail(record, fromPointer);
  } else if (action === 'configure') {
    showDialog(`Configurar ${record.name}`, `<form id="agent-config"><label for="system-prompt" class="mb-2 block text-sm font-medium">Prompt de sistema</label><textarea id="system-prompt" required rows="5" class="w-full rounded-xl border border-[#dce2ee] bg-[#f4f7fc] p-3 text-sm leading-relaxed dark:border-white/15 dark:bg-black/20 ${focus}"></textarea></form>`, id, fromPointer,
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
    showDialog(`Eliminar ${record.name}`, `<p class="text-sm leading-relaxed ${muted}">¿Quieres retirar este registro del listado de demostración?</p>`, id, fromPointer,
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
  themeTooltip.textContent = dark ? 'Activar modo claro' : 'Activar modo oscuro';
  themeToggle.innerHTML = icon(dark ? 'sun' : 'moon');
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
  const fromPointer = event.detail > 0;
  if (menuButton) toggleMenu(menuButton, fromPointer);
  if (skillButton) toggleSkills(skillButton, fromPointer);
  if (actionButton) handleAction(actionButton.dataset.action, actionButton.dataset.id, fromPointer);
});

document.addEventListener('keydown', event => {
  if (!openMenu) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu(true);
    return;
  }
  if (!openMenu.contains(event.target) || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
  const actions = [...openMenu.querySelectorAll('[data-action]:not(:disabled)')];
  const current = actions.indexOf(document.activeElement);
  const next = {
    ArrowDown: (current + 1) % actions.length,
    ArrowUp: current <= 0 ? actions.length - 1 : current - 1,
    Home: 0,
    End: actions.length - 1,
  };
  event.preventDefault();
  actions[next[event.key]]?.focus();
});

view.addEventListener('focusout', event => {
  if (openMenu?.contains(event.target) && !openMenu.contains(event.relatedTarget)) closeMenu();
});

dialog.addEventListener('click', event => {
  if (event.target === dialog || event.target.closest('[data-dialog-close]')) dialog.close();
});

dialog.addEventListener('close', () => {
  if (dialog.open) return;
  dialog.getAnimations().forEach(animation => animation.cancel());
  document.getElementById(openerId)?.focus();
});

nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (link?.matches('[aria-current="page"]')) {
    event.preventDefault();
    window.scrollTo(0, 0);
    heading.focus({ preventScroll: true });
  }
});

document.querySelector('#skip-link').addEventListener('click', event => {
  event.preventDefault();
  document.querySelector('#contenido').focus();
});

window.addEventListener('hashchange', () => {
  if (dialog.open) dialog.close();
  render();
  window.scrollTo(0, 0);
  heading.focus({ preventScroll: true });
});

updateTheme();
render();
