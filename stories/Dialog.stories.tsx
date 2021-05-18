import { Meta } from '@storybook/react'
import { Chance } from 'chance'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useState } from 'react'
import { Dialog } from '../src/components/Dialog'
import { FocusTrap } from '../src/components/FocusTrap'
import { DialogChildrenProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

export const Raw = () => {
  const [visible, setVisible] = useState<boolean>(false)

  const onClick = () => {
    setVisible(!visible)
  }

  return (
    <Fragment>
      <button className='border border-black focus:ring-2' onClick={onClick} type='button'>
        Show Dialog
      </button>
      {visible && (
        <Dialog.Root className='bg-black bg-opacity-50' onClose={onClick} hasDescription hasTitle>
          {(props: DialogChildrenProps) => (
            <FocusTrap.Root className='w-64 flex flex-col bg-white'>
              <Dialog.Title {...props} className='font-bold'>
                {Chance().sentence({ words: 2 })}
              </Dialog.Title>
              <Dialog.Description {...props}>{Chance().paragraph({ sentences: 1 })}</Dialog.Description>
              <div className='flex justify-end'>
                <button className='border border-black focus:ring-2' onClick={onClick} type='button'>
                  No
                </button>
                <button className='bg-black text-white focus:ring-2' onClick={onClick} type='button'>
                  Yes
                </button>
              </div>
            </FocusTrap.Root>
          )}
        </Dialog.Root>
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
    <Fragment>
      <button
        className={ArrayUtils.joinStrings(
          'bg-white px-12 py-6 rounded-md border border-gray-200 font-medium transition-all duration-200',
          'ring-offset-2 ring-blue-400 focus:ring-2',
          'hover:bg-gray-100 active:bg-gray-50'
        )}
        onClick={onClick}
        type='button'
      >
        Show Dialog
      </button>
      <AnimatePresence>
        {visible && (
          <Dialog.Root onClose={onClick} hasDescription hasTitle>
            {(props: DialogChildrenProps) => (
              <FocusTrap.Root autoFocus restoreFocus>
                <motion.div animate={{ opacity: 0.5 }} className='absolute inset-0 bg-black' exit={{ opacity: 0 }} initial={{ opacity: 0 }} />
                <div className='absolute inset-0 flex justify-center items-start py-16 z-10'>
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className='w-96 flex flex-col bg-white p-6 space-y-6 rounded-md'
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className='flex flex-col'>
                      <Dialog.Title {...props} className='font-medium text-lg'>
                        {Chance().sentence({ words: 2 })}
                      </Dialog.Title>
                      <Dialog.Description {...props} className='text-sm'>
                        {Chance().paragraph({ sentences: 1 })}
                      </Dialog.Description>
                    </div>
                    <div className='flex justify-end space-x-3'>
                      <button
                        className={ArrayUtils.joinStrings(
                          'bg-white px-6 py-3 rounded-md border border-gray-200 font-medium transition-all duration-200',
                          'ring-offset-2 ring-blue-400 focus:ring-2',
                          'hover:bg-gray-100 active:bg-gray-50'
                        )}
                        onClick={onClick}
                        type='button'
                      >
                        No
                      </button>
                      <button
                        className={ArrayUtils.joinStrings(
                          'bg-black px-6 py-3 rounded-md text-white font-medium transition-all duration-200',
                          'ring-offset-2 ring-blue-400 focus:ring-2',
                          'hover:bg-gray-700 active:bg-gray-600'
                        )}
                        onClick={onClick}
                        type='button'
                      >
                        Yes
                      </button>
                    </div>
                  </motion.div>
                </div>
              </FocusTrap.Root>
            )}
          </Dialog.Root>
        )}
      </AnimatePresence>
    </Fragment>
  )
}

export default {
  component: Dialog.Root,
  subcomponents: { Title: Dialog.Title, Description: Dialog.Description },
  title: 'Components/Dialog'
} as Meta
