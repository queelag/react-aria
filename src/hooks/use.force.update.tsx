import { useReducer } from 'react'

function useForceUpdate(): () => void {
  return useReducer(() => ({}), {})[1]
}

export default useForceUpdate
