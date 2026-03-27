import { motion } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { useTheme } from '@/context/ThemeContext'

function StoryLocal() {
  return (
    <section id="story" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: '-100px' }}
          className="text-center"
        >
          <span className="text-[11px] tracking-[0.35em] uppercase text-primary font-sans">
            Nuestra Filosofía
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mt-6 mb-10 text-foreground">
            Masa madre, piedra <br className="hidden sm:block" />
            <span className="italic text-primary/80">&amp; hongos de autor</span>
          </h2>

          <Separator className="w-12 mx-auto mb-10 bg-primary/30" />

          <div className="space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
            <p>
              Trabajamos cada pizza con{' '}
              <span className="text-foreground">masa madre de biga</span>, fermentada lentamente
              para lograr una corteza con carácter: crujiente por fuera, aireada y aromática por
              dentro. Nuestro horno a la piedra alcanza temperaturas que solo la tradición
              napolitana puede exigir, y la pizza es el lienzo donde los hongos/ingredientes son los protagonistas.
            </p>
            <p>
              Pero lo que nos distingue son nuestros ingredientes: hongos de especial interés
              gastronómico —{' '}
              <span className="text-foreground">
                Melena de León, Ostra, Shiitake
              </span>{' '}
              — y variedades de estación como{' '}
              <span className="text-foreground">Changle y Níscalo</span>, que aparecen y se van con
              el ritmo de la naturaleza.
            </p>
            <p>
              Cada pizza es una composición efímera. Un encuentro entre la tradición italiana y los
              bosques del sur de Chile.
            </p>
          </div>

          <Separator className="w-12 mx-auto mt-10 bg-primary/30" />

          <p className="mt-8 text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-sans">
            Los hongos varían con las estaciones
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function StoryLovable() {
  return (
    <section id="story" className="py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.4em] text-primary uppercase mb-6">
          Nuestra Historia
        </p>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-10 leading-tight">
          Del bosque al horno de piedra
        </h2>

        <Separator className="w-12 mx-auto mb-10 bg-border" />

        <div className="space-y-6 text-muted-foreground text-base md:text-lg leading-relaxed font-light">
          <p>
            En Stone Fungus elaboramos pizzas napolitanas artesanales con masa madre biga,
            fermentada lentamente y horneada en horno de piedra. Cada pizza es un lienzo donde
            los hongos son los protagonistas.
          </p>
          <p>
            Trabajamos con hongos de interés gastronómico especial:{' '}
            <span className="text-foreground italic">Melena de León</span>,{' '}
            <span className="text-foreground italic">Ostra</span>,{' '}
            <span className="text-foreground italic">Shiitake</span>, y variedades
            estacionales como{' '}
            <span className="text-foreground italic">Changle</span> y{' '}
            <span className="text-foreground italic">Níscalo</span>, que rotan con
            las estaciones del sur de Chile.
          </p>
          <p>
            Cada variedad es seleccionada por su perfil aromático y textura única,
            tratada con el respeto que merece un ingrediente extraordinario.
          </p>
        </div>
      </div>
    </section>
  )
}

export default function OurStory() {
  const { theme } = useTheme()
  return theme === 'lovable' ? <StoryLovable /> : <StoryLocal />
}
