import { Wrench } from 'lucide-react'
import { ServicePageTemplate } from '@/components/service-page-template'
import { getHeroByPage } from '@/app/actions/cms'

export const metadata = {
  title: 'Property Maintenance — Aménagement Monzon',
  description: 'Seasonal grass cutting plans, snow removal, power washing, and year-round property maintenance across Montreal.',
}

export default async function MaintenancePage() {
  const cmsHero = await getHeroByPage('maintenance')

  return (
    <ServicePageTemplate
      accentColor="#1E88E5"
      title="Property Maintenance"
      subtitle="Reliable, recurring property care throughout every season — from summer grass cutting plans to winter snow removal contracts."
      Icon={Wrench}
      cmsHero={cmsHero}
      whatWeDo={[
        'Customized grass cutting plans — weekly or bi-weekly scheduling',
        'Residential and commercial snow removal and ice management',
        'Power washing for driveways, patios, decks, and building exteriors',
        'Spring and fall property cleanup including leaf removal and debris haul',
        'Hedge trimming, edging, and seasonal lawn treatments',
        'General property inspections and minor exterior maintenance',
      ]}
      process={[
        { step: 1, title: 'Property Assessment', description: 'We walk your property to understand your needs and recommend the right maintenance plan.' },
        { step: 2, title: 'Plan Creation', description: 'A customized maintenance schedule is built around your preferences and seasonal requirements.' },
        { step: 3, title: 'Regular Service', description: 'Our team arrives on schedule, every time, delivering consistent and thorough care.' },
        { step: 4, title: 'Ongoing Communication', description: 'Regular updates, seasonal reminders, and direct access to your service coordinator.' },
      ]}
      whyChooseUs={[
        'Reliability: You can count on us to show up, on schedule, every single time — no excuses.',
        'Flexible Plans: Maintenance packages tailored to your property size, needs, and budget.',
        'Professional Equipment: Modern, well-maintained equipment for efficient and clean results.',
        'Seasonal Expertise: Deep knowledge of Quebec climate and seasonal property requirements.',
        'Emergency Response: Available for urgent snow removal and weather-related maintenance needs.',
        'Transparent Pricing: Clear, flat-rate contracts with no hidden charges or seasonal surprises.',
      ]}
      projects={[
        { title: 'Residential Annual Contract', description: 'Year-round grass cutting, fall cleanup, and snow removal contract for a family home in Laval.', year: 'Ongoing' },
        { title: 'Commercial Snow Management', description: 'Full-season snow removal and salting contract for a 12-unit commercial property in Montreal.', year: '2023–2024' },
        { title: 'Spring & Fall Cleanup', description: 'Comprehensive seasonal cleanup for a large residential estate — leaves, debris, and bed preparation.', year: '2024' },
      ]}
      testimonials={[
        { name: 'Patricia Anderson', role: 'Homeowner, Laval', text: 'Three years with Aménagement Monzon for our maintenance and they have never missed a single visit. Absolutely dependable and professional.' },
        { name: 'Thomas Brown', role: 'Commercial Property Manager', text: 'They handle our snow removal and summer cutting contracts. Responsive, reliable, and great value for the quality of service provided.' },
        { name: 'Susan Harris', role: 'Homeowner', text: 'Best decision we made was hiring them for maintenance. We never think about the lawn or snow anymore — it is just handled.' },
      ]}
    />
  )
}
