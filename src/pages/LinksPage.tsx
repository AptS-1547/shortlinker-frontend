import { format } from 'date-fns'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  FiCalendar as CalendarIcon,
  FiFilter as Filter,
  FiPlus as Plus,
  FiSearch as Search,
  FiSettings as Settings2,
  FiTrash2 as Trash2,
  FiX as X,
} from 'react-icons/fi'
import { toast } from 'sonner'
import PageHeader from '@/components/layout/PageHeader'
import {
  LinkDeleteDialog,
  LinkFormDialog,
  LinksTable,
} from '@/components/links'
import { Skeleton } from '@/components/ui/skeleton'
import type {
  ColumnKey,
  SortDirection,
  SortField,
} from '@/components/links/LinksTable'
import { DEFAULT_VISIBLE_COLUMNS } from '@/components/links/LinksTable'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { batchService } from '@/services/batchService'
import type { LinkPayload, SerializableShortLink } from '@/services/types'
import { useLinksStore } from '@/stores/linksStore'
import { STORAGE_KEYS, Storage } from '@/utils/storage'
import { buildShortUrl } from '@/utils/urlBuilder'

type StatusFilter = 'all' | 'active' | 'expired'

// 从 Storage 加载列配置
function loadVisibleColumns(): ColumnKey[] {
  try {
    const parsed = Storage.getJSON<ColumnKey[]>(
      STORAGE_KEYS.LINKS_VISIBLE_COLUMNS,
    )
    // 验证数据有效性
    if (
      Array.isArray(parsed) &&
      parsed.every((col) => DEFAULT_VISIBLE_COLUMNS.includes(col))
    ) {
      return parsed
    }
  } catch {
    // 忽略解析错误
  }
  return DEFAULT_VISIBLE_COLUMNS
}

// 列名翻译映射
const COLUMN_LABELS: Record<ColumnKey, string> = {
  code: 'links.table.code',
  target: 'links.table.target',
  clicks: 'links.table.clicks',
  status: 'links.table.status',
  created: 'links.table.created',
  expires: 'links.table.expires',
}

const INITIAL_FORM_DATA: LinkPayload = {
  code: '',
  target: '',
  expires_at: null,
  password: null,
}

export default function LinksPage() {
  const { t } = useTranslation()
  const { copy } = useCopyToClipboard()

  const {
    links,
    fetching,
    creating,
    updating,
    deleting,
    pagination,
    fetchLinks,
    createLink,
    updateLink,
    deleteLink,
    goToPage,
    setPageSize,
  } = useLinksStore()

  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [createdAfter, setCreatedAfter] = useState<Date | undefined>(undefined)
  const [createdBefore, setCreatedBefore] = useState<Date | undefined>(
    undefined,
  )
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  // 批量选择状态
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false)
  const [batchDeleting, setBatchDeleting] = useState(false)

  // 排序状态
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // 列配置状态
  const [visibleColumns, setVisibleColumns] =
    useState<ColumnKey[]>(loadVisibleColumns)

  // 对话框状态
  const formDialog = useDialog<SerializableShortLink>()
  const deleteDialog = useDialog<SerializableShortLink>()

  // 表单数据
  const [formData, setFormData] = useState<LinkPayload>(INITIAL_FORM_DATA)

  // 防止 StrictMode 双重执行 + 筛选变化检测
  const hasFetched = useRef(false)
  const prevFilter = useRef({
    searchQuery,
    statusFilter,
    createdAfter,
    createdBefore,
  })

  // 初始化加载 + 筛选变化时重新获取
  // biome-ignore lint/correctness/useExhaustiveDependencies: 仅监听筛选变化
  useEffect(() => {
    const query = {
      search: searchQuery || undefined,
      only_active: statusFilter === 'active' ? true : undefined,
      only_expired: statusFilter === 'expired' ? true : undefined,
      created_after: createdAfter?.toISOString(),
      created_before: createdBefore?.toISOString(),
      page: 1,
    }

    // 首次请求
    if (!hasFetched.current) {
      hasFetched.current = true
      prevFilter.current = {
        searchQuery,
        statusFilter,
        createdAfter,
        createdBefore,
      }
      fetchLinks(query)
      return
    }

    // 检查筛选是否真正变化（排除 StrictMode 重新运行）
    const filterChanged =
      prevFilter.current.searchQuery !== searchQuery ||
      prevFilter.current.statusFilter !== statusFilter ||
      prevFilter.current.createdAfter !== createdAfter ||
      prevFilter.current.createdBefore !== createdBefore

    if (!filterChanged) return

    // 筛选变化，防抖 300ms
    prevFilter.current = {
      searchQuery,
      statusFilter,
      createdAfter,
      createdBefore,
    }
    const timer = setTimeout(() => {
      fetchLinks(query)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter, createdAfter, createdBefore])

  // 处理创建
  const handleOpenCreate = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
    formDialog.open()
  }, [formDialog])

  // 处理编辑
  const handleOpenEdit = useCallback(
    (link: SerializableShortLink) => {
      setFormData({
        code: link.code,
        target: link.target,
        expires_at: link.expires_at,
        password: null,
      })
      formDialog.open(link)
    },
    [formDialog],
  )

  // 保存
  const handleSave = useCallback(async () => {
    try {
      if (formDialog.isEditMode && formDialog.data) {
        await updateLink(formDialog.data.code, formData)
        toast.success(t('links.updateSuccess', 'Link updated successfully'))
      } else {
        await createLink(formData)
        toast.success(t('links.createSuccess', 'Link created successfully'))
      }
      formDialog.close()
    } catch (err) {
      console.error('Save failed:', err)
      toast.error(
        formDialog.isEditMode
          ? t('links.updateError', 'Failed to update link')
          : t('links.createError', 'Failed to create link'),
      )
    }
  }, [formDialog, formData, updateLink, createLink, t])

  // 删除
  const handleDelete = useCallback(async () => {
    if (deleteDialog.data) {
      try {
        await deleteLink(deleteDialog.data.code)
        toast.success(t('links.deleteSuccess', 'Link deleted successfully'))
        deleteDialog.close()
      } catch (err) {
        console.error('Delete failed:', err)
        toast.error(t('links.deleteError', 'Failed to delete link'))
      }
    }
  }, [deleteDialog, deleteLink, t])

  // 复制链接
  const handleCopy = useCallback(
    async (code: string) => {
      const url = buildShortUrl(code)
      const success = await copy(url)
      if (success) {
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
        toast.success(t('links.copySuccess', 'Link copied to clipboard'))
      } else {
        toast.error(t('links.copyError', 'Failed to copy link'))
      }
    },
    [copy, t],
  )

  // 选择单个链接
  const handleSelectChange = useCallback((code: string, checked: boolean) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(code)
      } else {
        next.delete(code)
      }
      return next
    })
  }, [])

  // 全选/取消全选
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedCodes(new Set(links.map((link) => link.code)))
      } else {
        setSelectedCodes(new Set())
      }
    },
    [links],
  )

  // 清除选择
  const handleClearSelection = useCallback(() => {
    setSelectedCodes(new Set())
  }, [])

  // 批量删除
  const handleBatchDelete = useCallback(async () => {
    setBatchDeleting(true)
    try {
      const result = await batchService.deleteLinks(Array.from(selectedCodes))
      if (result.failed.length > 0) {
        console.warn('Some deletions failed:', result.failed)
        toast.warning(
          t(
            'links.batchDeletePartial',
            `Deleted ${result.success.length} links, ${result.failed.length} failed`,
          ),
        )
      } else {
        toast.success(
          t(
            'links.batchDeleteSuccess',
            `Successfully deleted ${result.success.length} links`,
          ),
        )
      }
      setSelectedCodes(new Set())
      setBatchDeleteOpen(false)
      // 刷新列表
      fetchLinks()
    } catch (err) {
      console.error('Batch delete failed:', err)
      toast.error(t('links.batchDeleteError', 'Failed to delete links'))
    } finally {
      setBatchDeleting(false)
    }
  }, [selectedCodes, fetchLinks, t])

  // 选中的链接数量
  const selectedCount = selectedCodes.size

  // 排序处理
  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        // 切换排序方向
        setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      } else {
        // 新字段，默认降序
        setSortField(field)
        setSortDirection('desc')
      }
    },
    [sortField],
  )

  // 排序后的链接列表
  const sortedLinks = useMemo(() => {
    if (!sortField) return links

    return [...links].sort((a, b) => {
      let comparison = 0
      if (sortField === 'clicks') {
        comparison = (a.click_count || 0) - (b.click_count || 0)
      } else if (sortField === 'created_at') {
        comparison =
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [links, sortField, sortDirection])

  // 列配置变更
  const handleColumnToggle = useCallback((col: ColumnKey, checked: boolean) => {
    setVisibleColumns((prev) => {
      const next = checked ? [...prev, col] : prev.filter((c) => c !== col)
      // 保存到 Storage
      Storage.setJSON(STORAGE_KEYS.LINKS_VISIBLE_COLUMNS, next)
      return next
    })
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('links.title')}
        description={t('links.description')}
        actions={
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('links.createNew')}
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 搜索框 */}
        <div className="relative w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('links.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        {/* 创建时间起始 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[180px] justify-start text-left font-normal',
                !createdAfter && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {createdAfter
                ? format(createdAfter, 'yyyy-MM-dd')
                : t('links.createdAfter')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={createdAfter}
              onSelect={setCreatedAfter}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {createdAfter && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCreatedAfter(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* 创建时间结束 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-[180px] justify-start text-left font-normal',
                !createdBefore && 'text-muted-foreground',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {createdBefore
                ? format(createdBefore, 'yyyy-MM-dd')
                : t('links.createdBefore')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={createdBefore}
              onSelect={setCreatedBefore}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {createdBefore && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCreatedBefore(undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* 状态筛选 */}
        <Select
          value={statusFilter}
          onValueChange={(value: StatusFilter) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[160px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t('links.filterOptions.allLinks')}
            </SelectItem>
            <SelectItem value="active">
              {t('links.filterOptions.activeOnly')}
            </SelectItem>
            <SelectItem value="expired">
              {t('links.filterOptions.expiredOnly')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Links Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              {t('links.tableTitle')} ({pagination.total})
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* 批量操作工具栏 */}
              {selectedCount > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {t('links.batch.selected', { count: selectedCount })}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setBatchDeleteOpen(true)}
                    className="gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('links.batch.delete')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                  >
                    {t('links.batch.clear')}
                  </Button>
                </>
              ) : (
                /* 列配置按钮 */
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Settings2 className="w-4 h-4" />
                      {t('links.columns.configure')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      {t('links.columns.title')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {DEFAULT_VISIBLE_COLUMNS.map((col) => (
                      <div
                        key={col}
                        className="flex items-center space-x-2 px-2 py-1.5"
                      >
                        <Checkbox
                          id={`col-${col}`}
                          checked={visibleColumns.includes(col)}
                          onCheckedChange={(checked) =>
                            handleColumnToggle(col, !!checked)
                          }
                        />
                        <label
                          htmlFor={`col-${col}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {t(COLUMN_LABELS[col])}
                        </label>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : links.length > 0 ? (
            <>
              <LinksTable
                links={sortedLinks}
                copiedCode={copiedCode}
                selectedCodes={selectedCodes}
                sortField={sortField}
                sortDirection={sortDirection}
                visibleColumns={visibleColumns}
                onCopy={handleCopy}
                onEdit={handleOpenEdit}
                onDelete={deleteDialog.open}
                onSelectChange={handleSelectChange}
                onSelectAll={handleSelectAll}
                onSort={handleSort}
              />

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                {/* Page Size Selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {t('links.pageSize')}
                  </span>
                  <Select
                    value={String(pagination.pageSize)}
                    onValueChange={(value) => setPageSize(Number(value))}
                  >
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Page Navigation */}
                {pagination.totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            pagination.hasPrev && goToPage(pagination.page - 1)
                          }
                          className={
                            !pagination.hasPrev
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1,
                      )
                        .filter((page) => Math.abs(page - pagination.page) <= 2)
                        .map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => goToPage(page)}
                              isActive={page === pagination.page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            pagination.hasNext && goToPage(pagination.page + 1)
                          }
                          className={
                            !pagination.hasNext
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {t('links.noLinksTitle', 'No links yet')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {t(
                  'links.noLinksDescription',
                  'Get started by creating your first short link',
                )}
              </p>
              <Button onClick={handleOpenCreate}>
                <Plus className="mr-2 h-4 w-4" />
                {t('links.createLink', 'Create Link')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <LinkFormDialog
        dialog={formDialog}
        formData={formData}
        onFormDataChange={setFormData}
        onSave={handleSave}
        isSaving={creating || updating}
      />

      <LinkDeleteDialog
        dialog={deleteDialog}
        onConfirm={handleDelete}
        isDeleting={deleting}
      />

      {/* 批量删除确认对话框 */}
      <AlertDialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('links.batch.deleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('links.batch.deleteDescription', { count: selectedCount })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={batchDeleting}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBatchDelete}
              disabled={batchDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {batchDeleting ? t('common.deleting') : t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
