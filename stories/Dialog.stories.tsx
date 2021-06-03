import { Meta, Story } from '@storybook/react'
import { Chance } from 'chance'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment, useState } from 'react'
import * as Component from '../src/components/Dialog'
import * as FocusTrap from '../src/components/FocusTrap'
import { DialogChildrenProps, DialogProps } from '../src/definitions/props'
import ArrayUtils from '../src/utils/array.utils'

const Template: Story<DialogProps> = (args: DialogProps) => {
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
          <Component.Root {...args} onClose={onClick} hasDescription hasTitle>
            {(props: DialogChildrenProps) => (
              <FocusTrap.Root autoFocus restoreFocus>
                <motion.div animate={{ opacity: 0.5 }} className='absolute inset-0 bg-black z-10' exit={{ opacity: 0 }} initial={{ opacity: 0 }} />
                <div className='absolute inset-0 flex justify-center items-start py-16 z-20'>
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className='w-96 flex flex-col bg-white p-6 space-y-6 rounded-md'
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                  >
                    <div className='flex flex-col'>
                      <Component.Title {...props} className='font-medium text-lg'>
                        {Chance().sentence({ words: 2 })}
                      </Component.Title>
                      <Component.Description {...props} className='text-sm'>
                        {Chance().paragraph({ sentences: 1 })}
                      </Component.Description>
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
          </Component.Root>
        )}
      </AnimatePresence>
    </Fragment>
  )
}

export const Dialog = Template.bind({})
Dialog.args = { hasDescription: true, hasTitle: true }

export default {
  component: Component.Root,
  subcomponents: { Title: Component.Title, Description: Component.Description },
  title: 'Components/Dialog'
} as Meta
