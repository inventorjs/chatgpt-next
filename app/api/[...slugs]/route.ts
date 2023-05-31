import https from 'https'
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

  const response = await new Promise<Response>((resolve, reject) => {
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
      const response = new Response(stream)
      Object.entries(res.headers).forEach(([key, val]) => {
        if (key && val && typeof val === 'string') {
          response.headers.set(key, val)
        }
      })
      resolve(response)
    })
    request.write(JSON.stringify(body))
    request.end()
    request.on('error', (err) => {
      reject(err)
    })
  })
  return response
}

export const runtime = 'edge'
export const preferredRegion = ['hkg1']
