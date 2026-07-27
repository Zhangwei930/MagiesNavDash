import http from 'node:http'
import { createWriteStream, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const PORT = Number(process.env.PORT || 8090)
const __dirname = dirname(fileURLToPath(import.meta.url))
const logDir = join(__dirname, 'logs')
mkdirSync(logDir, { recursive: true })
const logStream = createWriteStream(join(logDir, 'mail.log'), { flags: 'a' })

function log(line) {
  const row = `[${new Date().toISOString()}] ${line}\n`
  process.stdout.write(row)
  logStream.write(row)
}

function json(res, status, body) {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
  })
  res.end(payload)
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { status: 'ok', service: 'mail-gateway' })
  }

  if (req.method === 'POST' && req.url === '/api/send') {
    let raw = ''
    for await (const chunk of req) raw += chunk
    let data = {}
    try {
      data = JSON.parse(raw || '{}')
    } catch {
      return json(res, 400, { success: false, message: 'invalid json' })
    }

    const email = data.email
    const type = data.type || 'GENERIC'
    const subject = data.subject || 'Magies Hub'
    const body = data.body || ''

    if (!email) {
      return json(res, 400, { success: false, message: 'email required' })
    }

    // Phase1: 记录发送日志。若配置了 SMTP 环境变量可后续扩展真实发送。
    log(`SEND type=${type} to=${email} subject=${subject} body=${String(body).replace(/\n/g, ' | ')}`)

    return json(res, 200, {
      success: true,
      message: '邮件已受理（Mail Gateway）',
      provider: process.env.SMTP_HOST || 'log-only'
    })
  }

  json(res, 404, { success: false, message: 'not found' })
})

server.listen(PORT, () => {
  log(`Mail Gateway listening on :${PORT}`)
})
