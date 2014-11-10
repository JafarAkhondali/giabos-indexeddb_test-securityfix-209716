(function () {

	function otherPage () {
		var vm = new EZ(document.documentElement);
		vm.back = function () {
			console.log("history back");
			window.history.back();
		};
		
		vm._do(function () {
			vm.list = ["AAA", "BBB", "CCC"];
		});
	}


	window.addEventListener('push', function (evt) {
		console.log("vm setup ", evt.detail.state.url);
		if (/\/other.html$/.test(evt.detail.state.url)) {
			otherPage();
		}
	});

})();