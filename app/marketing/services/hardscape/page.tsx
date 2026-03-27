import { Leaf } from 'lucide-react'
import { ServicePageTemplate } from '@/components/service-page-template'

export const metadata = {
  title: 'Hardscape & Landscape — Aménagement Monzon',
  description: 'Techno-Bloc pavers, retaining walls, irrigation systems, and full landscape design across Montreal and surrounding areas.',
}

export default function HardscapePage() {
  return (
    <ServicePageTemplate
      accentColor="#2E7D32"
      title="Hardscape & Landscape"
      subtitle="Outdoor living spaces built to last — from Techno-Bloc paver driveways and retaining walls to full landscape and irrigation design."
      Icon={Leaf}
      whatWeDo={[
        'Techno-Bloc paver installation for driveways, patios, and walkways',
        'Structural and decorative retaining wall construction',
        'Complete irrigation system design, installation, and programming',
        'Sod installation with full site grading and soil preparation',
        'Landscape planting design with trees, shrubs, and perennials',
        'Outdoor lighting design and installation for safety and ambiance',
      ]}
      process={[
        { step: 1, title: 'Design Consultation', description: 'We meet on-site to understand your vision, assess your property, and explore design options.' },
        { step: 2, title: 'Site Preparation', description: 'Professional grading, excavation, and base preparation for a stable, long-lasting foundation.' },
        { step: 3, title: 'Installation', description: 'Expert hardscape and landscape installation with full quality control from start to finish.' },
        { step: 4, title: 'Final Touches', description: 'Cleanup, planting, lighting installation, and irrigation startup with programming walkthrough.' },
      ]}
      whyChooseUs={[
        'Design Excellence: We create landscapes that enhance property value and genuine curb appeal.',
        'Certified Materials: We use only Techno-Bloc certified pavers and quality materials for lasting results.',
        'Expert Installation: Our team ensures proper drainage, structural integrity, and long-term performance.',
        'Custom Design: Every project is tailored to your specific property, aesthetic, and budget.',
        'Seasonal Know-How: Deep knowledge of local climate and seasonal requirements for Quebec properties.',
        'Full-Scope Service: Design through installation through ongoing maintenance — one trusted team.',
      ]}
      projects={[
        { title: 'Paver Driveway & Patio', description: 'Full driveway replacement and rear patio using Techno-Bloc pavers with decorative border detailing.', year: '2024' },
        { title: 'Backyard Landscape Transformation', description: 'Retaining walls, sod, perennial planting, and irrigation system for a complete outdoor living space.', year: '2024' },
        { title: 'Commercial Property Hardscape', description: 'Professional hardscape and planting design for a multi-unit commercial development in Laval.', year: '2023' },
      ]}
      testimonials={[
        { name: 'Lisa Thompson', role: 'Homeowner, Longueuil', text: 'Our backyard is now an outdoor oasis. The design is beautiful and the quality of the work is outstanding. Could not be happier.' },
        { name: 'Robert Gagnon', role: 'Property Owner', text: 'Professional from start to finish. The irrigation system works perfectly and the sod looks incredible even a year later.' },
        { name: 'Michelle Beauchamp', role: 'Homeowner', text: 'The patio exceeded every expectation. Their team worked efficiently and the final result is exactly what we dreamed of.' },
      ]}
    />
  )
}
