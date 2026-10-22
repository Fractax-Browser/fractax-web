// Enlaces de la web en un solo sitio: descargas (GitHub Releases) y compra
// (Checkout Links de Polar, cuenta de produccion). Los botones llevan
// data-link="<clave>" y aqui se les pone el href.
const FRACTAX_LINKS = {
  macArm: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-mac-arm64.dmg',
  macIntel: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-mac-x64.dmg',
  windows: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-windows-setup.exe',
  linux: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-linux.AppImage',
  buyMonthly: 'https://buy.polar.sh/polar_cl_WIaVqh52XuEvEhNRSZ9KUltmp9z2LujUn8uac3RUmpj',
  buyYearly: 'https://buy.polar.sh/polar_cl_VSe2jd23eSojOW2zjevhZQ8x2C4zC2BdVzBf424L5Sv',
  portal: 'https://polar.sh/fractax/portal',
  // Oferta de lanzamiento: Premium gratis 6 meses (producto gratuito en Polar).
  earlyAdopter: 'https://buy.polar.sh/polar_cl_XvzuBUkfqdw0nNOOenfqqBGrzSBs30VbbYQOf2VxiKC',
}

// Plataformas con instalador publicado en la release. Las que estan a false
// salen deshabilitadas y sin enlace (asi no dan 404); ponerlas a true
// cuando su instalador este publicado.
const AVAILABLE = { macArm: true, macIntel: true, windows: true, linux: true }
for (const el of document.querySelectorAll('[data-link]')) {
  const key = el.dataset.link
  if (AVAILABLE[key] === false) {
    el.removeAttribute('href')
    el.setAttribute('aria-disabled', 'true')
    el.classList.add('btn-soon')
    continue
  }
  const url = FRACTAX_LINKS[key]
  if (url && /^https:\/\//.test(url)) el.href = url
}

// Boton principal de descarga segun el sistema de quien visita.
const primary = document.querySelector('[data-auto-download]')
if (primary) {
  const ua = navigator.userAgent
  const isWin = /Windows/i.test(ua)
  const isMac = /Macintosh|Mac OS X/i.test(ua)
  const isLinux = /Linux/i.test(ua) && !/Android/i.test(ua)
  if (isWin && AVAILABLE.windows) {
    primary.href = FRACTAX_LINKS.windows
    primary.querySelector('span').textContent = primary.dataset.labelWindows
  } else if (isMac) {
    primary.href = FRACTAX_LINKS.macArm
    primary.querySelector('span').textContent = primary.dataset.labelMac
  } else if (isLinux && AVAILABLE.linux) {
    primary.href = FRACTAX_LINKS.linux
    primary.querySelector('span').textContent = primary.dataset.labelLinux
  }
}

document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear())

// Videos de la app (<video data-autoplay>): en bucle y sin sonido, solo
// mientras se ven en pantalla (no gastan datos ni bateria fuera de vista).
// Con "reducir movimiento" no arrancan solos: se quedan con sus controles.
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const videos = document.querySelectorAll('video[data-autoplay]')
if (reduceMotion || !('IntersectionObserver' in window)) {
  for (const video of videos) video.controls = true
} else {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) entry.target.play().catch(() => { entry.target.controls = true })
      else entry.target.pause()
    }
  }, { threshold: 0.35 })
  for (const video of videos) observer.observe(video)
}

// Analitica (GoatCounter): sin cookies y sin guardar la IP, asi que no hace
// falta banner. Panel en https://fractax.goatcounter.com. Cuenta las visitas
// y, como eventos, los clics en cada boton de descarga ("descarga-macArm"...).
// Para que no cuenten tus propias visitas, abre una vez
// https://fractax.com/#toggle-goatcounter en cada navegador que uses.
const GOATCOUNTER_URL = 'https://fractax.goatcounter.com/count'
const DOWNLOAD_KEYS = { macArm: 1, macIntel: 1, windows: 1, linux: 1 }
if (location.hostname === 'fractax.com' || location.hostname === 'www.fractax.com') {
  const gc = document.createElement('script')
  gc.async = true
  gc.src = 'https://gc.zgo.at/count.js'
  gc.dataset.goatcounter = GOATCOUNTER_URL
  document.head.appendChild(gc)
}
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]')
  if (!a || !window.goatcounter || !window.goatcounter.count) return
  let key = a.dataset.link
  if (a.hasAttribute('data-auto-download')) {
    key = Object.keys(DOWNLOAD_KEYS).find((k) => FRACTAX_LINKS[k] === a.href) || 'auto'
  }
  if (!key || !(key in DOWNLOAD_KEYS || key === 'auto')) return
  window.goatcounter.count({ path: 'descarga-' + key, title: 'Descarga ' + key, event: true })
})
