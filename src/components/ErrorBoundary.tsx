import { Component, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiAlertTriangle as AlertTriangle,
  FiHome as Home,
  FiRefreshCw as RefreshCw,
} from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

function ErrorFallback({
  error,
  onReset,
}: {
  error: Error | null
  onReset: () => void
}) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle>{t('errors.boundary.title')}</CardTitle>
          <CardDescription>{t('errors.boundary.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <details className="text-sm text-muted-foreground">
              <summary className="cursor-pointer font-medium">
                {t('errors.boundary.technicalDetails')}
              </summary>
              <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                {error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-2">
            <Button onClick={onReset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('errors.boundary.reload')}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="flex-1"
            >
              <Home className="mr-2 h-4 w-4" />
              {t('errors.boundary.goHome')}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {t('errors.boundary.persistentIssue')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback error={this.state.error} onReset={this.handleReset} />
      )
    }
    return this.props.children
  }
}
