import { cls } from 'tagged-classnames-free'
import React from 'react'

import Empty from './Empty'

import type { DataV1 } from '#src/worker/_helpers/store'
import type { Monitor } from '#src/types'

import { getDisplayDays, getHistoryDates } from '#src/worker/_helpers/datetime'
import { parseLocation } from '#src/helpers/locations'
import { Tooltip, TooltipContent, TooltipTrigger } from '#src/components/Tooltip'
import { getChecksItemRenderStatus, getTargetDateChecksItem } from '#src/helpers/checks'

export interface IMonitorPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  allMonitors: Monitor[]
  data?: DataV1 | null
  search?: string
}

const MonitorPanel: React.FC<IMonitorPanelProps> = (props) => {
  const { allMonitors, data, search, ...restDivProps } = props

  if (allMonitors.length === 0) {
    return (
      <Empty>
        No monitors
      </Empty>
    )
  }

  if (!data || !data.monitorHistoryData || Object.keys(data).length === 0) {
    return (
      <Empty>
        <span className='i-svg-spinners--ring-resize mr-1 size-5' />
        No Data (
        {allMonitors.length}
        {' '}
        monitor(s))
      </Empty>
    )
  }

  const monitorIds = (Object.keys(data.monitorHistoryData) || [])
  const allOperational = data.lastUpdate?.checks.allOperational

  const titleCls = allOperational ? cls`border-green-500 bg-green-300 text-green-800` : cls`border-red-500 bg-red-300 text-red-800`
  return (
    <div {...restDivProps}>
      <div
        className={cls`
          flex items-center justify-between rounded border px-4 py-2 text-lg font-bold shadow-md
          ${titleCls}
        `}
        onDoubleClick={() => {
          // eslint-disable-next-line no-console
          console.log('allMonitors', allMonitors)
          // eslint-disable-next-line no-console
          console.log('data', data)
        }}
      >
        <div>
          {allOperational ? 'All Systems Operational' : 'Not All Systems Operational'}
        </div>
        {!!data.lastUpdate && (
          <div className='text-xs font-light' suppressHydrationWarning title={new Date(data.lastUpdate.time).toLocaleString()}>
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
        {monitorIds.filter((item) => {
          const targetMonitor = allMonitors.find((monitorItem) => monitorItem.id === item)
          const title = targetMonitor?.name || item
          const keyword = search?.trim().toLowerCase()
          if (!keyword) {
            return true
          }

          const searchFields = [title, targetMonitor?.id, targetMonitor?.description]

          return searchFields.filter(Boolean).some((item) => item!.includes(keyword))
        }).map((item) => {
          const monitorData = data.monitorHistoryData![item]
          const monitorConfig = allMonitors.find((monitorItem) => monitorItem.id === item)
          const targetMonitor = allMonitors.find((monitorItem) => monitorItem.id === item)
          const title = targetMonitor?.name || item

          const lastCheckInfo = [{
            key: 'Last Check Time',
            value: monitorData.lastCheck.time ? new Date(monitorData.lastCheck.time).toLocaleString() : null,
          }, {
            key: 'Last Check Operational',
            value: monitorData.lastCheck.operational.toString(),
          }, {
            key: 'Last Check Status',
            value: `${monitorData.lastCheck.status} / ${monitorData.lastCheck.statusText}`,
          }]

          const info = [
            ...(monitorConfig
              ? [
                  { key: 'Description', value: monitorConfig?.description },
                  {
                    key: 'Method',
                    value: (monitorConfig.method || 'GET').toUpperCase(),
                  },
                  {
                    key: 'URL',
                    value: monitorConfig.url,
                  },
                  {
                    key: 'Expect Status',
                    value: monitorConfig.expectStatus || 200,
                  },
                  {
                    key: 'Follow Redirect',
                    value: (monitorConfig.followRedirect || false).toString(),
                  },
                ]
              : []),
            { key: 'First Check', value: monitorData.firstCheck },
            ...lastCheckInfo,
          ].filter((item) => !(typeof item.value === 'undefined' || item.value === null)) as {
            key: string
            value: string | number
          }[]

          return (
            <li key={item} className={cls`[&:not(:last-child)]:mb-2`}>
              <div className='mb-1 flex items-center gap-2'>
                <h2 className='text-slate-950'>
                  {title}
                </h2>
                {!!info.length && (
                  <Tooltip>
                    <TooltipTrigger className={cls` size-5 text-slate-500`}>
                      <span className={cls`i-ic--outline-info size-full`} />
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
                            <span className={cls`font-semibold after:content-[':_']`}>
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
                {monitorConfig
                && (!monitorConfig.method || monitorConfig.method.toUpperCase() === 'GET')
                && (
                  <a
                    className='i-ic--outline-open-in-new size-5 text-slate-500 hover:text-slate-400'
                    href={monitorConfig.url}
                    target='_blank'
                    rel='noreferrer'
                    title='Open in new tab'
                  >
                    <span className='sr-only'>{title}</span>
                  </a>
                )}
              </div>
              <ul className='flex gap-1'>
                {getHistoryDates().map((dateItem) => {
                  const targetDateChecksItem = getTargetDateChecksItem(monitorData, dateItem)
                  const renderStatus = getChecksItemRenderStatus(monitorData, dateItem)

                  let color = cls`bg-gray-300`
                  let textColor = cls`text-gray-300`
                  let statusStr: React.ReactNode = null

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
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    case 'has-incident':
                      color = cls`bg-yellow-500`
                      textColor = cls`text-yellow-500`
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    default:
                      break
                  }

                  const itemWidth = `calc(100% / ${getDisplayDays()})`

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
                            rounded transition-all hover:opacity-70
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
                        <div className='font-semibold'>{dateItem}</div>
                        {statusStr && <div className={cls`${textColor} font-semibold`}>{statusStr}</div>}
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
                                  <span className='font-semibold'>
                                    {(stat.totalMs / stat.count).toFixed(0)}
                                  </span>
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
