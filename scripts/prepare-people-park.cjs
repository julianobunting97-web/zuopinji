// Derive web assets from the supplied project, leaving the source folder untouched.
const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require(process.argv[2] || 'sharp')
const sourceRoot = path.resolve(process.argv[3] || 'E:/桌面/作品集作品素材合集/人民公园')
const websiteRoot = path.resolve(__dirname, '..')
const targetRoot = path.join(websiteRoot, 'public/portfolio')
const files = [
  ['中心区域1.png', 'people-park-cover.jpg'],
  ['展板/1.jpg', 'people-park/boards/board-01.jpg'],
  ['展板/2.jpg', 'people-park/boards/board-02.jpg'],
  ['中心区域1.png', 'people-park/renders/central-core.jpg'],
  ['建筑学长_1789529538750.png', 'people-park/renders/aerial-view.jpg'],
  ['入口.jpeg', 'people-park/renders/entrance.jpg'],
  ['下沉瀑布.jpeg', 'people-park/renders/water-garden.jpg'],
  ['湖泊.jpeg', 'people-park/renders/lakeside.jpg'],
  ['亲子乐园.jpeg', 'people-park/renders/playground.jpg'],
  ['骑行区.png', 'people-park/renders/pump-track.jpg'],
  ['运动场1.jpeg', 'people-park/renders/sports-courts.jpg'],
  ['摄影图/19.png', 'people-park/renders/sports-night.jpg'],
  ['建筑学长_1789360816743.jpeg', 'people-park/renders/under-canopy-play.jpg'],
  ['摄影图/01.png', 'people-park/renders/waterfall-fern.jpg'],
  ['摄影图/02.png', 'people-park/renders/waterfall-close.jpg'],
  ['摄影图/03.png', 'people-park/renders/stream.jpg'],
  ['摄影图/04.png', 'people-park/renders/lake-pavilion.jpg'],
  ['摄影图/05.png', 'people-park/renders/wetland-walk.jpg'],
  ['摄影图/06.png', 'people-park/renders/sculpture-01.jpg'],
  ['摄影图/07.png', 'people-park/renders/sculpture-02.jpg'],
  ['摄影图/08.png', 'people-park/renders/playground-aerial.jpg'],
  ['摄影图/09.png', 'people-park/renders/splash-play.jpg'],
  ['摄影图/10.jpeg', 'people-park/renders/climbing-play.jpg'],
  ['摄影图/11.png', 'people-park/renders/cycling.jpg'],
  ['摄影图/12.png', 'people-park/renders/skating.jpg'],
  ['摄影图/13.png', 'people-park/renders/play-details.jpg'],
  ['摄影图/14.png', 'people-park/renders/rest-details.jpg'],
  ['摄影图/15.png', 'people-park/renders/entrance-details.jpg'],
  ['摄影图/16.png', 'people-park/renders/sculpture-overlook.jpg'],
  ['平面图5.jpeg', 'people-park/diagrams/master-plan.jpg'],
  ['立面图.png', 'people-park/diagrams/core-section.jpg'],
]
const diagramFolder = 'output/pdf/人民公园_A2竞赛展板/独立分析图'
const diagrams = [
  ['01_省市区位分析.png', 'location'],
  ['02_场地界面分析.png', 'site-boundary'],
  ['03_功能分区分析.png', 'zoning'],
  ['04_空间结构分析.png', 'structure'],
  ['05_慢行游线分析.png', 'circulation'],
  ['06_蓝绿系统分析.png', 'blue-green'],
  ['07_核心空间关系剖意.png', 'spatial-section'],
  ['08_核心分层分析.png', 'core-layers'],
  ['09_滨水生态策略.png', 'waterfront'],
  ['10_亲子节点分析.png', 'family-play'],
  ['11_分时共享活动.png', 'shared-use'],
]
files.push(...diagrams.map(([file, slug]) => [`${diagramFolder}/${file}`, `people-park/diagrams/${slug}.jpg`]))
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex')

async function main() {
  const manifest = []
  for (const [source, target] of files) {
    const input = path.join(sourceRoot, source)
    const output = path.join(targetRoot, target)
    const full = output.replace(/\.jpg$/, '.full.webp')
    const preview = output.replace(/\.jpg$/, '.preview.webp')
    const inputBytes = await fs.readFile(input)
    const meta = await sharp(inputBytes).metadata()
    await fs.mkdir(path.dirname(output), { recursive: true })
    await sharp(inputBytes).rotate().webp({ quality: /boards|diagrams/.test(target) ? 94 : 91, effort: 4 }).toFile(full)
    await sharp(inputBytes).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 84, effort: 4 }).toFile(preview)
    // Keep a JPEG fallback for direct URLs and native video posters.
    await sharp(inputBytes).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 88, mozjpeg: true }).toFile(output)
    const fullMeta = await sharp(full).metadata()
    if (fullMeta.width !== meta.width || fullMeta.height !== meta.height) throw new Error(`Full image dimensions changed: ${source}`)
    if (hash(await fs.readFile(input)) !== hash(inputBytes)) throw new Error(`Source changed: ${source}`)
    manifest.push({ source, target, width: meta.width, height: meta.height, sha256: hash(inputBytes), fullBytes: (await fs.stat(full)).size, previewBytes: (await fs.stat(preview)).size })
  }
  const review = path.join(websiteRoot, 'tmp/people-park-review')
  await fs.mkdir(review, { recursive: true })
  await fs.writeFile(path.join(review, 'asset-manifest.json'), JSON.stringify({ sourceRoot, files: manifest }, null, 2) + '\n')
  console.log(`Prepared ${manifest.length} assets; source hashes and full-size image dimensions verified.`)
}
main().catch(error => { console.error(error); process.exitCode = 1 })
