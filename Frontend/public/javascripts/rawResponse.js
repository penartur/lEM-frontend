window.addEvent('domready', function () {
	$$('form.rawResponse').each(function (f) {
		f.init = function () {
			f.getElements('[type=text], textarea').each(function (el) { new OverText(el); });

			new Form.Validator.Inline(f);

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
