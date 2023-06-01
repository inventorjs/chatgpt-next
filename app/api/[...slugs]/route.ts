import { NextRequest } from 'next/server';
import { headers as NextHeders } from 'next/headers'

const baseURL = 'https://api.openai.com/'

export async function POST(request: NextRequest, { params }: { params: { slugs: string[] } }) {
  const { slugs } = params
  const apiPath = slugs.join('/')
  const headers = Object.fromEntries(NextHeders())
  const urlObj = new URL(`${baseURL}${apiPath}`)
  const { authorization = '', ['content-type']: contentType = 'application/json' } = headers

  const response = await fetch(urlObj.toString(), {
    method: 'post',
    headers: {
      'content-type': contentType,
      authorization,
    },
    body: await request.text(),
  })
  return response
}

export const runtime = 'edge'
export const preferredRegion = ['hkg1']
