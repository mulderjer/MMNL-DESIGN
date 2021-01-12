(function () {
	// set a unique change id
	var changeId = "20191114";

	function getAllUrlParams(url) {
		// get query string from url (optional) or window
		var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

		// we'll store the parameters here
		var obj = {};

		// if query string exists
		if (queryString) {
			// stuff after # is not part of query string, so get rid of it
			queryString = queryString.split('#')[0];

			// split our query string into its component parts
			var arr = queryString.split('&');
			for (var i = 0; i < arr.length; i++) {

				// separate the keys and the values
				var a = arr[i].split('=');

				// set parameter name and value (use 'true' if empty)
				var paramName = a[0];
				var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

				// (optional) keep case consistent
				paramName = paramName.toLowerCase();
				if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

				// if the paramName ends with square brackets, e.g. colors[] or colors[2]
				if (paramName.match(/\[(\d+)?\]$/)) {
					// create key if it doesn't exist
					var key = paramName.replace(/\[(\d+)?\]/, '');
					if (!obj[key]) obj[key] = [];

					// if it's an indexed array e.g. colors[2]
					if (paramName.match(/\[\d+\]$/)) {
						// get the index value and add the entry at the appropriate position
						var index = /\[(\d+)\]/.exec(paramName)[1];
						obj[key][index] = paramValue;
					} else {
						// otherwise add the value to the end of the array
						obj[key].push(paramValue);
					}
				} else {
					// we're dealing with a string
					if (!obj[paramName]) {

						// if it doesn't exist, create property
						obj[paramName] = paramValue;
					} else if (obj[paramName] && typeof obj[paramName] === 'string') {
						// if property does exist and it's a string, convert it to an array
						obj[paramName] = [obj[paramName]];
						obj[paramName].push(paramValue);
					} else {
						// otherwise add the property
						obj[paramName].push(paramValue);
					}
				}
			}
		}
		return obj;
	}

	$(document).ready(function () {
		function goEdit() {
			/////////////////// START CHANGES ///////////////////
			//$("#category .products-list>li .product-wrapper .product-photo").css("background", "red");
			// only on page 1

			var page = getAllUrlParams().page;
			if (page === "1" || !page) {
				//$("#category .products-list>li .product-wrapper .product-photo").css("background", "red");
				$('#category .products-list>li:nth-child(7)').after('<div style="width:100%;margin-top:10px;margin-bottom:10px;"><li><a onclick="dataLayer.push({\'event\': \'gaEvent\', \'eventCategory\': \'Listingpage\', \'eventAction\': \'Red Night\', \'eventLabel\': \'Red Night abonnement\'});" href="https://telefoonabonnementen.mediamarkt.nl/product/apple-iphone-7-32gb-zwart-1878?abonnement=12047-12070-1878"><img style="float:left;width:100%;" src="{{MEDIA_REF_abo}}" /></a></li></div><li style="clear:both;margin-bottom:10px;" class="with-contenspot"></li>');
			}

			/////////////////// END CHANGES ///////////////////
			// add edited class to product list
			$(".products-list").addClass("edited-change-" + changeId);
		}

		goEdit();
		// listen for product list update (e.g. through pagination or filtering)
		var checkReady = setInterval(function () {

			// if there's no edited class and initial changes (.edited-store-checker) are made, make changes
			if ($(".products-list.edited-change-" + changeId).length === 0 && $(".products-list.edited-store-checker").length > 0) {
				goEdit();
			}
		}, 200);
	});
})();