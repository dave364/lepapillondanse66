# Reservas propias · cómo ponerlas en marcha

Sistema de reservas tipo Setmore para Le Papillon Danse 66: la clienta elige servicio, día y horario en el sitio
(4 idiomas), le llega un email con el link de PayPal con el monto ya puesto y la reserva queda **pendiente de
pago** hasta que Zulgey la marca como pagada en el panel (`/admin`). Hay eventos con cupo (clase gratis de prueba,
talleres…), recordatorios automáticos y link para cancelar.

Mientras no estén cargadas las variables de Supabase en Render, el sitio sigue funcionando igual que antes con
Setmore: se puede subir el código sin miedo.

## Cómo está armado

```
sitio (Render) ──► Supabase
                    ├─ Base de datos: servicios, horarios, bloqueos, eventos, reservas
                    │    (las reglas de agenda y cupo están en la base: nunca se pisan dos turnos)
                    ├─ Funciones: book (reservar), cancel, notify (avisos desde el panel), reminders
                    ├─ Login del panel (Zulgey)
                    └─ Cron: cada 30 min llama a reminders
emails ◄── Gmail del proyecto (lepapillondanse66.web@gmail.com) con contraseña de aplicación
```

| Archivo | Qué es |
|---|---|
| `migrations/20261030000000_reservas.sql` | Tablas, reglas, permisos y datos iniciales (horario L–V 9–17, clases del lunes y miércoles, los 9 servicios) |
| `functions/` | Funciones de servidor (Deno) y los emails en 4 idiomas (`_shared/templates.ts`) |
| `cron.sql` | Recordatorios automáticos |
| `tests/agenda.test.mjs` | Prueba la base sin internet: `npm run test:db` |
| `src/booking/` | Páginas de reserva, eventos y cancelación del sitio |
| `src/admin/` | Panel de Zulgey |

## Puesta en marcha (una sola vez)

### 1. Proyecto de Supabase
1. Entrar a [supabase.com](https://supabase.com) con **lepapillondanse66.web@gmail.com** → *New project*.
2. Nombre `lepapillondanse66`, región **West EU (Paris)**, guardar la contraseña de la base en un lugar seguro.

### 2. Base de datos
*SQL Editor* → *New query* → pegar todo `migrations/20261030000000_reservas.sql` → *Run*.

### 3. Usuaria del panel
1. *Authentication → URL Configuration*: en **Site URL** poner `https://lepapillondanse66.onrender.com`
   y en **Redirect URLs** agregar `https://lepapillondanse66.onrender.com/admin`.
2. *Authentication → Users → Add user → Send invitation* con el email de Zulgey. Le llega un link; al abrirlo
   elige su contraseña en el panel.
3. En *SQL Editor*, darle permiso de administradora (cambiar el email):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'EMAIL_DE_ZULGEY';
   ```
4. *Authentication → Sign In / Providers*: desactivar **Allow new users to sign up** (así nadie más se crea cuenta).

### 4. Gmail para mandar los emails
En la cuenta **lepapillondanse66.web@gmail.com**: activar la *Verificación en 2 pasos* y después crear una
*Contraseña de aplicación* (myaccount.google.com → Seguridad → Contraseñas de aplicaciones). Son 16 letras.

### 5. Funciones de servidor
Desde la carpeta del repo, en la terminal:
```bash
npx supabase login
npx supabase link --project-ref ID_DEL_PROYECTO      # está en Project Settings → General
npx supabase secrets set SMTP_USER=lepapillondanse66.web@gmail.com SMTP_PASS="las16letras" CRON_SECRET="una-frase-larga-inventada"
npx supabase functions deploy book cancel reminders notify
```

### 6. Recordatorios
Abrir `cron.sql`, reemplazar `TU_PROYECTO` y `TU_SECRETO` (el mismo `CRON_SECRET`) y correrlo en *SQL Editor*.

### 7. Conectar el sitio
En Render → servicio `lepapillondanse66` → *Environment*, agregar (están en Supabase → *Project Settings → API*):
- `VITE_SUPABASE_URL` = `https://ID_DEL_PROYECTO.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = la clave **anon / publishable** (nunca la *service_role*)

Guardar y volver a publicar. Los botones «Réserver» pasan a `/reserver` y aparece `/admin`.

### 8. Probar
Reservar algo con un email propio → llega la confirmación con el link de PayPal y a Zulgey el aviso →
en `/admin` marcarla pagada → llega «Pago recibido» → cancelar con el link del email.

## Para tener en cuenta
- **Horario**: se cambia en el panel (*Horarios*). Todo es hora de Francia, con cambio de hora de verano incluido.
  A la clienta que está en otro país se le muestra también su hora local.
- **Precios**: se cambian en el panel (*Servicios*) y se actualizan en las tarjetas del sitio. Los textos de cada
  servicio siguen en `src/i18n/locales/`. Un servicio nuevo hay que agregarlo en la base **y** en
  `src/config/booking.js` + archivos de idioma.
- **Avisos a Zulgey**: van a `lepapillondanse@gmail.com` (se cambia en *Ajustes*).
- **Dominio**: cuando `lepapillondanse66.com` apunte a Render, cambiar *Dirección del sitio* en *Ajustes* y las URLs
  del paso 3.1.
- **Plan gratis de Supabase**: alcanza de sobra; pausa proyectos sin actividad durante una semana (las llamadas del
  cron cuentan como actividad).
- **Gmail** permite unos 500 emails por día. Si algún día no alcanza, se puede usar Resend: definir los secretos
  `RESEND_API_KEY` y `EMAIL_FROM` y deja de usarse Gmail.
- **Probar emails en local**: con el secreto `EMAIL_LOG=/ruta/archivo.jsonl` los emails se guardan en ese archivo
  en vez de mandarse.
