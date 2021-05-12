import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useState } from 'react'
import { AlertDialog, AlertDialogDescription, AlertDialogTitle } from '../src/components/AlertDialog'
import { FocusTrap } from '../src/components/FocusTrap'
import { AlertDialogChildrenProps } from '../src/definitions/props'

export const Raw = () => {
  const [visible, setVisible] = useState<boolean>(false)

  const onClick = () => {
    setVisible(!visible)
  }

  return (
    <Fragment>
      <button className='border border-black focus:ring-2' onClick={onClick} type='button'>
        Show Alert Dialog
      </button>
      {visible && (
        <AlertDialog className='bg-black bg-opacity-50'>
          {(props: AlertDialogChildrenProps) => (
            <FocusTrap className='w-64 flex flex-col bg-white'>
              <AlertDialogTitle {...props} className='font-bold'>
                {Chance().sentence({ words: 2 })}
              </AlertDialogTitle>
              <AlertDialogDescription {...props}>{Chance().paragraph({ sentences: 1 })}</AlertDialogDescription>
              <div className='flex justify-end'>
                <button className='border border-black focus:ring-2' onClick={onClick} type='button'>
                  No
                </button>
                <button className='bg-black text-white focus:ring-2' onClick={onClick} type='button'>
                  Yes
                </button>
              </div>
            </FocusTrap>
          )}
        </AlertDialog>
      )}
    </Fragment>
  )
}

export const Styled = () => {
  const [visible, setVisible] = useState<boolean>(false)

  const onClick = () => {
    setVisible(!visible)
  }

  return (
    <div className='styled max-w-lg flex justify-center items-center rounded-md px-16 py-32 bg-gradient-to-br from-green-400 via-green-500 to-green-600'>
      <motion.button
        className='px-12 py-6 bg-white text-green-700 font-medium rounded-md focus:ring-2 ring-offset-2 ring-blue-700'
        onClick={onClick}
        type='button'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        Show Alert Dialog
      </motion.button>
      <AnimatePresence>
        {visible && (
          <AlertDialog>
            {(props: AlertDialogChildrenProps) => (
              <FocusTrap autoFocus restoreFocus>
                <motion.div animate={{ opacity: 0.5 }} className='absolute inset-0 bg-black' exit={{ opacity: 0 }} initial={{ opacity: 0 }} />
                <div className='absolute inset-0 flex justify-center items-start py-16 z-10'>
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className='w-96 flex flex-col bg-white p-6 space-y-6 rounded-md'
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className='flex flex-col'>
                      <AlertDialogTitle {...props} className='font-medium text-lg'>
                        {Chance().sentence({ words: 2 })}
                      </AlertDialogTitle>
                      <AlertDialogDescription {...props} className='text-sm'>
                        {Chance().paragraph({ sentences: 1 })}
                      </AlertDialogDescription>
                    </div>
                    <div className='flex justify-end space-x-3'>
                      <button
                        className='border border-gray-200 rounded-md px-6 py-3 text-sm focus:ring-2 ring-offset-1 transition-all duration-200 hover:bg-gray-100 active:bg-gray-50'
                        onClick={onClick}
                        type='button'
                      >
                        No
                      </button>
                      <button
                        className='bg-black text-white rounded-md px-6 py-3 text-sm focus:ring-2 ring-offset-1 transition-all duration-200 transform hover:scale-105 active:scale-95'
                        onClick={onClick}
                        type='button'
                      >
                        Yes
                      </button>
                    </div>
                  </motion.div>
                </div>
              </FocusTrap>
            )}
          </AlertDialog>
        )}
      </AnimatePresence>
    </div>
  )
}

export default {
  component: AlertDialog,
  subcomponents: { AlertDialogDescription, AlertDialogTitle },
  title: 'Components/AlertDialog'
} as Meta
