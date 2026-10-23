import { useCallback, useEffect, useState } from 'react'
import { api } from './api'

// const { data, loading, error, reload, setData } = useFetch('/posts')
// Pass null as the path to skip fetching.
export function useFetch(path) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(Boolean(path))
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!path) return
    setLoading(true)
    setError(null)
    try {
      setData(await api.get(path))
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [path])

  useEffect(() => {
    load()
  }, [load])

  return { data, loading, error, reload: load, setData }
}
