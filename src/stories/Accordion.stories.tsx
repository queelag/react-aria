import { KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import Chance from 'chance'
import { AnimatePresence, motion } from 'framer-motion'
import React, { Fragment } from 'react'
import { Accordion, AccordionSection, AccordionSectionHeader, AccordionSectionPanel } from '../components/Accordion'
import { AccordionChildrenProps, AccordionSectionChildrenProps } from '../definitions/props'

const sections: { description: string; title: string }[] = new Array(3).fill(0).map((v) => ({
  description: Chance().paragraph({ sentences: 1 }),
  title: Chance().sentence({ words: 2 })
}))

export const Raw = () => (
  <Accordion size={sections.length}>
    {(props: AccordionChildrenProps) => (
      <Fragment>
        {sections.map((v, k) => (
          <AccordionSection {...props} index={k} key={k}>
            {(props: AccordionSectionChildrenProps) => (
              <Fragment>
                <AccordionSectionHeader {...props}>{v.title}</AccordionSectionHeader>
                {props.expanded && <AccordionSectionPanel {...props}>{v.description}</AccordionSectionPanel>}
              </Fragment>
            )}
          </AccordionSection>
        ))}
      </Fragment>
    )}
  </Accordion>
)

export const Styled = () => {
  return (
    <div className='max-w-lg rounded-md p-16 bg-gradient-to-br from-red-400 via-red-500 to-red-600'>
      <Accordion className='flex flex-col rounded-md overflow-hidden bg-white divide-y divide-gray-100' size={sections.length}>
        {(props) => (
          <Fragment>
            {sections.map((v, k) => (
              <AccordionSection {...props} className='flex flex-col' index={k} key={k}>
                {(props) => (
                  <Fragment>
                    <AccordionSectionHeader {...props} className='focus:outline-none focus:bg-gray-200 z-10'>
                      <div className='flex justify-between items-center p-6 space-x-6'>
                        <span className='font-medium'>{v.title}</span>
                        <motion.div animate={{ rotate: props.expanded ? 180 : 0 }}>
                          <KeyboardArrowDownRounded />
                        </motion.div>
                      </div>
                    </AccordionSectionHeader>
                    <AnimatePresence>
                      {props.expanded && (
                        <motion.div
                          animate={{ height: 'auto' }}
                          className='overflow-hidden bg-gray-100'
                          exit={{ height: 0 }}
                          initial={{ height: 0 }}
                          transition={{ type: 'linear' }}
                        >
                          <AccordionSectionPanel {...props} className='p-6 text-sm'>
                            {v.description}
                          </AccordionSectionPanel>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Fragment>
                )}
              </AccordionSection>
            ))}
          </Fragment>
        )}
      </Accordion>
    </div>
  )
}

export default {
  component: Accordion,
  subcomponents: { AccordionSection, AccordionSectionPanel, AccordionSectionHeader },
  title: 'Components/Accordion'
} as Meta
