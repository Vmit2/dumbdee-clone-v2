import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Hook for debounced search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook for throttled function calls
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now())

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args)
      lastRun.current = Date.now()
    }
  }, [callback, delay])
}

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [hasIntersected, options])

  return { elementRef, isIntersecting, hasIntersected }
}

// Hook for virtual scrolling
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    )

    return {
      startIndex,
      endIndex,
      items: items.slice(startIndex, endIndex),
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    }
  }, [items, itemHeight, containerHeight, scrollTop])

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return { visibleItems, handleScroll }
}

// Hook for memoized selectors
export const useMemoizedSelector = (selector, deps = []) => {
  const selectorResult = useSelector(selector)
  
  return useMemo(() => selectorResult, [selectorResult, ...deps])
}

// Hook for optimized API calls
export const useOptimizedAPI = () => {
  const [cache, setCache] = useState(new Map())
  const [loading, setLoading] = useState(new Set())
  const abortControllers = useRef(new Map())

  const makeRequest = useCallback(async (key, apiCall, options = {}) => {
    const { 
      cacheTime = 5 * 60 * 1000, // 5 minutes default
      forceRefresh = false,
      onSuccess,
      onError 
    } = options

    // Check cache first
    if (!forceRefresh && cache.has(key)) {
      const cached = cache.get(key)
      if (Date.now() - cached.timestamp < cacheTime) {
        return cached.data
      }
    }

    // Prevent duplicate requests
    if (loading.has(key)) {
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          if (!loading.has(key)) {
            if (cache.has(key)) {
              resolve(cache.get(key).data)
            } else {
              reject(new Error('Request failed'))
            }
          } else {
            setTimeout(checkLoading, 100)
          }
        }
        checkLoading()
      })
    }

    setLoading(prev => new Set(prev).add(key))

    // Cancel previous request if exists
    if (abortControllers.current.has(key)) {
      abortControllers.current.get(key).abort()
    }

    const abortController = new AbortController()
    abortControllers.current.set(key, abortController)

    try {
      const data = await apiCall({ signal: abortController.signal })
      
      // Cache the result
      setCache(prev => new Map(prev).set(key, {
        data,
        timestamp: Date.now()
      }))

      if (onSuccess) onSuccess(data)
      return data
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (onError) onError(error)
        throw error
      }
    } finally {
      setLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(key)
        return newSet
      })
      abortControllers.current.delete(key)
    }
  }, [cache])

  const clearCache = useCallback((key) => {
    if (key) {
      setCache(prev => {
        const newCache = new Map(prev)
        newCache.delete(key)
        return newCache
      })
    } else {
      setCache(new Map())
    }
  }, [])

  const isLoading = useCallback((key) => loading.has(key), [loading])

  return { makeRequest, clearCache, isLoading }
}

// Hook for image lazy loading
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const { elementRef, hasIntersected } = useIntersectionObserver()

  useEffect(() => {
    if (hasIntersected && src) {
      const img = new Image()
      
      img.onload = () => {
        setImageSrc(src)
        setIsLoaded(true)
      }
      
      img.onerror = () => {
        setIsError(true)
      }
      
      img.src = src
    }
  }, [hasIntersected, src])

  return { elementRef, imageSrc, isLoaded, isError }
}

// Hook for component lazy loading
export const useLazyComponent = (importFunc) => {
  const [Component, setComponent] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadComponent = useCallback(async () => {
    if (Component || loading) return

    setLoading(true)
    try {
      const module = await importFunc()
      setComponent(() => module.default || module)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [importFunc, Component, loading])

  return { Component, loading, error, loadComponent }
}

// Hook for optimized form handling
export const useOptimizedForm = (initialValues, validationSchema) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedValues = useDebounce(values, 300)

  // Memoized validation
  const validationErrors = useMemo(() => {
    if (!validationSchema) return {}
    
    try {
      validationSchema.validateSync(debouncedValues, { abortEarly: false })
      return {}
    } catch (err) {
      const validationErrors = {}
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message
      })
      return validationErrors
    }
  }, [debouncedValues, validationSchema])

  useEffect(() => {
    setErrors(validationErrors)
  }, [validationErrors])

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
  }, [])

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
  }, [])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setValue(name, type === 'checkbox' ? checked : value)
  }, [setValue])

  const handleBlur = useCallback((e) => {
    setFieldTouched(e.target.name)
  }, [setFieldTouched])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid = useMemo(() => {
    return Object.keys(validationErrors).length === 0
  }, [validationErrors])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setFieldTouched,
    handleChange,
    handleBlur,
    resetForm,
    setIsSubmitting,
  }
}

// Hook for local storage with performance optimization
export const useOptimizedLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Use requestIdleCallback for non-critical localStorage writes
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        })
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue]
}

// Hook for window size with performance optimization
export const useOptimizedWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const handleResize = useThrottle(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, 100)

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return windowSize
}

// Hook for scroll position with performance optimization
export const useOptimizedScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState({
    x: window.pageXOffset,
    y: window.pageYOffset,
  })

  const handleScroll = useThrottle(() => {
    setScrollPosition({
      x: window.pageXOffset,
      y: window.pageYOffset,
    })
  }, 16) // ~60fps

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return scrollPosition
}

// Hook for media queries
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    const handleChange = (e) => setMatches(e.matches)

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [query])

  return matches
}

// Hook for prefetching data
export const usePrefetch = () => {
  const prefetchedData = useRef(new Map())

  const prefetch = useCallback(async (key, apiCall) => {
    if (prefetchedData.current.has(key)) return

    try {
      const data = await apiCall()
      prefetchedData.current.set(key, data)
    } catch (error) {
      console.error(`Prefetch failed for key "${key}":`, error)
    }
  }, [])

  const getPrefetchedData = useCallback((key) => {
    return prefetchedData.current.get(key)
  }, [])

  const clearPrefetchedData = useCallback((key) => {
    if (key) {
      prefetchedData.current.delete(key)
    } else {
      prefetchedData.current.clear()
    }
  }, [])

  return { prefetch, getPrefetchedData, clearPrefetchedData }
}

