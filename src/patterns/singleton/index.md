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

## 장단점

위 섹션에서 정리했듯이 **메모리를 절약하는 것**이 싱글톤 패턴의 장점이라고 볼 수 있다. 그리고 데이터 공유가 쉽다고 정리했는데, 이 경우 장점이 될 수도 혹은 취약점(단점)으로 작용할 수 있다. 보는 관점에따라, 전역적으로 인스턴스에 접근하는 것을 **안티 패턴**으로 간주하곤 한다. 전역적으로 접근할 수 있다는 건, 어떠한 파일 혹은 어떠한 모듈에서나 접근할 수 있다는 건데, 디버깅이 쉽지 않으며 인스턴스의 메서드가 외부로부터 값을 받아 자기 자신을 수정하려 하거나, 인스턴스 내 어떤 값을 수정하려 할 때 어디서 해당 메서드를 호출했는지에 대한 투명성이 보장되지 않는다.

전역적으로 접근할 수 있다는 것에 대해 프론트엔드와 관련 지어 생각해보면, React의 `Context`나, Vue의 `Vuex`를 보면 상태 관리를 위해 전역적으로 기능 및 외부 라이브러리를 사용하는데, 이러한 기능을 사용할 때와 같은 장단점이 있을 것이라 생각한다. `Vuex`의 경우 스토어의 여러 모듈이 존재하는 방식으로 설계할 수 있는데, 각 모듈의 상태를 직접적으로 변경할 수 있게되면 어디서 어떻게 변경이 되었는지, 흐름을 추적하기 어려워지기 때문에 모듈 내 `getter`, `setter`를 지정하여 사용하는 방법을 권장하고 있다.

싱글톤 패턴이 적절하게 쓰일 수 있는 상황을 잘 판단하여 적용하여야 한다.
