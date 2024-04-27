import { cls } from 'tagged-classnames-free'

import MonitorPanel from './components/MonitorPanel'

import type { IndexPageData } from './+data'

import { usePageContext } from '#src/renderer/usePageContext'
import { config } from '#src/config'

export default function Page() {
  const { data: { allMonitors, kvData, filter } } = usePageContext<IndexPageData>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [searchValue, setSearchValue] = useState(filter || '')

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/' && !inputFocused) {
        event.stopPropagation()
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keyup', handler)

    return () => {
      window.removeEventListener('keyup', handler)
    }
  }, [inputFocused])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (searchValue.trim()) {
      url.searchParams.set('filter', searchValue)
      history.replaceState(null, '', url)
    }
    else {
      url.searchParams.delete('filter')
      history.replaceState(null, '', url)
    }
  }, [searchValue])

  return (
    <div className='container max-w-screen-xl pt-4'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src='/logo.svg' className='size-10' />
          <h1 className='text-3xl'>{config.settings.title}</h1>
        </div>
        <div>
          <input
            ref={inputRef}
            value={searchValue}
            onChange={((event) => {
              setSearchValue(event.target.value)
            })}
            onKeyUp={(event) => {
              if (event.key.toLowerCase() === 'escape') {
                event.stopPropagation()
                event.preventDefault()
                setSearchValue('')
                inputRef.current?.blur()
              }
            }}
            onFocus={() => {
              setInputFocused(true)
            }}
            onBlur={() => {
              setInputFocused(false)
            }}
            className={cls`
              h-10 rounded-full border px-4 shadow outline-none
              transition-all focus:border-cyan-400
            `}
            placeholder='Type "/" to search'
          />
        </div>
      </header>
      <main>
        <MonitorPanel
          allMonitors={allMonitors}
          data={kvData}
          className={cls`mt-4`}
          search={searchValue}
        />
      </main>
      <footer className='mt-4 flex justify-between'>
        <span>
          Powered by
          {' '}
          <a href='https://workers.cloudflare.com/' target='_blank' rel='noreferrer'>
            Cloudflare Workers
          </a>
          {' '}
          &
          {' '}
          <a href='https://vike.dev/' target='_blank' rel='noreferrer'>
            Vike
          </a>
        </span>
        <a
          href='https://github.com/yunsii/cf-worker-status-page-pro'
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-1'
        >
          <span className='i-ic--outline-star size-4 animate-bounce' />
          Get your status page
        </a>
      </footer>
    </div>
  )
}
