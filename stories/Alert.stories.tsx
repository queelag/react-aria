import { InfoRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React from 'react'
import { Alert } from '../src/components/Alert'

export const Raw = () => <Alert.Root>{Chance().paragraph({ sentences: 1 })}</Alert.Root>

export const Styled = () => (
  <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.5 }}>
    <Alert.Root className='flex items-center p-6 space-x-3 rounded-md bg-white text-blue-500 shadow-2xl'>
      <InfoRounded style={{ fontSize: 32 }} />
      <div className='flex flex-col'>
        <span className='font-medium text-lg'>Information</span>
        <span className='text-sm'>{Chance().paragraph({ sentences: 1 })}</span>
      </div>
    </Alert.Root>
  </motion.div>
)

export default {
  component: Alert.Root,
  title: 'Components/Alert'
} as Meta
