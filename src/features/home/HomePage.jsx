import { Activity, ClipboardPenLine, Zap, Heart } from 'lucide-react'

/**
 * Página principal del dashboard de FitPet.
 */
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-5 bg-white">
      
      {/* Hero Section */}
      <section className="text-center my-12">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-none">
          Hola, <span className="text-fp-mint-600">dueño de mascota</span>!
        </h1>
        <p className="max-w-4xl mx-auto text-xl text-gray-600 px-4 mb-8">
          Tu dashboard de bienestar personalizado. Aquí controlas la vida activa y saludable de tu compañero peludo.
        </p>
      </section>

      {/* Grid 2x2 - Diseño Asimétrico estilo Margarita */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 mb-20">
        
        {/* Card 1: Monitoreo de Actividad - Verde claro */}
        <div className="p-8 bg-teal-100 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            <Activity className="h-10 w-10 text-fp-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Monitoreo de Actividad
          </h3>
          <p className="text-lg text-gray-700">
            Seguimiento de paseos, patrones de sueño y calorías quemadas para un bienestar proactivo.
          </p>
        </div>
        
        {/* Card 2: Historial Clínico - Borde naranja (destacado) */}
        <div className="p-8 bg-gray-100 border-4 border-fp-warm-500 rounded-2xl shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            <ClipboardPenLine className="h-10 w-10 text-fp-warm-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Historial Clínico Digital
          </h3>
          <p className="text-lg text-gray-600">
            Accede a vacunas, citas y diagnósticos en un solo lugar, siempre accesible.
          </p>
        </div>
        
        {/* Card 3: Recordatorios - Verde claro */}
        <div className="p-8 bg-teal-100 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            <Zap className="h-10 w-10 text-fp-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Recordatorios Inteligentes
          </h3>
          <p className="text-lg text-gray-700">
            Nunca olvides una dosis de medicamento o la próxima cita con recordatorios automáticos.
          </p>
        </div>
        
        {/* Card 4: Amor en Acción - Verde claro */}
        <div className="p-8 bg-teal-100 rounded-2xl shadow-xl transform hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
          <div className="flex justify-start mb-4">
            <Heart className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Más que Datos, es Amor en Acción
          </h3>
          <p className="text-lg text-gray-700">
            Cada registro, cada recordatorio, cada momento compartido fortalece el lazo con quien te brinda amor incondicional.
          </p>
        </div>
      </section>

      {/* Sección Filosofía - Similar a Margarita */}
      <section className="my-32 bg-gray-50 p-8 md:p-20 rounded-3xl shadow-xl border-t-8 border-fp-mint-500">
        <div className="text-center">
          <h2 className="text-5xl font-black text-gray-900 mb-6 leading-tight">
            Nuestra Filosofía: <span className="text-fp-mint-600">Tecnología con Amor</span>
          </h2>
          <p className="max-w-4xl mx-auto text-xl text-gray-600 leading-relaxed">
            En FitPet, combinamos <strong>tecnología inteligente</strong> con el cuidado que tu mascota merece. 
            Creemos en un seguimiento personalizado, datos claros y recordatorios que facilitan tu vida. 
            Porque cuidar de tu compañero peludo debe ser simple, efectivo y lleno de amor.
          </p>
        </div>
      </section>

    </div>
  )
}