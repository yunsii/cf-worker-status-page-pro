import React from 'react'
import { cls } from 'tagged-classnames-free'

import type { DataV1 } from '#src/worker/_helpers/store'

import { config } from '#src/config'
import { getHistoryDates } from '#src/worker/_helpers/datetime'
import { parseLocation } from '#src/helpers/locations'
import { Tooltip, TooltipContent, TooltipTrigger } from '#src/components/Tooltip'

export interface IMonitorPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: DataV1 | null
}

const MonitorPanel: React.FC<IMonitorPanelProps> = (props) => {
  const { data, ...restDivProps } = props

  if (!data || !data.monitorHistoryData || Object.keys(data).length === 0) {
    return <div>No Data</div>
  }

  const monitorIds = (Object.keys(data.monitorHistoryData) || [])
  const displayDays = config.settings.displayDays || 90
  const allOperational = data.lastUpdate?.checks.allOperational

  return (
    <div {...restDivProps}>
      <div className={cls`
        flex items-center justify-between rounded px-4 py-2 text-lg font-bold shadow-md
        ${allOperational ? 'border border-green-500 bg-green-300 text-green-800' : 'text-red-500'}
      `}
      >
        <div>
          {allOperational ? 'All Systems Operational' : 'Not All Systems Operational'}
        </div>
        {!!data.lastUpdate && (
          <div className='text-xs font-light'>
            checked
            {' '}
            {Math.round((Date.now() - data.lastUpdate.time) / 1000)}
            {' '}
            sec
            ago (from
            {' '}
            {parseLocation(data.lastUpdate.location)}
            )
          </div>
        )}
      </div>
      <ul className={cls`
        mt-4 flex flex-col gap-y-2
      `}
      >
        {monitorIds.map((item) => {
          return (
            <li key={item}>
              <h2>
                {config.monitors.find((monitorItem) => monitorItem.id === item)?.name || item}
              </h2>
              <ul className='flex gap-1'>
                {getHistoryDates(displayDays).map((dateItem) => {
                  const targetData = data.monitorHistoryData![item]

                  let color = cls`bg-gray-400`
                  const targetCheckData = targetData.checks.find((item) => item.date === dateItem)
                  if (targetCheckData) {
                    if (targetCheckData.fails === 0) {
                      color = cls`bg-green-500`
                    }
                    else {
                      const hasOperational = 'hasOperational' in targetCheckData ? targetCheckData.hasOperational : true
                      color = hasOperational ? cls`bg-orange-500` : cls`bg-red-500`
                    }
                  }

                  const itemWidth = `calc(100% / ${displayDays})`

                  return (
                    <Tooltip key={dateItem}>
                      <TooltipTrigger
                        as='li'
                        className='h-full'
                        style={{
                          width: itemWidth,
                        }}
                      >
                        <span
                          className={cls`
                            rounded
                            ${color} block
                          `}
                          style={{
                            height: 28,
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent className='whitespace-pre rounded p-2 opacity-90 shadow-lg backdrop-blur-lg'>
                        {targetCheckData ? JSON.stringify(targetCheckData, null, 2) : 'No Data'}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MonitorPanel
