import { forwardRef, useId } from 'react'

// Botón con el estilo del logo de Le Papillon: óvalo con borde dorado doble.
// - size="lg": botones principales (Entrer, Inscription), con volutas a los
//   costados y una gema verde arriba.
// - size="sm": menú, idioma, música. Solo el óvalo dorado.
// Se adapta al ancho del texto. Acepta `as` para usarlo como link
// (por ej. as={Link} o as="a").

function Curl({ id, side }) {
  return (
    <svg className={`ornate__curl ornate__curl--${side}`} viewBox="0 0 26 44" aria-hidden="true">
      <g fill="none" stroke={`url(#${id})`} strokeWidth="1.6" strokeLinecap="round">
        <path d="M26 22c-8 0-13-5-13-10 0-4 3-7 7-7 3 0 5 2 5 4.5S23 13 21 13" />
        <path d="M26 22c-8 0-13 5-13 10 0 4 3 7 7 7 3 0 5-2 5-4.5S23 31 21 31" />
        <path d="M13 22H6" />
      </g>
      <circle cx="5" cy="22" r="1.7" fill={`url(#${id})`} />
    </svg>
  )
}

function Gem({ id }) {
  return (
    <svg className="ornate__gem" viewBox="0 0 40 18" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fd3b5" />
          <stop offset="1" stopColor="#0c6b5a" />
        </linearGradient>
      </defs>
      <path d="M20 1l6 8-6 8-6-8z" fill={`url(#${id}-gem)`} stroke={`url(#${id})`} strokeWidth="1.2" />
      <path d="M4 9h7M29 9h7" stroke={`url(#${id})`} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

const OrnateButton = forwardRef(function OrnateButton(
  { as: Tag = 'button', size = 'lg', className = '', children, ...props },
  ref,
) {
  const id = `gold${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const big = size === 'lg'

  return (
    <Tag ref={ref} className={`ornate ornate--${size} ${className}`} {...props}>
      {big && (
        <>
          {/* degradado dorado compartido por las volutas y la gema */}
          <svg width="0" height="0" className="ornate__defs" aria-hidden="true">
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6e3a1" />
                <stop offset=".4" stopColor="#c99a3b" />
                <stop offset=".65" stopColor="#f3d98c" />
                <stop offset="1" stopColor="#a87a26" />
              </linearGradient>
            </defs>
          </svg>
          <Curl id={id} side="start" />
          <Curl id={id} side="end" />
          <Gem id={id} />
        </>
      )}
      <span className="ornate__label">{children}</span>
    </Tag>
  )
})

export default OrnateButton
