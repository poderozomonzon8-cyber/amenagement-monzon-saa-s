'use client'

import { ServicePageTemplate } from '@/components/service-page-template'

export default function MaintenanceService() {
  return (
    <ServicePageTemplate
      title="Professional Maintenance Services"
      subtitle="Reliable seasonal and recurring maintenance to keep your property pristine year-round."
      icon="🔧"
      whatWeDo={[
        'Grass Cutting Plans: Customized seasonal cutting plans with weekly or bi-weekly service',
        'Snow Removal: Fast, reliable snow plowing and removal service for winter months',
        'Power Washing: Professional pressure washing for driveways, patios, and exterior surfaces',
        'Leaf Cleanup: Thorough fall cleanup and removal of leaves and debris',
        'Spring Cleanup: Comprehensive spring property maintenance and preparation',
        'Building Maintenance: General property maintenance and seasonal inspections',
      ]}
      process={[
        {
          step: 1,
          title: 'Assessment',
          description: 'Evaluate your property and discuss your maintenance needs and preferences.',
        },
        {
          step: 2,
          title: 'Plan Creation',
          description: 'Develop a customized maintenance plan that fits your schedule and budget.',
        },
        {
          step: 3,
          title: 'Regular Service',
          description: 'Consistent professional maintenance delivered on your preferred schedule.',
        },
        {
          step: 4,
          title: 'Property Monitoring',
          description: 'Ongoing communication and monitoring to ensure your property stays pristine.',
        },
      ]}
      whyChooseUs={[
        'Reliability: Consistent service you can count on week after week',
        'Flexible Plans: Customized maintenance plans to fit your needs and budget',
        'Professional Equipment: Modern equipment and proven techniques',
        'Seasonal Expertise: Expert knowledge of seasonal property care requirements',
        'Emergency Service: Available for urgent maintenance and seasonal emergencies',
        'Competitive Rates: Transparent pricing with no hidden fees',
      ]}
      projects={[
        {
          title: 'Residential Maintenance Plan',
          description: 'Year-round maintenance service for residential property including grass cutting, snow removal, and seasonal cleanup.',
          year: 'Ongoing',
        },
        {
          title: 'Commercial Property Maintenance',
          description: 'Professional maintenance service for commercial parking lot and landscaping.',
          year: 'Ongoing',
        },
        {
          title: 'Seasonal Snow Management',
          description: 'Reliable snow removal and winter maintenance service throughout the season.',
          year: '2023-2024',
        },
      ]}
      testimonials={[
        {
          name: 'Patricia Anderson',
          role: 'Homeowner',
          text: 'We have used Aménagement Monzon for maintenance for 3 years. They are reliable, professional, and provide excellent service. Highly recommend.',
        },
        {
          name: 'Thomas Brown',
          role: 'Commercial Property Manager',
          text: 'Dependable maintenance service for our commercial property. They handle everything from grass cutting to snow removal. Great value.',
        },
        {
          name: 'Susan Harris',
          role: 'Homeowner',
          text: 'Best decision we made was to hire them for maintenance. One less thing to worry about. Professional and reliable every time.',
        },
      ]}
    />
  )
}
