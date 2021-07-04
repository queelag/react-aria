import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  external: ['@popperjs/core', '@queelag/core', '@queelag/react-core', 'lodash', 'react', 'react-dom', 'react-popper'],
  input: 'src/index.ts',
  plugins: [terser(), typescript()],
  output: {
    file: 'dist/index.js',
    format: 'esm'
  }
}
