/**
 * JS StackTrace
 * Get debug stacktrace in JavaScript
 *
 * Copyright (c) 2016 Lau Yu Hei
 * 
 * @author Lau Yu Hei
 * @version 1.0.1
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
     * Possible stack format in Chrome, Opera, Internet Explorer:
     * "TypeError: Cannot set property 'baz' of undefined"
     * "   at getStackTrace (simpli.js:125:13)"
     * "   at simpli.argcArray (impli.js:1039:33)"
     * "   at basic.js:329:1"
     *
     * Possible stack format in Firefox:
     * "getStackTrace@simpli.js:125:13"
     * "simpli.argcArray@simpli.js:1039:33"
     * "@basic.js:329:1"
     */
    var _traceRegEx = new RegExp(
        "^(?:\\s*at\\s?(.*)\\s|(.*)@)" +
        "\\(?(.*):([1-9][0-9]*):([1-9][0-9]*)\\)?$");
    var getInfoFromStack = function(trace) {
        var groups = trace.match(_traceRegEx);
        /*
         * Returns null if nothing matches
         */
        if (groups === null) {
            return null;
        }
        return {
            name: (groups[1]==="")? 
                ((groups[2]==="")? "anonymous": groups[2]): groups[1], 
            file: groups[2], 
            line: groups[3], 
            column: groups[4]
        };
    }
    return (function() {
        var stack, caller, traceInfo, 
            i, l, 
            stackTrace = [], 
            compatibility = true;
        try{
            var foo;
            foo.bar.baz = 1;
        }catch(e){
            if (typeof e.stack !== "undefined") {
                compatibility = false;
                stack = e.stack.split("\n");
                /*
                 * In non-Firefox browsers, the first stacktrace is the 
                 * TypeError message and does not match with the trace
                 * Regular Expression
                 */
                i = (stack[0].match(_traceRegEx) === null)? 2: 1;
                for(l=stack.length; i<l; i++) {
                    // In Firefox, the last stack is sometimes an empty string
                    if (stack[i].length === 0) {
                        break;
                    }
                    traceInfo = getInfoFromStack(stack[i]);
                    /*
                     * Stack Trace format is not a standard and there are 
                     * always inconsistency between browsers and unpredictable 
                     * future updates. In case the regular expression does not 
                     * match with the trace, fallback to compatibility mode
                     */
                    if (traceInfo === null) {
                        compatibility = true;
                        break;
                    }
                    /*
                     * In non-Firefox browsers, the first stacktrace is the 
                     * TypeError message
                     */
                    if (traceInfo.name === "getStackTrace") {
                        continue;
                    }
                    stackTrace.push(traceInfo);
                }
            } 
            if (compatibility) {
                // compatibility mode for old IE and Safari
                console.log("[Warning] getStackTrace() running in "+
                    "compatibility mode");
                try {
                    caller = arguments.callee;
                } catch(e) {
                    // callee and caller are not allowed in strict mode
                    console.log("[Error] getStackTrace() compatibility "+
                        "mode cannot be run under strict mode");
                    return [];
                }
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
