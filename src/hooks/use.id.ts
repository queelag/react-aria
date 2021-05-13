import { useMemo } from 'react'
import { ID } from '../definitions/types'
import IDUtils from '../utils/id.utils'

const useID = (prefix: string, id?: string): ID => useMemo(() => id || IDUtils.prefixed(prefix), [])
export default useID
