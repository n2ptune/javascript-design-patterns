class PreSingleton {
  private static _instance = new PreSingleton()

  private constructor() {}

  public static getInstance() {
    return this._instance
  }

  public getName() {
    return PreSingleton.name
  }
}

class Singleton {
  private static _instance: Singleton

  private constructor() {}

  public static getInstnace() {
    if (!this._instance) {
      this._instance = new Singleton()
    }

    return this._instance
  }

  public getName() {
    return Singleton.name
  }
}

const preSingleton = PreSingleton.getInstance()
const singleton = Singleton.getInstnace()

console.log(`${preSingleton.getName()} ${singleton.getName()}`)