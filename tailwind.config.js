module.exports = {
  purge: ['stories'],
  darkMode: false,
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      opacity: ['active'],
      ringWidth: ['active', 'hover'],
      scale: ['active']
    }
  },
  plugins: []
}
