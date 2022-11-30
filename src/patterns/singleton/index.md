---
name: 싱글톤 패턴
---

# 싱글톤 패턴

(OOP의 개념에서) 싱글톤이란 어떤 클래스의 인스턴스가 단 1개만 존재하는 것으로, 직접적으로 `new` 연산자 등을 통해 새 인스턴스를 메모리에 할당하는 것이 아닌, 클래스 로드 시점에 만들어진 인스턴스 1개를 공유하는 것을 말한다. 경우에 따라 클래스 로드 시점이 아닌 클래스 내 인스턴스 반환 함수 작성시 인스턴스가 생성되어 있지 않았을 때, 새로이 인스턴스를 반환하는 형태로 구현할 수도 있다.

```typescript
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
```

위 예제는 클래스가 불러와지는 시점에 인스턴스를 생성하므로 인스턴스가 메모리에 할당되는 시점이 클래스 로드 시점이다.

```typescript
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
```

반면 위 예제는 인스턴스가 메모리에 할당되는 시점은 `getInstance` 첫 메서드 호출시에 할당된다. 인스턴스가 사용되지 않을 케이스도 고려한다면 아래 예제가 메모리를 더 적게 잡아먹는다고 볼 수 있다.

```typescript
const preSingleton = PreSingleton.getInstance()
const singleton = Singleton.getInstnace()

console.log(`${preSingleton.getName()} ${singleton.getName()}`)
// PreSingleton Singleton
```

두 클래스 모두 `getInstance` 메서드를 호출하여 인스턴스를 가져올 수 있는 것을 확인할 수 있다.

## 장점

## 단점
