import fs from 'fs'
import path from 'path'
import { Reader } from '@maxmind/geoip2-node'
import { Request, Response, NextFunction } from 'express'

const dbPath = path.join(__dirname, '../utils/GeoLite2-Country.mmdb')
const dbBuffer = fs.readFileSync(dbPath)
const reader = Reader.openBuffer(dbBuffer)

export function geoipMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let ip: string | undefined

  const forwarded = req.headers['x-forwarded-for']
  console.log(`Forwarded is: ${forwarded}`)
  if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0]
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0]
  } else {
    ip = req.socket?.remoteAddress || undefined
  }

  if (ip?.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }
  console.log(`IP is: ${ip}`)

  try {
    const response = reader.country(ip || '')
    ;(req as any).country = response.country?.isoCode || null
  } catch {
    ;(req as any).country = null
  }

  next()
}
