import { ref, Ref } from 'vue'

export interface TableSelectionOptions<T> {
  /**
   * 获取项目的唯一标识符
   */
  getItemId: (item: T) => string | number
}

/**
 * 表格多选逻辑的 Composable
 */
export function useTableSelection<T>(items: Ref<T[]>, options: TableSelectionOptions<T>) {
  const selected = ref<Set<string | number>>(new Set())

  const isSelected = (item: T): boolean => {
    return selected.value.has(options.getItemId(item))
  }

  const isAllSelected = (): boolean => {
    if (items.value.length === 0) return false
    return items.value.every((item) => selected.value.has(options.getItemId(item)))
  }

  const isSomeSelected = (): boolean => {
    return selected.value.size > 0 && !isAllSelected()
  }

  const toggle = (item: T): void => {
    const id = options.getItemId(item)
    if (selected.value.has(id)) {
      selected.value.delete(id)
    } else {
      selected.value.add(id)
    }
  }

  const toggleAll = (): void => {
    if (isAllSelected()) {
      selected.value.clear()
    } else {
      items.value.forEach((item) => {
        selected.value.add(options.getItemId(item))
      })
    }
  }

  const selectAll = (): void => {
    items.value.forEach((item) => {
      selected.value.add(options.getItemId(item))
    })
  }

  const deselectAll = (): void => {
    selected.value.clear()
  }

  const getSelected = (): T[] => {
    return items.value.filter((item) => selected.value.has(options.getItemId(item)))
  }

  const getSelectedCount = (): number => {
    return selected.value.size
  }

  return {
    selected,
    isSelected,
    isAllSelected,
    isSomeSelected,
    toggle,
    toggleAll,
    selectAll,
    deselectAll,
    getSelected,
    getSelectedCount,
  }
}
