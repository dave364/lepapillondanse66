import { useEffect } from 'react'

// Aparición suave al hacer scroll.
// Busca en <main> los elementos de la lista y los muestra (fundido + subida
// corta) cuando entran en pantalla. Los que entran juntos aparecen uno tras
// otro con un pequeño desfase. Si el dispositivo pide "reducir movimiento",
// el CSS deja solo el fundido, sin desplazamiento.
const TARGETS = [
  '.block__title',
  '.block > .info',
  '.block > .center',
  '.about__text',
  '.about__img',
  '.philo__img',
  '.philo__text > p',
  '.philo__text > h3',
  '.philo__stage',
  '.course',
  '.service',
  '.care-list > li',
  '.mariposa__portrait',
  '.mariposa__text',
  '.mariposa__method',
  '.free-call',
  '.how',
  '.how__steps > li',
  '.panel',
  '.map',
  '.closing__title',
  '.closing__call',
].join(',')

const STAGGER = 110 // ms entre elementos que aparecen juntos

export default function useReveal(key) {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const els = [...document.querySelectorAll(`#main :is(${TARGETS})`)].filter(
      (el) => !el.classList.contains('is-in'),
    )

    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .forEach((e, i) => {
            e.target.style.setProperty('--reveal-delay', `${Math.min(i, 6) * STAGGER}ms`)
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    els.forEach((el) => {
      el.classList.add('reveal')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [key])
}
