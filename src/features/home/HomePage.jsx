import React from 'react'
// 💡 (FIX) Usamos lucide-react (según informe) en lugar de react-icons
import { Dog, Activity, ClipboardPenLine } from 'lucide-react'

/**
 * Página de inicio (Landing/Dashboard) que se muestra después de iniciar sesión.
 * Se renderiza dentro de AppLayout.
 */
function HomePage() {
  return (
    // AppLayout ya proporciona el fondo y el padding base.
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 my-8">
        {/* Tarjeta 1: Tu compañero */}
        <div className="transform rounded-2xl bg-[var(--bg-surface)] p-8 shadow-lg ring-1 ring-[var(--border-soft)] transition duration-300 ease-in-out hover:scale-[1.03]">
          <div className="flex justify-start mb-4">
            <Dog className="h-10 w-10 text-[var(--fp-primary-600)]" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-[var(--text-title)]">
            Tu compañero, conectado.
          </h3>
          <p className="text-lg text-[var(--text-base)]">
            Mantén un registro digital de la salud, vacunas y citas de tu
            mascota, accesible en cualquier momento.
          </p>
        </div>

        {/* Tarjeta 2: Bienestar Proactivo */}
        <div className="transform rounded-2xl border-4 border-[var(--fp-warm-500)] bg-[var(--bg-surface)] p-8 shadow-2xl ring-1 ring-[var(--border-soft)] transition duration-300 ease-in-out hover:scale-[1.03]">
          <div className="flex justify-start mb-4">
            <Activity className="h-10 w-10 text-[var(--fp-warm-500)]" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-[var(--text-title)]">
            Bienestar proactivo.
          </h3>
          <p className="text-lg text-[var(--text-base)]">
            Monitorea su actividad diaria, patrones de sueño y recibe alertas
            importantes sobre su bienestar.
          </p>
        </div>

        <div className="transform rounded-2xl bg-[var(--fp-primary-600)] p-8 text-white shadow-xl transition duration-300 ease-in-out hover:scale-[1.03]">
          <div className="flex justify-start mb-4">
            <ClipboardPenLine className="h-10 w-10" />
          </div>
          <h3 className="mb-4 text-2xl font-bold">Todo en un solo lugar.</h3>
          <p className="text-lg opacity-90">
            Gestiona recordatorios de medicamentos, comidas y paseos. FitPet es
            el centro de mando de la vida de tu mascota.
          </p>
        </div>
      </section>

      
      <section className="my-32 flex flex-col items-center rounded-3xl border-t-8 border-[var(--fp-mint-600)] bg-[var(--bg-surface)] p-8 shadow-xl ring-1 ring-[var(--border-soft)] md:flex-row md:p-12 lg:p-20">
        <div className="order-2 p-4 md:w-1/2 md:order-1">
          <h2 className="mb-6 border-l-4 border-[var(--fp-primary-600)] pl-4 text-4xl font-bold leading-tight text-[var(--text-title)] lg:text-5xl">
            Monitorea su actividad diaria.
          </h2>
          <p className="text-xl leading-relaxed text-[var(--text-base)]">
            FitPet te ayuda a entender las necesidades de tu mascota. Registra
            sus paseos, comprueba sus calorías quemadas y asegúrate de que
            descansa lo suficiente.
            <strong className="mt-4 block text-[var(--text-title)]">
              Una mascota activa es una mascota feliz.
            </strong>
          </p>
        </div>

        <div className="order-1 p-4 md:w-1/2 md:order-2">
          <img
            src="https://placehold.co/600x400/0F4C5C/FFFFFF?text=FitPet+App"
            alt="App de FitPet monitoreando a un perro"
            className="h-auto w-full transform rounded-2xl shadow-2xl ring-4 ring-white"
          />
        </div>
      </section>

      
      <section className="my-20 text-center">
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-[var(--text-title)] md:text-5xl">
          Funcionalidades{' '}
          <span className="text-[var(--fp-mint-600)] underline">
            Destacadas
          </span>
        </h2>
        <p className="mx-auto max-w-4xl px-4 text-xl text-[var(--text-base)]">
          Desde recordatorios de vacunas hasta un historial médico completo y
          seguimiento de la nutrición. Todo lo que necesitas para un cuidado
          excepcional, en la palma de tu mano.
        </p>
      </section>

    </div>
  )
}

export default HomePage