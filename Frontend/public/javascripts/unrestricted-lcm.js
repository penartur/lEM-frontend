"use strict";

/*global window: false*/
window.addEvent('domready', function () {
	/*global $: false, Element: false*/
	var form = $('unrestrictedLcmForm'),
		latentVariablesNumber = 0,
		manifestVariablesNumber = 0,
		respondentsNumber = 0;

	function numberChangeEvent(getExistingList, currentNumber, createNew, disableExisting, enableExisting, postprocess) {
		postprocess = postprocess || function () { };
		return function (event) {
			return (function (num) {
				if (num < 1) {
					return false;
				}
				if (num === currentNumber.get()) {
					return false;
				}
				currentNumber.set(num);
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
				postprocess(num);
			} (parseInt(this.value || '0', 10)));
		};
	}

	function syncPlainDataWithManifestVariablesNumber(form) {
		var table = form.getElement('#plainDataTable'),
			thead = table.getElement('thead'),
			tbody = table.getElement('tbody'),
			mockCurrent = { get: function () { return 0; }, set: function () { } },
			syncHeadRow = function (row) {
				numberChangeEvent(
					function () {
						return row.getElements('th').slice(1);
					},
					mockCurrent,
					function (i) {
						row.grab(
							(new Element('th', { text: 'A' + (i + 1) })),
							'bottom'
						);
					},
					function (td) {
						td.hide();
					},
					function (td) {
						td.show();
					}
				).call(this);
			},
			syncRow = function (row) {
				numberChangeEvent(
					function () {
						return row.getElements('td').slice(1);
					},
					mockCurrent,
					function (i) {
						var input = (new Element('input', {
							type: 'number',
							min: 1,
							required: true,
							name: 'response',
							class: 'input-mini',
							placeholder: 'Answer',
							'data-validators': 'validate-integer',
							'data-manifestposition': i
						}));
						row.grab(
							(new Element('td')).grab(input),
							'bottom'
						);
					},
					function (td) {
						td.getElement('input').disabled = true;
						td.hide();
					},
					function (td) {
						td.getElement('input').enabled = true;
						td.show();
					}
				).call(this);
			};

		return function () {
			var manifestMockCaller = { value: manifestVariablesNumber };
			thead.getElements('tr').each(syncHeadRow, manifestMockCaller);
			tbody.getElements('tr').each(syncRow, manifestMockCaller);
		};
	}

	function latentVariablesNumberChangeEvent(form) {
		var lfs = form.getElement('#latentFieldset');
		return numberChangeEvent(
			function () {
				return lfs.getElements('.latentNumberDimensionP');
			},
			{
				get: function () { return latentVariablesNumber; },
				set: function (num) { latentVariablesNumber = num; }
			},
			function (i) {
				var input = (new Element('input', {
					type: 'number',
					min: 1,
					required: true,
					name: 'latentDimension',
					placeholder: 'Dimension of the ' + (i + 1) + 'th latent variable',
					'data-validators': 'validate-integer'
				}));
				lfs.grab(
					(new Element('p', { 'class': 'latentNumberDimensionP' })).grab(input),
					'bottom'
				);
			},
			function (p) {
				p.getElement('input').disabled = true;
				p.hide();
			},
			function (p) {
				p.getElement('input').disabled = false;
				p.show();
			}
		);
	}

	function manifestVariablesNumberChangeEvent(form) {
		var mfs = form.getElement('#manifestFieldset');
		return numberChangeEvent(
			function () {
				return mfs.getElements('.manifestNumberDimensionP');
			},
			{
				get: function () { return manifestVariablesNumber; },
				set: function (num) { manifestVariablesNumber = num; }
			},
			function (i) {
				var input = (new Element('input', {
					type: 'number',
					min: 1,
					required: true,
					name: 'manifestDimension',
					placeholder: 'Dimension of the ' + (i + 1) + 'th manifest variable',
					'data-validators': 'validate-integer'
				}));
				mfs.grab(
					(new Element('p', { 'class': 'manifestNumberDimensionP' })).grab(input),
					'bottom'
				);
			},
			function (p) {
				p.getElement('input').disabled = true;
				p.hide();
			},
			function (p) {
				p.getElement('input').disabled = false;
				p.show();
			},
			syncPlainDataWithManifestVariablesNumber(form)
		);
	}

	function respondentsNumberChangeEvent(form) {
		var tbody = form.getElement('#plainDataTable').getElement('tbody');
		return numberChangeEvent(
			function () {
				return tbody.getElements('tr');
			},
			{
				get: function () { return respondentsNumber; },
				set: function (num) { respondentsNumber = num; }
			},
			function (i) {
				var td = (new Element('td', {
					text: 'Respondent #' + (i + 1)
				}));
				tbody.grab(
					(new Element('tr')).grab(td),
					'bottom'
				);
			},
			function (row) {
				row.hide();
				row.getElements('input').hide();
			},
			function (row) {
				row.show();
			},
			syncPlainDataWithManifestVariablesNumber(form)
		);
	}

	function dataTypeChangeEvent(form) {
		return function (event) {
			var value = form.getElement('input[name="dataType"]:checked').value;

			form.getElement('#rawDataFieldset').hide();
			form.getElement('#plainDataFieldset').hide();

			if (value === 'raw') {
				form.getElement('#rawDataFieldset').show();
			}

			if (value === 'plain') {
				form.getElement('#plainDataFieldset').show();
			}
		};
	}

	function initField(form, fieldName, changeEvent, defaultValue) {
		var fields = form.getElements('input[name="' + fieldName + '"]'),
			type = form.getElement('input[name="' + fieldName + '"]').type,
			fieldToSet;

		fields.addEvent('change', changeEvent).addEvent('input', changeEvent);

		if (type === 'radio') {
			form.getElement('input[name="' + fieldName + '"][value="' + defaultValue + '"]').set('checked', true);
		} else {
			fields.set('value', defaultValue);
		}

		fields.fireEvent('change');
	}

	initField(form, 'latentNumber', latentVariablesNumberChangeEvent(form), 1);
	initField(form, 'manifestNumber', manifestVariablesNumberChangeEvent(form), 1);
	initField(form, 'dataType', dataTypeChangeEvent(form), 'raw');
	initField(form, 'respondentsNumber', respondentsNumberChangeEvent(form), 1);
});
