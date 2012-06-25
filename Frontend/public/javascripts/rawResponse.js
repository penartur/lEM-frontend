"use strict";

/*jslint undef:true*/
window.addEvent('domready', function () {
	/*jslint undef:true*/
	var encoder = JSON.stringify || JSON.encode;
	$$('form.rawResponse').each(function (f) {
		f.init = function () {
			var request = new Form.Request(f, null, {
				requestOptions: {
					useSpinner: true,
					spinnerOptions: {
						message: 'Executing...'
					}
				},
				resetForm: false,
				onSuccess: function (a, b, c, response) {
					/*jslint undef:true*/
					$('responseContainer').hide();
					$('commandsContainer').hide();
					$('validationErrorsContainer').hide();
					$('errorsContainer').hide();
					$('resultContainer').hide();

					var result = JSON.decode(response);
					console.log(result);

					$('commandsPlaceholder').set('text', result.commands);
					if (result.commands) {
						$('commandsContainer').show();
					}

					$('validationErrorsPlaceholder').set('text', encoder(result.validationErr, null, 4));
					if (result.validationErr) {
						$('validationErrorsContainer').show();
					}

					$('errorsPlaceholder').set('text', result.err);
					if (result.err) {
						$('errorsContainer').show();
					}

					$('resultPlaceholder').set('html', result.result);
					if (result.result) {
						$('resultContainer').show();
					}

					$('responseContainer').show();
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
