const popups = {
	urls: null,
	goods2cart: null,

	init: function(elements, urls, urlsRegister, urlDomain,protocol, regionsList,suffix) {
		popups.urls = urls;
		popups.registration._app = popups.registration._init(elements.registration, urlsRegister);
		popups.authorization._app = popups.authorization._init(elements.authorization, urls);
		popups.regionChoose._app = popups.regionChoose._init(elements.regionChoose, urlDomain,protocol, regionsList,suffix);

		popups.feedback._init(elements.feedback);
		popups.callback._init(elements.callback);
		popups.callback_vacancy._init(elements.callback_vacancy);
		popups.suggestionSite._init(elements.suggestionSite);
		popups.cancelOrder._init(elements.cancelOrder);
		popups.drafts._init(elements.drafts);
		popups.sbpqr._init(elements.sbpqr);

		popups._alert.init(elements.alert);
		popups._alertNew.init(elements.alertNew);
		popups._alertNewSuccess.init(elements.alertNewSuccess);
		popups._confirm = new PopupConfirm(elements.confirm);
		popups._tooltip.init(elements.tooltip);
		popups.baseCompany._init(elements.baseCompany);
	},

	alert: function(message, information) {
		popups._alert.open(message, information);
	},
	alertNew: function(message, information,success) {
		popups._alertNew.open(message, information,success);
	},
	alertNewSuccess: function(message, information,success) {
		popups._alertNewSuccess.open(message, information,success);
	},
	/**
	 *
	 * @param {string} message
	 * @param {Function?} action
	 * @param {string?} ok_label
	 * @param {string?} cancel_label
	 * @param {string?} information
	 * @returns {PopupConfirm}
	 */
	confirm: function(message, action, ok_label, cancel_label, information) {
	
		popups._confirm.open(message, action, ok_label, cancel_label, information);
		return popups._confirm;
	},
	registration: {
		_app: null,

		open: function() {
			const app = popups.registration._app;
			if (app != null)
			{
				app.open();
			}
		},
		close: function() {
			const app = popups.registration._app;
			if (app != null)
			{
				app.close();
			}
		},
		_init: function(element, urls) {
			if (element == null)
			{
				return null;
			}

			element.style.display = 'block';
			return _app_registration(element, urls);
		},
	},
	authorization: {
		_app: null,

		open: function(url_skip) {
			const app = popups.authorization._app;
			if (app != null)
			{
				app.open(url_skip);
			}
		},
		close: function() {
			const app = popups.authorization._app;
			if (app != null)
			{
				app.close();
			}
		},
		_init: function(element, urls) {
			if (element == null)
			{
				return null;
			}

			element.style.display = 'block';
			return _app_authorization(element, urls);
		},
	},
	regionChoose: {
		_app: null,

		open: function(url_skip) {
			const app = popups.regionChoose._app;
			if (app != null)
			{
				app.open(url_skip);
			}
		},
		close: function() {
			const app = popups.regionChoose._app;
			if (app != null)
			{
				app.close();
			}
		},
		_init: function(element, urlDomain,protocol, regionsList,suffix) {
			if (element == null)
			{
				return null;
			}

			element.style.display = 'block';
			
			return _app_regionChoose(element, urlDomain,protocol, regionsList,suffix);
		},
	},
	feedback: {
		/**
		 * @var {FormFeedback}
		 */
		_form: null,
		open: function(email) {
			const form = popups.feedback._form;
			if (form != null)
			{
				form.open(email);
			}
		},
		close: function() {
			const form = popups.feedback._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}

			popups.feedback._form = new FormFeedback(element);
		}
	},
	callback: {
		/**
		 * @var {FormCallback}
		 */
		_form: null,
		open: function(email) {
			const form = popups.callback._form;
			if (form != null)
			{
				form.open(email);
			}
		},
		close: function() {
			const form = popups.callback._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}

			popups.callback._form = new FormCallback(element);
		}
	},
	suggestionSite: {
		/**
		 * @var {FormSuggestion}
		 */
		_form: null,
		open: function(email) {
			const form = popups.suggestionSite._form;
			if (form != null)
			{
				form.open(email);
			}
		},
		close: function() {
			const form = popups.suggestionSite._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}

			popups.suggestionSite._form = new FormSuggestion(element);
		}
	},
	callback_vacancy: {
		/**
		 * @var {FormCallbackVacancy}
		 */
		_form: null,
		open: function() {
			const form = popups.callback_vacancy._form;
			if (form != null)
			{
				form.open();
			}
		},
		close: function() {
			const form = popups.callback_vacancy._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {

			if (!element)
			{
				return;
			}

			popups.callback_vacancy._form = new FormCallbackVacancy(element);
		}
	},	
	cancelOrder: {
		/**
		 * @type {FormCancelOrder}
		 */
		_form: null,
		open: function(order_id) {
			const form = popups.cancelOrder._form;
			if (form != null)
			{
				form.open(order_id);
				return form;
			}
		},
		close: function() {
			const form = popups.cancelOrder._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}
			popups.cancelOrder._form = new FormCancelOrder(element);
		}
	},
	drafts: {
		/**
		 * @var {FormDrafts}
		 */
		_form: null,
		draftCallback:[],
		count: function(newCount) {
			const form = popups.drafts._form;
			if (form === null)
			{
				return 0;
			}

			if (typeof newCount !== 'undefined')
			{
				form.count = newCount;
			}

			return form.count;
		},
		open: function(goods_id) {
			const form = popups.drafts._form;
			if (form != null)
			{
				form.open(goods_id);
			}
			
		},
		close: function() {
			const form = popups.drafts._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}
			popups.drafts._form = new FormDrafts(element);

		}
	},
	sbpqr: {
		/**
		 * @var {FormSbpQr}
		 */
		_form: null,
		open: function(order_id, url_qr) {
			const form = popups.sbpqr._form;
			if (form != null)
			{
				form.open(order_id, url_qr);
			}
		},
		close: function() {
			const form = popups.sbpqr._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}

			popups.sbpqr._form = new FormSbpQr(element);
		}
	},

	_alert: {
		_$element: null,
		_$header: null,
		_$information: null,

		init: function(element) {
			popups._alert._$element = $(element);
			popups._alert._$header = popups._alert._$element.find('.alert_heading');
			popups._alert._$information = popups._alert._$element.find('.alert_text');

			// popups._alert._$element.on('click', popups._alert._close);
			popups._alert._$element.find('.system_popup_hide').on('click', popups._alert._close);
			popups._alert._$element.find('.alert_btn').on('click', popups._alert._close);
		},
		open: function(message, information) {
			if (typeof information == 'undefined')
			{
				information = '';
			}

			popups._alert._$header.html(message);
			popups._alert._$information.html(information);
			$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
			$('body').css('overflow-y','hidden');
			popups._alert._$element.css('display', 'block');
		},
		_close: function() {
			popups._alert._$element.css('display', 'none');
			$('body').css('overflow-y','scroll');
			return false;
		},
	},
	_alertNew: {
		_$element: null,
		_$header: null,
		_$information: null,
		_$imgSrc: null,
		_$timeOutClose: null,

		init: function(element) {
			popups._alertNew._$element = $(element);
			popups._alertNew._$header = popups._alertNew._$element.find('.alert_heading');
			popups._alertNew._$information = popups._alertNew._$element.find('.alert_text');
			popups._alertNew._$img = popups._alertNew._$element.find('.new_alert_img');
			popups._alertNew._$element.find('.system_popup_hide').on('click', popups._alertNew._close);
		},
		open: function(message, information, success, useWhiteBg=false) {
			if(useWhiteBg){
				popups._alertNew._$element.addClass('.new_alert_popup--white')
			}
			if (typeof information == 'undefined')
			{
				popups._alertNew._$information.hide();
			} else {
				popups._alertNew._$information.show();
				popups._alertNew._$information.html(information);
			}
			if(typeof success == 'undefined')
			{
				popups._alertNew._$img.hide();
			} else{
				popups._alertNew._$img.show();
				if(success){
					popups._alertNew._$img.attr('src','/img/new_icon/succes.svg');
				} else {
					popups._alertNew._$img.attr('src','/img/new_icon/fail.svg');
				}
			}
			popups._alertNew._$header.html(message);
			popups._alertNew._$timeOutClose=setTimeout(function(){
				popups._alertNew._close();
			},5000)

			popups._alertNew._$element.css('display', 'block');
		},
		_close: function() {
			if(popups._alertNew._$timeOutClose) clearTimeout(popups._alertNew._$timeOutClose);
			popups._alertNew._$element.css('display', 'none');

			return false;
		},
	},
	_alertNewSuccess: {
		_$element: null,
		_$header: null,
		_$information: null,
		_$imgSrc: null,
		init: function(element) {
			popups._alertNewSuccess._$element = $(element);
			popups._alertNewSuccess._$header = popups._alertNewSuccess._$element.find('.alert_heading');
			popups._alertNewSuccess._$information = popups._alertNewSuccess._$element.find('.alert_text');
			popups._alertNewSuccess._$img = popups._alertNewSuccess._$element.find('.new_alert_img');
			popups._alertNewSuccess._$element.find('.system_popup_hide').on('click', popups._alertNewSuccess._close);
		},
		open: function(message, information, success) {
			if (typeof information == 'undefined')
			{
				popups._alertNewSuccess._$information.hide();
			} else {
				popups._alertNewSuccess._$information.show();
				popups._alertNewSuccess._$information.html(information);
			}
			if(typeof success == 'undefined')
			{
				popups._alertNewSuccess._$img.hide();
			} else{
				popups._alertNewSuccess._$img.show();

				switch(success) {
					case 'success':
						popups._alertNewSuccess._$img.attr('src','/img/new_icon/succes.svg');
						break;
					case 'fail':
						popups._alertNewSuccess._$img.attr('src','/img/new_icon/fail.svg');
						break;
					case 'mistake':
						popups._alertNewSuccess._$img.attr('src','/img/new_icon/mistake.svg');
						break;
				}

			}
			popups._alertNewSuccess._$header.html(message);

			$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
			$('body').css('overflow-y','hidden');
			popups._alertNewSuccess._$element.css('display', 'block');
		},
		_close: function() {
			$('body').css('overflow-y','scroll');
			$("body").css('padding-right', '0px');
			popups._alertNewSuccess._$element.css('display', 'none');

			return false;
		},
	},
	/**
	 * @var {PopupConfirm?}
	 */
	_confirm: null,
	_tooltip: {
		_$element: null,
		_$wrap: null,
		_$content: null,

		init: function(element) {
			popups._tooltip._$element = $(element);
			//console.log(element);
			popups._tooltip._$content = popups._tooltip._$element.find('.js-content');
			popups._tooltip._$wrap = popups._tooltip._$element.find('.wrap');

			popups._tooltip._$element.find('.system_popup_hide').on('click', popups._tooltip._close);

			$('body').on('click', '[data-tooltip]', function(event){
				popups._tooltip._open(this, event);

				return false;
			});
			$('body').on('click', function(event){
				popups._tooltip._close_ev(event);
			})
		},
		_open: function(element) {
			const $element = $(element);
			const offset = $element.offset();
			let tooltipData=$element.data('tooltip');
			if (/<[a-z][\s\S]*>/i.test(tooltipData)) {
				// Если это верстка (содержит HTML-теги)
				popups._tooltip._$content.html(tooltipData);
			} else {
				// Если это идентификатор, найти элемент с этим ID и взять его контент
				const $tooltipElement = $(tooltipData);
				const content = $tooltipElement.length ? $tooltipElement.html() : tooltipData;
				popups._tooltip._$content.html(content);
			}
			popups._tooltip._$element.css({
				left: offset.left + 'px',
				top: (offset.top + $element.height()) + 'px',
				transform: 'translate(-50%, -0%)',
			});
			popups._tooltip._$element.css('display', 'block');
		},
		_openCustomText: function(element, text) {
			const $element = $(element);
			const offset = $element.offset();
			const content = text;
			popups._tooltip._$content.html(content);
			let widthPopup=offset.left+300;
			let windowWidth=$(window).width();
			if(widthPopup>windowWidth){
				popups._tooltip._$element.css({
					right: (windowWidth-offset.left) + 'px',
				})
			} else {
				popups._tooltip._$element.css({
					right:'unset',
					left: offset.left + 'px',
					transform: 'translate(-50%, -0%)',
				})
			}
			popups._tooltip._$element.css({
				top: (offset.top + $element.height()) + 'px',
				
			});
			popups._tooltip._$element.find('.bubble').css({
				marginTop:'0',
			});
			popups._tooltip._$element.css('display', 'block');
		},
		_close_ev: function (event) {
			if (!$(event.target).closest("#popup_tooltip").length) {
				popups._tooltip._close();
			}
		},
		_close: function() {
			popups._tooltip._$element.css('display', 'none');
		},
	},
	baseCompany: {
		/**
		 * @var {FormBaseCompany}
		 */
		_form: null,
		open: function(email) {
			const form = popups.baseCompany._form;
			if (form != null)
			{
				form.open(email);
			}
		},
		close: function() {
			const form = popups.baseCompany._form;
			if (form != null)
			{
				form.close();
			}
		},
		_init: function (element) {
			if (!element)
			{
				return;
			}

			popups.baseCompany._form = new FormBaseCompany(element);
		}
	},
};

class PopupConfirm
{
	/**
	 *
	 * @param {HTMLElement} element
	 */
	constructor(element)
	{
		this._$element = $(element);
		this._$header = this._$element.find('.alert_heading');
		this._$information = this._$element.find('.alert_text');
		this._$ok = this._$element.find('.js-ok');
		this._$cancel = this._$element.find('.js-cancel');

		/**
		 *
		 * @type {Function|null}
		 * @private
		 */
		this._resolve = null;

		/**
		 *
		 * @type {Function|null}
		 * @private
		 */
		this._ok_action = null;

		const self = this;
		this._$element.on('click', () => self._close(false));
		this._$element.find('.system_popup_hide').on('click', () => self._close(false));
		this._$cancel.on('click', () => self._close(false));
		this._$ok.on('click', () => self._close(true));
	}

	/**
	 *
	 * @param {Function} resolve
	 */
	then(resolve)
	{
		if (this._resolve != null)
		{
			this._resolve(false);
		}

		this._resolve = resolve;
	}

	/**
	 *
	 * @param {string} message
	 * @param {Function?} action
	 * @param {string?} ok_label
	 * @param {string?} cancel_label
	 * @param {string?} information
	 */
	open(message, action, ok_label, cancel_label, information)
	
	{		
		if (typeof action == 'undefined')
		{
			action = null;
		}
		if (typeof ok_label == 'undefined')
		{
			ok_label = 'ОК';
		}
		if (typeof cancel_label == 'undefined')
		{
			cancel_label = 'Отмена';
		}
		if (typeof information == 'undefined')
		{
			this._$information.hide();
		} else {
			this._$information.show();
			this._$information.html(information);
		}



		this._ok_action = action;
		this._$ok.html(ok_label);
		this._$cancel.html(cancel_label);
		this._$header.html(message);
		
		this._$element.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		$('body').css('overflow-y','hidden');
	}

	/**
	 *
	 * @param {boolean} ok
	 * @returns {boolean}
	 * @private
	 */
	_close(ok)
	{
		if (ok && (this._ok_action != null))
		{
			this._ok_action();
			this._ok_action = null;
		}
		if (this._resolve != null)
		{
			this._resolve(ok);
			this._resolve = null;
		}
		if($('.modal-wrapper--cart:visible:last').length==0){
			$("body").css('padding-right', '0px');
			$('body').css('overflow-y','auto');
		}
		this._$element.css('display', 'none');
		return false;
	}
}

class FormDrafts
{
	count = 0;
	$el = null;
	_authorized = false;
	_goods_id = null;
	callbacks = [];
	constructor(element)
	{
		const self = this;

		if (element != null)
		{
			this.$el = $(element);

			this._hide_results();
			this._authorized = true;
			this.callbacks=[];

			this.$el.on('click', function (event) {
				if (!$(event.target).closest(".wrap").length) {
					self.close();
					return false;
				} else{
					return;
				}			
			});

			this.$el.find('.system_popup_hide, .cancle').on('click', function () {
				self.close();
				return false;
			});

			this.$el.find('.add').on('click', function () {
				self._send();
				return false;
			});

			this.$el.find('form').on('submit', function () {
				self._send();
				return false;
			});
			this.$el.find('.addToDraft_popup_input').on('click', function(){
				$('#draft_new').prop('checked', true);
			})
		}

		// карточка товара
		const $body = $('body');
		$body.on('click', '.goods_card_icon_draft', function () {
			const goods_id = $(this).parents('.js-card-wrapper').data('id');
			self.open(goods_id);

			return false;
		});


		// страница товара
		$('.draft-link').on('click', function () {
			const goods_id = $(this).parents('.catalog__goods__header_action').data('id');
			self.open(goods_id);

			return false;
		});
		$(window).on('resize', function(){
			let heigth=$(window).height()-24 - 24 - 80 - 16 - 24 - 42 - 40;
			if(heigth<500){
				$('.addToDraft_popup_capcha_block').css('max-height', heigth+'px');
			} else {
				$('.addToDraft_popup_capcha_block').css('max-height', '500px');
			}
		})
	}

	open(goods_id)
	{
		if (!this._authorized)
		{
			popups.registration.open();
		}

		const request = {
			goods_id: goods_id
		};

		const self = this;
		$.ajax({
			type: 'POST',
			url: '/ajax/draft/',
			data: request,
			dataType: 'json',
			success: function(draft_ids) {
				self._open(goods_id, draft_ids);
				
			},
		});
	}

	_open(goods_id, draft_ids)
	{
		this._goods_id = goods_id;
		this.$el.find('input[name=draft_id]').each(function(){
			this.disabled = $.inArray(parseInt(this.value), draft_ids) !== -1;
			this.checked = this.checked && !this.disabled;
		});
		let heigth=$(window).height()-24 - 24 - 80 - 16 - 24 - 42 - 40;
		if(heigth<500){
			$('.addToDraft_popup_capcha_block').css('max-height', heigth+'px');
		} else {
			$('.addToDraft_popup_capcha_block').css('max-height', '500px');
		}
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
        $('body').css('overflow-y','hidden');
		this.$el.css('display', 'block');
		$('#draft_new').prop('checked', true);
	}

	close()
	{
		if (this.$el == null)
		{
			return;
		}

		this._reset();
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
        $('body').css('overflow-y','auto');
	}

	_show_results()
	{
		this.$el.find('.js-form').hide();
		this.$el.find('.js-results').show();
	}

	_hide_results()
	{
		this.$el.find('.js-form').show();
		this.$el.find('.js-results').hide();
	}

	_send()
	{
		const $draft_id = this.$el.find('input[name=draft_id]:checked');
		if ($draft_id.length === 0)
		{
			popups.alertNew('Не выбрана смета.','',false);
			return;
		}

		const request = {
			draft_id: this.$el.find('input[name=draft_id]:checked').val(),
			draft_name: $.trim(this.$el.find('input[name=draft_name]').val()),
			add: this._goods_id,
		};

		if ((request.draft_id === '0') && (request.draft_name === ''))
		{
			popups.alertNew('Не указано название сметы.','',false);
			return;
		}

		const self = this;
		$.ajax({
			type: 'POST',
			url: '/ajax/draft/',
			data: request,
			dataType: 'json',
			success: function(response) {
				self.count = response.count;
				
				if((request.draft_id === '0') && response.name){
					
					let newItem=$('.addToDraft_popup_list_item--main:last').clone();
					newItem.find('input').attr("id", 'draft_'+(response['count'])).attr('checked','checked').val(response['draft']['id']);
					newItem.find('label').attr("for", 'draft_'+(response['count'])).text(response['name']);
					newItem.find('input[name="draft_name"').remove();
					$('.addToDraft_popup_capcha_block').append(newItem);
				}
				let $card=$('.js-card-wrapper[data-id="'+self._goods_id+'"]');
				$card.find('.goods_card_icon_draft').addClass('active');
				self._show_results();
				for (let i in popups.drafts.draftCallback)
					{
						popups.drafts.draftCallback[i](response);
					}
			},
		});
	}

	_reset()
	{
		this._hide_results();
		this.$el.find('form')[0].reset();
	}
}

class FormSbpQr
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;
		this.$form = this.$el.find('form');

		const $message = this.$form.find('textarea');

		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}

			self.close();

			return false;
		});

		this.$el.find('.system_popup_hide').on('click', function () {
			self.close();

			return false;
		});

		this.$form.find('.system_popup_tag').on('click', function () {
			$message.val($message.val() + $(this).text() + ' ');
		});

		this.$form.find('[type=submit]').on('click', function () {
			$('[type=submit]', self.$form).removeAttr('clicked');
			$(this).attr('clicked', 'true');
		});

		this.$form.on('submit', function () {

			const data = new FormData(this);
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: bottom;"/>Отправляем...').prop('disabled', true);

			var btnClicked = $('[type=submit][clicked=true]');
			data.append(btnClicked.attr('name'), btnClicked.attr('value'));

			$.ajax({
				type: 'POST',
				url: '/ajax/order/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					popups.alert(result.error);
					//self.$form.trigger('reset');
					//self.close();
				},
				complete: function(jqXHR, textStatus){
					$submit.each(function(){
						$(this).html($(this).data('text')).prop('disabled', false);
					});
				}
			});

			return false;
		});
	}

	open(order_id, url_qr)
	{
		this.$form.find('input[name=order_id]').val(order_id!=undefined?order_id:'');
		this.$form.find('#inp_order_id_back').val(order_id!=undefined?order_id:'');
		this.$form.find('#lnk_qrcode_pay').attr('href',url_qr!=undefined?url_qr:'#');
		this.$el.css('display', 'block');
	}

	close()
	{
		this.$el.css('display', 'none');
	}
}

class FormCallback
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;
		this.$form = this.$el.find('form');
		
		const $message = this.$form.find('textarea');
		
		

		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}

			self.close();

			return false;
		});

		this.$el.find('.system_popup_hide').on('click', function () {
			self.close();

			return false;
		});

		this.$form.find('.system_popup_tag').on('click', function () {
			$message.val($message.val() + $(this).text() + ' ');
		});

		this.$form.on('submit', function () {
			const $disabled = $(this).find('[disabled]');
			$disabled.attr('disabled', false);
			const data = new FormData(this);
			$disabled.attr('disabled', true);
			if($('#re-captcha-callback').length){
				var capId = $('#re-captcha-callback').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
				if (!captcha.length) {
					popups.alert('* Вы не прошли проверку "Я не робот"');
					return false;
				}
			}

		
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);

			$.ajax({
				type: 'POST',
				url: '/ajax/callback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_callback');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'callback');

						popups.alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время!');
						self.$form.trigger('reset');

						self.close();
					}
					else
					{
						popups.alert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				}
			});

			return false;
		});
	}

	open(email)
	{
		this.$form.find('input[name=manager_email]').val(email!=undefined?email:'');
		this.$el.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		$('body').css('overflow-y','hidden');

	}

	close()
	{
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
		$('body').css('overflow-y','scroll');
	}
}



class FormSuggestion
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;

		this.$form = this.$el.find('form');
		
		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}

			self.close();
			return false;
		});
		this.$el.find('.system_popup_hide').on('click', function () {
			self.close();

			return false;
		});

		this.$form.find('button.system_popup_file_btn').on('click', function (event) {
			event.preventDefault();

			const total = self.$el.find('input[type=file]').length + 1;
			const name = 'contacts_files_' + total;

			if (total < 5)
			{
				const $input = $('<input type="file" name="' + name + '" accept="image/jpeg,image/png,image/gif,application/pdf,application/zip,application/x-rar-compressed,application/rtf,application/msword,application/vnd.ms-excel,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet">');

				$input.on('change', function () {
					const $e = $(this);
					if (!self.validateFile(this))
					{
						$e.remove();
						return;
					}

					const f = this.files[0];
					self.$form.append($e);
					self.$form.find('ul.system_popup_file_container').show();
					self.$form.find('ul.system_popup_file_container').append('<li><div class="item">' + f.name + ' (' + f.size + ')</div><div class="item_delete" data-id="' + name + '"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.875L9.125 0L5 4.125L0.875 0L0 0.875L4.125 5L0 9.125L0.875 10L5 5.875L9.125 10L10 9.125L5.875 5L10 0.875Z" fill="#AEAEAE"/></svg></div></li>');
				});

				$input.hide();
				$input.trigger('click');
			}
		});



		this.$form.on('click', '.item_delete', function () {
			const $e = $(this);
			const total = self.$el.find('input[type=file]').length-1;
			const name = $e.data('id');

			$e.parent().remove();
			self.$el.find('input[type=file][name="' + name + '"]').remove();
			if(total<1){
				self.$form.find('ul.system_popup_file_container').hide();
			}
		});

		this.$form.on('submit', function () {

			var capId = $('#re-captcha-suggestion').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
			if (!captcha.length) {
				popups.alert('* Вы не прошли проверку "Я не робот"');
				return false;
			}
			
			const data = new FormData(this);

			const site_form = data.get('site_form');
			if(site_form) data.delete('site_form');
			//data.append('g-recaptcha-response', captcha);
			
			const $submit=$('button[type="submit"]',this);

			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: bottom;"/>Отправляем...').prop('disabled', true);
			$.ajax({
				type: 'POST',
				url: '/ajax/feedback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_send_message');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'send_message');

						if(!site_form) self.close();
						//popups.alert('Спасибо за Ваше сообщение!\nМы ответим Вам в ближайшее время!');
						popups.alert('Сообщение отправлено.');
						//document.location.href = '/contacts/?sent';
					}
					else
					{
						popups.alert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					//$submit.show();
					$submit.html('Отправить').prop('disabled', false);
				}
			});
			return false;
		});
	}

	open(email)
	{
		this.$form.find('input[name=manager_email]').val(email!=undefined?email:'');
		this.$el.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		setTimeout(function(){
			$('#popup_suggestion .popups_system_container').css('min-height', ($('#popup_suggestion .wrap').height())+'px');
		},10)
		$('body').css('overflow-y','hidden');
	}

	close()
	{
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
		$('body').css('overflow-y','scroll');
	}

	validateFile(input)
	{
		const _validFileExtensions = [".jpg", ".jpeg", ".gif", ".png", ".pdf", ".zip", ".rar", ".rtf", ".doc", ".docx", ".xls", ".xlsx", ".odt", ".ods"];
		const size_limit = 3 * 1024 * 1024;

		if (input.files.length === 0)
		{
			return false;
		}

		const file = input.files[0];
		if (file.size > size_limit)
		{
			popups.alert('Слишком большой файл.');
			return false;
		}

		const name = file.name.toLowerCase();
		for (let j = 0; j < _validFileExtensions.length; j++)
		{
			const ext = _validFileExtensions[j].toLowerCase();
			if (name.substr(name.length - ext.length, ext.length) === ext)
			{
				return true;
			}
		}

		popups.alert('Недопустимое расширение файла.');

		return false;
	}
}

class FormCallbackVacancy
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;
		this.$form = this.$el.find('form');
		
		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}
			self.close();
			return false;
		});

		this.$el.find('.system_popup_hide').on('click', function () {
			self.close();

			return false;
		});

		this.$form.on('submit', function () {
			const data = new FormData(this);
			
			var capId = $('#re-captcha-callback-vacancy').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
			if (!captcha.length) {
				popups.alert('* Вы не прошли проверку "Я не робот"');
				return false;
			}
			
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);

			$.ajax({
				type: 'POST',
				url: '/ajax/vacancy_api/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'fulfill_without_a_resume');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'callback');

						popups.alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время!');
						self.$form.trigger('reset');

						self.close();
						
					}
					else
					{
						popups.alert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				}
			});

			return false;
		});
	}

	open()
	{
		this.$el.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		$('body').css('overflow-y','hidden');
	}

	close()
	{
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
		$('body').css('overflow', 'auto');
	}
}

class FormFeedback
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;
		const $themes = this.$el.find('input[name=contacts_theme]');
		const $shops = this.$el.find('.js-feedback-shops');
		const $labels = this.$el.find('.system_popup_tag');
		const $themesList = this.$el.find('.system_popup_tags_container:not(.js-feedback-shops) li.system_popup_tag');
		const $shopsList = this.$el.find('.js-feedback-shops li.system_popup_tag');
		this.$form = this.$el.find('form');
		
		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}

			self.close();
			return false;
		});
		this.$el.find('.system_popup_hide').on('click', function () {
			self.close();

			return false;
		});
		this.$el.find('.js-feedback2callback').on('click', function () {
			self.close();
			popups.callback.open();

			return false;
		});

		this.$form.find('button.system_popup_file_btn').on('click', function (event) {
			event.preventDefault();

			const total = self.$el.find('input[type=file]').length + 1;
			const name = 'contacts_files_' + total;

			if (total < 5)
			{
				const $input = $('<input type="file" name="' + name + '" accept="image/jpeg,image/png,image/gif,application/pdf,application/zip,application/x-rar-compressed,application/rtf,application/msword,application/vnd.ms-excel,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet">');

				$input.on('change', function () {
					const $e = $(this);
					if (!self.validateFile(this))
					{
						$e.remove();
						return;
					}

					const f = this.files[0];
					self.$form.append($e);
					self.$form.find('ul.system_popup_file_container').show();
					self.$form.find('ul.system_popup_file_container').append('<li><div class="item">' + f.name + ' (' + f.size + ')</div><div class="item_delete" data-id="' + name + '"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.875L9.125 0L5 4.125L0.875 0L0 0.875L4.125 5L0 9.125L0.875 10L5 5.875L9.125 10L10 9.125L5.875 5L10 0.875Z" fill="#AEAEAE"/></svg></div></li>');
				});

				$input.hide();
				$input.trigger('click');
			}
		});

		$labels.on('click', function () {
			const $e = $(this);
			const $input = $e.find('input');
			$themes.attr('checked', false);
			$input.attr('checked', true).change();
		});

		$themes.on('change', function () {
			const $current = $themes.filter(':checked');
			const value = parseInt($current.val());
			
			$themes.prop('disabled',true);
			$current.prop('disabled',false)
			//self.$form.find('[name="contacts_theme_val"]').val(value);
			
			if (value === 4) // отзыв о работе магазина
			{
				$shops.show();
				$shops.find('input').attr('required', true);
				
			}
			else
			{
				$shops.hide();
				$shops.find('input').attr('required', false);
			}
			setTimeout(function(){
				$('#popup_feedback .popups_system_container').css('min-height', ($('#popup_feedback .wrap').height())+'px');
			},10);
		}).change();

		$themesList.on('click', function () {
			$themesList.removeClass('active');
			$(this).addClass('active');
		});

		$shopsList.on('click', function () {
			$shopsList.removeClass('active');
			$(this).addClass('active');
			$shopsList.find('input').prop('disabled',true);
			$(this).find('input').prop('disabled',false);
			//self.$form.find('[name="contacts_shop_val"]').val($('input', this).val());
		});

		this.$form.on('click', '.item_delete', function () {
			const $e = $(this);
			const total = self.$el.find('input[type=file]').length-1;
			const name = $e.data('id');

			$e.parent().remove();
			self.$el.find('input[type=file][name="' + name + '"]').remove();
			if(total<1){
				self.$form.find('ul.system_popup_file_container').hide();
			}
		});

		this.$form.on('submit', function () {
			//const $disabled = $(this).find('[disabled]');
			//$disabled.attr('disabled', false);
			const data = new FormData(this);
			if($('#re-captcha-feedback').length){
				var capId = $('#re-captcha-feedback').data('widget-id'),
					captcha = grecaptcha.getResponse(capId);
				if (!captcha.length) {
					popups.alert('* Вы не прошли проверку "Я не робот"');
					return false;
				}
			}


			const site_form = data.get('site_form');
			if(site_form) data.delete('site_form');
			
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);
			$.ajax({
				type: 'POST',
				url: '/ajax/feedback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_send_message');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'send_message');

						if(!site_form) self.close();
						//popups.alert('Спасибо за Ваше сообщение!\nМы ответим Вам в ближайшее время!');
						popups.alert('Сообщение отправлено.');
						//document.location.href = '/contacts/?sent';
					}
					else
					{
						popups.alert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					//$submit.show();
					$submit.html('Отправить').prop('disabled', false);
				}
			});
			return false;
		});
	}

	open(email)
	{
		this.$form.find('input[name=manager_email]').val(email!=undefined?email:'');
		this.$el.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		setTimeout(function(){
			$('#popup_feedback .popups_system_container').css('min-height', ($('#popup_feedback .wrap').height())+'px');
		},10)
		$('body').css('overflow-y','hidden');
	}

	close()
	{
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
		$('body').css('overflow-y','scroll');
	}

	validateFile(input)
	{
		const _validFileExtensions = [".jpg", ".jpeg", ".gif", ".png", ".pdf", ".zip", ".rar", ".rtf", ".doc", ".docx", ".xls", ".xlsx", ".odt", ".ods"];
		const size_limit = 3 * 1024 * 1024;

		if (input.files.length === 0)
		{
			return false;
		}

		const file = input.files[0];
		if (file.size > size_limit)
		{
			popups.alert('Слишком большой файл.');
			return false;
		}

		const name = file.name.toLowerCase();
		for (let j = 0; j < _validFileExtensions.length; j++)
		{
			const ext = _validFileExtensions[j].toLowerCase();
			if (name.substr(name.length - ext.length, ext.length) === ext)
			{
				return true;
			}
		}

		popups.alert('Недопустимое расширение файла.');

		return false;
	}
}
function _app_regionChoose(element, urlDomain,protocol, regionsList,suffix){
	const data = {
		visible: false,
		urlDomain:urlDomain,
		protocol:protocol,
		regionsList:regionsList,
		suffix:suffix,
		searchVal:'',
		filterList:[],
	};
return new Vue({
	el: element,
	data: data,
	watch:{
		searchVal(new_value){
			this.filterList=[];
			this.changeValueSearch();
		}	
	},
	methods:{
		open:function(){
			this.visible = true;
			$('.header_region_arrow').toggleClass('rotate');
			$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
			$('body').css('overflow-y','hidden');
		},
		close: function() {
			this.visible = false;
			$('.header_region_arrow').toggleClass('rotate');
			$("body").css('padding-right', '0px');
			$('body').css('overflow-y','auto');
		},
		formatUrl:function(red, latin){
			let url;
			if(!red){
                let pathname = window.location.pathname;
                if (window.location.href.includes('catalog/?viewaction')) {
                    pathname = '/news/';
                }
                if (window.location.href.includes('profile/?draft=')) {
                    pathname = '/profile/?draft=' +  new URLSearchParams(window.location.search).get("draft");
                }
                if (window.location.href.includes('profile/?viewdraft=')) {
                    pathname = '/profile/?viewdraft=' +  new URLSearchParams(window.location.search).get("viewdraft");
                }
				url=this.protocol + '://' + latin + '.' + urlDomain + pathname;
			}
			return url;
		},
		changeValueSearch:function(){
			let self=this;
			regionsList.forEach(function(region){
				let cityList=region.list;
				let result=cityList.filter(function(city){
					return city.name.toLowerCase().includes(self.searchVal.toLowerCase())
				})
				if(result.length){
					let temp={
						'name':region.name,
						'list':result
					}
					self.filterList.push(temp);
				}
			})
		},
		clearVal: function(){
			this.filterList=[];
			this.searchVal='';
		},
		clickToCity:function(url){
			this.close();
			if (parseInt($('.js-cart-quantity').html())!='0')
			{
				popups.confirm('Сменить регион?',function(){
					document.location=url
				},'Сменить регион','Нет', 'В вашей корзине присутствуют товары. При смене региона она будет очищена')
				//confirm_js('<span style="font-family: helveticaneuecyrbold; font-size: 14px;">Обратите внимание!</span><br><br><span style="line-height: 160%;">В вашей корзине присутствует товар.<br>При смене региона она будет очищена.</span>', $(this).attr('href'));
				return false;
			} else{
				document.location=url
			}
		}
	}
})
}

function _app_authorization(element, urls)
{
	const data = {
		errors: {
			phone: '',
			timer: '',
			code: '',
			captcha_login: '',
			block: '',
			password:'',
			login_value:'',

		},

		urls: urls,

		step: 0,
		visible: false,
		sended: false,

		phone: '',
		code: '',
		card: '',
		password: '',
		login_value:'',
		delay: 0,
		countdown: 60,
		url_skip: '',
		focus_mask:false,
		valid_phone:false,
		_delay_start: null,
		_delay_timer: null,
		valid_code:false,
		need_reg: false,
		loading:false,
		loading_phone:false,
		loading_password:false,
		//captchaToken: '',
		allowed: '0123456789',
		full_code: Array(5),
		countRequestCode:0,
		mode:'password',
		mask:null,
		mask_phone:null,
		type_login:false,
		show_inputPassword:false,
		valid_login_auth:false,
		showEight:false,
		firstEmail:false,
		typeTel:false, 
		tempVal:'',
		haveChangeVal:false,
		showButtonLoginPhone:true,
		validate_phone_before:false,
		loading_check_value:false

	};

	return new Vue({
		el: element,
		data: data,
		watch:{
			phone(new_value){
				let newPhone = new_value.replace(/[^0-9]/g, '');
				if(newPhone.length==11){
					this.errors.phone='';
					this.valid_phone=true;
				} else{
					this.valid_phone=false;
				}
			},
			'mask_phone.unmaskedValue':function(new_value){
				this.phone=new_value;
			},
		} ,
		methods: {
			phone_formatFunct(phoneItem){
				const rawPhone = phoneItem.replaceAll(/[^0-9]+/g, '');
				let formattedPhone='';
				if(rawPhone.length==11){
					formattedPhone = '+7'
						+ ' (' + rawPhone.substring(1, 4) + ') '
						+ rawPhone.substring(4, 7) + '-'
						+ rawPhone.substring(7, 9) + '-'
						+ rawPhone.substring(9, 11);
				} else {
					formattedPhone = '+7'
						+ ' (' + rawPhone.substring(0, 3) + ') '
						+ rawPhone.substring(3, 6) + '-'
						+ rawPhone.substring(6, 8) + '-'
						+ rawPhone.substring(8, 10);
				}
				
				return formattedPhone;
			},
			authPassword: function() {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginpass');
                    this.sended = false;
                    return false;
                }
				if(this.sended) return false;
				this._resetErrors();
				this.loading_password=true;
				const self = this;
				this.sended = true;
				this._request({auth_phone: this.login_value, password: this.password, type_login:this.type_login, token: this.captchaToken}, function(response) {
                    self.resetSmartCaptcha('loginpass');
					self.loading_password=false;
					if (response.success)
					{
						dataLayerPush('auth_password');
						var url = new URL(window.location);
						url.searchParams.delete('authorization');
						window.history.pushState({}, '', url);
						document.location.reload();
					}
					else
					{	
						Object.assign(self.errors, response.errors);
						if(response.errors.allInfo){
							response.errors.login_value=response.errors.password
						}
					}
				});
			},
			clearItemValue: function (nameInput) {
				this[nameInput] = "";
				this.errors[nameInput] = "Поле обязательно для заполнения";
				if(nameInput=='login_value'){
					this.mask.value='';
					this.mask.updateOptions( {
						mask: /^\S*@?\S*$/,
						lazy: false,
					});
					this.mask.updateValue();
					this.mask.unmaskedValue='';
					this.show_inputPassword=false;
					this.password='';
					this.errors.password='';
					this.showEight=false;
					this.firstEmail=false;
					this.typeTel=false;
					this.haveChangeVal=false;
					this.showButtonLoginPhone=true;
				}
				this.valid_login_auth=false;
				this.validate_phone_before=false;

				this.loading_check_value=false;
			},
			checkEmptyPassword:function(){
				if(this.password.length>0){
					this.errors.password='';
				}
				if(this.password.length>1&&this.errors.login_value==''&&this.show_inputPassword){
					this.valid_login_auth=true;
				} else{
					this.valid_login_auth=false;
				}
			},

			validateInputType(){
				this.login_value=this.mask.unmaskedValue;
				this.show_inputPassword=false;
				if(/^\d+$/.test(this.login_value) && this.login_value.startsWith('7')){
					if(this.login_value.length==11 ){
						this.type_login='tel';
						this.errors.login_value='';
						this.loading_check_value=true;
						this.checkClientsInBase();
					} else{
						this.errors.login_value='Некорректный формат';
						self.haveChangeVal=false;
					}
				} else{
					var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if(emailRegex.test(this.login_value)) {
						this.errors.login_value='';
						this.type_login='email';
						this.loading_check_value=true;
						this.checkClientsInBase();
					} else if(this.login_value.length==0){
						this.errors.login_value='Поле обязательно для заполнения';
						self.haveChangeVal=false;
					} else {
						this.errors.login_value='Некорректный формат';
						self.haveChangeVal=false;
					}
				}
			},
			checkClientsInBase(){
				if(!this.type_login) return;
				const self= this;
				self.need_reg=false;
				
				this._request({checkClients: this.login_value, type_login:this.type_login}, function(response) 
				{
					let result = response.res !== undefined ? response.res : response, timerVal = 0;
					if(response.timer !== undefined) timerVal = response.timer;
					else if(response.errors.timer !== undefined) timerVal = response.errors.timer; 
					if (timerVal) {
						self.countdown=timerVal;
						// self._codeStep1();
					}
					self.loading_check_value=false;

					if (result.success)
					{
						let have_clients = response.need_reg !== undefined && !response.need_reg;
						self.showButtonLoginPhone = self.type_login != 'tel' && !have_clients;
						self.show_inputPassword = have_clients;
						
						if(have_clients)
							self.checkEmptyPassword();
						else {
							if(self.type_login=='tel'){
								if(response.send_code){
									self.phone=self.login_value.substr(1);
									self.countRequestCode=0;
									self.need_reg=true;
									self._codeStep1();
								}
							} else
								self.errors.login_value='Email не обнаружен. Войдите по номеру телефона';
						}
					}
					else
					{
						Object.assign(self.errors, result.errors);
					}
				});
			},
			handleSubmit(event) {
                if(event !== undefined) {
                    event.preventDefault(); // предотвращаем перезагрузку страницы
                }

				if (this.mode === 'resetPassword') {
					this.resetCode();
				} else{
					this.requestCode();
				}
			},
			handleSubmitStep2(event) {
                if (event !== undefined) {
                    event.preventDefault();
                }
				if (this.mode === 'resetPassword') {
					this.forgetPasswordCode();
				} else {
					this.authCode();
				}
			},
			resetCode(){
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginsms');
                    this.sended = false;
                    return false;
                }
				if(this.sended) return false;
				this._resetErrors();
				this.loading_phone=true;
				const self = this;
				this.sended = true;
				let captcha = true;
				this._request({forgot: this.phone, token: this.captchaToken}, function(response) {
                    self.resetSmartCaptcha('loginsms');
					self.loading_phone=false;

					let result = response.res !== undefined ? response.res : response;
					if (result.success) {
						if (response.timer) self.countdown=response.timer;
						self._codeStep1();
					} else {
						Object.assign(self.errors, result.errors);
					}
				});
			},
			forgetPasswordCode(){
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('restorepass');
                    this.sended = false;
                    return false;
                }
				if(this.sended) return false;
				this._resetErrors();
				this.loading=true;
				const self = this;
				this.sended = true;
				this._request({restore: this.phone, code: this.code, token: this.captchaToken}, function(response) {
                    self.resetSmartCaptcha('restorepass');
					self.loading=false;
					if (response.success)
					{
						dataLayerPush('auth_forget_password');

						self._reset()
						setTimeout(function(){
							var ip;
							if(self.mode=='sms'|| self.mode=='resetPassword'){
								ip = self.$refs.inp_phone;
							} else{
								ip = self.$refs.inp_login;
							}
							self.setCursorPosition();
		
							ip.focus();
						},10);
						popups.alertNew('Пароль изменен','Новый пароль отправлен Вам на указанный номер', true)
					}
					else
					{
						self.valid_code=false;
						Object.assign(self.errors, response.errors);
					}

				});
			},
			toggleMode(newVal){
				this.mode=newVal;
				const self=this;
				self._resetValue();
				setTimeout(function(){
					var ip;
					if(self.mode=='sms'|| self.mode=='resetPassword'){
						ip = self.$refs.inp_phone;
					} else{
						ip = self.$refs.inp_login;
					}
					self.setCursorPosition();

					ip.focus();
				},10);
			},
			showMaskFunction:function(){
				var self=this;
				
				//this.setCursorPosition()
				this.focus_mask = true;
				let phoneNumber=self.mask_phone.unmaskedValue;
				if(phoneNumber.length==0){
						
					let maskOptions2 = {
						mask: '+{7} (#00) 000-00-00',
					 
						definitions: {
							'#': /[01234569]/
						},
						placeholderChar: '_',
						lazy: false
					};
					self.mask_phone.updateOptions(maskOptions2);
					self.mask_phone.updateValue();
				}
				setTimeout(function(){
					//let newPhone = self.phone.replace(/[^0-9]/g, '');

					if(phoneNumber.length==0){
						
						self.setCursorPosition();
					}
				})
			},
			setCursorPosition:function(){
				var ip;
				if(this.mode=='sms'|| this.mode=='resetPassword'){
					ip = this.$refs.inp_phone;
				} else{
					ip = this.$refs.inp_login;
				}
				if (ip.createTextRange) {
					
				   var part = ip.createTextRange();
				   part.move("character", 4);
				   part.select();
			   } else if (ip.setSelectionRange) {
				   ip.setSelectionRange(4, 4);
			   }
	
			},
			hideMaskFunction:function(){
				let newPhone=this.mask_phone.unmaskedValue;
				if(newPhone.length===1||newPhone.length===0){
					this.phone='';
					this.focus_mask = false;
					this.valid_phone=false;
					this.errors.phone='Поле обязательно для заполнения';
					let maskOptions2 = {
						mask: '+{7} (#00) 000-00-00',
					 
						definitions: {
							'#': /[01234569]/
						},
						placeholderChar: '_',
						lazy: true
					};
					this.mask_phone.updateOptions(maskOptions2);
					this.mask_phone.updateValue();
					this.mask_phone.value='';
					this.mask_phone.unmaskedValue='';
				} else if(newPhone.length>1&&newPhone.length<11){
					this.errors.phone='Некорректно введен номер ';
				}
				
			},
			clearPhoneInput:function(){
				this.phone='';
				this.focus_mask = false;
				this.valid_phone=false;
				this.errors.phone='Поле обязательно для заполнения';
				let maskOptions2 = {
					mask: '+{7} (#00) 000-00-00',
				 
					definitions: {
						'#': /[01234569]/
					},
					placeholderChar: '_',
					lazy: true
				};
				this.mask_phone.updateOptions(maskOptions2);
				this.mask_phone.value='';
				this.mask_phone.unmaskedValue='';

			},
			open: function(url_skip) {
				const self = this;
				var url = new URL(window.location);
				url.searchParams.set('authorization','open');
				window.history.pushState({}, '', url);

				
				if (typeof url_skip == 'undefined')
				{
					url_skip = '';
				}

				this.url_skip = url_skip;
				this.visible = true;
				this.focus_mask = true;

				$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
				$('body').css('overflow-y','hidden');
				setTimeout(function(){
					var ip;
					if(self.mode=='sms'){
						ip = self.$refs.inp_phone;
					} else{
						ip = self.$refs.inp_login;
					}
					self.setCursorPosition();

					ip.focus();
					$('.slider-auth').slick({
						dots: true,
						infinite: true,
						speed: 300,
						slidesToShow: 1,
						autoplay: true,
						autoplaySpeed: 6000,
					});
					//$('.slider-auth').slick('slickPlay')
				},10);
			},
			close: function() {

				this._reset();
				this.visible = false;
				var url = new URL(window.location);
				url.searchParams.delete('authorization');
				$('.slider-auth').slick('unslick')
				window.history.pushState({}, '', url);
				$("body").css('padding-right', '0px');
				$('body').css('overflow-y','scroll');
			},
			_resetErrors: function() {
				for (let k in this.errors)
				{
					this.errors[k] = '';
				}
			},
			_reset: function() {
				this.step = 0;
				this.mode = 'password';
				this._resetValue();
			},
			_resetValue:function(){
				this.phone = '';
				this.code = '';
				this.password = '';
				this.login_value = '';
				this.captcha_login = '';
				this.valid_code=false;
				this.valid_phone=false;
				this.focus_mask=false;
				this.full_code=Array(5),
				this._resetErrors();
				this.countRequestCode=0;
				this.mask.value='';
				this.mask.updateOptions( {
					mask: /^\S*@?\S*$/,
					lazy: false,
				});
				this.mask.updateValue();
				this.mask.unmaskedValue='';
				this.mask_phone.value='';
				this.mask_phone.unmaskedValue='';
				this.show_inputPassword=false;
				this.showEight=false;
				this.firstEmail=false;
				this.typeTel=false;
				this.haveChangeVal=false;
				this.loading_phone=false;
				this.loading=false;
				this.validate_phone_before=false;
				this.showButtonLoginPhone=true;
				this.loading_check_value=false;
			},

			_codeStep1: function() {
				this.step = 1;
				this._delay_start = new Date();
				this.code='';
				this.full_code=Array(5);
				this.valid_code=false;

				setTimeout(()=>{$('.js-code-auth')[0].focus();},150)
				
				const self = this;
				this._delay_timer = setInterval(function(){
					self._delayHandler();
				}, 1000);	
			},
			codeInputFunction: function($event,key){
				if (this.allowed.includes($event.data))
				{
					this.full_code[key] = $event.data;
					$($event.target).next().focus()
					this.trySendCode();
				}
				else
				{
					this.full_code[key] = '';
					$event.preventDefault();
					//$event.stopPropagation();
				}
			},
			CheckLengthCodeItem:function(key,$event){
				if (($event.code === 'ArrowLeft') && (key > 0))
				{
					$event.preventDefault();
					$event.stopPropagation();
					$($event.target).prev().focus();
				}
				else if (($event.code === 'ArrowRight') && (key < 6))
				{
					$event.preventDefault();
					$event.stopPropagation();
					$($event.target).next().focus();
				}
				else if (($event.code === 'Backspace') && (key > 0))
				{
					$($event.target).val('');
					this.full_code[key] = '';
					$($event.target).prev().focus();
					$event.preventDefault();
					$event.stopPropagation();
					if(this.countRequestCode<3){
						this.errors.code='';
					}
				}
			},
			_delayHandler: function() {
				const seconds = Math.round(((new Date()) - this._delay_start) / 1000);
				this.delay = Math.max(0, this.countdown - seconds);
				if (this.delay === 0)
				{
					clearInterval(this._delay_timer);
				}
			},
			requestCode: function() {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginsms');
                    this.sended = false;
                    return false;
                }
				if(this.sended) return false;
				this._resetErrors();
				this.loading_phone=true;
				
				const self = this;
				let captcha = true;
				this.sended = true;
				this.countRequestCode=0;
				self.loading=false;
				this._request({request_code: this.phone, token: this.captchaToken}, function(response) {
                    self.resetSmartCaptcha('loginsms');
					self.loading_phone=false;
					let result = response.res !== undefined ? response.res : response;
					if (result.success) {
						if (response.timer) self.countdown=response.timer;
						else if(result.timer) self.countdown=result.timer;
						self.need_reg = response.need_reg;
						self._codeStep1();
					} else {
						Object.assign(self.errors, result.errors);
					}
				});
			},
			authCode: function() {
				if(this.sended) return false;
				if(this.errors.block) return false;
				this._resetErrors();
				this.loading=true;
				const self = this;
				this.sended = true;
				this.countRequestCode++;
				this._request({auth_code: this.code, phone: this.phone, need_reg: this.need_reg?1:0}, function(response) {
					if (response.success)
					{
						dataLayerPush('auth_sms');

						if(self.need_reg){
							self.step=3;
						} else {
							var url = new URL(window.location);
							url.searchParams.delete('authorization');
							window.history.pushState({}, '', url);
							document.location.reload();
						}
					}
					else
					{
						Object.assign(self.errors, response.errors);
						self.loading=false;
						self.valid_code=false;
						// self.code='';
						// self.full_code=Array(5);
						// setTimeout(()=>{$('.auth-codeForm__input')[0].focus();},150);
					}
				});
			},

			_request: function(request, onresponse) {
				const self=this;
				const settings = {
					method: 'POST',
					data: request,
					dataType: 'json',
					success: onresponse,
					complete: function(jqXHR, textStatus){
						self.sended = false;
					}
				};

				$.ajax('/ajax/authorization/', settings);
			},
			
			// get recaptcha token when user resolved it
			recaptchaVerify(response) {
				//this.captchaToken = response;
			},
			// check the recaptcha widget
			checkRecaptcha(ref) {
				return this.$refs['recaptcha_'+ref].check();
			},
			resetRecaptcha(ref) {
				this.$refs['recaptcha_'+ref].reset();
			},
            smartCaptchaExecute(ref){
                return this.$refs['smartcaptcha_'+ref].execute();
            },
            smartCaptchaVerify(response){
                this.captchaToken = response;
            },
            checkSmartCaptcha(ref){
                return this.$refs['smartcaptcha_'+ref].check();
            },
            resetSmartCaptcha(ref){
                this.captchaToken = undefined;
                return this.$refs['smartcaptcha_'+ref].reset();
            },
			full_codeFunction() {
				let code='';
				this.full_code.forEach((num)=>{
					if(!!num){
						code = code+num;
					}
				})
				//const code = this.full_code[0] + this.full_code[1] + this.full_code[2] + this.full_code[3] + this.full_code[4] + this.full_code[5];
				return code;
			},
			trySendCode() {
				this.code=this.full_codeFunction();
				if (this.code.length === 6)
				{
					if(this.countRequestCode>=3){
						this.errors.code='Вы неверно ввели код 3 раза. Запросите новый.';
						return false;
					}

					this.errors.code='';
					this.valid_code=true;
	
					if (this.mode === 'resetPassword') {
						this.forgetPasswordCode();
					  } else {
						  this.authCode();
					  }
				} else {
					this.valid_code=false;
				}
			},
			togglePassword: function ($event, password) {
				const $e = $($event.currentTarget);
				if (password.type === 'text')
				{
					password.type = 'password';
					$e.removeClass('view');
				}
				else
				{
					password.type = 'text';
					$e.addClass('view');
				}
			},
			focusLoginValue(){
				const self=this;
				if(!this.haveChangeVal){
					setTimeout(function(){
						self.validateInputType();
					}, 500)
				}

			},
			changeValueItem(){
				this.haveChangeVal=true;
				const self=this;
				setTimeout(function(){
					self.validateInputType();
				}, 500)
			}

		},
		mounted() {
			const element = document.getElementById('login_auth');
			const phoneMaskOptions = {
				mask: '+{7} (000) 000-00-00',
				lazy: false,
			  };
		  
			const emailMaskOptions = {
				mask: /^\S*@?\S*$/,
				lazy: false,
			};
			this.mask = IMask(element, emailMaskOptions);
			const self=this;
			$(element).keypress(function(event) {
				let value=element.value;
			 	const keyPressVal=String.fromCharCode(event.which)
			 	let new_val=value+keyPressVal;
				 if(new_val=='+7'){
					self.mask.updateOptions(emailMaskOptions);
					self.mask.updateValue();
					return;
				}
				if(new_val.startsWith('+7') && new_val.length==3 && self.allowed.includes(keyPressVal)) {
					self.mask.value=value.slice(2);
					self.mask.updateOptions(phoneMaskOptions);
					self.mask.updateValue();
					return;
				}
			 	if(new_val.startsWith('+7') &&self.allowed.includes(keyPressVal)){
					new_val= new_val.replace(/\D/g,'');
			 	 }
				if(new_val=='8'){
					self.mask.updateOptions(emailMaskOptions);
					self.mask.updateValue();
					return;
				}
				if(new_val.startsWith('8') && new_val.length==2 && self.allowed.includes(keyPressVal)) {
					self.showEight=true;
					self.mask.value=value.slice(1);
					self.mask.updateOptions(phoneMaskOptions);
					self.mask.updateValue();
					return;
				}
				if(new_val.length<12 && (new_val.length>0 && !/\D/.test(new_val)) ){
					self.firstEmail=false;
					self.typeTel=true;
					self.mask.updateOptions(phoneMaskOptions);
				 //mask.value = '+7 ' + value.slice(1);
			   } else {
					self.typeTel=false;
					if(!self.firstEmail){
						self.mask.updateOptions(emailMaskOptions);
							if(self.showEight){
								let new_email_val='8'+self.mask.unmaskedValue.slice(1);
								self.mask.value=new_email_val;
							} else{
								self.mask.value=self.mask.unmaskedValue.slice(1);
							}
						self.mask.updateValue();
						self.firstEmail=true;
				   		return
				 	}
				 	self.mask.updateOptions(emailMaskOptions);
			   }
			   self.mask.updateValue();
			   
		   });

		   $(element).on('input', function(event){
			self.haveChangeVal=false;
			const regex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
			 if(self.typeTel && self.mask.unmaskedValue=='7' || self.mask.unmaskedValue.length==0){
				self.mask.updateOptions(emailMaskOptions);
				self.mask.updateValue();
				self.showEight=false;
				self.firstEmail=false;
				self.typeTel=false;
				self.validate_phone_before=false;
				return false;
				
			 }
			 if(self.mask.unmaskedValue.length==11 && (self.mask.unmaskedValue.startsWith('8') || self.mask.unmaskedValue.startsWith('7')) && (!/\D/.test(self.mask.unmaskedValue))){
				if(self.mask.unmaskedValue.startsWith('8')){
					self.showEight=true;
				}	
				self.mask.value=self.mask.unmaskedValue.slice(1);
				self.mask.updateOptions(phoneMaskOptions);
				self.mask.updateValue();
			}
			  if(self.mask.unmaskedValue.length==16 && self.mask.unmaskedValue.startsWith('+7') && regex.test(self.mask.unmaskedValue)){
				self.mask.value=self.mask.unmaskedValue.slice(2);
				self.mask.updateOptions(phoneMaskOptions);
				self.mask.updateValue();
			  }
			  if(self.mask.unmaskedValue.length==12 && self.mask.unmaskedValue.startsWith('+7') && self.mask.unmaskedValue.replace(/[\D]+/g,'').length==11){
				self.typeTel = true;
				self.mask.value=self.mask.unmaskedValue.slice(2);
				self.mask.updateOptions(phoneMaskOptions);
				self.mask.updateValue();
				
			}
			if(self.mask.unmaskedValue.length==10  && (!/\D/.test(self.mask.unmaskedValue))){
				self.typeTel = true;
				self.mask.updateOptions(phoneMaskOptions);
				self.mask.updateValue();
				
			}
			if(self.mask.unmaskedValue.length==11 && self.mask.unmaskedValue.startsWith(7) && self.mask.unmaskedValue.replace(/[\D]+/g,'').length==11){
				self.validate_phone_before=true;
				self.errors.login_value='';
			} else {
				var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
				if(emailRegex.test(self.mask.unmaskedValue)) {
					self.validate_phone_before=true;
					self.errors.login_value='';
				} else{
					self.validate_phone_before=false;
				}
				
			}
		   })

			const element2 = document.getElementById('phone_auth');
			let maskOptions2 = {
				mask: '+{7} (#00) 000-00-00',
			 
				definitions: {
					'#': /[01234569]/
				},
				placeholderChar: '_'
			};
			this.mask_phone = IMask(element2, maskOptions2);
			// $('.slider-auth').slick({
			// 	dots: true,
			// 	infinite: true,
			// 	speed: 300,
			// 	slidesToShow: 1,
			// 	autoplay: false,
			// 	autoplaySpeed: 2000,
			// });
			self.validateInputType();
		},
		beforeMount(){
			var urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get('authorization') === 'open') {
				this.open();
				
			};

		},
		created(){


		}
	});
}

function _app_registration(element, urls)
{
	const request = {
		first_name: '',
		last_name: '',
		middle_name: '',
		gender: '',

		email: '',
		password: '',
		password_confirm: '',
		birth_dt: '',
		phone: '',

		agreement: false,
	}

	if(socialInfoDefault) {
        for(let name in request) {
			switch (name) {
				case 'gender': break;
				default :
					if(socialInfoDefault[name]) {
						request[name] = socialInfoDefault[name];
					}
					break;
			}
		}
	}

	const data = {
		request,
		errors: {
			phone: '',
			code: '',
			timer: '',

			first_name: '',
			last_name: '',
			middle_name: '',
			gender: '',

			email: '',
			password: '',
			password_confirm: '',
			birth_dt: '',
			captcha_register: '',
			
			agreement: '',
		},

		step: 0,
		visible: false,
		sended: false,
		urls: urls,
		
		code: '',
		delay: 0,
		countdown: 60,
		_delay_start: null,
		_delay_timer: null,		

		genders: [
			//{'name': '-', 'value': ''},
			{'name': 'Женский', 'value': 0},
			{'name': 'Мужской', 'value': 1},
		],
	};

	return new Vue({
		el: element,
		data: data,
		computed: {
			gender_selected() {
				for (let i = 0; i < this.genders.length; i++)
				{
					const g = this.genders[i];
					if (g.value === this.request.gender)
					{
						return g;
					}
				}
				return;
				//return this.genders[0];
			},
		},
		methods: {
			openAuthorization: function () {
				this.close();
				popups.authorization.open();
			},
			open: function () {
				$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
				$('body').css('overflow-y','hidden');
				this.visible = true;
				
				setTimeout(function(){
					$('#app_registration .popups_system_container').css('min-height', ($('#app_registration .wrap').height())+'px');
				},10)
				
			},
			close: function () {
				this.step = 0;
				this.code = '';
				this.visible = false;
				$("body").css('padding-right', '0px');
				$('body').css('overflow-y','scroll');
			},
			_resetErrors: function () {
				for (let k in this.errors)
				{
					this.errors[k] = '';
				}
			},
			_reset: function () {
				this.step = 0;
				this.code = '';

				this._resetErrors();

				for (let k in this.request)
				{
					this.request[k] = '';
				}

				this.request.agreement = false;
			},
			combackToStep1: function(){
				this.step = 0; 
				this.request.phone='';
				setTimeout(function(){
					$('#app_registration .popups_system_container').css('min-height', ($('#app_registration .wrap').height()+30)+'px');
				},10)
			},
			sendCode: function () {
				if (this.sended)
				{
					return false;
				}				
				const self = this;
				this._resetErrors();

				const request = Object.assign({registration: 1}, this.request);
				request.agreement = request.agreement ? 1 : 0;
				request['confirm_code'] = this.code;
				
				this.sended = true;
				this._request(request, function (response) {
					if (response.success)
					{
						var url = new URL(window.location);
						url.searchParams.delete('authorization');
						window.history.pushState({}, '', url);
						document.location.reload();

					}
					else
					{
						Object.assign(self.errors, response.errors);
					}
				});
			},
			registration: function () {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('register');
                    this.sended = false;
                    return false;
                }
				if (this.sended)
				{
					return false;
				}
				
				const self = this;
				this._resetErrors();
				if(!this.checkPhone()) return false;
				
				if(!this.request.agreement){
					Object.assign(self.errors, {
						agreement: 'Условия не приняты'
					});
					return false;
				}
				
				if(this.request.password.length<6){
					
					Object.assign(self.errors, {
						password: 'Минимально 6 символов'
					});
					return false;
				}

				const request = Object.assign({registration: 1}, this.request);
				request.agreement = request.agreement ? 1 : 0;
                request.token = this.captchaToken;
				this.sended = true;
				this._request(request, function (response) {
					if (response.success)
					{
						self.step = 1;
						self._delayStart();
						setTimeout(function(){
							var ip = self.$refs.inp_code;
							 if (ip.createTextRange) {
								var part = ip.createTextRange();
								part.move("character", 0);
								part.select();
							} else if (ip.setSelectionRange) {
								ip.setSelectionRange(0, 0);
							}
							ip.focus();
						},10);
					}
					else
					{
                        self.resetSmartCaptcha('register');
						Object.assign(self.errors, response.errors);
					}
					setTimeout(function(){
						$('#app_registration .popups_system_container').css('min-height', ($('#app_registration .wrap').height())+'px');
					},10)
				});
			},
			togglePassword: function ($event, password) {
				const $e = $($event.currentTarget);
				if (password.type === 'text')
				{
					password.type = 'password';
					$e.removeClass('view');
				}
				else
				{
					password.type = 'text';
					$e.addClass('view');
				}
			},
			setCustomDate: function (date) {
				if (date)
				{
					this.request.birth_dt = date;
				}
			},
			_request: function (request, onresponse) {
				const self = this;
				const settings = {
					method: 'POST',
					data: request,
					dataType: 'json',
					success: onresponse,
					complete: function(jqXHR, textStatus){
						self.sended = false;
					}
				};
				
				$.ajax('/ajax/registration/', settings);
			},
			
			_delayStart: function() {
				this.step = 1;
				this._delay_start = new Date();
				this.code='';
				
				const self = this;
				this._delay_timer = setInterval(function(){
					self._delayHandler();
				}, 1000);
				setTimeout(function(){
					self.$refs.inp_code.focus();
				},10);				
			},
			_delayHandler: function() {
				const seconds = Math.round(((new Date()) - this._delay_start) / 1000);
				this.delay = Math.max(0, this.countdown - seconds);
				if (this.delay === 0)
				{
					clearInterval(this._delay_timer);
				}
			},
			
			// get recaptcha token when user resolved it
			recaptchaVerify(response) {
				//this.captchaToken = response;
			},
			// check the recaptcha widget
			checkRecaptcha(ref) {
				return this.$refs['recaptcha_'+ref].check();
			},
			resetRecaptcha(ref) {
				this.$refs['recaptcha_'+ref].reset();
			},
            smartCaptchaExecute(ref){
                return this.$refs['smartcaptcha_'+ref].execute();
            },
            smartCaptchaVerify(response){
                this.captchaToken = response;
            },
            checkSmartCaptcha(ref){
                return this.$refs['smartcaptcha_'+ref].check();
            },
            resetSmartCaptcha(ref){
                this.captchaToken = undefined;
                return this.$refs['smartcaptcha_'+ref].reset();
            },
			checkPhone(){
				var phone_clean = this.request.phone.replace(/[^0-9]/g, '');
				if (phone_clean.length<11) {
					this.errors.phone='Указан неверный номер телефона';
					return false;
				}
				this.errors.phone='';
				return true;
			},			
		}
	});
}

class ScrollController
{
	supportsPassive = false;

	constructor()
	{
		const self = this;

		// left: 37, up: 38, right: 39, down: 40,
		// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
		this.keys = {
			37: 1, 38: 1, 39: 1, 40: 1,
			32: 1, 33: 1, 34: 1, 35: 1, 36: 1
		};

		// modern Chrome requires { passive: false } when adding event
		try {
			window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
				get: function () { self.supportsPassive = true; }
			}));
		} catch(e) {}

		this.wheelOpt = this.supportsPassive ? { passive: false } : false;
		this.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

		this.preventDefaultForScrollKeys = function(e)
		{
			self._preventDefaultForScrollKeys(e);
		}
	}

	preventDefault(e)
	{
		e.preventDefault();
	}

	_preventDefaultForScrollKeys(e)
	{
		if (this.keys[e.keyCode])
		{
			this.preventDefault(e);
			return false;
		}
	}

	disable()
	{
		window.addEventListener('DOMMouseScroll', this.preventDefault, false); // older FF
		window.addEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt); // modern desktop
		window.addEventListener('touchmove', this.preventDefault, this.wheelOpt); // mobile
		window.addEventListener('keydown', this.preventDefaultForScrollKeys, false);
	}

	enable()
	{
		window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
		window.removeEventListener(this.wheelEvent, this.preventDefault, this.wheelOpt);
		window.removeEventListener('touchmove', this.preventDefault, this.wheelOpt);
		window.removeEventListener('keydown', this.preventDefaultForScrollKeys, false);
	}
}

class FormCancelOrder
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;
		this.$form = this.$el.find('form');
		this.$el.on('click', function (event) {
			if(event.target !== this) return;
			self.close();
			return false;
		});
		this.$el.find('.system_popup_hide, .js-cancel').on('click', function () {
			self.close();
			return false;
		});

		this.$form.on('submit', function () {
			const data = new FormData(this);
			const $submit = $('button[type="submit"]', this);
			$submit.html('<img src="/img/ajax-loader.gif" alt="" height="34" style="vertical-align: bottom;"/>Отправляем...').prop('disabled', true);
			$.ajax({
				type: 'POST',
				url: '/ajax/order_cancel/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function(response) {
					if (response.success)
					{
						document.location = document.location;
					}
					else
					{
						popups.alert(response.error);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					popups.alert('Ошибка! Попробуйте позже.');
					console.error(textStatus, jqXHR.responseText);
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				}
			});
			return false;
		});
	}
	
	open(order_id)
	{
		this.$form.find('input[name=cancel]').val(order_id);
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		$('body').css('overflow-y','hidden');
		this.$el.css('display', 'block');
	}

	close()
	{
		$("body").css('padding-right', '0px');
		$('body').css('overflow-y','scroll');
		this.$el.css('display', 'none');
		
	}
}

class FormBaseCompany
{
	$el = null;

	constructor(element)
	{
		this.$el = $(element);

		const self = this;

		this.$form = this.$el.find('form');
		
		this.$el.on('click', function (event) {
			if(event.target !== this)
			{
				return;
			}

			self.close();
			return false;
		});


		this.$el.find('.system_popup_hide, .cancle').on('click', function () {
			self.close();
			return false;
		});


		this.$el.find('.add').on('click', function () {
			self._send();
			return false;
		});


	}

	open(email)
	{
		this.$el.css('display', 'block');
		$("body").css('padding-right', window.innerWidth - document.documentElement.clientWidth + 'px');
		setTimeout(function(){
			$('#popup_suggestion .popups_system_container').css('min-height', ($('#popup_suggestion .wrap').height())+'px');
		},10)
		$('body').css('overflow-y','hidden');
	}

	close()
	{
		this.$el.css('display', 'none');
		$("body").css('padding-right', '0px');
		$('body').css('overflow-y','scroll');
	}
	_send()
	{
		//Отправка запроса
	}

}



const scroll = new ScrollController();
