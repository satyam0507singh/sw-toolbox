'use strict';
var DB_PREFIX = 'sw-notify-';
var DB_VERSION = 1;
var STORE_NAME = 'store';
var IDB_NAME = 'config'

function openIdb() {
    return new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_PREFIX + IDB_NAME, DB_VERSION);

        request.onupgradeneeded = function () {
            var objectStore = request.result.createObjectStore(STORE_NAME, { autoIncrement: true });
            //  objectStore.createIndex(IDB_NAME,IDB_NAME,{ unique: false });
            // objectStore.createIndex(TIMESTAMP_PROPERTY, TIMESTAMP_PROPERTY,
            //     { unique: false });
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    })

}
function storeConfig(configObj) {
    return new Promise(function (resolve, reject) {
        openIdb().then(function (db) {
            // var db = request.result
            var transaction = db.transaction(STORE_NAME, 'readwrite');
            var objectStore = transaction.objectStore(STORE_NAME);
            var delRequest = objectStore.clear();
            delRequest.onsuccess = function () {
                console.log('deleted the entries in the indexedDB done');
                objectStore.put(configObj);
            }
            delRequest.onerror = function (err) {
                reject(err);
            }
            transaction.oncomplete = function () {
                resolve(true);
            };
            transaction.onerror = function (err) {
                reject(err);
            }
        }, function (err) {
            reject(err);
        })
    })
}

function getConfig() {
    // return new Promise(function (resolve, reject) {
        var request = indexedDB.open(DB_PREFIX + IDB_NAME, DB_VERSION);
        request.onupgradeneeded = function () {
            var objectStore = request.result.createObjectStore(STORE_NAME, { autoIncrement: true });
            // objectStore.createIndex(IDB_NAME,IDB_NAME,{ unique: false });
            // objectStore.createIndex(TIMESTAMP_PROPERTY, TIMESTAMP_PROPERTY,
            //     { unique: false });
        };
        request.onsuccess = function () {
            var db = request.result
            var transaction = db.transaction(STORE_NAME, 'readwrite');
            var objectStore = transaction.objectStore(STORE_NAME);
            // var index = objectStore.index(IDB_NAME);
            var configData = [];
            objectStore.openCursor().onsuccess = function (cursorEvent) {
                var cursor = cursorEvent.target.result;
                if (cursor) {
                    // if (now - maxAgeMillis > cursor.value[TIMESTAMP_PROPERTY]) {
                    //     var url = cursor.value[URL_PROPERTY];
                    //     urls.push(url);
                    //     objectStore.delete(url);
                    //     cursor.continue();
                    // }
                    // configData.push(cursor.value);
                    console.log('inside indexedDB :: '+cursor.value);
                    return cursor.value;
                    
                } else {
                    console.log("No more entries!");
                }
            };

            transaction.oncomplete = function () {
                console.log(configData);
                // resolve(configData);
            };
        };

        request.onerror = function (err) {
            // reject(err);
            return null;
        };
    // })

}

module.exports = {
    getConfig: getConfig,
    openIdb: openIdb,
    storeConfig: storeConfig
}