import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FiAlertTriangle, FiCode } from 'react-icons/fi'
import type { z } from 'zod'

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  type ConfigValueType,
  createConfigFormSchema,
} from '@/schemas/systemConfigSchema'
import type { SystemConfigItem } from '@/services/api'
import { formatJSON, getConfigKeyLabel } from '@/utils/configUtils'

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
  const [showRestartWarning, setShowRestartWarning] = useState(false)

  // 动态创建 schema
  const schema = config
    ? createConfigFormSchema(config.value_type as ConfigValueType)
    : createConfigFormSchema('string')

  type FormValues = z.infer<typeof schema>

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      value: config?.value || '',
    },
  })

  // 当 config 变化时重置表单
  useEffect(() => {
    if (config) {
      form.reset({ value: config.value })
      setShowRestartWarning(false)
    }
  }, [config, form])

  const handleSave = async (data: FormValues) => {
    if (!config) return

    try {
      const result = await onSave(config.key, data.value)
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

  const handleFormatJSON = () => {
    const currentValue = form.getValues('value')
    const formatted = formatJSON(currentValue)
    form.setValue('value', formatted)
  }

  if (!config) return null

  // 根据类型渲染不同的输入组件
  const renderInput = (field: {
    value: string
    onChange: (value: string) => void
  }) => {
    switch (config.value_type) {
      case 'bool':
        return (
          <div className="flex items-center gap-2">
            <Checkbox
              id="config-bool-value"
              checked={field.value === 'true'}
              onCheckedChange={(checked: boolean) =>
                field.onChange(checked ? 'true' : 'false')
              }
            />
            <label
              htmlFor="config-bool-value"
              className="text-sm text-muted-foreground"
            >
              {field.value === 'true'
                ? t('common.enabled', 'Enabled')
                : t('common.disabled', 'Disabled')}
            </label>
          </div>
        )

      case 'int':
        return (
          <Input
            type="text"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="font-mono"
            placeholder="42"
          />
        )

      case 'json':
        return (
          <div className="space-y-2">
            <Textarea
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              className="font-mono text-sm"
              rows={10}
              placeholder='{"key": "value"}'
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFormatJSON}
              className="w-full"
            >
              <FiCode className="mr-2 h-4 w-4" />
              {t('config.formatJSON', 'Format JSON')}
            </Button>
          </div>
        )

      default:
        return (
          <Input
            type="text"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            className="font-mono"
          />
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t('config.editConfig', 'Edit Configuration')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            {/* 配置键 */}
            <div className="space-y-2">
              <FormLabel>{t('config.key', 'Key')}</FormLabel>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
                  {getConfigKeyLabel(config.key, t)}
                </code>
                <Badge variant="outline">{config.value_type}</Badge>
              </div>
            </div>

            {/* 配置值 */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('config.value', 'Value')}</FormLabel>
                  <FormControl>{renderInput(field)}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                {showRestartWarning
                  ? t('common.close', 'Close')
                  : t('common.cancel', 'Cancel')}
              </Button>
              {!showRestartWarning && (
                <Button type="submit" disabled={saving}>
                  {saving
                    ? t('common.saving', 'Saving...')
                    : t('common.save', 'Save')}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
