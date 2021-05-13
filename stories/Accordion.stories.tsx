import { KeyboardArrowDownRounded } from '@material-ui/icons'
import { Meta } from '@storybook/react'
import Chance from 'chance'
import { motion } from 'framer-motion'
import React, { Fragment } from 'react'
import * as Accordion from '../src/components/Accordion'
import { AccordionChildrenProps, AccordionSectionChildrenProps } from '../src/definitions/props'

const sections: { description: string; title: string }[] = new Array(3).fill(0).map((v) => ({
  description: Chance().paragraph({ sentences: 1 }),
  title: Chance().sentence({ words: 2 })
}))

export const Raw = () => (
  <Accordion.Root>
    {(props: AccordionChildrenProps) => (
      <Fragment>
        {sections.map((v, k) => (
          <Accordion.Section {...props} key={k}>
            {(props: AccordionSectionChildrenProps) => (
              <Fragment>
                <Accordion.SectionHeader {...props}>{v.title}</Accordion.SectionHeader>
                <Accordion.SectionPanel {...props}>{props.expanded && v.description}</Accordion.SectionPanel>
              </Fragment>
            )}
          </Accordion.Section>
        ))}
      </Fragment>
    )}
  </Accordion.Root>
)

export const Styled = () => {
  return (
    <div className='max-w-lg rounded-md p-16 bg-gradient-to-br from-red-400 via-red-500 to-red-600'>
      <Accordion.Root className='flex flex-col rounded-md overflow-hidden bg-white divide-y divide-gray-100'>
        {(props) => (
          <Fragment>
            {sections.map((v, k) => (
              <Accordion.Section {...props} className='flex flex-col' key={k}>
                {(props) => (
                  <Fragment>
                    <Accordion.SectionHeader {...props} className='focus:outline-none focus:bg-gray-200 z-10'>
                      <div className='flex justify-between items-center p-6 space-x-6'>
                        <span className='font-medium'>{v.title}</span>
                        <motion.div animate={{ rotate: props.expanded ? 180 : 0 }}>
                          <KeyboardArrowDownRounded />
                        </motion.div>
                      </div>
                    </Accordion.SectionHeader>
                    <Accordion.SectionPanel {...props}>
                      <motion.div
                        animate={{ height: props.expanded ? 'auto' : 0 }}
                        className='overflow-hidden bg-gray-100'
                        initial={{ height: 0 }}
                        transition={{ type: 'linear' }}
                      >
                        <div className='p-6 text-sm'>{v.description}</div>
                      </motion.div>
                    </Accordion.SectionPanel>
                  </Fragment>
                )}
              </Accordion.Section>
            ))}
          </Fragment>
        )}
      </Accordion.Root>
    </div>
  )
}

export default {
  component: Accordion.Root,
  subcomponents: { Section: Accordion.Section, SectionHeader: Accordion.SectionHeader, SectionPanel: Accordion.SectionPanel },
  title: 'Components/Accordion'
} as Meta
