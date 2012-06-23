"use strict";

/*global window: false*/
window.addEvent('domready', function () {
	/*global $: false, Element: false*/
	var form = $('unrestrictedLcmForm');

	function numberChangeEvent(getExistingList, createNew, disableExisting, enableExisting) {
		return function (event) {
			return (function (num) {
				if (num < 1) {
					return false;
				}
				var i,
					items = getExistingList();
				for (i = 0; i < items.length; i++) {
					if (i < num) {
						enableExisting(items[i], i);
					} else {
						disableExisting(items[i], i);
					}
				}
				for (true; i < num; i++) {
					createNew(i);
				}
			}(parseInt(this.value || '0', 10)));
		};
	}

	function variablesNumberChangeEvent(lfs, dpName, diName, title) {
		return numberChangeEvent(
			function () {
				return lfs.getElements('.' + dpName);
			},
			function (i) {
				var input = (new Element('input', {
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
			},
			function (field) {
				field.getElement('input').disabled = true;
				field.hide();
			},
			function (field) {
				field.getElement('input').disabled = false;
				field.show();
			}
		);
	}

	function initNumberField(field, changeEvent, defaultValue) {
		field
			.addEvent('change', changeEvent)
			.addEvent('input', changeEvent)
			.set('value', defaultValue)
			.fireEvent('change');
	}

	initNumberField(
		form.getElement('#latentFieldset').getElement('input[name="latentNumber"]'),
		variablesNumberChangeEvent(
			form.getElement('#latentFieldset'),
			"latentNumberDimensionP",
			"latentDimension",
			"latent"
		),
		1
	);

	initNumberField(
		form.getElement('#manifestFieldset').getElement('input[name="manifestNumber"]'),
		variablesNumberChangeEvent(
			form.getElement('#manifestFieldset'),
			"manifestNumberDimensionP",
			"manifestDimension",
			"manifest"
		),
		1
	);
});
