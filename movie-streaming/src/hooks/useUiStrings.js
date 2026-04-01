import { useCallback, useMemo } from 'react'
import { useApp } from './useApp'
import { UI_LOCALES, interpolate } from '../locales/ui'

export function useUiStrings() {
  const { activeProfile } = useApp()
  const locale = activeProfile?.languagePref || 'en'
  const table = useMemo(
    () => UI_LOCALES[locale] || UI_LOCALES.en,
    [locale]
  )

  const t = useCallback(
    (key, vars) => {
      const raw = table[key] ?? UI_LOCALES.en[key] ?? key
      return vars ? interpolate(raw, vars) : raw
    },
    [table]
  )

  return { t, locale }
}
