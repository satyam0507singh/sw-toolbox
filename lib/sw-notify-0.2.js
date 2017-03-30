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
// var idbConfig = require('./idb-config');

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
            "/home", "/offline"
        ],
        // @ defaultHandler ::- it is the default handler for the Requests 
        defaultHandler: 'networkFirst',
        // @ navigationFallback ::- fallback page which will be served if both network and cache request fails
        navigationFallback: '/offline' //todo link to our custom offline page

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

function init(configObj) {

    if (configObj && typeof configObj === 'object') {
        var config = configObj.config;
        if (config && typeof config === 'object') {
            if (config.enable || false) {
                notifyInit(config);
            } else { console.log('Cache API is not enabled'); }

        } else {
            console.log('config object is incorrect');
        }
    } else {
        console.log('config not found');
    }
}

function notifyInit(configObj) {
    var notify = new Notify();
    notify.init(configObj);
}

module.exports = {
    init: init,
}