const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require(process.argv[2] || 'sharp')
const sourceRoot = path.resolve(process.argv[3] || 'E:/桌面/作品集作品素材合集')
const websiteRoot = path.resolve(__dirname, '..')
const publicRoot = path.join(websiteRoot, 'public/portfolio')
const sources = {
  apartment: path.join(sourceRoot, '单人公寓'),
  family: path.join(sourceRoot, '三口之家（诧寂风）'),
}
const newFiles = [
  ['apartment', '白模图/客厅白模_6.png', 'single-apartment/process/living-white-model.png'],
  ['apartment', '白模图/电竞白模.png', 'single-apartment/process/gaming-white-model.png'],
  ['apartment', '平面图/彩平图3.jpeg', 'single-apartment/diagrams/floor-plan.jpeg'],
  ['apartment', '平面图/功能分区.png', 'single-apartment/diagrams/zoning.png'],
  ['apartment', '材质分析/客厅.jpeg', 'single-apartment/diagrams/living-materials.jpeg'],
  ['apartment', '材质分析/厨房.jpeg', 'single-apartment/diagrams/kitchen-materials.jpeg'],
  ['family', '平面分析/彩平.jpeg', 'family-home/diagrams/floor-plan.jpeg'],
  ['family', '平面分析/功能分区.jpeg', 'family-home/diagrams/zoning.jpeg'],
  ['family', '平面分析/动线.jpeg', 'family-home/diagrams/circulation.jpeg'],
  ['family', '平面分析/轴测分析.jpeg', 'family-home/diagrams/axonometric.jpeg'],
  ['family', '材料分析/AI室内大师_1767624476593.jpeg', 'family-home/diagrams/living-materials.jpeg'],
  ['family', '材料分析/AI室内大师_1768057521524.jpeg', 'family-home/diagrams/kitchen-materials.jpeg'],
  ['family', '材料分析/image_1767020498489452.jpg', 'family-home/diagrams/bedroom-materials.jpg'],
  ['family', '材料分析/AI室内大师_1767624808675.jpeg', 'family-home/diagrams/studio-materials.jpeg'],
  ['family', '材料分析/AI室内大师_1767625242515.jpeg', 'family-home/diagrams/bathroom-materials.jpeg'],
  ['family', '平面分析/展板展示.jpg', 'family-home/boards/presentation.jpg'],
]
const existingFiles = [
  ['apartment','效果图/客厅.png','single-apartment/renders/render-01.png'],
  ['apartment','效果图/厨房.jpeg','single-apartment/renders/render-02.jpeg'],
  ['apartment','效果图/电竞房.jpeg','single-apartment/renders/render-03.jpeg'],
  ['apartment','效果图/厨房摄影1.png','single-apartment/renders/photo-kitchen-01.png'],
  ['apartment','效果图/客厅摄影1.png','single-apartment/renders/photo-living-01.png'],
  ['apartment','效果图/客厅摄影2.png','single-apartment/renders/photo-living-02.png'],
  ['apartment','效果图/客厅摄影3.png','single-apartment/renders/photo-living-03.png'],
  ['apartment','效果图/客厅摄影4.png','single-apartment/renders/photo-living-04.png'],
  ['apartment','效果图/电竞房摄影1.png','single-apartment/renders/photo-gaming-01.png'],
  ['family','效果图/客厅1.jpeg','family-home/renders/render-01.jpeg'],
  ['family','效果图/餐厅2.jpeg','family-home/renders/render-02.jpeg'],
  ['family','效果图/直播间.png','family-home/renders/render-03.png'],
  ['family','效果图/老年房间.png','family-home/renders/render-04.png'],
  ['family','效果图/卫生间.png','family-home/renders/render-05.png'],
]
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
async function main() {
  const records = []
  for (const [project, source, target] of [...existingFiles, ...newFiles]) {
    const input = path.join(sources[project], source)
    const output = path.join(publicRoot, target)
    const preview = output.replace(/\.(png|jpe?g)$/i, '.preview.webp')
    const full = output.replace(/\.(png|jpe?g)$/i, '.full.webp')
    const bytes = await fs.readFile(input)
    const sourceHash = hash(bytes)
    const currentHash = await fs.readFile(output).then(hash).catch(e => {if(e.code === 'ENOENT') return null; throw e})
    const unchanged = currentHash === sourceHash
    const derivedExist = await Promise.all([preview, full].map(p => fs.access(p).then(()=>true).catch(()=>false)))
    if (!unchanged || derivedExist.some(x => !x)) {
      await fs.mkdir(path.dirname(output), {recursive:true})
      await fs.copyFile(input, output)
      await sharp(bytes).rotate().resize({width:1600,withoutEnlargement:true}).webp({quality:86,effort:4}).toFile(preview)
      await sharp(bytes).rotate().webp({quality:/diagrams|boards/.test(target)?95:91,effort:4}).toFile(full)
    }
    const originalMeta = await sharp(bytes).metadata()
    const fullMeta = await sharp(full).metadata()
    const width = [5,6,7,8].includes(originalMeta.orientation) ? originalMeta.height : originalMeta.width
    const height = [5,6,7,8].includes(originalMeta.orientation) ? originalMeta.width : originalMeta.height
    if (fullMeta.width !== width || fullMeta.height !== height) throw Error(`Full-size dimensions changed: ${source}`)
    if (hash(await fs.readFile(input)) !== sourceHash) throw Error(`Source changed: ${source}`)
    if (hash(await fs.readFile(output)) !== sourceHash) throw Error(`Copy mismatch: ${source}`)
    records.push({project,source,target,sha256:sourceHash,width,height,unchanged,previewBytes:(await fs.stat(preview)).size,fullBytes:(await fs.stat(full)).size})
  }
  const review = path.join(websiteRoot,'tmp/interior-updates-review')
  await fs.mkdir(review,{recursive:true})
  await fs.writeFile(path.join(review,'asset-manifest.json'),JSON.stringify({sourceRoot,images:records},null,2)+'\n')
  console.log(`Verified ${records.length} images: ${records.filter(r=>r.unchanged).length} existing images unchanged; ${records.filter(r=>!r.unchanged).length} added or updated. Source hashes, copies and full-size dimensions verified.`)
}
main().catch(e=>{console.error(e);process.exitCode=1})
