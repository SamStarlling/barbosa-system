// Configurations for each agent
const agentConfigs = {
  whatsapp: {
    color: 'cyan',
    precision: '98.4%',
    kpiLabel: 'Leads Qualificados',
    kpiStart: 47,
    steps: [
      { label: 'Novo Lead', icon: 'solar:login-2-linear' },
      { label: 'Qualificar IA', icon: 'solar:cpu-linear' },
      { label: 'Mensagem', icon: 'solar:chat-round-dots-linear' }
    ],
    logs: [
      "Novo lead qualificado como 'Interessado: Alta Conversão'",
      "Prompt qualificador disparado com sucesso",
      "WhatsApp bot enviou resposta automatizada",
      "Lead #042 clicou no link de agendamento",
      "Sincronização efetuada na agenda do WhatsApp",
      "Agente de vendas qualificador aguardando novos gatilhos"
    ]
  },
  scraper: {
    color: 'emerald',
    precision: '99.1%',
    kpiLabel: 'Empresas Mapeadas',
    kpiStart: 184,
    steps: [
      { label: 'Pesquisa Local', icon: 'solar:globus-linear' },
      { label: 'Filtro Inteligente', icon: 'solar:shield-check-linear' },
      { label: 'Lista Salva', icon: 'solar:folder-with-files-linear' }
    ],
    logs: [
      "Iniciando busca por 'Clínicas Médicas em São Paulo'",
      "Maps Scraper: Extraindo dados de localização e contato",
      "Filtrados 14 contatos válidos (Telefone/WhatsApp)",
      "Planilha exportada para o banco de dados",
      "Disparador: Iniciando qualificação prévia de leads",
      "Pesquisa local finalizada. Aguardando novo termo."
    ]
  },
  nurturing: {
    color: 'purple',
    precision: '97.8%',
    kpiLabel: 'Disparos Ativos',
    kpiStart: 89,
    steps: [
      { label: 'Gatilho CRM', icon: 'solar:card-recieved-linear' },
      { label: 'Personalizar', icon: 'solar:pen-new-square-linear' },
      { label: 'Enviar E-mail', icon: 'solar:letter-linear' }
    ],
    logs: [
      "Lead inativo detectado (Gatilho: 24h sem resposta)",
      "LLM gerando e-mail personalizado com prova social",
      "CRM Flow: E-mail de reengajamento enviado com sucesso",
      "Mapeado: E-mail aberto pelo destinatário",
      "Sucesso: Lead respondeu solicitando chamada comercial",
      "Processo de nutrição IA aguardando próxima fila"
    ]
  }
};

let activeAgent = 'whatsapp';
let sequencerTimer = null;
let mainSimulationTimer = null;
let metricVal = agentConfigs.whatsapp.kpiStart;
let currentTypingIntervals = [];

function clearTypingIntervals() {
  currentTypingIntervals.forEach(interval => clearInterval(interval));
  currentTypingIntervals = [];
}

function stopSimulations() {
  if (sequencerTimer) clearInterval(sequencerTimer);
  if (mainSimulationTimer) clearInterval(mainSimulationTimer);
  clearTypingIntervals();
}

function appendFriendlyLog(text, colorClass = 'text-neutral-300') {
  const feed = document.getElementById('timeline-events-feed');
  const time = new Date().toLocaleTimeString('pt-BR', { hour12: false });

  const logItem = document.createElement('div');
  logItem.className = 'flex items-start gap-2.5 text-[10px] text-neutral-400 animate-fade-in-up';

  const config = agentConfigs[activeAgent];
  const iconColor = colorClass.includes('font-semibold') ? colorClass : `text-${config.color}-400`;

  logItem.innerHTML = `
    <iconify-icon icon="solar:check-circle-bold" class="${iconColor} mt-0.5" width="12"></iconify-icon>
    <div class="flex-1 leading-normal ${colorClass}">
      <span class="text-neutral-600 font-mono mr-1.5 select-none">${time}</span>
      <span class="log-text"></span><span class="terminal-cursor"></span>
    </div>
  `;

  feed.appendChild(logItem);
  feed.scrollTop = feed.scrollHeight;

  while (feed.children.length > 4) {
    feed.removeChild(feed.firstChild);
  }

  // Efeito de digitação da mensagem
  const logTextSpan = logItem.querySelector('.log-text');
  const cursorSpan = logItem.querySelector('.terminal-cursor');
  let charIndex = 0;

  const typingInterval = setInterval(() => {
    if (charIndex < text.length) {
      logTextSpan.textContent += text.charAt(charIndex);
      charIndex++;
      feed.scrollTop = feed.scrollHeight;
    } else {
      clearInterval(typingInterval);
      cursorSpan.remove(); // Remove o cursor piscante quando a digitação termina
      const idx = currentTypingIntervals.indexOf(typingInterval);
      if (idx > -1) currentTypingIntervals.splice(idx, 1);
    }
  }, 15); // Velocidade de digitação rápida e dinâmica

  currentTypingIntervals.push(typingInterval);
}

function resetStepsStyle() {
  for (let i = 1; i <= 3; i++) {
    const stepIcon = document.getElementById(`step-${i}-icon`);
    const stepLabel = document.getElementById(`step-${i}-label`);
    stepIcon.classList.remove('step-active-cyan', 'step-active-emerald', 'step-active-purple');
    stepLabel.classList.remove('text-cyan-400', 'text-emerald-400', 'text-purple-400', 'font-bold', 'text-white');
    stepLabel.classList.add('text-neutral-500');
  }
}

function runSequencer() {
  let step = 1;
  resetStepsStyle();

  sequencerTimer = setInterval(() => {
    resetStepsStyle();
    if (step <= 3) {
      const stepIcon = document.getElementById(`step-${step}-icon`);
      const stepLabel = document.getElementById(`step-${step}-label`);
      const config = agentConfigs[activeAgent];

      stepIcon.classList.add(`step-active-${config.color}`);
      stepLabel.classList.remove('text-neutral-500');
      stepLabel.classList.add(`text-${config.color}-400`, 'font-bold');
      step++;
    } else {
      step = 1;
    }
  }, 1200);
}

function restartSimulations() {
  if (sequencerTimer) clearInterval(sequencerTimer);
  if (mainSimulationTimer) clearInterval(mainSimulationTimer);
  clearTypingIntervals();

  runSequencer();

  const config = agentConfigs[activeAgent];
  let logIndex = 1;

  mainSimulationTimer = setInterval(() => {
    metricVal += Math.floor(Math.random() * 2) + 1;
    document.getElementById('metric-kpi-val').textContent = metricVal;

    appendFriendlyLog(config.logs[logIndex % config.logs.length]);
    logIndex++;
  }, 4500);
}

function selectAgent(agentId) {
  if (activeAgent === agentId) return;
  activeAgent = agentId;

  const agents = ['whatsapp', 'scraper', 'nurturing'];
  agents.forEach(id => {
    const card = document.getElementById(`card-${id}`);
    const badge = document.getElementById(`badge-${id}`);

    if (id === agentId) {
      card.className = `flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all ease-in-out duration-500 cursor-pointer group card-active-${id}`;
      badge.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-${agentConfigs[id].color}-500/10 border border-${agentConfigs[id].color}-500/20 text-[9px] font-mono font-medium text-${agentConfigs[id].color}-300 select-none`;
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-${agentConfigs[id].color}-400 animate-pulse"></span> ATIVO`;
    } else {
      card.className = `flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all ease-in-out duration-500 cursor-pointer group opacity-40`;
      badge.className = `flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-mono font-medium text-neutral-500 select-none`;
      badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-neutral-600"></span> Standby`;
    }
  });

  const config = agentConfigs[agentId];

  for (let i = 1; i <= 3; i++) {
    const stepLabel = document.getElementById(`step-${i}-label`);
    const stepIconContainer = document.getElementById(`step-${i}-icon`);
    const stepIcon = stepIconContainer.querySelector('iconify-icon');

    stepLabel.textContent = config.steps[i - 1].label;
    stepIcon.setAttribute('icon', config.steps[i - 1].icon);
  }

  const connector1 = document.getElementById('connector-1');
  const connector2 = document.getElementById('connector-2');
  connector1.className = `absolute inset-0 w-full h-full -translate-x-full animate-connector-${config.color}`;
  connector2.className = `absolute inset-0 w-full h-full -translate-x-full animate-connector-${config.color}`;

  resetStepsStyle();

  metricVal = config.kpiStart;
  document.getElementById('metric-kpi-val').textContent = metricVal;
  document.getElementById('metric-kpi-lbl').textContent = config.kpiLabel;
  document.getElementById('metric-precision-val').textContent = config.precision;

  const feed = document.getElementById('timeline-events-feed');
  feed.innerHTML = '';
  appendFriendlyLog(`Iniciando monitoramento de fluxo: ${agentId.toUpperCase()}`, `text-${config.color}-400 font-semibold`);
  appendFriendlyLog(config.logs[0]);

  restartSimulations();
}

// Toggle Handlers
document.getElementById('card-whatsapp').addEventListener('click', () => selectAgent('whatsapp'));
document.getElementById('card-scraper').addEventListener('click', () => selectAgent('scraper'));
document.getElementById('card-nurturing').addEventListener('click', () => selectAgent('nurturing'));

// 3D Parallax Tilt Effect for Bento Cards
const cards = document.querySelectorAll('.border-beam-container, .lg\\:col-span-7, .service-card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;

    const angleX = (yc - y) / 25;
    const angleY = (x - xc) / 25;

    card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(1.01, 1.01, 1.01)`;
    card.style.boxShadow = `0 15px 35px -10px rgba(6, 182, 212, 0.15)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.boxShadow = 'none';
  });
});

// Smooth scroll navigation and fade out effects
const mainNav = document.getElementById('main-nav');
const heroSection = document.querySelector('main');

window.addEventListener('scroll', () => {
  // Header sticky dynamic class toggle
  if (window.scrollY > 40) {
    mainNav.classList.add('nav-scrolled');
  } else {
    mainNav.classList.remove('nav-scrolled');
  }

  // Smooth fade of hero section based on scroll offset
  if (window.scrollY > 80) {
    const opacity = Math.max(0, 1 - (window.scrollY - 80) / 250);
    heroSection.style.opacity = opacity;
    heroSection.style.pointerEvents = opacity < 0.1 ? 'none' : 'auto';
  } else {
    heroSection.style.opacity = 1;
    heroSection.style.pointerEvents = 'auto';
  }
});

// Methodology Interactive Timeline Hover Script
const methodologyCards = document.querySelectorAll('.methodology-card');
const glowTrack = document.getElementById('timeline-glow-track');
const stepDisplay = document.getElementById('methodology-step-display');
const stepTitle = document.getElementById('methodology-step-title');

methodologyCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    const step = card.getAttribute('data-step');
    const stepName = card.getAttribute('data-step-name');

    // Update active card opacity states
    methodologyCards.forEach(c => {
      if (c === card) {
        c.classList.remove('opacity-50');
        c.classList.add('border-cyan-500/30');
      } else {
        c.classList.add('opacity-50');
        c.classList.remove('border-cyan-500/30');
      }
    });

    // Update vertical glow track position
    const percentageHeight = 25;
    const topOffset = (step - 1) * percentageHeight;
    glowTrack.style.top = `${topOffset}%`;

    // Update display text and metadata on left
    stepDisplay.textContent = `0${step}`;
    stepTitle.textContent = stepName;

    // Dynamically change colors based on step for premium accent transitions
    if (step === '4') {
      stepDisplay.className = 'text-8xl font-serif italic font-light text-emerald-400/25 transition-all duration-500 ease-out select-none';
      stepTitle.className = 'text-xs font-mono text-emerald-400 uppercase tracking-wider mt-2 transition-all duration-300';
      glowTrack.className = 'w-[3px] bg-gradient-to-b from-purple-400 to-emerald-400 absolute top-0 rounded-full transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      stepDisplay.className = 'text-8xl font-serif italic font-light text-cyan-400/25 transition-all duration-500 ease-out select-none';
      stepTitle.className = 'text-xs font-mono text-cyan-400 uppercase tracking-wider mt-2 transition-all duration-300';
      glowTrack.className = 'w-[3px] bg-gradient-to-b from-cyan-400 to-purple-400 absolute top-0 rounded-full transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1)';
    }
  });
});

// Mobile Drawer Logic
const trigger = document.getElementById('mobile-menu-trigger');
const closeBtn = document.getElementById('mobile-menu-close');
const drawer = document.getElementById('mobile-drawer');
const drawerContent = drawer.querySelector('div');
const drawerLinks = document.querySelectorAll('.mobile-drawer-link');

function openDrawer() {
  drawer.classList.remove('hidden');
  setTimeout(() => {
    drawer.classList.remove('opacity-0');
    drawerContent.classList.remove('translate-x-full');
  }, 50);
}

function closeDrawer() {
  drawerContent.classList.add('translate-x-full');
  drawer.classList.add('opacity-0');
  setTimeout(() => {
    drawer.classList.add('hidden');
  }, 300);
}

trigger.addEventListener('click', openDrawer);
closeBtn.addEventListener('click', closeDrawer);
drawerLinks.forEach(link => link.addEventListener('click', closeDrawer));
drawer.addEventListener('click', (e) => {
  if (e.target === drawer) closeDrawer();
});

// Intersection Observer to optimize performance on mobile / low-end devices
const heroElement = document.getElementById('hero');
let isHeroVisible = true;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    isHeroVisible = entry.isIntersecting;
    if (isHeroVisible) {
      restartSimulations();
    } else {
      stopSimulations();
    }
  });
}, { threshold: 0.1 });

observer.observe(heroElement);
