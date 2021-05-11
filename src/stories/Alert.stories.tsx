import { InfoRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import { motion } from 'framer-motion'
import React from 'react'
import { Alert } from '../components/Alert'

export const Raw = () => <Alert>{Chance().paragraph({ sentences: 1 })}</Alert>

export const Styled = () => (
  <div className='max-w-2xl rounded-md p-16 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'>
    <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.5 }}>
      <Alert className='flex items-center p-6 space-x-3 rounded-md bg-white'>
        <InfoRounded className='text-blue-600' style={{ fontSize: 32 }} />
        <div className='flex flex-col space-y-1'>
          <span className='font-medium text-lg text-blue-600'>Information</span>
          <span className='text-sm text-blue-600'>{Chance().paragraph({ sentences: 1 })}</span>
        </div>
      </Alert>
    </motion.div>
  </div>
)

export default {
  component: Alert,
  title: 'Components/Alert'
} as Meta
