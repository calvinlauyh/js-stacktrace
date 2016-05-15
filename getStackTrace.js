/**
 * JS StackTrace
 * Get debug stacktrace in JavaScript
 *
 * Copyright (c) 2016 Yu H.
 * 
 * @author Yu H.
 * @version 1.0.2
 * @license The MIT License (MIT)
 * https://opensource.org/licenses/MIT
 **/

/**
 * Generate a stack trace
 * @return {array|null}     Returns an array of stack trace, or null if the 
 *                          Stack Trace is in unrecognized format. 
 */
var getStackTrace = (function() {
    /**
     * This function wrap and return the console object according to the 
     * current environment support
     * 
     * @return {object}     The console object
     */
    var _console = function() {
        /*
         * console in Internet Explorer prior to 10 is undefined if the 
         * developer console is not opened
         */
        if (typeof console !== "undefined") {
            /*
             * console in Internet Explorer prior to 10 does not have 
             * console.debug
             */
            if (typeof console.debug === "undefined") {
                console.debug = console.log;
            }
            return console;
        } else {
            return {
                log: function(message) {}, 
                info: function(message) {}, 
                warn: function(message) {}, 
                error: function(message) {}, 
                debug: function(message) {}
            }
        }
    }
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
        var groups = trace.match(_traceRegEx), 
            name;
        /*
         * Returns null if nothing matches
         */
        if (groups === null) {
            return null;
        }
        name = (typeof groups[1]==="undefined")? groups[2]: groups[1];
        return {
            name: (name==="")? "anonymous": name, 
            file: groups[3], 
            line: groups[4], 
            column: groups[5]
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
                _console().error("[Warning] getStackTrace() running in "+
                    "compatibility mode");
                try {
                    caller = arguments.callee;
                } catch(e) {
                    // callee and caller are not allowed in strict mode
                    _console().error("[Warning] getStackTrace() "+
                        "compatibility mode cannot be run in strict mode");
                    return null;
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
