const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')

const source = 'E:/桌面/作品集作品素材合集/人民公园'
const out = path.resolve(__dirname, 'people-park-review')
const escapeXml = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')

async function sheet(files, name, columns = 4, width = 360, height = 245) {
  const composites = []
  for (const [index, relative] of files.entries()) {
    const input = path.join(source, relative)
    const meta = await sharp(input).metadata()
    const thumb = await sharp(input).rotate().resize({ width: width - 16, height: height - 48, fit: 'inside', withoutEnlargement: true }).flatten({ background: '#eee' }).png().toBuffer()
    const thumbMeta = await sharp(thumb).metadata()
    const left = index % columns * width
    const top = Math.floor(index / columns) * height
    composites.push({ input: thumb, left: left + Math.floor((width - thumbMeta.width) / 2), top: top + 5 })
    const label = `${relative} (${meta.width} × ${meta.height})`
    composites.push({ input: Buffer.from(`<svg width="${width}" height="42"><rect width="100%" height="100%" fill="white"/><text x="9" y="17" font-family="Microsoft YaHei" font-size="12">${escapeXml(label.slice(0, 46))}</text><text x="9" y="34" font-family="Microsoft YaHei" font-size="11">${escapeXml(label.slice(46))}</text></svg>`), left, top: top + height - 42 })
  }
  const output = path.join(out, name + '.jpg')
  await sharp({ create: { width: columns * width, height: Math.ceil(files.length / columns) * height, channels: 3, background: '#eeeeea' } }).composite(composites).jpeg({ quality: 86 }).toFile(output)
  console.log(output)
}

async function main() {
  await fs.mkdir(out, { recursive: true })
  const photos = (await fs.readdir(path.join(source, '摄影图'))).filter(x => /\.(png|jpe?g)$/i.test(x)).sort((a,b) => a.localeCompare(b, 'zh-CN', { numeric: true })).map(x => '摄影图/' + x)
  await sheet(photos.slice(0,16), 'photos-01')
  await sheet(photos.slice(16), 'photos-02')
  await sheet(['展板/1.jpg','展板/2.jpg','平面图5.jpeg','中心区域1.png','入口.jpeg','下沉瀑布.jpeg','骑行区.png','亲子乐园.jpeg','湖泊.jpeg','运动场1.jpeg','立面图.png','output/pdf/人民公园_A2竞赛展板/01_总体策略_A2_300dpi.png','output/pdf/人民公园_A2竞赛展板/02_节点体验_A2_300dpi.png'], 'boards-and-key-views', 3, 480, 345)
}
main().catch(error => { console.error(error); process.exitCode = 1 })
