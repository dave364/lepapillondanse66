// Mariposa de trazo simple, usada como marca del sitio
export default function Butterfly({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M32 14C26 2 8 0 5 9c-3 9 9 17 27 15" />
        <path d="M32 14C38 2 56 0 59 9c3 9-9 17-27 15" />
        <path d="M32 24c-14 0-22 8-18 15 4 6 14 2 18-7" />
        <path d="M32 24c14 0 22 8 18 15-4 6-14 2-18-7" />
        <path d="M32 12v26" strokeLinecap="round" />
      </g>
    </svg>
  )
}
