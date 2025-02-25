function create_filter_selected(selector, data)
{
	return new Vue({
		el: selector,
		data: data,
		computed: {
			view: function() {
				let result = [];
				
				for (let index in this.params)
				{
					const param = this.params[index];
					if (!this.values[param.id])
					{
						continue;
					}
	
					const value = this.values[param.id];
					const item = {
						id: param.id,
						name: param.name,
						type: param.type
					};
					
					if (param.type === this.types.list)
					{
						item.list = param.list.filter(function(v) {
							return value.indexOf(v.id) !== -1;
						});
					}
					else if (param.type === this.types.number)
					{
						item.min = value.min;
						item.max = value.max;
					}
					else if (param.type === this.types.bool)
					{
					}
					else
					{
						continue;
					}
	
					result.push(item);
				}
				if (result.length>0){
					$('.js-clear-filter').show()
				} else {
					$('.js-clear-filter').hide()
				}
				return result;
			}
		},
		methods: {
			number_text: function(number, textes) {
				return number_text(number, textes);
			},
			_disable: function(param, value) {
				filter.filter_pause = true;
	
				if (param.type === this.types.list)
				{
					const $input = filter.$.find('input[data-key=' + param.id + '][value=' + value + ']');
					let countValueItem=$input.closest('.catalog_filter_item').find('.catalog_filter_item_header_count_label');
					let countValue=parseInt(countValueItem.attr('data-value'));
					countValue--;
					countValueItem.text(countValue);
					countValueItem.attr('data-value', countValue)
					$input[0].checked = false;
				}
				else if (param.type === this.types.number)
				{
					const $inputs = filter.$.find('input[data-key=' + param.id + ']');
					var slider = filter._slider($inputs);
	
					slider.instance.limitMin = parseInt(slider.instance.options.range.min);
					slider.instance.limitMax = parseInt(slider.instance.options.range.max);

					slider.instance.set([slider.instance.limitMin, slider.instance.limitMax]);
				}
				else if (param.type === this.types.bool)
				{
					const $input = filter.$.find('input[data-key=' + param.id + ']');
					$input[0].checked = false;
				}
	
				filter.setOrder(param.id);
				filter.filter_pause = false;
				filter.apply();
				$('.new_switch_catalog input').prop('checked', false);
			},
			clear: function() {
				filter.clear();
			}
		}
	});
}

function filter_init_sliders($navRange)
{
	$navRange.each(function() {
		const $e = $(this);
		var min = parseFloat($e.data('min-value') || 0),
			max = parseFloat($e.data('max-value') || 1000),
			currentMin = parseFloat($e.data('current-min-value') || min),
			currentMax = parseFloat($e.data('current-max-value') || max),
			step = parseFloat($e.data('step') || 1),
			$inputMin = $e.find('input.js-range-input-min'),
			$inputMax = $e.find('input.js-range-input-max'),
			$slider = $e.find('.js-range-slider');
			
			if(!$inputMin.length && $e.data('input-min-target')) $inputMin = $($e.data('input-min-target'));
			if(!$inputMax.length && $e.data('input-max-target')) $inputMax = $($e.data('input-max-target'));

		if ($slider.length && ($inputMin.length || $inputMax.length))
		{
			var keypressSlider = $slider[0], digs = 0;
			if ($inputMin.length && $inputMax.length)
				var inputs = [$inputMin[0], $inputMax[0]],
					start_vals = [currentMin, currentMax],
					connect_val = true;
			else if($inputMin.length)
				var inputs = [$inputMin[0]],
					start_vals = [currentMin],
					connect_val = 'lower';
			else if($inputMax.length)
				var inputs = [$inputMax[0]],
					start_vals = [currentMax],
					connect_val = 'upper';

			if(step < 1){
				//const digs = x => ( (x.toString().includes('.')) ? (x.toString().split('.').pop().length) : (0) );
				const decimals = x => ~(x + '').indexOf('.') ? (x + '').split('.')[1].length : 0;
				digs = decimals(step);
				//format_val = wNumb({ decimals: d });
			}
			noUiSlider.create(keypressSlider, {
				start: start_vals,
				setp: step,
				connect: connect_val,
				direction: 'ltr',
				range: {
					'min': [min, step],
					'max': [max]
				},
			});
			Inputmask({ 
				alias: "numeric",
				groupSeparator: " ", // разделитель тысяч
				autoGroup: true,
				digits: 0, // без дробной части
				rightAlign: false, // выравнивание слева
				clearMaskOnLostFocus: false // сохраняет формат при потере фокуса
			  }).mask($inputMin);
			
			  Inputmask({ 
				alias: "numeric",
				groupSeparator: " ",
				autoGroup: true,
				digits: 0,
				rightAlign: false,
				clearMaskOnLostFocus: false 
			  }).mask($inputMax);

			keypressSlider.noUiSlider.limitMin = min;
			keypressSlider.noUiSlider.limitMax = max;

			keypressSlider.noUiSlider.on('change', function (values, handle) {
				if (values[handle] < keypressSlider.noUiSlider.limitMin)
				{
					const v = (handle === 0)
						? [keypressSlider.noUiSlider.limitMin, null]
						: [null, keypressSlider.noUiSlider.limitMin];
					keypressSlider.noUiSlider.set(v);
				}
				else if (values[handle] > keypressSlider.noUiSlider.limitMax)
				{
					const v = (handle === 0)
						? [keypressSlider.noUiSlider.limitMax, null]
						: [null, keypressSlider.noUiSlider.limitMax];
					keypressSlider.noUiSlider.set(v);
				}
			});

			keypressSlider.noUiSlider.on('update', function(values, handle) {
				const v = parseFloat(values[handle]).toFixed(digs);
				
				if (v < keypressSlider.noUiSlider.limitMin)
				{
					return;
				}
				if (v > keypressSlider.noUiSlider.limitMax)
				{
					return;
				}

				if (inputs[handle].value.replace(/\s/g, '') != v)
				{
					inputs[handle].value = v;
					$(inputs[handle]).trigger('change');
				}
			});
			
			if ($inputMin.length){
				$($inputMin[0]).on('change', function(){
					keypressSlider.noUiSlider.set([this.value.replace(/\s/g, ''), null]);
				})
			}
			if ($inputMax.length){
				$($inputMax[0]).on('change', function(){
					if(this.value){
						keypressSlider.noUiSlider.set([null, this.value.replace(/\s/g, '')]);
				} else {
						keypressSlider.noUiSlider.set([null, keypressSlider.noUiSlider.limitMax]);
					}
				})
			}
		}
	});
}

const filter = {
	$: null,
	loader: null,

	tooltip_timer: null,
	timeout_id: null,

	state_setted: false,
	filter_pause: false,
	last_order: 0,

	category_level_1: '',
	category_level_2: '',
	category_level_3: '',
	change_apply_ev:null,

	init: function($filter) {
		filter.$ = $filter;
		filter.$.find('input[name=token_access]').remove();

		filter.$.find('input').on('change', function(ev) {
			if (filter.filter_pause)
			{
				return ;
			}
			//filter.showLoading(ev);
			filter.setOrder($(this).data('key'));
			let countValueItem=$(ev.target).closest('.catalog_filter_item').find('.catalog_filter_item_header_count_label');
			let countValue=parseInt(countValueItem.attr('data-value'));
			if(ev.target.checked){
				countValue++;
			} else {
				countValue--;
			}
			countValueItem.text(countValue);
			countValueItem.attr('data-value', countValue)
			clearTimeout(filter.timeout_id);
			filter.timeout_id = setTimeout(function(){
				filter.change_apply_ev=ev;
				filter.apply(ev);
			}, 200);

			return false;
		});

		filter.$.find('.js-filter-option-more').on('click', function(){
			const $more = $(this);
			const $container=$more.closest('.catalog_filter_item_body');
			const $less = $container.find('.js-filter-option-less');
			const $list = $container.find('.catalog_filter_item_body_additional');
	
			$more.hide();
			$less.show();
			$list.slideDown('slow');
	
			return false;
		});
	
		filter.$.find('.js-filter-option-less').on('click', function(){
			const $less = $(this);
			const $container=$less.closest('.catalog_filter_item_body')
			const $more = $container.find('.js-filter-option-more');
			const $list = $container.find('.catalog_filter_item_body_additional');
	
			$more.show();
			$less.hide();
			$list.slideUp('slow');
	
			return false;
		}).click();
		$('body').on('click', '.js-clear-filter', function(event){
			event.preventDefault();
			filter.change_apply_ev=event;
			filter.clear();
			
		})

	},

	_metrika: function(ev) {
		if (typeof ym != 'undefined')
		{
			ym(ymID, 'reachGoal', 'category_click_filter_brand', {
				category_level_1: filter.category_level_1,
				category_level_2: filter.category_level_2,
				category_level_3: filter.category_level_3,
				brand: $(ev.target).text()
			});
		}

		if (typeof ga != 'undefined')
		{
			ga('send', 'event', 'category', 'click', 'filter_brand', {
				dimension1: filter.category_level_1,
				dimension2: filter.category_level_2,
				dimension3: filter.category_level_3,
				dimension4: $(ev.target).text()
			});
		}
	},

	prepSearch: function (url, ignoreVal) {
		var pairs = url.substring(url.indexOf('?') + 1).split('&'), res = {}, key;
		for (var i = 0; i < pairs.length; i++) {
			if(!pairs[i]) continue;
			var pair = pairs[i].split('=');
			if(pair[1] == ignoreVal) continue;
			key = decodeURIComponent(pair[0]);
			var value = decodeURIComponent(pair[1]);
			if (key.includes('min') || key.includes('max')) {
				value = value.replace(/\s+/g, '');
			}
			if(res[ key ]) {
				if(!Array.isArray(res[ key ])) 
					res[ key ] = [ res[ key ] ];
				
				res[ key ].push(pair[1]);
			} else
				res[ key ] = value;
		 }
		 return res;
	},

	apply: function(ev) {
		if (ev)
		{
			filter._metrika(ev);
		}

		var search = filter.$.serialize();
		//filter.loader.url = './?' + filter.$.serialize() ;
		search = this.prepSearch(search); // ,'-1'
		if (ev)
		{
			filter.loader.on_page.push(function(){
				filter.loader.on_page.pop();
				//filter.showLoaded(ev);
			});
		}
		$('.catalog__block__tagCatalogBlock__tag').removeClass('active');
		for (var key in filter.loader.request) if (key.startsWith('order')) delete filter.loader.request[key];
		for (var key in filter.loader.request) if (key.startsWith('params')) delete filter.loader.request[key];
		for (var key in filter.loader.request) if (key.startsWith('brend')) delete filter.loader.request[key];
		for (var key in filter.loader.request) if (key.startsWith('available')) delete filter.loader.request[key];
		for (var key in filter.loader.request) if (key.startsWith('news')) delete filter.loader.request[key];
		filter.loader.setPage(1, search);
	},

	reset: function() {
		filter.$[0].reset();
		filter.apply();
	},

	clear: function() {
		filter.filter_pause = true;

		filter.$.find('input[name^=order]').each(function(){
			this.value = -1;
		});
		filter.$.find('input[type=checkbox]').each(function(){
			this.checked = false;
		});

		const $sliders = filter.$.find('.js-rangeBlock');
		$sliders.each(function(){
			const $inputs = $(this).find('.new_input_withoutLabel');
			const slider = filter._slider($inputs);
			slider.instance.limitMin = parseInt(slider.instance.options.range.min);
			slider.instance.limitMax = parseInt(slider.instance.options.range.max);
			slider.instance.set([slider.instance.limitMin, slider.instance.limitMax]);
		});
		$('.catalog_filter_item_header_count_label').each(function(){
			$(this).text(0);
			$(this).attr('data-value', 0)
		});
		filter.filter_pause = false;
		filter.apply();
	},

	_tooltipPos: function(ev) {
		const topDelta = $('.catalog_sidebar_filter').offset().top + 10;
		return $(ev.target).offset().top - topDelta;
		
	},

	showLoading: function(ev) {
		if($('#filter_tooltip').length){
			$('#filter_tooltip .tooltip-loader').show();
			$('#filter_tooltip .tooltip-info').hide();
	
			const top = filter._tooltipPos(ev);
			$('#filter_tooltip').finish().css('display', 'block').css('top', top);
		}

	},

	showLoaded: function(ev) {
		if('#filter_tooltip'.length){
			const top = filter._tooltipPos(ev)
			const count = filter.loader.pagination.count;
			const text = number_text(parseInt(count, 10), ['товар', 'товара', 'товаров']);
	
			$('#filter_tooltip .count').html(text);
			$('#filter_tooltip').css('top', top);
			setTimeout(function(){
				$('#filter_tooltip').fadeIn('slow')
			}, 50)
			//$('#filter_tooltip').finish().css('display', 'block').css('top', top);
	
			clearTimeout(filter.tooltip_timer);
	
			filter.tooltip_timer = setTimeout(function(){
				$('#filter_tooltip').fadeOut('slow');
			}, 1500);
		}

	},

	setOrder: function(key) {
		let v = -1;
		const $e = filter.$.find('input[data-key=' + key + ']');
		let setted = false;

		if ($e.first().hasClass('min'))
		{
			const slider = filter._slider($e);
			setted = (slider.$min.val() != slider.instance.limitMin) || (slider.$max.val() != slider.instance.limitMax);
		}
		else
		{
			setted = $e.is(':checked');
		}

		if (setted)
		{
			v = filter.last_order;
			filter.last_order += 1;
		}

		filter.$.find('input[name="order[' + key + ']"]').val(v);
	},

	_slider: function($inputs) {
		const result = {
			$min: $inputs.filter('.js-range-input-min'),
			$max: $inputs.filter('.js-range-input-max'),
			$settings: $inputs.parents('.js-rangeBlock')
		};

		result.$slider = result.$settings.find('.js-range-slider');
		result.instance = result.$slider[0].noUiSlider;

		return result;
	},

	_selected: function($inputs, values) {
		let result = [];
		for (let index in values)
		{
			const v = values[index];
			if ($inputs.filter('[value='+v.id+']:checked').length)
			{
				result.push(v.id);
			}
		}

		return result;
	},

	getValues: function(params) {
		let result = {};

		for (let index in params)
		{
			const param = params[index];
			const $inputs = filter.$.find('input[data-key=' + param.id + ']');

			if (param.type === parametres_types.list)
			{
				const values = filter._selected($inputs, param.list);

				if (values.length)
				{
					result[param.id] = values;
				}
			}
			else if (param.type === parametres_types.number)
			{
				const slider = filter._slider($inputs).instance;
				const values = slider.get();
				//if ((values[0] == slider.options.range.min) && (values[1] == slider.options.range.max))
				if ((values[0] <= slider.limitMin) && (values[1] >= slider.limitMax))
				{
					continue;
				}

				result[param.id] = {
					min: parseInt(values[0]),
					max: parseInt(values[1])
				};
			}
			else if (param.type === parametres_types.bool)
			{
				if ($inputs.is(':checked'))
				{
					result[param.id] = true;
				}
			}
		}

		return result;
	},
	_updateParams: function(current_params) {
		if (current_params == null)
		{
			return;
		}
		
		$.each(current_params, function(k, values) {
			const $inputs = filter.$.find('input[data-key=' + k + ']');
			if(k=='n'&&values.length==0){
				filter.$.find('input[name=news_all]').attr('disabled', true)
			} else {
				filter.$.find('input[name=news_all]').attr('disabled', false)
			}
			if (values.max && values.min)
			{
				return;
				const slider = filter._slider($inputs);

				values.min = parseInt(values.min);
				values.max = parseInt(values.max);
				if (values.min === values.max)
				{
					// values.max += 1;
				}

				const new_values = [null, null];
				if (slider.$min.val() == slider.$settings.data('min-value'))
				{
					new_values[0] = values.min;
					slider.$min[0].value = values.min;
				}
				if (slider.$max.val() == slider.$settings.data('max-value'))
				{
					new_values[1] = values.max;
					slider.$max[0].value = values.max;
				}

				slider.instance.limitMin = values.min;
				slider.instance.limitMax = values.max;

				slider.instance.set(new_values);

				slider.$settings.data('min-value', values.min);
				slider.$settings.data('max-value', values.max);
			}
			else if (values instanceof Array)
			{
				$inputs.each(function(){
					var enabled = ($.inArray(this.value, values) > -1) || ($.inArray(parseInt(this.value), values) > -1);
					this.disabled = !enabled;
				});
			}
			else
			{
				$inputs.attr('disabled', !values);
			}
		});
	},
	setValues: function(current_params) {
		filter.filter_pause = true;

		filter._updateParams(current_params);

		filter.filter_pause = false;

		if (typeof filter_selected !== 'undefined')
		{
			filter_selected.values = filter.getValues(filter_selected.params);
			filter_selected.count = filter.loader.pagination.count;
		}
		if (typeof filter_selected2 !== 'undefined')
			{
				filter_selected2.values = filter.getValues(filter_selected2.params);
				filter_selected2.count = filter.loader.pagination.count;
			}
		if(filter.change_apply_ev){
			filter.showLoaded(filter.change_apply_ev);
			filter.change_apply_ev=null;
		}
		
		if(typeof filter.callback=='function') filter.callback();
	}
}

function init_profile_filter($form, dates)
{
	$form.find('input[name=token_access]').remove();
	$form.find('input.submit,select').on('input', function(){
		$form.submit();
	});

	const $date_periods = $('.js-order-date');
	
	$date_periods.on('click', function(){
		const $e = $(this);
		$('#filter_date_start').val($e.data('start'));
		$('#filter_date_end').val($e.data('end'));
		
		$date_periods.removeClass('b2b__orders__filter-date__btn--active');
		$e.addClass('b2b__orders__filter-date__btn--active');
		
		$form.submit();
	});

	$('.js-order-date-toggle').on('click', function(){
		$(this).hide();
		$('.js-order-date-range').css('display', '');
	});

	const $date_start = $('.js-order-date-start');
	const $date_end = $('.js-order-date-end');
	const $date_end2 = $('.js-order-date-end2');

	$date_start.datepicker({
		defaultDate: dates[0] === '' ? '+0D' : dates[0],
		maxDate: dates[1] === '' ? '+0D' : dates[1],
		minDate: typeof dates[2]!='undefined' ? dates[2] : null,
		// changeMonth: true,
		// numberOfMonths: 1,
		onSelect: function(selectedDate) {
			$date_periods.removeClass('b2b__orders__filter-date__btn--active');
			$date_end.datepicker('option', 'minDate', selectedDate);
			$form.submit();
		}
	});

	$date_end.datepicker({
		defaultDate: dates[1] === '' ? '+0D' : dates[1],
		minDate: dates[0] === '' ? '' : dates[0],
		maxDate: '+0D',
		// changeMonth: true,
		// numberOfMonths: 1,
		onSelect: function(selectedDate) {
			$date_periods.removeClass('b2b__orders__filter-date__btn--active');
			$date_start.datepicker('option', 'maxDate', selectedDate);
			$form.submit();
		}
	});
	$date_end2.datepicker({
		defaultDate: dates[1] === '' ? '+0D' : dates[1],
		minDate: dates[0] === '' ? '' : dates[0],
		// changeMonth: true,
		// numberOfMonths: 1,
		onSelect: function(selectedDate) {
			$date_periods.removeClass('b2b__orders__filter-date__btn--active');
			$form.submit();
		}
	});
}

function init_draft_filter($form, dates){
	$form.find('input[name=token_access]').remove();
	$form.find('input.submit,select').on('input', function(){
		$form.submit();
	});
	$('#date_range').datepicker({
		range: 'period', // режим - выбор периода
		numberOfMonths: 1,
		showOn: 'both',
		defaultDate:null,
		buttonImage: '/img/shopping_cart_details/calendar.svg',
		onSelect: function(dateText, inst, extensionRange) {
		  $('#date_range').val(extensionRange.startDateText + '-' + extensionRange.endDateText);
		  $('#filter_date_start').val(extensionRange.startDateText);
		  $('#filter_date_end').val(extensionRange.endDateText);
		  if(extensionRange.endDateText&&extensionRange.startDateText){
			$('.search_clear--draftDate').show();
		  }
		  $form.submit();
		  inst.inline = true;
		},
		onClose: function(dateText, inst) {
			inst.inline = false;
		}
	});
	if(dates[0] != ''&&dates[1] != ''){
		$('#date_range').datepicker('setDate', [dates[0] === '' ? '+0D' : dates[0], dates[1] === '' ? '+0D' : dates[1]]);
		$('.search_clear--draftDate').show();
	} else {
		$('.search_clear--draftDate').hide();
	}
	let regex = /^\d{2}\.\d{2}\.\d{4}-\d{2}\.\d{2}\.\d{4}$/;
	$('#date_range').on('input', function(){
		if($(this).val().length>0){
			$('.search_clear--draftDate').show();
		} else {
			$('.search_clear--draftDate').hide();
		}
		regex.test($(this).val())
		if(regex.test($(this).val())){
			let valAr=$(this).val().split('-');
			$('#date_range').datepicker('setDate', [valAr[0] ,valAr[1]]);
			$('#filter_date_start').val(valAr[0]);
		  	$('#filter_date_end').val(valAr[1]);
		  	$('#date_range').val(valAr[0] + '-' + valAr[1]);
			$form.submit();
		}
	})

	var extensionRange = $('#date_range').datepicker('widget').data('datepickerExtensionRange');
	if(extensionRange.startDateText && extensionRange.endDateText) {
		$('#date_range').val(extensionRange.startDateText + ' - ' + extensionRange.endDateText);
	}
	$('.search_input_draft').on('input', function(){
		if($(this).val().length>0){
			$('.search_clear--draftName').show();
		} else {
			$('.search_clear--draftName').hide();
		}
	})
	$('.search_clear--draftName').click(function(){
		$('.search_clear--draftName').hide();
		$('.search_input_draft').val('');
		$('.search_input_draft').trigger('input');
	})
	$('.search_clear--draftDate').click(function(){
		$('.search_clear--draftDate').hide();
		$('#date_range').val('');
		$("#date_range" ).datepicker( "setDate");
		$('#filter_date_start').val('');
		$('#filter_date_end').val('');
		$('.search_input_draft').trigger('input');
	})

}
