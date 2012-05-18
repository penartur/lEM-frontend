window.addEvent('domready', function () {
	var form = $('unrestrictedLcmForm');
	var changeEvent = function (lfs, dpName, diName, title) {
		return function (event) {
			var num = parseInt(this.value);
			if (num < 1) {
				return false;
			}
			var items = lfs.getElements('.' + dpName);
			var i;
			for (i = 0; i < items.length; i++) {
				if (i < num) {
					items[i].getElement('input').disabled = false;
					items[i].show();
				} else {
					items[i].getElement('input').disabled = true;
					items[i].hide();
				}
			}
			for (; i < num; i++) {
				var input = (new Element('input', {
					type: 'number',
					step: 'any',
					required: true,
					name: diName,
					placeholder: 'Dimension of the ' + (i + 1) + 'th ' + title + ' variable',
					'data-validators': 'validate-integer'
				}));
				lfs.grab(
					(new Element('p', { class: dpName })).grab(input),
					'bottom'
				);
			}
		};
	};
	var monitor = function (fsName, inName, dpName, diName, title) {
		var lfs = form.getElement('#' + fsName);
		var lin = lfs.getElement('input[name="' + inName + '"]');
		lin
			.addEvent('change', changeEvent(lfs, dpName, diName, title))
			.addEvent('input', changeEvent(lfs, dpName, diName, title))
			.set('value', 1)
			.fireEvent('change');
	}
	monitor("latentFieldset", "latentNumber", "latentNumberDimensionP", "latentDimension", "latent");
	monitor("manifestFieldset", "manifestNumber", "manifestNumberDimensionP", "manifestDimension", "manifest");
});
