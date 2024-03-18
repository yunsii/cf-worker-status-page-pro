import React from 'react'
import { cls } from 'tagged-classnames-free'

import type { DataV1 } from '#src/worker/_helpers/store'

import { config } from '#src/config'
import { getHistoryDates } from '#src/worker/_helpers/datetime'
import { parseLocation } from '#src/helpers/locations'
import { Tooltip, TooltipContent, TooltipTrigger } from '#src/components/Tooltip'
import { getChecksItemRenderStatus, getTargetDateChecksItem } from '#src/helpers/checks'

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

  const titleCls = allOperational ? cls`border-green-500 bg-green-300 text-green-800` : cls`border-red-500 bg-red-300 text-red-800`
  return (
    <div {...restDivProps}>
      <div className={cls`
        flex items-center justify-between rounded border px-4 py-2 text-lg font-bold shadow-md
        ${titleCls}
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
          const monitorData = data.monitorHistoryData![item]
          const monitorConfig = config.monitors.find((monitorItem) => monitorItem.id === item)
          const info = [
            { key: 'Description', value: monitorConfig?.description },
            { key: 'First Check', value: monitorData.firstCheck },
          ].filter((item) => !!item.value)

          return (
            <li key={item}>
              <div className='flex items-center'>
                <h2>
                  {config.monitors.find((monitorItem) => monitorItem.id === item)?.name || item}
                </h2>
                {!!info.length && (
                  <Tooltip>
                    <TooltipTrigger className={cls`size-6`}>
                      ❔
                    </TooltipTrigger>
                    <TooltipContent
                      as='ul'
                      className={cls`
                        list-none whitespace-pre rounded p-2
                        shadow-lg backdrop-blur-lg
                      `}
                    >
                      {info.map((item) => {
                        return (
                          <li key={item.key}>
                            <span className={cls`after:content-[':_']`}>
                              {item.key}
                            </span>
                            <span>
                              {item.value}
                            </span>
                          </li>
                        )
                      })}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <ul className='flex gap-1'>
                {getHistoryDates(displayDays).map((dateItem) => {
                  const targetDateChecksItem = getTargetDateChecksItem(monitorData, dateItem)
                  const renderStatus = getChecksItemRenderStatus(monitorData, dateItem)

                  let color = cls`bg-gray-300`
                  let textColor = cls`text-gray-300`
                  let statusStr: string | null = null

                  switch (renderStatus) {
                    case 'all-good':
                      color = cls`bg-green-500`
                      textColor = cls`text-green-500`
                      statusStr = 'All good'
                      break
                    case 'all-incidents':
                      color = cls`bg-red-700`
                      textColor = cls`text-red-700`
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    case 'latest-incident':
                      color = cls`bg-red-500`
                      textColor = cls`text-red-500`
                      statusStr = `Latest incident`
                      break
                    case 'has-incident':
                      color = cls`bg-yellow-500`
                      textColor = cls`text-yellow-500`
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    default:
                      break
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
                      <TooltipContent className={cls`
                        whitespace-pre rounded p-2 text-center text-sm
                        shadow-lg backdrop-blur-lg
                      `}
                      >
                        <div>{dateItem}</div>
                        {statusStr && <div className={cls`${textColor} font-bold`}>{statusStr}</div>}
                        <div />
                        {targetDateChecksItem
                          ? Object.keys(targetDateChecksItem.stats).map((item) => {
                            const stat = targetDateChecksItem.stats[item]
                            return (
                              <div key={item}>
                                <span className={cls`after:content-[':_']`}>
                                  {parseLocation(item)}
                                </span>
                                <span>
                                  {(stat.totalMs / stat.count).toFixed(0)}
                                  ms
                                </span>
                              </div>
                            )
                          })
                          : (
                            <div>No Data</div>
                            )}
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
