const fs = require('fs')

;(() => {
  let file, exports, out

  file = fs.readFileSync('./src/definitions/props.ts', 'utf8')
  exports = file.match(/export type [a-zA-Z]+/gm)
  out = `export {`

  exports
    .map((v) => v.replace('export type ', ''))
    .forEach((v) => {
      out += `\n  ${v} as Aria${v},`
    })

  out += `\n} from './definitions/props'`
  console.log(out)
})()
