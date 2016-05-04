/**
 * JS StackTrace
 * Get debug stacktrace in JavaScript
 *
 * Copyright (c) 2016 Lau Yu Hei
 * 
 * @author Lau Yu Hei
 * @version 1.0.0
 * @license The MIT License (MIT)
 * https://opensource.org/licenses/MIT
 **/

var getStackTrace = (function() {
    // old IE browsers does not support String.trim()
    var _trimRegEx = new RegExp("^\\s+|\\s+$", "g");
    var getFNameFromFString = function(str) {
        var tmp = Object.toString.call(str), 
            calllerName;
        // remove anything before the function name
        tmp = tmp.slice(tmp.indexOf("function")+8);

        // get the function name without any space
        callerName = tmp.slice(0, tmp.indexOf("(")).replace(_trimRegEx, '');
        return (callerName.length === 0)? "anonymous": callerName;
    }
    /*
     * Possible stack format in modern browsers:
     * "   at test (testStack.html:122:6)"
     * "   at test2 (testStack.html:168:9)"
     * "   at test3 (testStack.html:171:9)"
     * "   at testStack.html:173:13"
     */
    var _traceRegEx = new RegExp(
        "^\\s*at\\s?(.*)\\s\\(?(.*):([1-9][0-9]*):([1-9][0-9]*)\\)?$");
    var getInfoFromStack = function(trace) {
        var groups = trace.match(_traceRegEx);
        return {
            name: (groups[1]==="")? "anonymous": groups[1], 
            file: groups[2], 
            line: groups[3], 
            column: groups[4]
        };
    }
    return (function() {
        var stack, caller, traceInfo, 
            i, l, 
            stackTrace = [];
        try{
            var foo;
            foo.bar.baz = 1;
        }catch(e){
            if (typeof e.stack !== "undefined") {
                stack = e.stack.split("\n");
                console.dir(stack);
                for(i=2, l=stack.length; i<l; i++) {
                    stackTrace.push(getInfoFromStack(stack[i]));
                }
            } else {
                // old IE and Safari
                caller = arguments.callee;
                // loop throught until caller is no longer defined
                while (caller.caller) {
                    caller = caller.caller;
                    stackTrace.push({
                        name: getFNameFromFString(caller), 
                        file: undefined, 
                        line: undefined, 
                        column: undefined
                    });
                }
            }
        }
        return stackTrace;
    });
})();
