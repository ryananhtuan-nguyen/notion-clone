import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Price } from './supabase/supabase.types'
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency || undefined,
    minimumFractionDigits: 0,
  }).format((price?.unitAmount || 0) / 100)
  return priceString
}

export const getURL = () => {
  let url = process?.env?.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/'

  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const postData = async ({
  url,
  data,
}: {
  url: string
  data?: { price: Price }
}) => {
  const res: Response = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    console.log('Error in postData', { url, data, res })
    throw Error(res.statusText)
  }
  return res.json()
}

export const toDateTime = (secs: number) => {
  var t = new Date('1970-01-01T00:30:00Z')
  t.setSeconds(secs)
  return t
}

export function constructMetadata({
  title = 'Cypress - Your workspace, perfected',
  description = 'Create and collaborate in your workspace has never been easier',
  image = '/appBanner.png',
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL(
      'https://notion-clone-production-90f7.up.railway.app/'
    ),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
