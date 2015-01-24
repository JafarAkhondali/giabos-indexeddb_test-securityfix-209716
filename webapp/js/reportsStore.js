(function () {

   // IndexedDB setup.
   window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
   window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
   window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
   if (!window.indexedDB) {
      window.alert("Your browser doesn't support IndexedDB.");
   }
   window.URL = window.URL || window.webkitURL; /// !!!!!! https://developer.mozilla.org/en-US/docs/Web/API/Window.URL

   ///
   // Reports store access class based on IndexedDB.
   // Available operations:
   //    save: saves one specific report. The report is a js object with a property called 'datetime' (= access key).
   //    get: retrieves a report based on its key.
   //    remove: removed a report based on its key.
   //    all: retreives all stored reports.
   function ReportsStoreIDB () {
      var self = this;
      self.dbVersion = 1;

      // Create/open database
      var openRequest = window.indexedDB.open("iinspectdb", self.dbVersion);
      openRequest.onerror = function (event) {
         window.alert("Error during open of indexeddb:" + event.target.errorCode);
         window.alert("Error during open of indexeddb target:" + JSON.stringify(event.target));
      };
      openRequest.onsuccess = function (event) {
         self.db = event.target.result; // save db reference...
      };
      openRequest.onupgradeneeded = function(event) {
         var db = event.target.result;
         var objectStore = db.createObjectStore("reports", { keyPath: "createdOn" });
         //objectStore.createIndex("name", "name", { unique: false });
      };
   }

   ReportsStoreIDB.prototype.save = function (obj, successCallback, errorCallback) {
      var transaction = this.db.transaction(["reports"], "readwrite");
      transaction.oncomplete = successCallback || function (event) { console.log("Transaction completed"); };
      transaction.onerror = errorCallback || function (event) { console.error("Transaction error", event); };
      var reportsStore = transaction.objectStore("reports");

      var addRequest = reportsStore.put(obj);
      addRequest.onsuccess = successCallback || function(event) { console.log("added successfully!"); };
      addRequest.onerror = errorCallback || function (event,e) { console.error("add error", e); };
   };

   ReportsStoreIDB.prototype.get = function (key, successCallback, errorCallback) {
      var request = this.db.transaction(["reports"]).objectStore("reports").get(key);
      request.onerror = errorCallback || function (event) { console.error("get error", event); };
      request.onsuccess = function (event) { console.log("get success:", event.target.result);  successCallback(event.target.result);  };
   };

   ReportsStoreIDB.prototype.remove = function (key, successCallback, errorCallback) {
      var request = this.db.transaction(["reports"], 'readwrite').objectStore("reports").delete(key);
      request.onerror = errorCallback || function (event) { console.error("get error", event); };
      request.onsuccess = function (event) { console.log("get success:", event.target.result);  successCallback(event.target.result);  };
   };

   ReportsStoreIDB.prototype.all = function (successCallback, errorCallback) {
      var request = this.db.transaction(["reports"]).objectStore("reports").openCursor();
      request.onerror = errorCallback || function (event) { console.error("get error", event); };
      request.onsuccess = function (event) {
         var cursor = event.target.result;
         if (cursor) {
            successCallback(cursor.value, cursor.key);
            cursor.continue();
         }
      };
   };

   window.iinspect = window.iinspect || {};
   window.iinspect.reportsStore = new ReportsStoreIDB();

})();
