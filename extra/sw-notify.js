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

// var helpers = require('./helpers');
// var router = require('./router');
// var options = require('./options');
var handlerArray = ['cacheFirst', 'cacheOnly', 'fastest', 'networkFirst', 'networkOnly'];
var requestTypeArray = ['get', 'post', 'put', 'delete', 'head'];
var Notify = function () {

    // default option 

    // @ option.cache ::- contain the default configuration about the cache
    // @ option.cache.name ::- default name of the primary cache if not provided then 'notify-1'            
    // @ option.cache.maxAge ::-  time in second after which response is will be consider fresh            
    // @ option.cache.maxLimit ::- max limit of entries in the cache                             
    //              
    this.options = {
        cache: {
            name: 'notify-2',
            maxAge: 604800,
            maxLimit: 1000
        },
        // @ option.preCache ::- Array that contain urlPattern that will be precache at 
        //                       install phase of the service worker
        preCache: [

        ],
        // @ defaultHandler ::- it is the default handler for the Requests 
        defaultHandler: 'networkFirst',
        // @ navigationFallback ::- fallback page which will be served if both network and cache request fails
        navigationFallback: '/' //todo link to our custom offline page

    };

}

Notify.prototype.init = function (option) {

    // chech if option object is avaliable and has keys
    if (typeof option === 'object' && Object.keys(option).length >= 1) {

        //object is valid and has keys

        // extend the option with default option
        var extendedOption = utils.extends(this.options, option);

        if (utils.validateOptions(extendedOption)) {

            console.log('option is valid');
            this.options = extendedOption;
            utils.notify_toolbox(extendedOption);

        } else {
            console.log('option is invalid');
        }
    } else {
        // object is not valid or does not have keys
        //  extend default values

        console.log('initializing with default values');
        option = this.options;
        utils.notify_toolbox(option);
    }

}

var utils = {
    extends: function () {

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
                        extended[prop] = utils.extends(true, extended[prop], obj[prop]);
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

    },
    validateOptions: function (option) {
        var isValidArray = [];
        var isValid = true;
        isValidArray.push(utils.validateHandler(option.defaultHandler));
        isValidArray.push(utils.validatePreCache(option.preCache));


        isValidArray.forEach(function (item) {
            if (!item) {
                isValid = false;
            }
        })
        return isValid;
    },
    validateHandler: function (handler) {

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


    },
    validatePreCache: function (preCache) {
        return Array.isArray(preCache);
    },
    validateRequestType: function (requestType) {
        if (typeof requestType === 'string' && requestType.length) {
            if (requestTypeArray.indexOf(requestType) !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },
    get: function (regex, handler, maxAge, maxLimit, cacheName, origin) {
        // check if regex is valid or not 
        if (typeof regex === 'string' && regex.length) {
            if (typeof origin === 'string' && origin.length) {
                notify.router.any(
                    regex,
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
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
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
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
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
                        },
                        'origin': origin
                    }
                )
            } else {
                notify.router.any(
                    regex,
                    notify[handler] || utils.getDefaultHandler(),
                    {
                        'cache':
                        {
                            'name': cacheName || utils.getDefaultCacheName(),
                            'maxAgeSeconds': maxAge || utils.getDefaultMaxAge(),
                            'maxEntries': maxLimit || utils.getDefaultMaxLimit()
                        }

                    }
                )
            }
        } else {
            console.log('not a valid regex');
            return;
        }
    },
    getDefaultHandler: function () {
        return notify.options.defaultHandler;
    },
    getDefaultCacheName: function () {
        return notify.options.cache.name;
    },
    getDefaultMaxAge: function () {
        return notify.options.cache.maxAge;
    },
    getDefaultMaxLimit: function () {
        return notify.options.cache.maxLimit;
    },
    getDefaultRequestType: function () {
        var _defaultRequestType = 'any';
        return _defaultRequestType;
    },
    setDefault: function (configOption) {
        notify.options.debug = configOption.debug || false;
        notify.options.cache.name = configOption.cache.name;
        notify.options.cache.maxAgeSeconds = configOption.cache.maxAge;
        notify.options.cache.maxEntries = configOption.cache.maxLimit;
        notify.options.defaultHandler = configOption.defaultHandler;
        notify.options.preCacheItems = configOption.preCache;
        notify.options.navigationFallback = configOption.navigationFallback;
    },
    setUrls: function (configOption) {
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
                if (_requestType && utils.validateRequestType(_requestType)) {
                    // yes  'requestType' property is present
                    utils[_requestType](urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
                } else {
                    // no 'requestType' property is not present
                    //  fallback to default
                    utils[utils.getDefaultRequestType()](urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);

                }
            }
        }
    },
    setStatic: function (configOption) {
        if (configOption.hasOwnProperty('staticFiles')) {
            for (var key in configOption.staticFiles) {
                var _requestType = configOption.staticFiles[key].requestType;
                var _handler = configOption.staticFiles[key].handler || 'cacheFirst';
                var _maxAge = configOption.staticFiles[key].maxAge;
                var _maxLimit = configOption.staticFiles[key].maxLimit;
                var _cacheName = utils.getDefaultCacheName();
                var _origin = configOption.staticFiles[key].origin;
                var _urlPattern = configOption.staticFiles[key].urlPattern;
                if (_requestType && utils.validateRequestType(_requestType)) {
                    // yes  'requestType' property is present
                    utils[_requestType](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
                } else {
                    // no 'requestType' property is not present
                    //  fallback to default
                    utils[utils.getDefaultRequestType()](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);

                }
            }
        }
    },
    setDynamic: function (configOption) {
        if (configOption.hasOwnProperty('dynamicFiles')) {
            for (var key in configOption.dynamicFiles) {
                var _requestType = configOption.dynamicFiles[key].requestType;
                var _handler = configOption.dynamicFiles[key].handler || 'networkOnly';
                var _maxAge = configOption.dynamicFiles[key].maxAge;
                var _maxLimit = configOption.dynamicFiles[key].maxLimit;
                var _cacheName = utils.getDefaultCacheName();
                var _origin = configOption.dynamicFiles[key].origin;
                var _urlPattern = configOption.dynamicFiles[key].urlPattern;
                if (_requestType && utils.validateRequestType(_requestType)) {
                    // yes  'requestType' property is present
                    utils[_requestType](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
                } else {
                    // no 'requestType' property is not present
                    //  fallback to default
                    utils[utils.getDefaultRequestType()](_urlPattern, _handler, _maxAge, _maxLimit, _cacheName, _origin);
                }
            }
        }
    },
    notify_toolbox: function (configOption) {

        //                var _defaultRequestType = 'any';
        utils.setDefault(configOption);
        utils.setUrls(configOption);
        utils.setStatic(configOption);
        utils.setDynamic(configOption);

        // add default handler if some request does not match
        //                toolbox.router.default = toolbox[configOption.defaultHandler];
        notify.router.default = notify[utils.getDefaultHandler()];

    }
};

function notifyInit(configObj) {
    var notify = new Notify();
    notify.init(configObj);
}

module.exports = {
    init: notifyInit
}