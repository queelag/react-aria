import { createContext } from 'react'

type ContextData = {
  alertDialogsVisibilityMap: Map<string, boolean>
}

const contextData: ContextData = {
  alertDialogsVisibilityMap: new Map()
}

const Context = createContext(contextData)
export default Context
