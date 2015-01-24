/**

   variables:
      iinspect.reports =

Report:
   {
      createdOn: <datetime>,
      uploadedOn: <datetime>,
      details: {
         accountName,
         assetID,
         regNo,
         refNo,
         inspectionDate,
         location,
         comment
      },
      pictures: [
         {
            content: blob,
            comment: '',
            position: '',
            url: 'aaa'
         },

      ]
   }


**/

(function () {
   'use strict';

   window.iinspect = window.iinspect || {};
   window.iinspect.reports = [];

   // --------------------------------------------------------------------------
   //
   function indexPage () {
      var vm = new EZ(document.documentElement);
      vm._apply(function () {
         vm.settings={};
         vm.settings.name = localStorage.getItem('settings.name');
         vm.settings.email = localStorage.getItem('settings.email');
      });
      vm._listen('settings.name', function () {
         localStorage.setItem('settings.name', vm.settings.name);
      });
      vm._listen('settings.email', function () {
         localStorage.setItem('settings.email', vm.settings.email);
      });
      vm.createNewReport = function () {
         localStorage.setItem("selectedReport", "");
         window.PUSH({url: "newreport.html", transition: 'slide-in'});
      };
   }

   // --------------------------------------------------------------------------
   //
   function reportsPage () {
		var vm = new EZ(document.documentElement);
		vm.back = function () {
			window.history.back();
		};
      vm._apply(function () {
         vm.reports = [];
      });
      vm._listen('reports[*].createdOn', function (nv,old,item) {
         item.createdOnAsStr = moment(nv).format('DD/MM/YYYY HH:mm') + " (" + moment(nv).fromNow() + ")" ;
      });
      vm._listen('reports[*].pictures', function (nv,old,item) {
         item.picturesCount = item.pictures.length;
      });
      window.iinspect.reportsStore.all(function (rpt, key) {
         vm._apply(function () { vm.reports.unshift(rpt); });
      });
      vm.showReport = function (evt, idx) {
         localStorage.setItem("selectedReport", vm.reports[idx].createdOn.getTime());
         window.PUSH({url: "newreport.html", transition: 'slide-in'});
      };
      vm.createNewReport = function () {
         localStorage.setItem("selectedReport", "");
         window.PUSH({url: "newreport.html", transition: 'slide-in'});
      };
	}

   // --------------------------------------------------------------------------
   //
   function newReportPage () {
      console.log("newReportPage activated !");
      var vm = new EZ(document.documentElement);

      vm._listen('currentCursor', function (nv) {
         vm.cursorsList = Array.apply(null, new Array(vm.currentReport.pictures.length)).map(Boolean.prototype.valueOf,false);
         vm.cursorsList[nv] = true;
      });

      var selectedReport = localStorage.getItem("selectedReport");
      if (selectedReport) {
         window.iinspect.reportsStore.get(new Date(parseInt(selectedReport,10)), function (report) {
            vm._apply(function () {
               vm.currentReport = report;
               vm.currentReport.pictures.forEach(function (pict) { pict.url = URL.createObjectURL(pict.content); console.log("pict url: ", pict.url); });
               vm.currentCursor = 0;
            });
         });
      } else {
         vm._apply(function () {
            vm.currentReport = {createdOn: new Date(), details: {}, pictures: []};
            vm.currentCursor = 0;
         });
      }

      vm.slide = function (evt) {
         console.log("slide no: ", evt.detail.slideNumber);
         vm.currentCursor = evt.detail.slideNumber;
      };
      vm.capturePicture = function () {
         // simulate a click on the "capture from camera" input field.
         document.getElementById('camera-capture').dispatchEvent(new Event('click'));
      };
      vm.newPictureCaptured = function (event) {
         if(event.target.files.length == 1 && event.target.files[0].type.indexOf("image/") === 0) {
            var blob = new Blob ([event.target.files[0]], {type: 'image/jpg'});
            vm.currentReport.pictures.push({
               content: blob, // !!!!! OK for chrome on android !!!!!
               comment: '',
               url: URL.createObjectURL(blob)
            });
            vm.currentCursor = vm.currentReport.pictures.length - 1;
         }
         window.iinspect.reportsStore.save(vm.currentReport, function () { console.info("save successful!"); }, function (e) { console.error('save error!', e);  });
      };
      vm.removePicture = function () {
         vm.currentReport.pictures.splice(vm.currentCursor,1);
         vm.currentCursor = Math.max(vm.currentCursor-1, 0);
         window.iinspect.reportsStore.save(vm.currentReport, function () { console.info("save successful!"); }, function (e) { console.error('save error!', e);  });
      };
      vm.uploadReport = function () {
         window.iinspect.reportsStore.save(vm.currentReport, function () { console.info("save successful!"); }, function (e) { console.error('save error!', e);  });
      };
   }

   indexPage();

	// http://stackoverflow.com/questions/23145097/execute-custom-script-after-page-loaded-with-ratchet-push-js
	window.addEventListener('push', function (evt) {
		console.log("vm setup ", evt.detail.state.url);
		if (/reports.html$/.test(evt.detail.state.url)) {
			reportsPage();
		}
		if (/newreport.html$/.test(evt.detail.state.url)) {
			newReportPage();
		}
		if (/index.html$/.test(evt.detail.state.url)) {
			indexPage();
		}
	});

})();
