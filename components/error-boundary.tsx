'use client'

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-secondary border border-border rounded-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="font-semibold text-foreground mb-2">Erreur d&apos;application</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la page et réessayer.
                </p>
                <details className="text-xs text-muted-foreground mb-4 bg-background/50 p-2 rounded">
                  <summary className="cursor-pointer font-medium mb-2">Détails de l&apos;erreur</summary>
                  <pre className="overflow-auto text-red-500/70 whitespace-pre-wrap break-words">
                    {this.state.error?.toString()}
                  </pre>
                </details>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Rafraîchir la page
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
