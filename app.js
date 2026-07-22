const APP_STATE = {
  data: null,
  currentView: "dashboard",
  openDropdown: null,
  darkMode: false,
  resolvedErrors: new Set(),
  filters: {
    users: "",
    agents: "",
    skills: "",
    contracts: "",
    errors: ""
  }
};

const VIEW_TITLES = {
  dashboard: "Dashboard",
  users: "Gestion de Usuarios",
  agents: "Gestion de Agentes",
  skills: "Skills",
  contracts: "Contrataciones de Agentes",
  errors: "Log de Errores"
};

const refs = {
  html: document.documentElement,
  sidebar: document.querySelector("#sidebar"),
  mobileSidebarBackdrop: document.querySelector("#mobile-sidebar-backdrop"),
  mobileSidebarOpen: document.querySelector("#mobile-sidebar-open"),
  mobileSidebarClose: document.querySelector("#mobile-sidebar-close"),
  viewTitle: document.querySelector("#view-title"),
  navButtons: Array.from(document.querySelectorAll(".view-link")),
  panels: Array.from(document.querySelectorAll(".view-panel")),
  darkToggle: document.querySelector("#dark-toggle"),
  darkIcon: document.querySelector("#dark-icon"),
  darkLabel: document.querySelector("#dark-label"),
  dashboardMetrics: document.querySelector("#dashboard-metrics"),
  weeklyChart: document.querySelector("#weekly-chart"),
  usersTableBody: document.querySelector("#users-table-body"),
  agentsList: document.querySelector("#agents-list"),
  skillsGrid: document.querySelector("#skills-grid"),
  contractsTableBody: document.querySelector("#contracts-table-body"),
  errorsTableBody: document.querySelector("#errors-table-body"),
  modal: document.querySelector("#modal"),
  modalBackdrop: document.querySelector("#modal-backdrop"),
  modalClose: document.querySelector("#modal-close"),
  modalTitle: document.querySelector("#modal-title"),
  modalContent: document.querySelector("#modal-content"),
  modalFooter: document.querySelector("#modal-footer"),
  filterUsers: document.querySelector("#filter-users"),
  filterAgents: document.querySelector("#filter-agents"),
  filterSkills: document.querySelector("#filter-skills"),
  filterContracts: document.querySelector("#filter-contracts"),
  filterErrors: document.querySelector("#filter-errors")
};

function normalizeText(text) {
  return String(text).toLowerCase().trim();
}

function includesQuery(values, query) {
  if (!query) {
    return true;
  }
  const haystack = values.map((value) => normalizeText(value)).join(" ");
  return haystack.includes(query);
}

function openMobileSidebar() {
  refs.sidebar.classList.remove("-translate-x-full");
  refs.mobileSidebarBackdrop.classList.remove("hidden");
}

function closeMobileSidebar() {
  refs.sidebar.classList.add("-translate-x-full");
  refs.mobileSidebarBackdrop.classList.add("hidden");
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

function statusBadge(status) {
  const palette = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    failing: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    inactive: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
    suspended: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
  };
  const label = {
    active: "Activo",
    failing: "Con fallos",
    inactive: "Inactivo",
    suspended: "Suspendido"
  };
  return `<span class="rounded-full px-2.5 py-1 text-xs font-bold ${palette[status] || palette.inactive}">${label[status] || status}</span>`;
}

function severityBadge(severity) {
  const palette = {
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    low: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300"
  };
  return `<span class="rounded-full px-2.5 py-1 text-xs font-bold uppercase ${palette[severity] || palette.low}">${severity}</span>`;
}

function closeAllDropdowns() {
  document.querySelectorAll(".dropdown-menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
  APP_STATE.openDropdown = null;
}

function openModal({ title, contentHtml, footerHtml = "" }) {
  refs.modalTitle.textContent = title;
  refs.modalContent.innerHTML = contentHtml;
  refs.modalFooter.innerHTML = footerHtml;
  refs.modal.classList.remove("hidden");
  refs.modal.classList.add("flex");
}

function closeModal() {
  refs.modal.classList.add("hidden");
  refs.modal.classList.remove("flex");
  refs.modalTitle.textContent = "Detalle";
  refs.modalContent.innerHTML = "";
  refs.modalFooter.innerHTML = "";
}

function setDarkMode(enabled) {
  APP_STATE.darkMode = enabled;
  refs.darkToggle.setAttribute("aria-pressed", String(enabled));
  refs.darkIcon.textContent = enabled ? "MOON" : "SUN";
  refs.darkLabel.textContent = enabled ? "Modo oscuro" : "Modo claro";

  if (enabled) {
    refs.html.classList.add("dark");
  } else {
    refs.html.classList.remove("dark");
  }

  localStorage.setItem("agenthub-dark-mode", enabled ? "1" : "0");
}

function applyActiveNav(view) {
  refs.navButtons.forEach((button) => {
    const active = button.dataset.view === view;
    button.className = `view-link flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
      active
        ? "bg-cyan-600 text-white shadow-sm dark:bg-cyan-500 dark:text-slate-950"
        : "hover:bg-cyan-100 hover:text-cyan-900 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-200"
    }`;
  });
}

function changeView(view) {
  APP_STATE.currentView = view;
  refs.viewTitle.textContent = VIEW_TITLES[view] || "Dashboard";
  refs.panels.forEach((panel) => {
    panel.classList.toggle("hidden", panel.id !== `view-${view}`);
  });
  applyActiveNav(view);
  closeAllDropdowns();
  closeMobileSidebar();
}

function buildDropdown(id, items) {
  const options = items
    .map(
      (item) =>
        `<button class="dropdown-action block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700" data-action="${item.action}" data-id="${id}">${item.label}</button>`
    )
    .join("");

  return `
    <div class="relative inline-block text-left">
      <button class="dropdown-toggle rounded-lg border border-slate-300 px-2 py-1 text-lg font-bold leading-none transition hover:border-cyan-400 dark:border-slate-600" data-dropdown-target="dropdown-${id}" aria-label="Abrir acciones">⋮</button>
      <div id="dropdown-${id}" class="dropdown-menu absolute right-0 z-20 mt-2 hidden w-44 rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
        ${options}
      </div>
    </div>
  `;
}

function renderDashboard() {
  const metrics = APP_STATE.data.dashboard.metrics;
  const cards = [
    {
      title: "Ingresos totales",
      value: formatCurrency(metrics.totalRevenue),
      icon: "UP",
      tone: "from-emerald-100 to-emerald-50 text-emerald-800 dark:from-emerald-900/40 dark:to-emerald-950 dark:text-emerald-200"
    },
    {
      title: "Perdidas por descuentos",
      value: formatCurrency(metrics.discountLoss),
      icon: "DOWN",
      tone: "from-rose-100 to-rose-50 text-rose-800 dark:from-rose-900/40 dark:to-rose-950 dark:text-rose-200"
    },
    {
      title: "Agentes activos",
      value: String(metrics.activeAgents),
      icon: "OK",
      tone: "from-cyan-100 to-cyan-50 text-cyan-800 dark:from-cyan-900/40 dark:to-cyan-950 dark:text-cyan-200"
    },
    {
      title: "Agentes con fallos",
      value: String(metrics.failingAgents),
      icon: "!",
      tone: "from-amber-100 to-amber-50 text-amber-800 dark:from-amber-900/40 dark:to-amber-950 dark:text-amber-200"
    }
  ];

  refs.dashboardMetrics.innerHTML = cards
    .map(
      (card) => `
      <article class="rounded-2xl border border-slate-200 bg-gradient-to-br ${card.tone} p-5 shadow-sm dark:border-slate-700">
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold uppercase tracking-wider">${card.title}</p>
          <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-lg font-black dark:bg-slate-800/70">${card.icon}</span>
        </div>
        <p class="mt-4 text-3xl font-black tracking-tight">${card.value}</p>
      </article>
    `
    )
    .join("");

  const bars = ["h-2/5", "h-5/9", "h-[45%]", "h-[70%]", "h-[62%]", "h-4/5", "h-[68%]"];
  const labels = ["L", "M", "X", "J", "V", "S", "D"];
  refs.weeklyChart.innerHTML = bars
    .map(
      (heightClass, index) => `
      <div class="flex flex-col items-center gap-2">
        <div class="w-full rounded-lg bg-gradient-to-t from-cyan-500 to-amber-400 ${heightClass}"></div>
        <span class="text-xs font-bold text-slate-600 dark:text-slate-300">${labels[index]}</span>
      </div>
    `
    )
    .join("");
}

function renderUsers() {
  const query = normalizeText(APP_STATE.filters.users);
  const filteredUsers = APP_STATE.data.users.filter((user) =>
    includesQuery([user.id, user.name, user.email, user.plan, user.status], query)
  );

  refs.usersTableBody.innerHTML = filteredUsers
    .map(
      (user) => `
      <tr>
        <td class="px-4 py-3 font-mono text-xs">${user.id}</td>
        <td class="px-4 py-3 font-semibold">${user.name}</td>
        <td class="px-4 py-3">${user.email}</td>
        <td class="px-4 py-3">${user.plan}</td>
        <td class="px-4 py-3">${statusBadge(user.status)}</td>
        <td class="px-4 py-3 text-right">
          ${buildDropdown(`user-${user.id}`, [
            { action: "user-view", label: "Ver detalle" },
            { action: "user-delete", label: "Eliminar" }
          ])}
        </td>
      </tr>
    `
    )
    .join("");

  if (filteredUsers.length === 0) {
    refs.usersTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No hay usuarios que coincidan con la busqueda.</td>
      </tr>
    `;
  }
}

function renderAgents() {
  const query = normalizeText(APP_STATE.filters.agents);
  const filteredAgents = APP_STATE.data.agents.filter((agent) =>
    includesQuery([agent.id, agent.name, agent.owner, agent.status, agent.skills.join(" ")], query)
  );

  refs.agentsList.innerHTML = filteredAgents
    .map(
      (agent) => `
      <li class="rounded-xl border border-slate-200 p-4 shadow-sm dark:border-slate-700">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p class="text-xs font-mono text-slate-500 dark:text-slate-400">${agent.id}</p>
            <h4 class="text-lg font-extrabold">${agent.name}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300">Cliente: ${agent.owner}</p>
            <div class="mt-2">${statusBadge(agent.status)}</div>
          </div>
          <div class="flex items-center gap-2">
            <button class="skills-toggle rounded-lg border border-slate-300 px-3 py-1 text-sm font-semibold transition hover:border-cyan-400 dark:border-slate-600" data-target="skills-${agent.id}" aria-expanded="false">Ver skills</button>
            ${buildDropdown(`agent-${agent.id}`, [
              { action: "agent-config", label: "Configurar prompt" },
              { action: "agent-delete", label: "Eliminar" }
            ])}
          </div>
        </div>
        <div id="skills-${agent.id}" class="mt-3 max-h-0 overflow-hidden rounded-lg bg-slate-100 transition-all duration-300 dark:bg-slate-800">
          <ul class="space-y-2 p-3 text-sm">
            ${agent.skills.map((skill) => `<li class="rounded-md bg-white px-2 py-1 dark:bg-slate-700">${skill}</li>`).join("")}
          </ul>
        </div>
      </li>
    `
    )
    .join("");

  if (filteredAgents.length === 0) {
    refs.agentsList.innerHTML = `
      <li class="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay agentes que coincidan con la busqueda.</li>
    `;
  }
}

function renderSkills() {
  const query = normalizeText(APP_STATE.filters.skills);
  const filteredSkills = APP_STATE.data.skills.filter((skill) =>
    includesQuery([skill.id, skill.name, skill.description], query)
  );

  refs.skillsGrid.innerHTML = filteredSkills
    .map(
      (skill) => `
      <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
        <p class="text-xs font-mono text-slate-500 dark:text-slate-400">${skill.id}</p>
        <h4 class="mt-1 text-lg font-extrabold">${skill.name}</h4>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${skill.description}</p>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <span class="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300">Uso: ${skill.activeCount} agentes</span>
          <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Precio: ${formatCurrency(skill.price)}</span>
        </div>
        <div class="mt-4 flex justify-end">
          ${buildDropdown(`skill-${skill.id}`, [
            { action: "skill-view", label: "Ver detalle" },
            { action: "skill-delete", label: "Eliminar" }
          ])}
        </div>
      </article>
    `
    )
    .join("");

  if (filteredSkills.length === 0) {
    refs.skillsGrid.innerHTML = `
      <article class="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No hay skills que coincidan con la busqueda.</article>
    `;
  }
}

function renderContracts() {
  const query = normalizeText(APP_STATE.filters.contracts);
  const filteredContracts = APP_STATE.data.contracts.filter((contract) =>
    includesQuery([
      contract.id,
      contract.client,
      contract.agentName,
      contract.skillsContracted.join(" "),
      contract.startDate,
      contract.endDate
    ], query)
  );

  refs.contractsTableBody.innerHTML = filteredContracts
    .map(
      (contract) => `
      <tr>
        <td class="px-4 py-3 font-mono text-xs">${contract.id}</td>
        <td class="px-4 py-3 font-semibold">${contract.client}</td>
        <td class="px-4 py-3">${contract.agentName}</td>
        <td class="px-4 py-3">${contract.skillsContracted.join(", ")}</td>
        <td class="px-4 py-3">${contract.startDate} a ${contract.endDate}</td>
        <td class="px-4 py-3 font-bold">${formatCurrency(contract.totalPaid)}</td>
        <td class="px-4 py-3 text-right">
          ${buildDropdown(`contract-${contract.id}`, [{ action: "contract-view", label: "Ver detalle" }])}
        </td>
      </tr>
    `
    )
    .join("");

  if (filteredContracts.length === 0) {
    refs.contractsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No hay contrataciones que coincidan con la busqueda.</td>
      </tr>
    `;
  }
}

function renderErrors() {
  const query = normalizeText(APP_STATE.filters.errors);
  const filteredErrors = APP_STATE.data.errorLogs.filter((log) =>
    includesQuery([log.id, log.agentName, log.errorType, log.severity, log.description], query)
  );

  refs.errorsTableBody.innerHTML = filteredErrors
    .map((log) => {
      const resolved = APP_STATE.resolvedErrors.has(log.id);
      return `
      <tr class="${resolved ? "opacity-55" : ""}">
        <td class="px-4 py-3 font-mono text-xs">${log.id}</td>
        <td class="px-4 py-3">${new Date(log.timestamp).toLocaleString("es-ES")}</td>
        <td class="px-4 py-3 font-semibold">${log.agentName}</td>
        <td class="px-4 py-3">${log.errorType}</td>
        <td class="px-4 py-3">${severityBadge(log.severity)}</td>
        <td class="px-4 py-3">${log.description}</td>
        <td class="px-4 py-3 text-right">
          ${buildDropdown(`error-${log.id}`, [
            { action: "error-trace", label: "Ver traza del error" },
            { action: "error-resolve", label: "Marcar resuelto" }
          ])}
        </td>
      </tr>
    `;
    })
    .join("");

  if (filteredErrors.length === 0) {
    refs.errorsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">No hay errores que coincidan con la busqueda.</td>
      </tr>
    `;
  }
}

function renderAll() {
  renderDashboard();
  renderUsers();
  renderAgents();
  renderSkills();
  renderContracts();
  renderErrors();
}

function findEntityByAction(action, id) {
  const key = id.split("-").slice(1).join("-");

  if (action.startsWith("user-")) {
    return APP_STATE.data.users.find((item) => item.id === key);
  }
  if (action.startsWith("agent-")) {
    return APP_STATE.data.agents.find((item) => item.id === key);
  }
  if (action.startsWith("skill-")) {
    return APP_STATE.data.skills.find((item) => item.id === key);
  }
  if (action.startsWith("contract-")) {
    return APP_STATE.data.contracts.find((item) => item.id === key);
  }
  if (action.startsWith("error-")) {
    return APP_STATE.data.errorLogs.find((item) => item.id === key);
  }
  return null;
}

function buildDetailsList(entity) {
  return Object.entries(entity)
    .map(([field, value]) => {
      const printable = Array.isArray(value) ? value.join(", ") : String(value);
      return `<div class="rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800"><p class="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">${field}</p><p class="font-semibold">${printable}</p></div>`;
    })
    .join("");
}

function setupActions() {
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(".dropdown-toggle");
    const actionButton = event.target.closest(".dropdown-action");
    const skillsToggle = event.target.closest(".skills-toggle");

    if (toggle) {
      event.stopPropagation();
      const targetId = toggle.dataset.dropdownTarget;
      const menu = document.getElementById(targetId);
      const isOpening = menu.classList.contains("hidden");
      closeAllDropdowns();
      if (isOpening) {
        menu.classList.remove("hidden");
        APP_STATE.openDropdown = targetId;
      }
      return;
    }

    if (skillsToggle) {
      const target = document.getElementById(skillsToggle.dataset.target);
      const expanded = skillsToggle.getAttribute("aria-expanded") === "true";
      skillsToggle.setAttribute("aria-expanded", String(!expanded));
      skillsToggle.textContent = expanded ? "Ver skills" : "Ocultar skills";
      target.classList.toggle("max-h-0", expanded);
      target.classList.toggle("max-h-64", !expanded);
      return;
    }

    if (actionButton) {
      const action = actionButton.dataset.action;
      const id = actionButton.dataset.id;
      const entity = findEntityByAction(action, id);

      if (action.endsWith("-view") && entity) {
        openModal({
          title: `Detalle ${entity.id || ""}`,
          contentHtml: `<div class="grid grid-cols-1 gap-2">${buildDetailsList(entity)}</div>`
        });
      }

      if (action === "agent-config" && entity) {
        openModal({
          title: `Configurar prompt ${entity.name}`,
          contentHtml: `
            <label for="prompt-editor" class="mb-2 block text-sm font-semibold">System prompt</label>
            <textarea id="prompt-editor" class="h-52 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-800" spellcheck="false">${entity.systemPrompt}</textarea>
          `,
          footerHtml: `
            <button id="modal-save" class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-500">Guardar</button>
          `
        });

        const saveButton = document.getElementById("modal-save");
        saveButton?.addEventListener("click", () => {
          const editor = document.getElementById("prompt-editor");
          entity.systemPrompt = editor.value.trim();
          closeModal();
        });
      }

      if (action === "error-trace" && entity) {
        openModal({
          title: `Traza ${entity.id}`,
          contentHtml: `<pre class="rounded-xl bg-slate-950 p-4 text-xs text-cyan-300">${entity.trace}</pre>`
        });
      }

      if (action === "error-resolve" && entity) {
        APP_STATE.resolvedErrors.add(entity.id);
        renderErrors();
      }

      if (action.endsWith("-delete")) {
        openModal({
          title: "Simulacion de eliminacion",
          contentHtml: `<p>En este prototipo no se elimina informacion real. La accion queda registrada para validacion de flujo.</p>`
        });
      }

      closeAllDropdowns();
      return;
    }

    if (!event.target.closest(".dropdown-menu")) {
      closeAllDropdowns();
    }
  });

  refs.modalClose.addEventListener("click", closeModal);
  refs.modalBackdrop.addEventListener("click", closeModal);

  refs.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      changeView(button.dataset.view);
    });
  });

  refs.darkToggle.addEventListener("click", () => {
    setDarkMode(!APP_STATE.darkMode);
  });

  refs.mobileSidebarOpen.addEventListener("click", openMobileSidebar);
  refs.mobileSidebarClose.addEventListener("click", closeMobileSidebar);
  refs.mobileSidebarBackdrop.addEventListener("click", closeMobileSidebar);

  refs.filterUsers.addEventListener("input", (event) => {
    APP_STATE.filters.users = event.target.value;
    renderUsers();
  });

  refs.filterAgents.addEventListener("input", (event) => {
    APP_STATE.filters.agents = event.target.value;
    renderAgents();
  });

  refs.filterSkills.addEventListener("input", (event) => {
    APP_STATE.filters.skills = event.target.value;
    renderSkills();
  });

  refs.filterContracts.addEventListener("input", (event) => {
    APP_STATE.filters.contracts = event.target.value;
    renderContracts();
  });

  refs.filterErrors.addEventListener("input", (event) => {
    APP_STATE.filters.errors = event.target.value;
    renderErrors();
  });
}

async function loadData() {
  const response = await fetch("./data/data.json");
  if (!response.ok) {
    throw new Error("No se pudo cargar data/data.json");
  }
  APP_STATE.data = await response.json();
}

async function init() {
  const savedDark = localStorage.getItem("agenthub-dark-mode") === "1";
  setDarkMode(savedDark);

  try {
    await loadData();
    renderAll();
    changeView("dashboard");
    setupActions();
  } catch (error) {
    refs.viewTitle.textContent = "Error de carga";
    document.querySelector("#app-main").innerHTML = `
      <section class="rounded-xl border border-rose-300 bg-rose-50 p-4 text-rose-700 dark:border-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        <h3 class="text-lg font-extrabold">No se pudo iniciar el prototipo</h3>
        <p class="mt-2 text-sm">${error.message}</p>
      </section>
    `;
  }
}

init();
