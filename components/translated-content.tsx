'use client'

import { useTranslation } from '@/lib/use-translation'

export function TranslatedContent() {
  const { t } = useTranslation()

  return {
    nav: {
      home: t('nav.home'),
      services: t('nav.construction'),
      portfolio: t('nav.portfolio'),
      contact: t('nav.contact'),
    },
    hero: {
      eyebrow: 'Aménagement Monzon — Montréal, Québec',
      title: t('hero.title'),
      fallback: t('hero.fallback_subtitle'),
      cta: t('buttons.get_quote'),
      view_work: t('hero.view_work'),
    },
    stats: {
      years_experience: t('stats.years_experience'),
      projects_delivered: t('stats.projects_delivered'),
      client_satisfaction: t('stats.client_satisfaction'),
      value_constructed: t('stats.value_constructed'),
    },
    services: {
      label: t('services.section_label'),
      title_1: t('services.section_title_1'),
      title_2: t('services.section_title_2'),
      get_quote: t('buttons.get_quote'),
      learn_more: t('buttons.learn_more'),
      construction: t('services.construction_label'),
      construction_desc: t('services.construction_desc'),
      hardscape: t('services.hardscape_label'),
      hardscape_desc: t('services.hardscape_desc'),
      maintenance: t('services.maintenance_label'),
      maintenance_desc: t('services.maintenance_desc'),
    },
    cta_mid: {
      title: t('cta_mid.title'),
      subtitle: t('cta_mid.subtitle'),
      get_quote: t('cta_mid.get_quote'),
      see_portfolio: t('cta_mid.see_portfolio'),
    },
    why: {
      label: t('why.label'),
      title: t('why.title'),
      licensed: t('why.licensed_label'),
      licensed_desc: t('why.licensed_desc'),
      ontime: t('why.ontime_label'),
      ontime_desc: t('why.ontime_desc'),
      premium: t('why.premium_label'),
      premium_desc: t('why.premium_desc'),
    },
    testimonials: {
      label: t('testimonials.label'),
      title: t('testimonials.title'),
    },
    cta_bottom: {
      title: t('cta_bottom.title'),
      subtitle: t('cta_bottom.subtitle'),
      get_quote: t('cta_bottom.get_quote'),
      client_portal: t('cta_bottom.client_portal'),
    },
  }
}
