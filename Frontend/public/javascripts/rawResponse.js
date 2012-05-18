window.addEvent('domready', function () {
	$$('form.rawResponse').each(function (f) {
		f.init = function () {
			new Form.Request(f, null, {
				requestOptions: {
				},
				resetForm: false,
				onSuccess: function (a, b, c, response) {
					$('resultPlaceholder').set('text', JSON.decode(response).result);
					$('resultContainer').show();
				},
				onFailure: function (e) {
					$('resultContainer').hide();
					alert("An error occured while processing your request");
					console.log(arguments);
				}
			});
		}
		f.init();
	});
});
