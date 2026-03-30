import Hero from '@/components/Hero'
import OurStory from '@/components/OurStory'
import PizzaGallery from '@/components/PizzaGallery'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function HomePage() {
  useDocumentTitle()
  return (
    <>
      <Hero />
      <OurStory />
      <PizzaGallery />
    </>
  )
}
