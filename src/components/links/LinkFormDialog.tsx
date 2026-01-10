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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { UseDialogReturn } from '@/hooks/useDialog'
import type { LinkPayload, SerializableShortLink } from '@/services/types'

// 生成小时选项 (00-23)
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))
// 生成分钟选项 (00-59)
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

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
                {/* 日期选择 */}
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
                        ? format(new Date(formData.expires_at), 'yyyy-MM-dd')
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
                          // 保留现有时间，如果没有则默认 23:59
                          const existingDate = formData.expires_at
                            ? new Date(formData.expires_at)
                            : null
                          const hours = existingDate?.getHours() ?? 23
                          const minutes = existingDate?.getMinutes() ?? 59
                          date.setHours(hours, minutes, 0, 0)
                          onFormDataChange({
                            ...formData,
                            expires_at: date.toISOString(),
                          })
                        }
                      }}
                      disabled={(date) => {
                        const today = new Date()
                        today.setHours(0, 0, 0, 0)
                        return date < today
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {/* 时间选择 */}
                {formData.expires_at && (
                  <>
                    <Select
                      value={format(new Date(formData.expires_at), 'HH')}
                      onValueChange={(hour) => {
                        const date = new Date(formData.expires_at!)
                        date.setHours(parseInt(hour, 10))
                        onFormDataChange({
                          ...formData,
                          expires_at: date.toISOString(),
                        })
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOURS.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">:</span>
                    <Select
                      value={format(new Date(formData.expires_at), 'mm')}
                      onValueChange={(minute) => {
                        const date = new Date(formData.expires_at!)
                        date.setMinutes(parseInt(minute, 10))
                        onFormDataChange({
                          ...formData,
                          expires_at: date.toISOString(),
                        })
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MINUTES.map((m) => (
                          <SelectItem key={m} value={m}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                )}

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
