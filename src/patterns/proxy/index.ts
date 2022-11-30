const home = {
  location: 'Seoul',
  createdAt: 1997,
  name: '와르르맨션'
}

const proxy = new Proxy(home, {
  get (obj, prop) {
    console.log('getter:', obj, prop)
  },
  set (obj, prop, value) {
    console.log('setter:', obj, prop, value)
    return true
  }
})

proxy.name = '억장와르르맨션'
console.log(proxy.name)