# JS StackTrace
JS StackTrace allows developers to quickly access to array of current stack trace by calling function ```getStackTrace();```. Note that stack trace should only be used for debug purpose and not to be used in production because there are some known inconsistency between browsers and it is unpredictable whether there will be any update to the stack trace in the future development in JavaScript engine.

## Return value
```getStackTrace();``` will return an array containing all the stack trace of current function invocation. Each level of trace has the following properties  
  
| Property | Data Type | Description                                            |
|----------|-----------|--------------------------------------------------------|
| name     | string    | The function name                                      |
| file     | number    | (Optional) The file in which the function is invoked   |
| line     | number    | (Optional) The line in which the function is invoked   |
| column   | string    | (Optional) The column in which the function is invoked |
  
The last three properties is optional because in old Internet Explorer browsers there is no detail stack trace available and the ```caller``` and ```caller``` property are used instead. However, these properties can only give the function name
  
## Usage
```
function foo() {
console.dir(getStackTrace());
}
foo();
```  
Result:  
```
Array[2]
0: Object
    column: "13"
    file: "demo.html"
    line: "2"
    name: "foo"
    __proto__: Object
1: Object
    column: "1"
    file: "demo.html"
    line: "4"
    name: "anonymous"
    __proto__: Object
length: 2
__proto__: Object
```  

## Known Inconsistency
* Internet Explorer 11 displays "Anonymous function" if the function invoked is anonymous function while Chrome leaves the function part empty.
* Internet Explorer 11 displays "Global code" if the function is invoked in global scope while Chrome leaves the function part empty.

## Browser Support
* Google Chrome (latest)
* Mozilla Firefox (latest)
* Apple Safari (Testing)
* Microsoft Edge (latest)
* Internet Explorer (7+)
* Opera (latest)
* Android Browser (latest)
* Google Chrome on Android (latest)
* Apple Safari on iOS (latest)
* Google Chrome on iOS (latest)
  
## History
* 17 May, 2016. Version 1.0.3
  * Renamte property 'name' in stack trace to 'invokedBy'
* 7 May, 2016. Version 1.0.2
  * Change return value format
  * Add function document
* 6 May, 2016. Version 1.0.1
  * Fix for Firefox inconsistency
  * Add fallback logic in case Stack Trace has changes in the future
* 4 May, 2016. Version 1.0.0
  * First published
  
## License
Copyright (c) Yu H.
Published under The MIT License (MIT)
