'use client'

import { ServicePageTemplate } from '@/components/service-page-template'

export default function ConstructionService() {
  return (
    <ServicePageTemplate
      title="Construction & Renovations"
      subtitle="Expert interior renovations, foundation repair, and structural solutions with 20+ years of proven experience."
      icon="🏗️"
      whatWeDo={[
        'Interior Renovations: Complete home renovations with attention to detail and quality finishes',
        'French Drains: Professional drainage solutions to protect your foundation and prevent water damage',
        'Foundation Crack Repair: Expert structural repair using proven techniques and premium materials',
        'Basement Waterproofing: Comprehensive waterproofing solutions for permanent protection',
        'Structural Assessment: Professional evaluation and recommendations for your property',
        'Custom Construction: Build additions and expansions tailored to your vision',
      ]}
      process={[
        {
          step: 1,
          title: 'Consultation',
          description: 'On-site evaluation of your project needs and goals. We assess the scope and provide professional recommendations.',
        },
        {
          step: 2,
          title: 'Planning',
          description: 'Detailed project planning with timeline and materials specification. You receive a comprehensive quote.',
        },
        {
          step: 3,
          title: 'Execution',
          description: 'Professional installation using premium materials and proven techniques. Regular updates kept throughout.',
        },
        {
          step: 4,
          title: 'Completion',
          description: 'Final inspection and walkthrough. Your project delivered on-time and exceeding expectations.',
        },
      ]}
      whyChooseUs={[
        'Proven Experience: 20+ years specializing in construction and structural repairs',
        'Quality Materials: Only premium materials used to ensure durability and longevity',
        'Professional Team: Licensed, insured, and certified experts',
        'Transparent Process: Clear communication from start to finish',
        'Warranty Coverage: All work backed by comprehensive warranty',
        'References Available: 500+ satisfied residential and commercial clients',
      ]}
      projects={[
        {
          title: 'Modern Kitchen Renovation',
          description: 'Complete kitchen renovation with custom cabinetry and premium finishes.',
          year: '2024',
        },
        {
          title: 'Foundation Crack Repair',
          description: 'Structural repair and waterproofing of historical home foundation.',
          year: '2023',
        },
        {
          title: 'Bathroom Addition',
          description: 'Full bathroom construction with tile work and plumbing integration.',
          year: '2023',
        },
      ]}
      testimonials={[
        {
          name: 'David Martinez',
          role: 'Homeowner',
          text: 'Aménagement Monzon transformed our home with a professional basement renovation. The quality of work and attention to detail was exceptional.',
        },
        {
          name: 'Emily Chen',
          role: 'Property Manager',
          text: 'Reliable and professional. They handled our foundation repairs with expertise. Highly recommend for any structural work.',
        },
        {
          name: 'James Wilson',
          role: 'Real Estate Developer',
          text: 'Perfect partner for renovation projects. Their team is skilled, punctual, and delivers premium quality work consistently.',
        },
      ]}
    />
  )
}
