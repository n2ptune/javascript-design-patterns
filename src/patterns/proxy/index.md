---
name: 프록시 패턴
---

# 프록시 패턴

프록시 패턴을 이용하면 자바스크립트에서 특정 값을 가져올 때(get) 혹은 설정할 때(set) 커스텀 로직을 구현할 수 있다.

```typescript
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // target already has corresponding Proxy
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // only specific value types can be observed.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

[Vue 내 reactivity 관련된 파일](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts)에서 가져온 코드중 일부인데, 프록시 객체를 사용하여 컴포넌트 상태와 관련된 함수를 작성하였다. 객체의 get/set에 관여할 수 있다는 것은 자바스크립트 객체가 변경될 때마다 DOM을 다시 그린다거나 눈에 직접 보이는 HTML의 텍스트 값을 실시간으로 감지하여 변경할 수 있게된다. 해당 패키지에서는 프록시 패턴을 적용하여 상태 관리에 대한 문제를 해결하였다.

```typescript
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
    return true
  }
})

console.log(proxy.name)
// getter: { location: 'Seoul', createdAt: 1997, name: '와르르맨션' } name
// undefined
```

`Proxy` 타입의 인스턴스를 하나 생성해서 `proxy`에 할당한다. 이 때, 첫번째 인자로는 프록시 대상이 되고, 두번째는 반환된 객체에 어떤 행위를 했을 경우의 처리를 정의할 수 있다. 예제에서는 접근 연산자로 객체의 프로퍼티에 접근할 때의 행위 `get`에 대한 함수와 어떤 값을 할당할 때의 행위인 `set`을 정의했다. `get` 메서드에 정의된대로 콘솔에 `obj`, `prop` 값들이 찍히며 실제로 그 원하는 값을 반환하진 않는다. 아무 것도 반환한게 없으므로 `undefined`를 반환한다.

```typescript
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
```

`set` 함수의 리턴 타입은 `boolean`이다. `true`인 경우 `value`로 넘긴 값이 정상적으로 할당이 되었다는 의미로 사용하면 되고, `false`인 경우 어떤 이유로 `value`를 `obj`에 할당할 수 없는 경우 사용하면 된다. `false`를 반환할 경우 `TypeError`를 내뱉는다. 위 예제의 경우 아래의 출력 결과를 가진다.

```sh
setter: { location: 'Seoul', createdAt: 1997, name: '와르르맨션' } name 억장와르르맨션
getter: { location: 'Seoul', createdAt: 1997, name: '와르르맨션' } name
undefined
```