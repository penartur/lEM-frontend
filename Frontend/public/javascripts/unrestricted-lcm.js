"use strict";

/*jslint undef:true*/
window.addEvent('domready', function () {
	/*jslint undef:true*/
	var form = $('unrestrictedLcmForm'),
		changeEvent = function (lfs, dpName, diName, title) {
			return function (event) {
				return (function (num) {
					if (num < 1) {
						return false;
					}
					var i,
						input,
						items = lfs.getElements('.' + dpName);
					for (i = 0; i < items.length; i++) {
						if (i < num) {
							items[i].getElement('input').disabled = false;
							items[i].show();
						} else {
							items[i].getElement('input').disabled = true;
							items[i].hide();
						}
					}
					for (true; i < num; i++) {
						input = (new Element('input', {
							type: 'number',
							min: 1,
							required: true,
							name: diName,
							placeholder: 'Dimension of the ' + (i + 1) + 'th ' + title + ' variable',
							'data-validators': 'validate-integer'
						}));
						lfs.grab(
							(new Element('p', { "class": dpName })).grab(input),
							'bottom'
						);
					}
				}(parseInt(this.value, 10)));
			};
		},
		monitor = function (fsName, inName, dpName, diName, title) {
			var lfs = form.getElement('#' + fsName),
				lin = lfs.getElement('input[name="' + inName + '"]');

			lin
				.addEvent('change', changeEvent(lfs, dpName, diName, title))
				.addEvent('input', changeEvent(lfs, dpName, diName, title))
				.set('value', 1)
				.fireEvent('change');
		};

	monitor("latentFieldset", "latentNumber", "latentNumberDimensionP", "latentDimension", "latent");
	monitor("manifestFieldset", "manifestNumber", "manifestNumberDimensionP", "manifestDimension", "manifest");
});
