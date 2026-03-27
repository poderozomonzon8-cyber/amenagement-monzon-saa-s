'use client'

import { ServicePageTemplate } from '@/components/service-page-template'

export default function HardscapeService() {
  return (
    <ServicePageTemplate
      title="Hardscape & Landscape Design"
      subtitle="Transform your outdoor space with premium hardscaping, landscaping, and irrigation solutions."
      icon="🌳"
      whatWeDo={[
        'Paver Installation: Professional Techno Block paver installation for driveways, patios, and walkways',
        'Retaining Walls: Structural and decorative retaining walls built to last',
        'Outdoor Lighting: Strategic landscape lighting to enhance beauty and functionality',
        'Irrigation Systems: Complete irrigation design and installation for healthy lawns',
        'Lawn Installation: Premium sod installation with site preparation',
        'Landscape Design: Custom outdoor designs tailored to your vision and budget',
      ]}
      process={[
        {
          step: 1,
          title: 'Design Consultation',
          description: 'We meet with you to understand your vision, assess your space, and recommend design options.',
        },
        {
          step: 2,
          title: 'Site Preparation',
          description: 'Professional grading, soil preparation, and foundation work for optimal results.',
        },
        {
          step: 3,
          title: 'Installation',
          description: 'Expert installation of all hardscape and landscape elements with precision and care.',
        },
        {
          step: 4,
          title: 'Landscaping',
          description: 'Final landscaping, plantings, and finishing touches to complete your outdoor oasis.',
        },
      ]}
      whyChooseUs={[
        'Design Excellence: Creative landscapes that enhance property value and curb appeal',
        'Premium Materials: Techno Block pavers and quality materials for lasting beauty',
        'Expert Installation: Professional team ensures proper drainage and structural integrity',
        'Custom Solutions: Each project tailored to your specific needs and style',
        'Maintenance Support: Ongoing care recommendations and seasonal maintenance plans',
        'Complete Services: Design through installation to ongoing maintenance',
      ]}
      projects={[
        {
          title: 'Modern Patio & Landscaping',
          description: 'Extensive Techno Block patio with integrated irrigation and professional plantings.',
          year: '2024',
        },
        {
          title: 'Backyard Transformation',
          description: 'Complete outdoor living space with retaining walls, lighting, and lawn installation.',
          year: '2024',
        },
        {
          title: 'Commercial Hardscaping',
          description: 'Professional landscape design and hardscaping for commercial property.',
          year: '2023',
        },
      ]}
      testimonials={[
        {
          name: 'Lisa Thompson',
          role: 'Homeowner',
          text: 'Our backyard is now an outdoor oasis thanks to Aménagement Monzon. The design is beautiful and the quality of work is outstanding.',
        },
        {
          name: 'Robert Johnson',
          role: 'Property Owner',
          text: 'Professional landscaping service. They handle everything from design to installation to ongoing maintenance. Highly satisfied.',
        },
        {
          name: 'Michelle Davis',
          role: 'Homeowner',
          text: 'The patio looks incredible. Their team worked efficiently and the final result exceeded our expectations. Definitely recommend them.',
        },
      ]}
    />
  )
}
