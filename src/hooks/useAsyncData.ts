import { useEffect, useMemo, useState, type DependencyList } from 'react'

type AsyncState<T> = {
  data: T | null
  status: 'idle' | 'loading' | 'success' | 'error'
  error?: string
}

type UseAsyncOptions<T> = {
  refreshIntervalMs?: number
  initialData?: T | null
}

export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList = [],
  options: UseAsyncOptions<T> = {},
) {
  const refreshInterval = options.refreshIntervalMs
  const [state, setState] = useState<AsyncState<T>>({
    data: options.initialData ?? null,
    status: options.initialData ? 'success' : 'loading',
  })

  const memoizedDeps = useMemo(() => [...deps, refreshInterval], [deps, refreshInterval])

  useEffect(() => {
    let active = true
    let intervalId: ReturnType<typeof setInterval> | undefined

    const execute = () => {
      setState((prev) => ({ ...prev, status: 'loading', error: undefined }))

      loader()
        .then((result) => {
          if (!active) return
          setState({ data: result, status: 'success' })
        })
        .catch((err) => {
          if (!active) return
          setState({
            data: null,
            status: 'error',
            error: err instanceof Error ? err.message : String(err),
          })
        })
    }

    execute()

    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(execute, refreshInterval)
    }

    return () => {
      active = false
      if (intervalId) clearInterval(intervalId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, memoizedDeps)

  return state
}
