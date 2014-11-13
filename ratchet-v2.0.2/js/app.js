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

	// http://stackoverflow.com/questions/23145097/execute-custom-script-after-page-loaded-with-ratchet-push-js
	window.addEventListener('push', function (evt) {
		console.log("vm setup ", evt.detail.state.url);
		if (/\/other.html$/.test(evt.detail.state.url)) {
			otherPage();
		}
	});

})();
