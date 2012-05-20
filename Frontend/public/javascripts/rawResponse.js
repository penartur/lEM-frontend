"use strict";

/*jslint undef:true*/
window.addEvent('domready', function () {
	/*jslint undef:true*/
	$$('form.rawResponse').each(function (f) {
		f.init = function () {
			var request = new Form.Request(f, null, {
				requestOptions: {
				},
				resetForm: false,
				onSuccess: function (a, b, c, response) {
					/*jslint undef:true*/
					var result = JSON.decode(response);
					console.log(result);
					$('commandsPlaceholder').set('text', result.commands);
					$('errorsPlaceholder').set('text', result.err);
					$('resultPlaceholder').set('html', result.result);
					$('resultContainer').show();
				},
				onFailure: function (e) {
					/*jslint undef:true*/
					$('resultContainer').hide();
					alert("An error occured while processing your request");
				}
			});
		};
		f.init();
	});
});
