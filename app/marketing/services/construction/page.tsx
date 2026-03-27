import { Hammer } from 'lucide-react'
import { ServicePageTemplate } from '@/components/service-page-template'

export const metadata = {
  title: 'Construction & Renovations — Aménagement Monzon',
  description: 'Interior renovations, French drains, foundation crack repair, basement waterproofing, and structural construction across Montreal.',
}

export default function ConstructionPage() {
  return (
    <ServicePageTemplate
      accentColor="#C9A84C"
      title="Construction & Renovations"
      subtitle="Expert interior renovations, foundation repair, drainage systems, and structural solutions — backed by 20+ years of proven craftsmanship."
      Icon={Hammer}
      whatWeDo={[
        'Interior renovations with premium finishes and custom cabinetry',
        'French drains and exterior drainage system installation',
        'Foundation crack repair using industry-certified techniques',
        'Basement waterproofing — interior and exterior systems',
        'Structural assessments and professional engineering recommendations',
        'Bathroom and kitchen additions and full-room construction',
      ]}
      process={[
        { step: 1, title: 'Consultation', description: 'Free on-site visit to evaluate your needs, assess the scope, and understand your vision.' },
        { step: 2, title: 'Planning', description: 'Detailed project plan, timeline, materials specification, and itemized cost estimate.' },
        { step: 3, title: 'Execution', description: 'Professional installation with progress updates and strict quality control at every step.' },
        { step: 4, title: 'Completion', description: 'Final walkthrough, clean-up, and full project sign-off. Guaranteed on-time delivery.' },
      ]}
      whyChooseUs={[
        'Proven Experience: 20+ years specializing in residential and commercial construction across Quebec.',
        'Premium Materials: We use only certified, high-durability materials sourced from trusted suppliers.',
        'Licensed & Insured: Fully certified team with comprehensive liability coverage on all projects.',
        'Transparent Pricing: Clear, itemized quotes — no hidden fees, no surprises at the end.',
        'Warranty Coverage: All work is backed by a comprehensive warranty for your peace of mind.',
        'Proven Track Record: 500+ satisfied clients across Montreal and surrounding regions.',
      ]}
      projects={[
        { title: 'Full Kitchen Renovation', description: 'Complete gut-and-rebuild with custom cabinetry, quartz countertops, and high-end appliance integration.', year: '2024' },
        { title: 'Foundation Crack Repair', description: 'Structural crack repair and full waterproofing system installation for a 1970s residential home.', year: '2024' },
        { title: 'Basement Suite Addition', description: 'Full basement development with bathroom, bedroom, kitchenette, and legal egress window.', year: '2023' },
      ]}
      testimonials={[
        { name: 'David Martinez', role: 'Homeowner, Laval', text: 'The team at Aménagement Monzon transformed our basement completely. Quality of work and attention to detail were exceptional throughout the project.' },
        { name: 'Emily Chen', role: 'Property Manager', text: 'They handled our foundation repairs with true expertise. Reliable, professional, and the result has been flawless for over a year now.' },
        { name: 'James Wilson', role: 'Real Estate Developer', text: 'Our go-to partner for renovation projects. Skilled, punctual, and consistently delivers premium quality work on schedule.' },
      ]}
    />
  )
}
