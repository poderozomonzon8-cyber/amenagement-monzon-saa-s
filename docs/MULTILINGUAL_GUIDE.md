# Multilingual System Implementation Guide

## System Architecture

The multilingual system for Aménagement Monzon is built with the following components:

### 1. Context & State Management
- **LanguageProvider** (`lib/i18n-context.tsx`): React Context providing language state globally
- Storage: localStorage with key `am-language`, defaults to 'en'
- Languages: English (en), French (fr), Spanish (es)

### 2. Translation Files
Located in `lib/translations/`:
- `index.ts` - Translation loader that dynamically imports language files
- `en.json` - English translations
- `fr.json` - French translations  
- `es.json` - Spanish translations

Each file contains nested translation keys organized by feature (nav, hero, contact, dashboard, etc.)

### 3. Translation Hook
- `useTranslation()` hook in `lib/use-translation.ts`
- Usage: `const t = useTranslation()`, then `t('key.path')`
- Automatic fallback to English if key not found
- Works with nested keys: `t('contact.phone_label')`

### 4. Language Selector UI
- `components/language-selector.tsx` - Dropdown to switch languages
- Added to marketing header next to theme toggle
- Responsive design, works on mobile and desktop
- Uses CSS variables for styling

### 5. Translated Components

#### Marketing Pages
- **Homepage**: `components/marketing-home-client.tsx` - Full translation support for hero, services, testimonials
- **Contact Page**: `components/contact-form-client.tsx` - Translated form labels, placeholders, messages

#### Dashboard
- **Sidebar**: `components/platform/sidebar-translated.tsx` - Translated navigation labels using i18n hook

### 6. Database Translation Support
- Migration script: `scripts/add-translation-columns.sql`
- Adds `_en` and `_es` suffixed columns to:
  - website_heroes (title, subtitle, cta_text)
  - testimonials (comment, client_name, client_role)
  - website_about (description, team_bio)
  - users & leads (preferred_language field)

### 7. Utilities
- `lib/get-translated-content.ts` - Functions to fetch translated content from database
  - `getTranslatedField()` - Get translated value with fallback
  - `buildMultilingualSelect()` - Build SQL select clauses
  - `getLanguageFromPreference()` - Determine language from preferences

- `lib/translation-cache.ts` - Performance optimization
  - In-memory caching with TTL
  - `loadTranslationsCached()` - Load with caching
  - `preloadTranslations()` - Batch load for better UX

### 8. Error Handling
- `components/translation-error-boundary.tsx` - Error boundary for translation failures
- Falls back gracefully to English if translations fail to load
- Console logging for debugging

## Integration Points

### 1. Root Layout
- Wrapped with `ThemeProvider` and `LanguageProvider`
- Enables language context throughout entire app

### 2. API & Server Actions
- Pass language preference from headers: `x-preferred-language: en|fr|es`
- Store language preference in user/lead records
- Use `getTranslatedContent()` utilities for database queries

### 3. Client Components
```tsx
'use client'
import { useTranslation } from '@/lib/use-translation'

export function MyComponent() {
  const t = useTranslation()
  return <p>{t('feature.label')}</p>
}
```

### 4. Server Components
```tsx
import { getTranslatedField } from '@/lib/get-translated-content'

export async function MyPage() {
  const language = getLanguageFromPreference(userLang)
  const content = getTranslatedField(dbRecord, 'title', language)
  // ...
}
```

## Adding New Translations

1. Add key to all three language files:
   ```json
   {
     "feature": {
       "new_key": "English text"
     }
   }
   ```

2. Use in component:
   ```tsx
   const t = useTranslation()
   const text = t('feature.new_key')
   ```

3. For database content, add `_en` and `_es` columns to relevant tables

## Performance Considerations

- Translations are cached in memory with 1-hour TTL
- Language selection persists in localStorage
- Minimal re-renders when language changes via context
- CSS variables update instantly without page reload

## Browser Support

- All modern browsers supporting ES6, localStorage, and CSS Custom Properties
- Graceful fallback to English if localStorage unavailable
- System preference detection via Accept-Language header

## Future Enhancements

- Add more languages (Italian, German, etc.) by adding new JSON files
- Implement RTL support for Arabic/Hebrew
- Add translation management UI for admins
- Implement Server-Sent Events for real-time translation updates
- Add pluralization and interpolation support
