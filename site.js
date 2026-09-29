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
