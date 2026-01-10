import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FiAlertTriangle } from 'react-icons/fi'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { SystemConfigItem } from '@/services/api'

/** 获取配置键的翻译名称 */
function getKeyLabel(
  key: string,
  t: ReturnType<typeof useTranslation>['t'],
): string {
  const translationKey = `config.keys.${key}`
  const translated = t(translationKey as never)
  return translated === translationKey ? key : translated
}

interface SystemConfigEditDialogProps {
  config: SystemConfigItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (
    key: string,
    value: string,
  ) => Promise<{ requires_restart: boolean; message: string | null }>
  saving: boolean
}

export function SystemConfigEditDialog({
  config,
  open,
  onOpenChange,
  onSave,
  saving,
}: SystemConfigEditDialogProps) {
  const { t } = useTranslation()
  const [value, setValue] = useState('')
  const [showRestartWarning, setShowRestartWarning] = useState(false)

  useEffect(() => {
    if (config) {
      setValue(config.value)
      setShowRestartWarning(false)
    }
  }, [config])

  const handleSave = async () => {
    if (!config) return

    try {
      const result = await onSave(config.key, value)
      if (result.requires_restart) {
        setShowRestartWarning(true)
      } else {
        onOpenChange(false)
      }
    } catch {
      // Error is handled by the store
    }
  }

  const handleClose = () => {
    setShowRestartWarning(false)
    onOpenChange(false)
  }

  if (!config) return null

  // 根据类型渲染不同的输入组件
  const renderInput = () => {
    switch (config.value_type) {
      case 'bool':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id="config-bool-value"
              checked={value === 'true' || value === '1' || value === 'yes'}
              onCheckedChange={(checked: boolean) =>
                setValue(checked ? 'true' : 'false')
              }
            />
            <label
              htmlFor="config-bool-value"
              className="text-sm text-muted-foreground"
            >
              {value === 'true' || value === '1' || value === 'yes'
                ? t('common.enabled', 'Enabled')
                : t('common.disabled', 'Disabled')}
            </label>
          </div>
        )
      case 'int':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="font-mono"
          />
        )
      default:
        return (
          <Input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="font-mono"
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {t('config.editConfig', 'Edit Configuration')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 配置键 */}
          <div className="space-y-2">
            <Label>{t('config.key', 'Key')}</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
                {getKeyLabel(config.key, t)}
              </code>
              <Badge variant="outline">{config.value_type}</Badge>
            </div>
          </div>

          {/* 配置值 */}
          <div className="space-y-2">
            <Label htmlFor="config-value">{t('config.value', 'Value')}</Label>
            {renderInput()}
          </div>

          {/* 需要重启提示 */}
          {config.requires_restart && (
            <div className="flex items-center gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-200">
              <FiAlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                {t(
                  'config.requiresRestartHint',
                  'Changes require server restart to take effect',
                )}
              </span>
            </div>
          )}

          {/* 保存成功但需要重启的提示 */}
          {showRestartWarning && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950/50 dark:text-green-200">
              <span>
                {t(
                  'config.savedNeedRestart',
                  'Configuration saved. Please restart the server for changes to take effect.',
                )}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {showRestartWarning
              ? t('common.close', 'Close')
              : t('common.cancel', 'Cancel')}
          </Button>
          {!showRestartWarning && (
            <Button onClick={handleSave} disabled={saving}>
              {saving
                ? t('common.saving', 'Saving...')
                : t('common.save', 'Save')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
