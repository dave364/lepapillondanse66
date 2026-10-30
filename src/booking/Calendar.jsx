import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

// Calendario mensual: los días con horarios libres se pueden elegir.
// Las fechas son textos 'AAAA-MM-DD' (día de Francia), sin zonas horarias.
const pad = (n) => String(n).padStart(2, '0')
const keyOf = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`
const locale = (lang) => (lang === 'ar' ? 'ar-u-nu-latn' : lang === 'en' ? 'en-GB' : lang)

export default function Calendar({ days, today, selected, onSelect }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const available = useMemo(() => [...days.keys()].sort(), [days])

  // Mes visible: el del día elegido o el primero con horarios
  const start = selected || available[0] || today
  const [ym, setYm] = useState(() => ({ y: +start.slice(0, 4), m: +start.slice(5, 7) - 1 }))

  const first = { y: +today.slice(0, 4), m: +today.slice(5, 7) - 1 }
  const lastKey = available.at(-1) || today
  const last = { y: +lastKey.slice(0, 4), m: +lastKey.slice(5, 7) - 1 }
  const idx = (v) => v.y * 12 + v.m
  const move = (n) => {
    const i = idx(ym) + n
    setYm({ y: Math.floor(i / 12), m: i % 12 })
  }

  const monthNameRaw = new Intl.DateTimeFormat(locale(lang), { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(Date.UTC(ym.y, ym.m, 1))
  const monthName = monthNameRaw.charAt(0).toLocaleUpperCase() + monthNameRaw.slice(1)
  // Lunes a domingo (1 de enero de 2024 fue lunes)
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale(lang), { weekday: 'short', timeZone: 'UTC' }).format(Date.UTC(2024, 0, 1 + i)))

  const daysInMonth = new Date(Date.UTC(ym.y, ym.m + 1, 0)).getUTCDate()
  const offset = (new Date(Date.UTC(ym.y, ym.m, 1)).getUTCDay() + 6) % 7
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const anyThisMonth = available.some((k) => k.startsWith(`${ym.y}-${pad(ym.m + 1)}`))

  return (
    <div className="bk-cal">
      <div className="bk-cal__head">
        <button type="button" className="bk-cal__nav" onClick={() => move(-1)}
          disabled={idx(ym) <= idx(first)} aria-label={t('booking.prevMonth')}>
          <span aria-hidden="true">‹</span>
        </button>
        <h3 className="bk-cal__month" aria-live="polite">{monthName}</h3>
        <button type="button" className="bk-cal__nav" onClick={() => move(1)}
          disabled={idx(ym) >= idx(last)} aria-label={t('booking.nextMonth')}>
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div className="bk-cal__grid" role="grid">
        {weekdays.map((w) => <span key={w} className="bk-cal__wd" role="columnheader">{w}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={`e${i}`} />
          const k = keyOf(ym.y, ym.m, d)
          const has = days.has(k)
          return (
            <button
              key={k}
              type="button"
              role="gridcell"
              className={`bk-cal__day ${has ? 'is-open' : ''} ${selected === k ? 'is-selected' : ''} ${k === today ? 'is-today' : ''}`}
              disabled={!has}
              aria-pressed={selected === k}
              onClick={() => onSelect(k)}
            >
              {d}
            </button>
          )
        })}
      </div>
      {!anyThisMonth && <p className="bk-cal__empty">{t('booking.noSlotsMonth')}</p>}
    </div>
  )
}
