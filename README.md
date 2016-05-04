# JS StackTrace
JS StackTrace allows developers to quickly access to array of current stack trace by calling function ```getStackTrace();```. Note that stack trace should only be used for debug purpose and not to be used in production because there are some known inconsistencies between browsers and it is unpredictable whether there will be any update to the stack trace in the future development in JavaScript engine.

## Return value
```getStackTrace();``` will return an array containing all the stack trace of current function invocation. Each level of trace has the following properties  
  
| Property | Data Type | Description                                            |
|----------|-----------|--------------------------------------------------------|
| name     | string    | The function name                                      |
| file     | number    | (Optional) The file in which the function is invoked   |
| line     | number    | (Optional) The line in which the function is invoked   |
| column   | string    | (Optional) The column in which the function is invoked |
  
The last three properties is optional because in old IE browsers there is no detail stack trace available and the caller and caller property are used instead. However, these properties can only give the function name
  
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
* 5 Apr, 2016. Version 1.0.0
  * First published
  
## License
Copyright (c) Lau Yu Hei  
Published under The MIT License (MIT)
