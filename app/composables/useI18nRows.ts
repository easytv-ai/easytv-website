// tm() 拿到的数组元素是未解析的文案节点，要逐个过 rt()。
// 这里收口成两个带类型的小工具，省得每个组件各写一遍 as any。
type I18nMsg = Parameters<ReturnType<typeof useI18n>['rt']>[0]

export function useI18nRows() {
  const { tm, rt } = useI18n()

  /** 对象数组：每个字段都是一条文案，如 features.items */
  function rows<K extends string>(key: string): Record<K, string>[] {
    return (tm(key) as unknown as Record<K, I18nMsg>[]).map(row =>
      Object.fromEntries(Object.entries<I18nMsg>(row).map(([k, v]) => [k, rt(v)])) as Record<K, string>,
    )
  }

  /** 字符串数组，如 quickstart.tabs */
  function list(key: string): string[] {
    return (tm(key) as unknown as I18nMsg[]).map(m => rt(m))
  }

  /** 带子列表的分组，如 roadmap.cols（title + items[]） */
  function groups(key: string): { title: string, items: string[] }[] {
    return (tm(key) as unknown as { title: I18nMsg, items: I18nMsg[] }[]).map(g => ({
      title: rt(g.title),
      items: g.items.map(m => rt(m)),
    }))
  }

  return { rows, list, groups }
}
