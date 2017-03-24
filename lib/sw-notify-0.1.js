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

var utils = require('./utils-0.2');
var idbConfig = require('./idb-config');

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
            "/", "/notifyvisitors_push/cache/offline.html"
        ],
        // @ defaultHandler ::- it is the default handler for the Requests 
        defaultHandler: 'networkFirst',
        // @ navigationFallback ::- fallback page which will be served if both network and cache request fails
        navigationFallback: '/notifyvisitors_push/cache/offline.html' //todo link to our custom offline page

    };

}

Notify.prototype.init = function (option) {

    // chech if option object is avaliable and has keys
    if (typeof option === 'object' && Object.keys(option).length >= 1) {

        //object is valid and has keys

        // extend the option with default option
        var extendedOption = utils.extend(this.options, option);

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

function initSynch() {
    // return new Promise(function (resolve, reject) {
        console.log('initSynch');
        var configData = idbConfig.getConfig();
        console.log('inside sw-notify :: '+configData);
        return configData;
        // .then(function (configData) {
        //     console.log(configData);
        //     resolve(configData);
        // }, function (err) {
        //     reject(err);
        // })
    // })
}
function fetchConfig() {
    var brandid = NOTIFYVISITORS_BRAIND_ID || typeof undefined;
    if (brandid === 'undefined') {
        return new Promise(function (resolve, reject) {
            resolve(null);
        })
    } else {
        //  return fetch('https://push.notifyvisitors.com/pwa/sw/config?brandid=' + brandid)   //for production
        return fetch('https://devpush.notifyvisitors.com/pwa/sw/config?brandid=' + brandid)   // for development
            .then(function (response) {
                return response.json();
            }).catch(function (err) {
                debug('error during fetching config ::' + err);
                return null;
            });
    }
}
function init() {
    return new Promise(function (resolve, reject) {
        fetchConfig().then(function (configObj) {
            // console.log(globalOptions);
            // console.log(configObj);
            if (configObj && typeof configObj === 'object') {
                var config = configObj.config;
                if (config && typeof config === 'object') {
                    if (config.enable || false) {
                        idbConfig.storeConfig(config).then(function (success) {
                            if (success) {
                                console.log('config added successfully');
                                // may be add a flag in the localStorage to use in case of page load;
                            }

                        }).catch(function (err) {
                            console.log(err);
                        })
                        notifyInit(config);
                        resolve();
                    } else {
                        debug('Cache API is not enabled');
                        reject();
                    }

                } else {
                    debug('config object is incorrect');
                    notifyInit();
                    resolve();
                }
            } else {
                notifyInit();
                resolve();
            }
        })
    })
}

function notifyInit(configObj) {
    var notify = new Notify();
    notify.init(configObj);
}

module.exports = {
    init: init,
    initSynch: initSynch,
    notifyInit: notifyInit
}