const rc = <T>(fn: () => any, c: T): T => {
  fn()
  return c
}

export default rc
