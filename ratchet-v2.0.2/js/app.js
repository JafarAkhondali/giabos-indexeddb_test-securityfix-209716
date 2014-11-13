(function () {

	function otherPage () {
		var vm = new EZ(document.documentElement);
		vm.back = function () {
			window.history.back();
		};
		vm._do(function () {
			vm.list = ["AAA", "BBB", "CCC"];
		});
	}
    function indexPage () {
        var vm = new EZ(document.documentElement);
		vm._do(function () {
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

    indexPage();

	// http://stackoverflow.com/questions/23145097/execute-custom-script-after-page-loaded-with-ratchet-push-js
	window.addEventListener('push', function (evt) {
		console.log("vm setup ", evt.detail.state.url);
		if (/\/other.html$/.test(evt.detail.state.url)) {
			otherPage();
		}
		if (/\/index.html$/.test(evt.detail.state.url)) {
			indexPage();
		}
	});

})();
