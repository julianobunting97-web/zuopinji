const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('C:/Users/Administrator/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp')
const out = path.join(__dirname, 'interior-updates-review')
const roots = {
  apartment: 'E:/桌面/作品集作品素材合集/单人公寓',
  family: 'E:/桌面/作品集作品素材合集/三口之家（诧寂风）',
}
const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;')
async function collect(root, current = '') {
  const files = []
  for (const entry of await fs.readdir(path.join(root, current), {withFileTypes:true})) {
    const relative = path.join(current, entry.name)
    if (entry.isDirectory()) files.push(...await collect(root, relative))
    else if (/\.(png|jpe?g)$/i.test(entry.name)) files.push(relative)
  }
  return files
}
async function main() {
  await fs.mkdir(out,{recursive:true})
  for (const [name, root] of Object.entries(roots)) {
    const files = await collect(root)
    const manifest = []
    for(let page = 0; page < files.length; page += 12) {
      const subset = files.slice(page, page+12)
      const cellW = 480, cellH = 345, columns = 3
      const composite = []
      for(const [i, rel] of subset.entries()) {
        const input = path.join(root,rel)
        const meta = await sharp(input).metadata()
        const buffer = await sharp(input).rotate().resize({width:cellW-16,height:cellH-54,fit:'inside',withoutEnlargement:true}).flatten({background:'#f1f1eb'}).png().toBuffer()
        const thumb = await sharp(buffer).metadata()
        const left = i%columns*cellW, top = Math.floor(i/columns)*cellH
        composite.push({input:buffer,left:left+Math.floor((cellW-thumb.width)/2),top:top+6})
        composite.push({input:Buffer.from(`<svg width="${cellW}" height="46"><rect width="100%" height="100%" fill="white"/><text x="9" y="18" font-family="Microsoft YaHei" font-size="13">${escape(rel)}</text><text x="9" y="36" font-family="Microsoft YaHei" font-size="12">${meta.width} × ${meta.height}</text></svg>`),left,top:top+cellH-46})
        manifest.push({relative:rel,width:meta.width,height:meta.height,bytes:(await fs.stat(input)).size})
      }
      const filename = path.join(out,`${name}-${page/12+1}.jpg`)
      await sharp({create:{width:columns*cellW,height:Math.ceil(subset.length/columns)*cellH,channels:3,background:'#eeeeea'}}).composite(composite).jpeg({quality:88}).toFile(filename)
      console.log(filename)
    }
    await fs.writeFile(path.join(out,`${name}-inventory.json`),JSON.stringify({root,images:manifest},null,2)+'\n')
  }
}
main().catch(e=>{console.error(e);process.exitCode=1})
