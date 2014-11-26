(function () {
	function otherPage () {
		var vm = new EZ(document.documentElement);
		vm.back = function () {
			window.history.back();
		};
		vm._apply(function () {
			vm.list = ["AAA", "BBB", "CCC"];
		});
	}
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
   }

   function newReportPage () {
      var vm = new EZ(document.documentElement);
      vm._listen('currentCursor', function (nv) {
         vm.cursorsList = Array.apply(null, new Array(vm.picturesList.length)).map(Boolean.prototype.valueOf,false);
         vm.cursorsList[nv] = true;
      });
		vm._apply(function () {
         vm.picturesList = [
            {url: 'img/t1.jpg'},
            {url: 'img/t2.jpg'},
            {url: 'img/t3.jpg'}
         ];
         vm.currentCursor = 0;
      });
      vm.slide = function (evt) {
         console.log(evt.detail.slideNumber);
         vm.currentCursor = evt.detail.slideNumber;
      };
   }

    indexPage();

	// http://stackoverflow.com/questions/23145097/execute-custom-script-after-page-loaded-with-ratchet-push-js
	window.addEventListener('push', function (evt) {
		console.log("vm setup ", evt.detail.state.url);
		if (/\/other.html$/.test(evt.detail.state.url)) {
			otherPage();
		}
		if (/\/newreport.html$/.test(evt.detail.state.url)) {
			newReportPage();
		}
		if (/\/index.html$/.test(evt.detail.state.url)) {
			indexPage();
		}
	});

})();
