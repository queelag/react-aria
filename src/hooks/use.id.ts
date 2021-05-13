import { useMemo } from 'react'
import { ID } from '../definitions/types'
import IDUtils from '../utils/id.utils'

const useID = (prefix: string): ID => useMemo(() => IDUtils.prefixed(prefix), [])
export default useID
