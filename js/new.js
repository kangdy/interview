function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const result = fn.apply(obj, args)
  // 需要判断构造函数是否有返回值，没有的话就直接返回obj
  return typeof result === 'object' && result !== null ? result : obj;
}

function Person(name) {
  this.name = name
}

const p = new Person('ss')
console.log(p);
const p1 = myNew(Person, 'aa')
console.log(p1);
