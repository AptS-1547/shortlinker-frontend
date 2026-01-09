import { format } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isValidHttpUrl } from '@/utils/validators'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { UseDialogReturn } from '@/hooks/useDialog'
import type { LinkPayload, SerializableShortLink } from '@/services/types'

interface LinkFormDialogProps {
  dialog: UseDialogReturn<SerializableShortLink>
  formData: LinkPayload
  onFormDataChange: (data: LinkPayload) => void
  onSave: () => Promise<void>
  isSaving: boolean
}

/**
 * 链接创建/编辑表单对话框
 */
export function LinkFormDialog({
  dialog,
  formData,
  onFormDataChange,
  onSave,
  isSaving,
}: LinkFormDialogProps) {
  const { t } = useTranslation()
  const [urlError, setUrlError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUrlError(null)

    if (!isValidHttpUrl(formData.target)) {
      setUrlError(t('links.form.invalidUrl'))
      return
    }

    await onSave()
  }

  return (
    <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {dialog.isEditMode ? t('links.editLink') : t('links.createLink')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">{t('links.form.code')}</Label>
              <Input
                id="code"
                value={formData.code || ''}
                onChange={(e) =>
                  onFormDataChange({ ...formData, code: e.target.value })
                }
                placeholder={t('links.form.codePlaceholder')}
                disabled={dialog.isEditMode}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target">{t('links.form.target')}</Label>
              <Input
                id="target"
                value={formData.target}
                onChange={(e) =>
                  onFormDataChange({ ...formData, target: e.target.value })
                }
                placeholder={t('links.form.targetPlaceholder')}
                required
              />
              {urlError && (
                <p className="text-sm text-destructive">{urlError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('links.form.password')}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e) =>
                  onFormDataChange({
                    ...formData,
                    password: e.target.value || null,
                  })
                }
                placeholder={t('links.form.passwordPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('links.expiresAtOptional')}</Label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !formData.expires_at && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expires_at
                        ? format(
                            new Date(formData.expires_at),
                            'yyyy-MM-dd HH:mm',
                          )
                        : t('links.permanent')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        formData.expires_at
                          ? new Date(formData.expires_at)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          // 设置为当天的 23:59:59
                          date.setHours(23, 59, 59, 0)
                          onFormDataChange({
                            ...formData,
                            expires_at: date.toISOString(),
                          })
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {formData.expires_at && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      onFormDataChange({ ...formData, expires_at: null })
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {t('links.expiresAtHelp')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={dialog.close}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? t('common.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
