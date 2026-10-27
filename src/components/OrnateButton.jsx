import { forwardRef, useId } from 'react'

// Marco dorado con volutas, inspirado en el logo de Le Papillon:
// óvalo doble, curvas a los costados y una gema verde arriba.
function Frame({ id }) {
  const gold = `url(#${id}-gold)`
  const curl = (
    <g fill="none" stroke={gold} strokeWidth="1.6" strokeLinecap="round">
      <path d="M22 40c-8 0-13-5-13-10 0-4 3-7 7-7 3 0 5 2 5 4.5S19 31 17 31" />
      <path d="M22 40c-8 0-13 5-13 10 0 4 3 7 7 7 3 0 5-2 5-4.5S19 49 17 49" />
      <path d="M9 40H2" />
      <circle cx="3" cy="40" r="1.6" fill={gold} stroke="none" />
    </g>
  )

  return (
    <svg className="ornate__frame" viewBox="0 0 300 80" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e3a1" />
          <stop offset=".35" stopColor="#c99a3b" />
          <stop offset=".6" stopColor="#f3d98c" />
          <stop offset="1" stopColor="#a87a26" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" stopOpacity=".95" />
          <stop offset="1" stopColor="#f6e8d6" stopOpacity=".95" />
        </linearGradient>
        <linearGradient id={`${id}-gem`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fd3b5" />
          <stop offset="1" stopColor="#0c6b5a" />
        </linearGradient>
      </defs>

      {/* óvalo exterior e interior */}
      <rect x="24" y="10" width="252" height="60" rx="30" fill={`url(#${id}-fill)`} stroke={gold} strokeWidth="2" />
      <rect x="30" y="16" width="240" height="48" rx="24" fill="none" stroke={gold} strokeWidth="0.9" />

      {/* volutas a los costados */}
      {curl}
      <g transform="translate(300 0) scale(-1 1)">{curl}</g>

      {/* gema y destellos arriba, como en el logo */}
      <path d="M150 3l5 7-5 7-5-7z" fill={`url(#${id}-gem)`} stroke={gold} strokeWidth="1" />
      <path d="M136 10h6M158 10h6" stroke={gold} strokeWidth="1.2" strokeLinecap="round" />
      {/* punto abajo */}
      <circle cx="150" cy="70" r="2.2" fill={gold} />
    </svg>
  )
}

// Botón o link con el marco dorado. Acepta `as="a"` para links.
const OrnateButton = forwardRef(function OrnateButton(
  { as: Tag = 'button', className = '', children, ...props },
  ref,
) {
  const id = useId().replace(/:/g, '')
  return (
    <Tag ref={ref} className={`ornate ${className}`} {...props}>
      <Frame id={id} />
      <span className="ornate__label">{children}</span>
    </Tag>
  )
})

export default OrnateButton
