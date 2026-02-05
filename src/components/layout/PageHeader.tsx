import { memo, type ReactNode } from 'react'

interface PageHeaderProps {
  title: string | ReactNode
  description?: string
  actions?: ReactNode
}

const PageHeader = memo(function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
})

export default PageHeader
