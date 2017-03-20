//    Copyright 2017 Satyam Singh (satyam0507@gmail.com) All Rights Reserved.
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.

'use strict';

var handlerArray = ['cacheFirst', 'cacheOnly', 'fastest', 'networkFirst', 'networkOnly'];
var requestTypeArray = ['get', 'post', 'put', 'delete', 'head'];


var extend = function () {


    // Variables
    var extended = {};
    var deep = true;
    var i = 0;
    var length = arguments.length;

    // Check if a deep merge
    if (Object.prototype.toString.call(arguments[0]) === '[object Boolean]') {
        deep = arguments[0];
        i++;
    }

    // Merge the object into the extended object
    var merge = function (obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                // If deep merge and property is an object, merge properties
                if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
                    extended[prop] = extend(true, extended[prop], obj[prop]);
                } else {
                    extended[prop] = obj[prop];
                }
            }
        }
    };

    // Loop through each object and conduct a merge
    for (; i < length; i++) {
        var obj = arguments[i];
        merge(obj);
    }

    return extended;

}

var validateOptions = function (option) {
    var isValidArray = [];
    var isValid = true;
    isValidArray.push(validateHandler(option.defaultHandler));
    isValidArray.push(validatePreCache(option.preCache));


    isValidArray.forEach(function (item) {
        if (!item) {
            isValid = false;
        }
    })
    return isValid;
}
var notify_toolbox = function (configOption) {

    //                var _defaultRequestType = 'any';
    setDefault(configOption);
    setUrls(configOption);
    setStatic(configOption);
    setDynamic(configOption);

    // add default handler if some request does not match
    //                toolbox.router.default = toolbox[configOption.defaultHandler];
    notify.router.default = notify[getDefaultHandler()];

}

var validateHandler = function (handler) {

    if (typeof handler === 'string' && handler.length) {
        // handler is a valid string

        // check if the value exist the handlerArray
        if (handlerArray.indexOf(handler) !== -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }


}

var validatePreCache = function (preCache) {
    return Array.isArray(preCache);
}

var validateRequestType = function (requestType) {
    if (typeof requestType === 'string' && requestType.length) {
        if (requestTypeArray.indexOf(requestType) !== -1) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }

}
var getDefaultHandler = function () {
    return notify.options.defaultHandler;
}
var getDefaultCacheName = function () {
    return notify.options.cache.name;
}
var getDefaultMaxAge = function () {
    return notify.options.cache.maxAge;
}
var getDefaultMaxLimit = function () {
    return notify.options.cache.maxLimit;
}
var getDefaultRequestType = function () {
    var _defaultRequestType = 'any';
    return _defaultRequestType;
}
var setDefault = function (configOption) {
    configOption.debug = true;
    notify.options.debug = configOption.debug || false;
    notify.options.cache.name = configOption.cache.name;
    notify.options.cache.maxAgeSeconds = configOption.cache.maxAge;
    notify.options.cache.maxEntries = configOption.cache.maxLimit;
    notify.options.defaultHandler = configOption.defaultHandler;
    notify.options.preCacheItems = configOption.preCache;
    notify.options.navigationFallback = configOption.navigationFallback;
}
var setUrls = function (configOption) {
    if (configOption.hasOwnProperty('urls')) {
        for (var urlPattern in configOption.urls) {
            // console.log(url);
            // check if the 'requestType' property is provided by the user for this url/express regex
            // if not then we will default it to get() requestType
            var _requestType = configOption.urls[urlPattern].requestType;
            var _handler = configOption.urls[urlPattern].handler;
            var _maxAge = configOption.urls[urlPattern].maxAge;
            var _maxLimit = configOption.urls[urlPattern].maxLimit;
            var _cacheName = configOption.cache.name;
            var _origin = configOption.urls[urlPattern].origin;
            if (_requestType && validateRequestType(_requestType)) {
                // yes  'requestType' property is present
                requestType[_requestType](urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
            } else {
                // no 'requestType' property is not present
                //  fallback to default
                requestType[getDefaultRequestType()](urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);

            }
        }
    }
}

var setStatic = function (configOption) {
    if (configOption.hasOwnProperty('staticFiles')) {
        for (var key in configOption.staticFiles) {
            var _requestType = configOption.staticFiles[key].requestType;
            var _handler = configOption.staticFiles[key].handler || 'cacheFirst';
            var _maxAge = configOption.staticFiles[key].maxAge;
            var _maxLimit = configOption.staticFiles[key].maxLimit;
            var _cacheName = getDefaultCacheName();
            var _origin = configOption.staticFiles[key].origin;
            var _urlPattern = configOption.staticFiles[key].urlPattern;
            if (_requestType && validateRequestType(_requestType)) {
                // yes  'requestType' property is present
                requestType[_requestType](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
            } else {
                // no 'requestType' property is not present
                //  fallback to default
                requestType[getDefaultRequestType()](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);

            }
        }
    }
}
var setDynamic = function (configOption) {
    if (configOption.hasOwnProperty('dynamicFiles')) {
        for (var key in configOption.dynamicFiles) {
            var _requestType = configOption.dynamicFiles[key].requestType;
            var _handler = configOption.dynamicFiles[key].handler || 'networkOnly';
            var _maxAge = configOption.dynamicFiles[key].maxAge;
            var _maxLimit = configOption.dynamicFiles[key].maxLimit;
            var _cacheName = getDefaultCacheName();
            var _origin = configOption.dynamicFiles[key].origin;
            var _urlPattern = configOption.dynamicFiles[key].urlPattern;
            if (_requestType && validateRequestType(_requestType)) {
                // yes  'requestType' property is present
                requestType[_requestType](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
            } else {
                // no 'requestType' property is not present
                //  fallback to default
                requestType[getDefaultRequestType()](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
            }
        }
    }
}

var requestType = {
    get: function (regex, handler, maxAge, maxLimit, cacheName, origin) {
        // check if regex is valid or not 
        if (typeof regex === 'string' && regex.length) {
            if (typeof origin === 'string' && origin.length) {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        }

                    }
                )
            }
        } else {
            console.log('not a valid regex');
            return;
        }

    },
    post: function (regex, handler, maxAge, maxLimit, cacheName, origin) {
        // check if regex is valid or not 
        if (typeof regex === 'string' && regex.length) {
            if (typeof origin === 'string' && origin.length) {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        }

                    }
                )
            }
        } else {
            console.log('not a valid regex');
            return;
        }
    },
    any: function (regex, handler, maxAge, maxLimit, cacheName, origin) {
        // check if regex is valid or not 
        if (typeof regex === 'string' && regex.length) {
            if (typeof origin === 'string' && origin.length) {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || getDefaultMaxAge(),
                            'maxEntries': maxLimit || getDefaultMaxLimit()
                        }

                    }
                )
            }
        } else {
            console.log('not a valid regex');
            return;
        }
    }

}


module.exports = {
    extend: extend,
    validateOptions: validateOptions,
    notify_toolbox: notify_toolbox
}