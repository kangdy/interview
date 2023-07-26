// 实现一个简单的 call 函数
Function.prototype.myCall = function (context, ...args) {
  const fn = Symbol("fn");
  context[fn] = this;
  const result = context[fn](...args);
  delete context[fn];
  return result;
};

// 示例函数
function greet(greeting, punctuation) {
  console.log(`${greeting}, ${this.name}${punctuation}`);
}

// 示例对象
const person = {
  name: "Alice",
};

// 使用原生 call 函数
greet.call(person, "Hello", "!"); // 输出: Hello, Alice!

// 使用自定义 myCall 函数
greet.myCall(person, "Hi", "."); // 输出: Hi, Alice.
