// Enlaces de la web en un solo sitio: descargas (GitHub Releases) y compra
// (Checkout Links de Polar, cuenta de produccion). Los botones llevan
// data-link="<clave>" y aqui se les pone el href.
const FRACTAX_LINKS = {
  macArm: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-mac-arm64.dmg',
  macIntel: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-mac-x64.dmg',
  // Windows: la Microsoft Store (firmada por Microsoft, sin avisos de
  // SmartScreen). El instalador .exe queda como alternativa.
  windows: 'https://apps.microsoft.com/detail/9p58d2btct7z',
  windowsExe: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-windows-setup.exe',
  linux: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-linux.AppImage',
  linuxDeb: 'https://github.com/Fractax-Browser/fractax-web/releases/latest/download/Fractax-linux.deb',
  buyMonthly: 'https://buy.polar.sh/polar_cl_WIaVqh52XuEvEhNRSZ9KUltmp9z2LujUn8uac3RUmpj',
  buyYearly: 'https://buy.polar.sh/polar_cl_VSe2jd23eSojOW2zjevhZQ8x2C4zC2BdVzBf424L5Sv',
  // Business: aun sin boton en la web ("Proximamente").
  buyBusinessMonthly: 'https://buy.polar.sh/polar_cl_e2SrNcvLmwEQYQDikVOUakYXrWVOa8y9iTCqA2bEYqM',
  buyBusinessYearly: 'https://buy.polar.sh/polar_cl_x8qVworFLotxZgLxuTBVjDMZFuxKuwYJuWuyG1lXbQE',
  portal: 'https://polar.sh/fractax/portal',
  // Oferta de lanzamiento: Personal gratis 6 meses (producto gratuito en Polar).
  earlyAdopter: 'https://buy.polar.sh/polar_cl_XvzuBUkfqdw0nNOOenfqqBGrzSBs30VbbYQOf2VxiKC',
}

// Plataformas con instalador publicado en la release. Las que estan a false
// salen deshabilitadas y sin enlace (asi no dan 404); ponerlas a true
// cuando su instalador este publicado.
const AVAILABLE = { macArm: true, macIntel: true, windows: true, windowsExe: true, linux: true, linuxDeb: true }
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

// Sistema de quien visita: el boton principal dice "Descargar para Mac /
// Windows / Linux" y, como el boton del menu, lleva a las tarjetas de
// descarga con la de ese sistema seleccionada.
const UA = navigator.userAgent
const VISITOR_OS = /Windows/i.test(UA) ? 'windows' : /Macintosh|Mac OS X/i.test(UA) ? 'apple' : /Linux/i.test(UA) && !/Android/i.test(UA) ? 'linux' : ''
const primary = document.querySelector('[data-auto-download]')
if (primary) {
  const label = { windows: primary.dataset.labelWindows, apple: primary.dataset.labelMac, linux: primary.dataset.labelLinux }[VISITOR_OS]
  if (label) primary.querySelector('span').textContent = label
}
const osCards = document.querySelector('.os-cards')
const yourCard = osCards && VISITOR_OS ? osCards.querySelector('.os-card.os-' + VISITOR_OS) : null
if (yourCard) {
  yourCard.classList.add('selected')
  const tag = document.createElement('span')
  tag.className = 'os-yours'
  tag.textContent = osCards.dataset.yours || ''
  yourCard.prepend(tag)
}
/** Lleva a las tarjetas y hace destacar la del sistema de quien visita. */
function goToDownloads(smooth) {
  const section = document.getElementById('descargas') || document.getElementById('downloads')
  if (!section) return false
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ;(yourCard || osCards || section).scrollIntoView({ behavior: smooth && !reduce ? 'smooth' : 'auto', block: 'center' })
  if (yourCard) {
    yourCard.classList.remove('pulse')
    void yourCard.offsetWidth
    yourCard.classList.add('pulse')
  }
  return true
}
document.addEventListener('click', (e) => {
  const a = e.target.closest && e.target.closest('a[href]')
  if (!a) return
  const hash = a.getAttribute('href').replace(/^\/(en\/)?/, '')
  if (hash !== '#descargas' && hash !== '#downloads') return
  if (!document.getElementById(hash.slice(1))) return
  e.preventDefault()
  history.replaceState(null, '', hash)
  goToDownloads(true)
})
if (location.hash === '#descargas' || location.hash === '#downloads') window.addEventListener('load', () => goToDownloads(false))

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
const DOWNLOAD_KEYS = { macArm: 1, macIntel: 1, windows: 1, windowsExe: 1, linux: 1, linuxDeb: 1 }
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
  if (!key || !(key in DOWNLOAD_KEYS || key === 'auto')) return
  window.goatcounter.count({ path: 'descarga-' + key, title: 'Descarga ' + key, event: true })
})

// --- Lista de espera de Business ("Avisadme cuando este") ----------------
// Los botones con data-notify="business" abren un formulario; cada alta
// llega por email a carlosgutierrez@fractax.com a traves de FormSubmit
// (formsubmit.co, sin cuenta). La primera vez FormSubmit manda un email
// para activar el formulario; despues da un codigo aleatorio que se pone
// aqui en lugar de la direccion, para que no se vea en la web.
// Vacio: el boton abre el correo como antes.
const NOTIFY_ENDPOINT = 'https://formsubmit.co/ajax/carlosgutierrez@fractax.com'

const NOTIFY_TEXT = {
  es: {
    title: 'Te avisamos cuando salga Business',
    text: 'Déjanos tu organización y tu email profesional y te escribimos en cuanto Fractax Business esté disponible. Nada más.',
    org: 'Nombre de tu organización',
    orgPlaceholder: 'Asesoría García S.L.',
    email: 'Email profesional',
    emailPlaceholder: 'nombre@tudespacho.es',
    consent: 'Acepto que Fractax guarde estos datos para avisarme del lanzamiento de Business, según la <a href="/privacidad.html" target="_blank">política de privacidad</a>.',
    send: 'Avisadme',
    cancel: 'Cancelar',
    sending: 'Enviando…',
    done: '¡Listo! Estás en la lista: te escribiremos en cuanto Fractax Business esté disponible.',
    error: 'No se ha podido enviar. Inténtalo de nuevo o escríbenos a support@fractax.com.',
    close: 'Cerrar',
  },
  en: {
    title: 'We’ll let you know when Business is out',
    text: 'Leave your organization and work email and we’ll write as soon as Fractax Business is available. Nothing else.',
    org: 'Organization name',
    orgPlaceholder: 'Smith & Partners Ltd',
    email: 'Work email',
    emailPlaceholder: 'name@yourfirm.com',
    consent: 'I agree that Fractax stores these details to tell me when Business launches, as described in the <a href="/en/privacy.html" target="_blank">privacy policy</a>.',
    send: 'Notify me',
    cancel: 'Cancel',
    sending: 'Sending…',
    done: 'Done! You’re on the list: we’ll write as soon as Fractax Business is available.',
    error: 'It couldn’t be sent. Please try again or write to support@fractax.com.',
    close: 'Close',
  },
}

function openNotifyDialog() {
  const lang = (document.documentElement.lang || 'es').startsWith('en') ? 'en' : 'es'
  const tx = NOTIFY_TEXT[lang]
  const dialog = document.createElement('dialog')
  dialog.className = 'notify-dialog'
  dialog.innerHTML = `
    <form class="notify-form">
      <h3>${tx.title}</h3>
      <p class="notify-text">${tx.text}</p>
      <label class="notify-label" for="notify-org">${tx.org}</label>
      <input id="notify-org" name="organizacion" type="text" required maxlength="120" autocomplete="organization" placeholder="${tx.orgPlaceholder}">
      <label class="notify-label" for="notify-email">${tx.email}</label>
      <input id="notify-email" name="email" type="email" required maxlength="160" autocomplete="work email" placeholder="${tx.emailPlaceholder}">
      <!-- Trampa para bots (FormSubmit descarta el envio si viene relleno) -->
      <input name="_honey" type="text" value="" tabindex="-1" autocomplete="off" class="notify-trap" aria-hidden="true">
      <label class="notify-consent"><input name="consent" type="checkbox" value="1" required> <span>${tx.consent}</span></label>
      <p class="notify-status" role="status"></p>
      <div class="notify-actions">
        <button type="button" class="btn btn-outline btn-small notify-cancel">${tx.cancel}</button>
        <button type="submit" class="btn btn-primary btn-small notify-send">${tx.send}</button>
      </div>
    </form>`
  document.body.appendChild(dialog)
  const form = dialog.querySelector('form')
  const status = dialog.querySelector('.notify-status')
  const send = dialog.querySelector('.notify-send')
  const cancel = dialog.querySelector('.notify-cancel')
  const close = () => { dialog.close(); dialog.remove() }
  cancel.addEventListener('click', close)
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close() })
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    send.disabled = true
    send.textContent = tx.sending
    status.textContent = ''
    try {
      const data = new FormData(form)
      const res = await fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          organizacion: String(data.get('organizacion') || '').trim(),
          email: data.get('email'),
          idioma: lang,
          pagina: location.pathname,
          _subject: 'Lista de espera Fractax Business',
          _replyto: data.get('email'),
          _template: 'table',
          _captcha: 'false',
          _honey: data.get('_honey') || '',
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) !== 'true') throw new Error(json.message || 'error')
      form.innerHTML = `<h3>${tx.title}</h3><p class="notify-text">${tx.done}</p>
        <div class="notify-actions"><button type="button" class="btn btn-primary btn-small">${tx.close}</button></div>`
      form.querySelector('button').addEventListener('click', close)
      if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'lista-business', title: 'Alta lista Business', event: true })
    } catch {
      status.textContent = tx.error
      send.disabled = false
      send.textContent = tx.send
    }
  })
  dialog.showModal()
  dialog.querySelector('#notify-org').focus()
}

if (NOTIFY_ENDPOINT && /^https:\/\//.test(NOTIFY_ENDPOINT)) {
  for (const el of document.querySelectorAll('[data-notify="business"]')) {
    el.addEventListener('click', (e) => { e.preventDefault(); openNotifyDialog() })
  }
}
