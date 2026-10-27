// Fail locally before Cloudflare rejects an oversized deployment asset.
const fs = require('node:fs/promises')
const path = require('node:path')

const output = path.resolve(__dirname, '../dist')
const maxBytes = 25 * 1024 * 1024
const maxFiles = 20000

async function main() {
  let count = 0
  let largest = { name: '', size: 0 }
  const errors = []

  async function inspect(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        await inspect(filename)
      } else if (entry.isFile()) {
        const { size } = await fs.stat(filename)
        const name = path.relative(output, filename).split(path.sep).join('/')
        count += 1
        if (size > largest.size) largest = { name, size }
        if (size > maxBytes) errors.push(`${name}: ${(size / 1024 / 1024).toFixed(2)} MiB exceeds 25 MiB`)
      }
    }
  }

  await inspect(output)
  if (count > maxFiles) errors.push(`${count} files exceeds the Pages Free plan limit of ${maxFiles}`)
  if (errors.length) throw new Error(`Cloudflare Pages asset validation failed:\n${errors.join('\n')}`)
  console.log(`Pages assets OK: ${count} files; largest ${(largest.size / 1024 / 1024).toFixed(2)} MiB (${largest.name}).`)
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
