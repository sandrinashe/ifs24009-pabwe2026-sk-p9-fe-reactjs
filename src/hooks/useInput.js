import { useCallback, useState } from 'react'

/** State form sederhana: values, bind(name), set(name,value), reset(next). */
export default function useInput(initial = {}) {
  const [values, setValues] = useState(initial)

  const set = useCallback((name, value) => setValues((v) => ({ ...v, [name]: value })), [])
  const bind = useCallback(
    (name) => ({
      value: values[name] ?? '',
      onChange: (e) => set(name, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
    }),
    [values, set],
  )
  const reset = useCallback((next = initial) => setValues(next), [initial])

  return { values, set, bind, reset }
}
