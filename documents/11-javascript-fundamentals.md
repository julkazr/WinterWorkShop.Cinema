# JavaScript

, often abbreviated as JS, is a high-level, just-in-time compiled, multi-paradigm programming language that conforms to the ECMAScript specification. JavaScript has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.
Alongside HTML and CSS, JavaScript is one of the core technologies of the World Wide Web. JavaScript enables interactive web pages and is an essential part of web applications. The vast majority of websites use it, and major web browsers have a dedicated JavaScript engine to execute it
This is a crash course in JavaScript. It is intended for people who already have a bit of programming experience in other languages.
This will hopefully give a basic idea of the most-commonly-used language features, but it is not indended to be a comprehensive guide.

## Basic Syntax

To declare a variable called foo:
```js
let foo = 5;
```
To declare a function called addTwoNumbers, which accepts two parameters and adds them together:
```js
function addTwoNumbers (param1, param2) {
  return param1 + param2;
}
```

// or equivalently:
```js
let addTwoNumbers = function (param1, param2) {
  return param1 + param2;
}
```
To call the function addTwoNumbers with 3 and 5:
```js
addTwoNumbers(3, 5); // <-- this will be 8
```
To print something to the console, use the built-in console.log function:
```js
console.log('foo');
console.log('the answer is ' + answer);
```
Strings can be either single-quoted or double-quoted.
```js
let string1 = "This is a string.";
let string2 = 'This is also a string';
```

## Objects

An object is a collection of key-value pairs, without any particular ordering.
Objects are created like this:
```js
let exampleObject = {key1: value1, key2: 'value2'};
```
The keys have to be strings*, but the values don't:
```js
let myObject = {foo: 1, bar: 2, baz: 3};
```
In the example above, myObject has 3 keys (foo, bar, and baz) with corresponding values 1, 2, and 3 respectively.
To access the values of an object, use a dot followed by the key name.
```js
myObject.baz // <-- this will be 3
```
To set values on an object:
```js
myObject.qux = 5; // Creates a key `qux` on `myObject` with value 5.
```

## Arrays

An array is an ordered list of elements. To create an array, separate the elements with commas, and surround the whole thing with square brackets.
```js
let myArray = ['foo', 'bar', 'baz'];
```
To add an element to an array, use the built-in push function.
```js
myArray.push('qux');
console.log(myArray); // prints out ['foo', 'bar', 'baz', 'qux']
```
To get the element of an array at a given index, use square brackets:
```js
myArray[2] // <-- this will be 'baz'
```
To get the length of an array, use the .length property.
```js
myArray.length // <-- this will be 4
```

## Control flow

if statements:
```js
if (someCondition) {
  // code
}
if (someCondition) {
  // code
} else {
  // other code
}
```
while statement:
```js
while (someCondition) {
  // code
}
```
To check whether two values are equal to each other, use triple equals: ===
```js
if (myVariable === 5) {
  // etc.
}
```
There is also a double-equals operator (==), which is similar but can be confusing because it performs type coersion. Generally, it's best to use === unless you know what you're doing.

## Modules and Node.js

This section only applies to Node.js. Node.js is a JavaScript runtime environment which allows you to run javascript programs on a server or in a script. (JavaScript can also be run in a web browser, or a few other environments.)
To export code for use in another file, use the built-in module.exports object.
```js
// e.g. in a file called myModule.js:
module.exports = {foo: 5, bar: 7};
```
Then to import the code from a different file, use the built-in require function with the module's filepath.
```js
// in another file
var myImportedModule = require('./myModule.js');
console.log(myImportedModule); // logs {foo: 5, bar: 7}
console.log(myImportedModule.foo); // logs 5
```

## Miscellaneous syntax:

This is syntax that you don't really need to have in order to write basic JavaScript, but can be helpful to know if you're reading someone else's code.
var, const
var and const are alternate ways of declaring variables. There are a few differences, but for the most part they're the same as let.

## The ARROW operator =>

The => operator is an alternate way of expressing functions, See arrow functions.
Basically, the following statements are almost equivalent:
```js
let myFunction = function (param1, param2) {
  // code goes here
}

// ---

let myFunction = (param1, param2) => {
  // code goes here
}
```
There are a few subtle differences between the two functions, specifically if you're using the special variable this. However, most of the time you don't have to worry about the difference.
