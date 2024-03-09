export function handleFetchError(event: FetchEvent, error: any) {
  console.error(error)
  if (error instanceof Error) {
    event.respondWith(new Response(error.message, { status: 500 }))
  }
  event.respondWith(new Response('Unknown error', { status: 500 }))
}
