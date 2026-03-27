import { getHeroByPage, getFeaturedReviews, getAboutContent } from '@/app/actions/cms'
import { MarketingHomeClient } from '@/components/marketing-home-client'

export default async function MarketingHome() {
  const [hero, reviews, about] = await Promise.all([
    getHeroByPage('home'),
    getFeaturedReviews(),
    getAboutContent(),
  ])

  const defaultHero = {
    title: 'Built with precision.',
    subtitle: 'Premium construction, hardscape, and property maintenance across Montreal and the surrounding region. Over two decades of trusted craftsmanship.',
    cta_text: 'Request a Free Quote',
    accent_color: '#C9A84C',
    media_url: null,
  } as const

  const defaultStats = [
    { value: '20+', label: 'Years of Experience' },
    { value: '500+', label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '$50M+', label: 'Value Constructed' },
  ]

  const defaultTestimonials = [
    {
      client_name: 'David Tremblay',
      client_role: 'Homeowner, Laval',
      comment: 'Aménagement Monzon transformed our property completely. The attention to detail and quality of craftsmanship exceeded every expectation.',
      rating: 5,
    },
    {
      client_name: 'Sophie Gagnon',
      client_role: 'Property Manager',
      comment: 'Reliable, professional, and thorough. They handle all our seasonal maintenance and we have never had to worry about a thing.',
      rating: 5,
    },
    {
      client_name: 'Marc Beauchamp',
      client_role: 'Real Estate Developer',
      comment: 'Our go-to partner for hardscape and construction work. Their team delivers on time, on budget, every single time.',
      rating: 5,
    },
  ]

  const heroData = hero || defaultHero
  const testimonials = reviews.length > 0 ? reviews : defaultTestimonials
  const stats = about
    ? [
        { value: `${about.years_experience}+`, label: 'Years of Experience' },
        { value: `${about.projects_completed}+`, label: 'Projects Delivered' },
        { value: '98%', label: 'Client Satisfaction' },
        { value: '$50M+', label: 'Value Constructed' },
      ]
    : defaultStats

  const accentColor = heroData.accent_color || '#C9A84C'

  return (
    <MarketingHomeClient
      heroData={heroData}
      stats={stats}
      testimonials={testimonials}
      accentColor={accentColor}
    />
  )
}
