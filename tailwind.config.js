module.exports = {
  purge: ['stories/*.tsx'],
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
