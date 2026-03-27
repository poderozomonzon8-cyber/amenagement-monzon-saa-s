'use client'

import React, { ReactNode } from 'react'

interface TranslationErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface TranslationErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class TranslationErrorBoundary extends React.Component<
  TranslationErrorBoundaryProps,
  TranslationErrorBoundaryState
> {
  constructor(props: TranslationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): TranslationErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Translation error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400">
            <p className="text-sm font-medium">Translation Error</p>
            <p className="text-xs opacity-75">Failed to load translations. Using fallback language.</p>
          </div>
        )
      )
    }

    return this.props.children
  }
}
