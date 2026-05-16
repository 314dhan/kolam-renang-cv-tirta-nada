/* ── Splash screen ── */
const splash = document.getElementById('splash');
if (splash) {
    document.body.style.overflow = 'hidden';
    let splashDone = false;
    function exitSplash() {
        if (splashDone) return;
        splashDone = true;
        splash.classList.add('splash-exit');
        document.body.style.overflow = '';
        setTimeout(() => { splash.remove(); }, 700);
    }
    splash.addEventListener('click', exitSplash);
    setTimeout(exitSplash, 1800);
}

/* ── Mobile menu ── */
const burger = document.getElementById('burger');
const mMenu  = document.getElementById('mobile-menu');
const bOpen  = document.getElementById('b-open');
const bClose = document.getElementById('b-close');
burger.addEventListener('click', () => {
    const hidden = mMenu.classList.toggle('hidden');
    bOpen.classList.toggle('hidden', !hidden);
    bClose.classList.toggle('hidden', hidden);
});
function closeMenu() {
    mMenu.classList.add('hidden');
    bOpen.classList.remove('hidden');
    bClose.classList.add('hidden');
}

/* ── Active nav ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('a.nav-link');
function updateNav() {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
}
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ── Navbar solid on scroll ── */
const navbar = document.getElementById('navbar');
function updateNavbar() {
    navbar.classList.toggle('is-scrolled', window.scrollY > 60);
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

/* ── Scroll progress bar ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = scrolled + '%';
}, { passive: true });

/* ── Hero parallax ── */
const heroImg = document.getElementById('hero-img');
window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight)
        heroImg.style.transform = `scale(1.1) translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

/* ── Hero text stagger ── */
document.querySelectorAll('.hero-enter').forEach((el, i) => {
    setTimeout(() => {
        el.style.transition = 'opacity 0.75s cubic-bezier(0.25,1,0.5,1), transform 0.75s cubic-bezier(0.25,1,0.5,1)';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
    }, 120 + i * 150);
});

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

/* ── Staggered child reveal (data-stagger) ── */
document.querySelectorAll('[data-stagger]').forEach(container => {
    container.querySelectorAll(':scope > *').forEach((child, i) => {
        child.style.transitionDelay = (i % 4 * 0.1) + 's';
        revealObs.observe(child);
    });
});

/* ── Stats counter ── */
let counted = false;
const statNums = document.querySelectorAll('[data-count]');
const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
        counted = true;
        statNums.forEach(el => {
            const target = +el.dataset.count, suffix = el.dataset.suffix || '';
            let cur = 0;
            const step = target / 45;
            const t = setInterval(() => {
                cur = Math.min(cur + step, target);
                el.textContent = Math.round(cur) + suffix;
                if (cur >= target) clearInterval(t);
            }, 32);
        });
    }
}, { threshold: 0.8 });
if (statNums[0]) statsObs.observe(document.getElementById('stats-grid'));

/* ── Back to top ── */
const backTop = document.getElementById('back-top');
window.addEventListener('scroll', () => {
    const show = window.scrollY > 400;
    backTop.classList.toggle('opacity-0', !show);
    backTop.classList.toggle('pointer-events-none', !show);
}, { passive: true });

/* ── Ripple effect ── */
document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

/* ── Lightbox ── */
const galItems = document.querySelectorAll('.gal-item');
const lb       = document.getElementById('lightbox');
const lbImg    = document.getElementById('lb-img');
const lbCap    = document.getElementById('lb-cap');
const lbSrcs   = Array.from(galItems).map(el => el.querySelector('img').src);
const lbAlts   = Array.from(galItems).map(el => el.querySelector('img').alt);
let lbIdx = 0;

function openLightbox(el) {
    lbIdx = Array.from(galItems).indexOf(el);
    lbImg.src = lbSrcs[lbIdx]; lbCap.textContent = lbAlts[lbIdx];
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeLightbox() { lb.classList.remove('open'); document.body.style.overflow = ''; }
function lbNav(dir) {
    lbIdx = (lbIdx + dir + lbSrcs.length) % lbSrcs.length;
    lbImg.src = lbSrcs[lbIdx]; lbCap.textContent = lbAlts[lbIdx];
}
document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
});
