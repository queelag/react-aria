const tcp = async <T, U extends Error = Error>(f: () => Promise<T>, v: boolean = true): Promise<T | U> => {
  try {
    return await f()
  } catch (e: any) {
    v && console.error(e)
    return e
  }
}

export default tcp
