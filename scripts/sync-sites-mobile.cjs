// Copy only the site's runtime assets into its isolated publishing checkout.
const fs = require('node:fs/promises')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const checkoutName = process.argv[2] || '.sites-mobile'
if (!['.sites-mobile', '.sites-release'].includes(checkoutName)) {
  throw new Error('Expected .sites-mobile or .sites-release checkout')
}
const checkout = path.join(root, checkoutName)

async function copy(relative) {
  const from = path.join(root, relative)
  const to = path.join(checkout, relative)
  await fs.mkdir(path.dirname(to), { recursive: true })
  await fs.copyFile(from, to)
}

async function walk(directory) {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(filename))
    else files.push(filename)
  }
  return files
}

async function main() {
  const manifest = JSON.parse(await fs.readFile(path.join(checkout, '.openai/hosting.json'), 'utf8'))
  if (manifest.project_id !== 'appgprj_6ab38027664c8191b93fa378a6baab0e') {
    throw new Error('The publishing checkout belongs to a different Site')
  }
  const sourceFiles = (await walk(path.join(root, 'src')))
    .map(file => path.relative(root, file))
    .filter(file => !file.startsWith(`src${path.sep}assets${path.sep}`))
  const portfolioFiles = (await walk(path.join(root, 'public/portfolio')))
    .filter(file => /\.(preview|full)\.webp$|\.mp4$/i.test(file))
    .map(file => path.relative(root, file))

  // Native video posters use JPEG URLs rather than the gallery's WebP copies.
  const posters = new Set()
  for (const relative of sourceFiles.filter(file => /\.[jt]sx?$/.test(file))) {
    const code = await fs.readFile(path.join(root, relative), 'utf8')
    for (const match of code.matchAll(/poster:\s*['"](\/portfolio\/[^'"]+)['"]/g)) {
      posters.add(`public${match[1]}`)
    }
  }

  const files = [
    'index.html', 'package.json', 'package-lock.json', 'vite.config.js',
    'public/favicon.svg', 'public/_redirects', 'public/fonts/Anurati-Regular.otf',
    'src/assets/hero-background.mp4', 'scripts/check-pages-assets.cjs',
    ...sourceFiles, ...portfolioFiles, ...posters,
  ]
  const full = portfolioFiles.filter(file => file.endsWith('.full.webp')).length
  const preview = portfolioFiles.filter(file => file.endsWith('.preview.webp')).length
  if (!full || preview < full) throw new Error(`Missing web images: ${full} full, ${preview} previews`)
  for (const file of portfolioFiles.filter(file => file.endsWith('.full.webp'))) {
    if (!portfolioFiles.includes(file.replace(/\.full\.webp$/, '.preview.webp'))) {
      throw new Error(`Missing preview image for ${file}`)
    }
  }
  for (const relative of files) await copy(relative)
  const videos = portfolioFiles.filter(file => file.endsWith('.mp4')).length
  console.log(`Synchronized ${files.length} source and asset files (${full} full-size images, ${preview} previews, ${videos} videos, ${posters.size} native posters).`)
}

main().catch(error => { console.error(error); process.exitCode = 1 })
