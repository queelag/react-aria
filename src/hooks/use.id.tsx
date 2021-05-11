import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import { ID } from '../definitions/types'

const useID = (prefix: string): ID => useMemo(() => prefix + '-' + nanoid(), [])
export default useID
