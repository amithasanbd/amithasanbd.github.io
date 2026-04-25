
const navLinks = document.getElementById('navLinks');
const menuToggle = document.getElementById('menuToggle');
const toTop = document.getElementById('toTop');
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
if (menuToggle) menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks?.classList.remove('open')));

window.addEventListener('scroll', () => {
  if (!toTop) return;
  window.scrollY > 500 ? toTop.classList.add('show') : toTop.classList.remove('show');
});
toTop?.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const slides = [...document.querySelectorAll('.hero-slide')];
let slideIndex = 0;
if (slides.length) {
  setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
  }, 5200);
}

const typed = document.getElementById('dynamicRole');
const roles = ['Marine AI', 'Ocean Data Science', 'GIS & Remote Sensing', 'Digital Twin Ocean', 'Python/R Data Analytics', 'PFZ Modelling'];
let roleIndex = 0;
if (typed) {
  setInterval(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    typed.textContent = roles[roleIndex];
  }, 1800);
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
      entry.target.querySelectorAll('.skill-fill').forEach(bar => bar.style.width = bar.dataset.level + '%');
    }
  });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

async function getJSON(path) {
  const res = await fetch(path, {cache:'no-store'});
  if (!res.ok) throw new Error(path);
  return await res.json();
}

function projectHTML(p) {
  return `
    <article class="glass project-item reveal visible" data-cat="${p.categories.join(' ')}">
      <img src="${p.image}" alt="${p.title}">
      <p class="section-tag">${p.group}</p>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tool-tags">${p.tools.map(t => `<span>${t}</span>`).join('')}</div>
      <span class="status-badge">${p.status}</span>
    </article>`;
}

async function loadProjects() {
  const container = document.getElementById('projectsContainer');
  const featured = document.getElementById('featuredProjects');
  try {
    const projects = await getJSON('data/projects.json');
    if (container) {
      const render = (filter='all') => {
        const items = projects.filter(p => filter === 'all' || p.categories.includes(filter));
        container.innerHTML = items.map(projectHTML).join('');
      };
      render();
      document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          render(btn.dataset.filter);
        });
      });
    }
    if (featured) featured.innerHTML = projects.slice(0,3).map(projectHTML).join('');
  } catch(e) {
    if (container) container.innerHTML = '<article class="glass project-item"><h3>Projects loading issue</h3><p>Check data/projects.json.</p></article>';
  }
}

function updateHTML(u) {
  return `<article class="glass update-card reveal visible">
    <time>${u.date} · ${u.category}</time>
    <h3>${u.title}</h3>
    <p>${u.description}</p>
  </article>`;
}

async function loadUpdates() {
  const page = document.getElementById('updatesContainer');
  const latest = document.getElementById('latestUpdates');
  try {
    const updates = await getJSON('data/updates.json');
    if (page) page.innerHTML = updates.map(updateHTML).join('');
    if (latest) latest.innerHTML = updates.slice(0,3).map(updateHTML).join('');
  } catch(e) {}
}

async function loadSkills() {
  const target = document.getElementById('skillsContainer');
  if (!target) return;
  try {
    const skills = await getJSON('data/skills.json');
    target.innerHTML = skills.map(s => `
      <article class="glass skill-card reveal visible">
        <div class="skill-meta"><span>${s.name}</span><span>${s.level}%</span></div>
        <p>${s.category}</p>
        <div class="skill-bar"><div class="skill-fill" data-level="${s.level}" style="width:${s.level}%"></div></div>
      </article>`).join('');
  } catch(e) {}
}

async function loadGallery() {
  const target = document.getElementById('galleryContainer');
  if (!target) return;
  try {
    const items = await getJSON('data/gallery.json');
    target.innerHTML = items.map(item => `
      <figure class="glass gallery-card reveal visible">
        <img src="${item.image}" alt="${item.title}">
        <figcaption>${item.title}</figcaption>
        <p class="section-tag">${item.type}</p>
        <p>${item.description}</p>
      </figure>`).join('');
  } catch(e) {}
}

loadProjects();
loadUpdates();
loadSkills();
loadGallery();
