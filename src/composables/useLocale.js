import { ref, watch } from 'vue'

const STORAGE_KEY = 'rodebiau:locale'
const initial =
  (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY)) ||
  (typeof navigator !== 'undefined' && navigator.language?.startsWith('zh')
    ? 'zh'
    : 'en')

export const locale = ref(initial === 'zh' ? 'zh' : 'en')

if (typeof window !== 'undefined') {
  watch(locale, v => {
    localStorage.setItem(STORAGE_KEY, v)
    document.documentElement.lang = v === 'zh' ? 'zh-CN' : 'en'
  }, { immediate: true })
}

export function useLocale() {
  const toggle = () => {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
  }
  const t = obj => (obj && obj[locale.value] != null ? obj[locale.value] : obj)
  return { locale, toggle, t }
}
