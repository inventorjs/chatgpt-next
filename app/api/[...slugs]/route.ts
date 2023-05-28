import https from 'node:https'
import { NextRequest } from 'next/server';
import { headers as NextHeders } from 'next/headers'

const baseURL = 'https://api.openai.com:443/'

export async function POST(request: NextRequest, { params }: { params: { slugs: string[] } }) {
  const { slugs } = params
  const apiPath = slugs.join('/')
  const body = await request.json()
  const headers = Object.fromEntries(NextHeders())
  const urlObj = new URL(`${baseURL}${apiPath}`)
  const { authorization = '', ['content-type']: contentType = 'application/json' } = headers

  const stream = await new Promise<ReadableStream>((resolve, reject) => {
    const request = https.request({
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'post',
      headers: {
        'content-type': contentType,
        authorization,
      },
    }, (res) => {
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          res.on('data', (chunk) => {
            controller.enqueue(encoder.encode(chunk))
          })
          res.on('end', () => {
            controller.close()
          })
        },
      })
      resolve(stream)
    })
    request.write(JSON.stringify(body))
    request.end()
    request.on('error', (err) => {
      reject(err)
    })
  })
  return new Response(stream)
}
