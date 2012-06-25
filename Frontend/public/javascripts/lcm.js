"use strict";

/*global window: false*/
window.addEvent('domready', function () {
	/*global $: false, Element: false, Elements: false*/
	var form = $('unrestrictedLcmForm'),
		latentVariablesNumber = 0,
		manifestVariablesNumber = 0,
		respondentsNumber = 0,
		modelType = '',
		dataType = '';

	/// fieldSpec could be either name of input or the single input element itself.
	function initField(form, fieldSpec, changeEvent, defaultValue) {
		var firstField = (typeof (fieldSpec) === 'string') ? form.getElement('input[name="' + fieldSpec + '"]') : fieldSpec,
			fieldType = firstField.type,
			fieldName = firstField.name,
			fields = ((fieldType === 'radio') || (typeof (fieldSpec) === 'string')) ? form.getElements('input[name="' + fieldName + '"]') : new Elements([fieldSpec]);

		fields.addEvent('change', changeEvent).addEvent('input', changeEvent);

		if (defaultValue !== undefined) {
			if (fieldType === 'radio') {
				form.getElement('input[name="' + fieldName + '"][value="' + defaultValue + '"]').set('checked', true);
			} else {
				fields.set('value', defaultValue);
			}
			fields.fireEvent('change');
		}
	}

	function numberChangeEvent(getExistingList, currentNumber, createNew, disableExisting, enableExisting, postprocess) {
		var postprocesses = Array.prototype.slice.call(arguments, 5);
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
				for (i = 0; i < postprocesses.length; i++) {
					postprocesses[i](num);
				}
			} (parseInt(this.value || '0', 10)));
		};
	}

	function syncManifestVariablesSettingsWithModelType(form) {
		var checkedModelTypeField = form.getElement('input[name="modelType"]:checked') || {},
			checkedModelType = checkedModelTypeField.value,
			mfs = form.getElement('#manifestFieldset'),
			enabler = function (p) {
				p.getElements('[data-datakind="manifestVariableOrder"]').set({ disabled: false }).show();
			},
			disabler = function (p) {
				p.getElements('[data-datakind="manifestVariableOrder"]').set({ disabled: true }).hide();
			},
			mockCurrent = { get: function () { return 0; }, set: function () { } };

		return function () {
			var mockCaller = { value: manifestVariablesNumber };
			numberChangeEvent(
				function () {
					return mfs.getElements('.manifestNumberDimensionP');
				},
				mockCurrent,
				function () {
					throw new Error('We shouldn\'t be here');
				},
				disabler,
				modelType === 'croon' ? enabler : disabler
			).call(mockCaller);
		};
	}

	function syncPlainDataWithManifestVariablesNumber(form) {
		var table = form.getElement('#plainDataTable'),
			thead = table.getElement('thead'),
			tbody = table.getElement('tbody'),
			mockCurrent = { get: function () { return 0; }, set: function () { } },
			disabler = function (td) {
				td.getElement('input').disabled = true;
				td.hide();
			},
			enabler = function (td) {
				td.getElement('input').disabled = false;
				td.show();
			},
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
								max: form.getElement('input[name="manifestDimension"][data-manifestposition="' + i + '"]').value || undefined,
								required: true,
								name: 'answers[' + i + ']',
								'class': 'input-mini',
								placeholder: 'Answer',
								'data-validators': 'validate-integer',
								'data-manifestposition': i
							})),
							td = (new Element('td')).grab(input);

						row.grab(td, 'bottom');
						dataType === 'plain' ? enabler(td) : disabler(td)
					},
					disabler,
					dataType === 'plain' ? enabler : disabler
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
				var dimensionInput = new Element('input', {
					type: 'number',
					min: 1,
					required: true,
					name: 'manifestDimension',
					placeholder: 'Dimension of the ' + (i + 1) + 'th manifest variable',
					'data-validators': 'validate-integer',
					'data-manifestposition': i,
					'data-datakind': 'manifestVariableDimension'
				}),
					orderButtonForward = new Element('button', {
						'class': 'btn',
						type: 'button',
						text: 'Forward',
						value: 'or1',
						'data-datakind': 'manifestVariableOrder'
					}),
					orderButtonReverse = new Element('button', {
						'class': 'btn',
						type: 'button',
						text: 'Reverse',
						value: 'or2',
						'data-datakind': 'manifestVariableOrder'
					}),
					orderValue = new Element('input', {
						type: 'hidden',
						required: true,
						name: 'manifestOrders',
						'data-datakind': 'manifestVariableOrder'
					}),
					inputsGroup = new Element('div', { 'class': 'input-append' }),
					orderChangeEvent = function (event) {
						orderValue.value = this.value;
						orderButtonForward.removeClass('btn-info');
						orderButtonReverse.removeClass('btn-info');
						this.addClass('btn-info');
					};

				orderButtonForward.addEvent('change', orderChangeEvent).addEvent('input', orderChangeEvent).addEvent('click', orderChangeEvent);
				orderButtonReverse.addEvent('change', orderChangeEvent).addEvent('input', orderChangeEvent).addEvent('click', orderChangeEvent);

				inputsGroup.grab(dimensionInput).grab(orderButtonForward).grab(orderButtonReverse);
				mfs.grab(
					(new Element('p', { 'class': 'manifestNumberDimensionP' })).grab(inputsGroup).grab(orderValue),
					'bottom'
				);
				initField(form, dimensionInput, function (event) {
					form.getElement('#plainDataTable').getElements('input[data-manifestposition="' + i + '"]').set({ max: this.value });
				});
				orderChangeEvent.call(orderButtonForward);
			},
			function (p) {
				p.getElement('input').disabled = true;
				p.hide();
			},
			function (p) {
				p.getElement('input').disabled = false;
				p.show();
			},
			syncPlainDataWithManifestVariablesNumber(form),
			syncManifestVariablesSettingsWithModelType(form)
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

	function modelTypeChangeEvent(form) {
		return function (event) {
			modelType = form.getElement('input[name="modelType"]:checked').value;
			syncManifestVariablesSettingsWithModelType(form)();
		};
	}

	function dataTypeChangeEvent(form) {
		return function (event) {
			dataType = form.getElement('input[name="dataType"]:checked').value;

			form.getElement('#rawDataFieldset').hide();
			form.getElement('#rawDataFieldset').getElement('textarea').disabled = true;
			form.getElement('#plainDataFieldset').hide();
			form.getElement('#plainDataFieldset').getElements('input').disabled = true;

			if (dataType === 'raw') {
				form.getElement('#rawDataFieldset').show();
				form.getElement('#rawDataFieldset').getElement('textarea').disabled = false;
			}

			if (dataType === 'plain') {
				form.getElement('#plainDataFieldset').show();
			}

			syncPlainDataWithManifestVariablesNumber(form)();
		};
	}

	initField(form, 'modelType', modelTypeChangeEvent(form), 'croon');
	initField(form, 'latentNumber', latentVariablesNumberChangeEvent(form), 1);
	initField(form, 'manifestNumber', manifestVariablesNumberChangeEvent(form), 1);
	initField(form, 'dataType', dataTypeChangeEvent(form), 'raw');
	initField(form, 'respondentsNumber', respondentsNumberChangeEvent(form), 1);
});
