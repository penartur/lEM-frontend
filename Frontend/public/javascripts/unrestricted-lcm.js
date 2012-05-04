window.addEvent('domready', function () {
	var form = $('unrestrictedLcmForm');
	var monitor = function (fsName, inName, dpName, diName, title) {
		var lfs = form.getElement('#' + fsName);
		lfs.getElement('input[name="' + inName + '"]').addEvent('change', function (event) {
			var num = parseInt(this.value);
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
					type: 'text',
					name: diName,
					title: 'Dimension of the ' + (i + 1) + 'th ' + title + ' variable',
					'data-validators': 'validate-integer'
				}));
				lfs.grab(
				(new Element('p', { class: dpName })).grab(input),
				'bottom'
			);
				new OverText(input);
			}
			OverText.update();
		});
	}

	monitor("latentFieldset", "latentNumber", "latentNumberDimensionP", "latentDimension", "latent");
	monitor("manifestFieldset", "manifestNumber", "manifestNumberDimensionP", "manifestDimension", "manifest");
});
