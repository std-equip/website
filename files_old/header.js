(function($) {
    $.fn.hasScrollBar = function() {
		return $('body').height() > this.height() || this.get(0).scrollHeight > Math.round(this.height());
    }
})(jQuery);
const modalControl = {
	body: null,
	content: null,
	content_pad: false,
	modCounter: 0,
	style_body: null,
	openModal: function(){
		const curModal = $('.modal:visible:last');
		if(!modalControl.modCounter && modalControl.body && modalControl.body.length){
			let padd=window.innerWidth - curModal.width();
			modalControl.style_body = modalControl.body.attr('style');
			modalControl.body.css('overflow','hidden');
			if(curModal.length){
				if(curModal.hasScrollBar()){
					modalControl.content.css('padding-right',  padd+ 'px');
					modalControl.content_pad = true;
				} else
					$('.modal-wrapper', curModal).css('right','-8px')
			}
			
		}
		modalControl.modCounter++;
		if(curModal.length && curModal.data('func') && typeof window[curModal.data('func')]=='function')
			window[curModal.data('func')]();
	},
	closeModal: function(){
		if(modalControl.modCounter > 0) modalControl.modCounter--;
		if(!modalControl.modCounter && modalControl.body && modalControl.body.length){
			if(modalControl.style_body)
				modalControl.body.attr('style', modalControl.style_body);
			else
				modalControl.body.css('overflow', ''); // 'visible'
			
			if(modalControl.content_pad){
				modalControl.content_pad = false;
				modalControl.content.css('padding-right', '0px');
			}
		}
	},
	init: function(){
		modalControl.body = $('body');
		modalControl.content = $('.main-content');
	}
};
const popups={
	mobileAlert:function(message, title, buttonText, buttonClass){

		if(typeof message == 'undefined') return false;
        var modal=$('#popup_alert:eq(0)');
		
		if(!modal.length){
			$('body .main-content__wrapper').append(`
			<div class="popups_system popups_system--newCont" id="popup_alert" style="display: none;">
				<div class="popups_system_container fixed_container_middle  popups_system_container--center">
					<div class="wrap">
						<div class="alert system_popup system_popup_new">
							<div class="system_popup_hide system_popup_hide_new">
								<img src="/img/new_icon/close.svg" alt="">
							</div>
							<div class="system_popup_head">
								<div class="alert_heading system_popup_heading_new">`+(typeof title !== 'undefined' && title.length ? title : 'Внимание!')+`
								</div>
								`+(typeof message !== 'undefined' && message.length?`<div class="alert_text system_popup_head_text">${message}</div>`:'')+`
								
							</div>
							<div class="alert_btn_wrap">
								<button class="new_white_button_border" type="button" name="button">ОК</button>
							</div>
						</div>
					</div>
				</div>
			</div>`)
			modal=$('#popup_alert');
			modal.find('.new_white_button_border, .system_popup_hide_new').click(function(){
				
				modal.remove();
			});
			$('#popup_alert').click( function(e){ // событие клика по веб-документу
				var div = $( ".system_popup_new" ); 
				if ( !div.is(e.target) 
					&& div.has(e.target).length === 0 ) { 
						modal.remove();
						$('body').css('overflow-y', 'scroll');
						$("body").css('padding-right', '0px');
				}
			});
		};


        modal.show();
		//button.focus();
		return true;
    },
	mobilealertNew:function(message, information, success){
		if(typeof message == 'undefined') return false;
		let timeOutClose;
        var modal=$('.modalAlert:eq(0)');
		if(!modal.length){
			$('body .main-content__wrapper').append(
				`<div class="new_alert_popup" id="popup_alertNew" style="display: none;">
					<div class="new_alert_popup_wrapper">
						<div class="system_popup_hide">
							<img src="/img/new_icon/search_clear.svg" alt="" width="16" height="16">
						</div>
						`+(typeof success == 'undefined'?``:`<img src="`+(success?'/img/new_icon/succes.svg':'/img/new_icon/fail.svg')+`" class="new_alert_img">`)+`
						
						<div class="new_alert_block">
							<div class="alert_heading new_alert_title">${message}
							</div>
							`+(information?`<div class="alert_text new_alert_text">${information}
							</div>`:'')+`
						</div>
					</div>
				</div>`
			);

			modal=$('.new_alert_popup');
			modal.find('.system_popup_hide').click(function(){
				clearTimeout(timeOutClose);
				modal.fadeOut();
				modal.remove();
			});
		};
        modal.fadeIn();
		timeOutClose=setTimeout(function(){
			modal.fadeOut();
			modal.remove();
		},4000)
		return true;
    },

	mobileConfirm:function(message,ok_action,  ok_label, cancel_label,information){
		if(typeof message == 'undefined') return false;
        var modal=$('#popup_confirm').eq(0);
		if(!modal.length){
			$('body .main-content__wrapper').append(`
			<div class="popups_system popups_system--newCont" id="popup_confirm" style="display: none;" >
				<div class="popups_system_container new_fixed_container  popups_system_container--center">
					<div class="wrap">
						<div class="alert system_popup system_popup_new">
							<div class="system_popup_hide system_popup_hide_new">
								<img src="/img/new_icon/close.svg" alt="">
							</div>
							<div class="system_popup_head">
								<div class="alert_heading system_popup_heading_new">
								`+(typeof message !== 'undefined' && message.length ? message : 'Внимание!')+`
								</div>
								`+(information?`<div class="alert_text new_alert_text">${information}
								</div>`:'')+`
							</div>
							<div class="alert_btn_wrap">
								<button class="alert_btn btn js-ok" type="button" name="button">`+(ok_label?ok_label:'ОК')+`</button>
								<button class="alert_btn btn js-cancel" type="button" name="button">`+(cancel_label?cancel_label:'Отмена')+`</button>
							</div>
						</div>
					</div>
				</div>
			</div>`)
			modal=$('#popup_confirm');
			modal.find('.system_popup_hide_new').click(function(){
				if($('.modal:visible:last').length){}else {
					//modalControl.closeModal();
				}
				modal.hide();
				return false;
			});
		}
        const button=modal.find('.js-ok');
		const buttonCancel=modal.find('.js-cancel');
		buttonCancel.click(function(){
			if (ok_action != null)
			{
				if($('.modal:visible:last').length){}else {
					//modalControl.closeModal();
				}
				modal.remove();
				return false;
			}
		})
		button.click(function(){
			if (ok_action != null)
			{
				ok_action();
				ok_action = null;
				if($('.modal:visible:last').length){}else {
					//modalControl.closeModal();
				}
				modal.remove();
				return false;
			}
		});
		
        modal.show();
		//modalControl.openModal();
		//button.focus();
		return true;
	},
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
				left: (offset.left-$('.main-content__wrapper').offset().left + 16) + 'px',
				top: (offset.top + $element.height()) + 'px',
				transform: 'translate(-100%, -0%)',
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
	mobilealertNewSuccess:function(message, information, success){
		if(typeof message == 'undefined') return false;
        var modal=$('.modalAlert:eq(0)');
		let srcLink=''
		switch(success) {
			case 'success':
				srcLink='/img/new_icon/succes.svg';
				break;
			case 'fail':
				srcLink='/img/new_icon/fail.svg';
				break;
			case 'mistake':
				srcLink='/img/new_icon/mistake.svg';
				break;
		}
		if(!modal.length){
			$('body .main-content__wrapper').append(
				`<div class="popups_system popups_system--newCont" id="mobilealertNewSuccess" style="display: none;" >
					<div class="popups_system_container new_fixed_container  popups_system_container--center">
						<div class="wrap">
				
					<div class="new_alert_popup_wrapper new_alert_popup_wrapper--center">
						<div class="system_popup_hide_new">
							<img src="/img/new_icon/search_clear.svg" alt="" width="16" height="16">
						</div>
						`+(typeof success == 'undefined'?``:`<img src="`+srcLink+`" class="new_alert_img">`)+`
						
						<div class="new_alert_block">
							<div class="alert_heading new_alert_title">${message}
							</div>
							`+(information?`<div class="alert_text new_alert_text">${information}
							</div>`:'')+`
						</div>
					</div>
				</div>
				</div>
				</div>`
			);

			modal=$('#mobilealertNewSuccess');
			modal.find('.system_popup_hide_new').click(function(){
				modal.hide();
				modal.remove();
				$('body').css('overflow-y', 'scroll');
				$("body").css('padding-right', '0px');
			});
			$('#mobilealertNewSuccess').click( function(e){ // событие клика по веб-документу
				var div = $( ".system_popup_new" ); 
				if ( !div.is(e.target) 
					&& div.has(e.target).length === 0 ) { 
						modal.remove();
						$('body').css('overflow-y', 'scroll');
						$("body").css('padding-right', '0px');
				}
			});
		};
        modal.show();
		return true;
    },
};
class searchControl {
	constructor(input, srchWin, goBack){
		this.$input = input;
		this.$srchWin = srchWin;
		this.$goBackArr = goBack;
		this.$suggResult = $('#suggResult');
		this.$emptyResult = $('#emptyResult');
		this.$historyResult = $('#historyResult');
		this.$searchResult = $('#resultSearchDone');
		this.$searchCode = $('#searchCode');
		this.init();
	}
	init(){
		var selfObj = this;
		// suggestions
		this.$srchWin.on('click', '.historySearch_item', function() {
			const search = $(this).data('value'), redirect = true;
			if (redirect)
				document.location = MOBIL+'/catalog/?sp%5Bname%5D=1&sp%5Bartikul%5D=1&search=&s=' + search;
			else
			{
				this.hide();
				this.$input.val(search); // trigger keydown?
			}
		});
		this.$searchCode.on('click', '.header__searchResultBox__actionBox__goodsList__item', function() {
			document.location = $(this).data('href');
		});		
		$('.resetFilter a', this.$historyResult).click(function(e) {
			e.preventDefault();
            $.getJSON(MOBIL+'/ajax/searches/', {op: 'clear'}, function(res) {
                if (!res.error) {
					selfObj.$goBackArr.click();
					selfObj.$historyResult.remove();
					selfObj.$historyResult = null;
				}
            });			
		});
        $('.historySearch_item span', this.$historyResult).click(function(e) {
            e.stopPropagation();
            var self = $(this),
                lnk = self.prev();
            self.css('background-image', 'url("/img/ajax-loader.gif")').css('background-size', '14px');
            $.getJSON(MOBIL+'/ajax/searches/', {
                op: 'remove',
                s: lnk.text()
            }, function(res) {
                if (!res.error) {
                    lnk.parent().remove();
                    if (!$('.historySearch_item a', selfObj.$historyResult).length){
                        selfObj.$goBackArr.click();
						selfObj.$historyResult.remove();
					}
                } else
                    self.css('background-image', 'url("/img_mobile/header/search_item_remove.svg")').css('background-size', '');
            });
        });		
	}
	checkSuggest(data){
		this.$srchWin.hide();
		this.$suggResult.hide();
		this.$emptyResult.hide();
		if(this.$historyResult && this.$historyResult.length) this.$historyResult.hide();
		this.$searchResult.hide();
		this.$searchCode.html('');

		if(data.length > 0){
			//var html='';
			// $.each(data, function(i,v) {
			// 	html += '<div class="historySearch_item" data-value="'+v.suggestion+'"><span>'+v.suggestion+'</span></div>';
			// });
			$('.historySearch', this.$suggResult).html(data);
			this.$suggResult.show();
			return true;
		}
		return false;
	}
	checkEmpty(code){
		var dom = $.parseHTML(code);
		var empty = $(dom).find('.header__searchResultBox__actionBox__goodsList:eq(0)').length == 0;
		if(empty) this.$emptyResult.show();
		return empty;
	}
	checkHistory(show){
		this.$searchResult.hide();
		if(this.$historyResult && this.$historyResult.length){
			this.$historyResult.toggle(show);
			this.$srchWin.toggle(show);
			return show;
		} else
			this.$srchWin.hide();
		return false;
	}
	showResult(code){
		this.$searchCode.html(code);
		new Swiper('.swiper', {
			speed: 400,
			spaceBetween: 10,
			slidesPerView: 'auto',
			freeMode:true,
		});
		this.$searchResult.show();
	}
};
class CustomTimer {
	constructor(initValue, timerBox, startHandler, finishHandler){
		this.timer = null;
		this.startSeconds = parseInt(initValue || 60);
		this.timerBox = typeof timerBox!='undefined' && (timerBox instanceof Element || timerBox instanceof jQuery && timerBox.length) ? timerBox : null;
		this.startHandler = typeof startHandler=='function' ? startHandler : null;
		this.finishHandler = typeof finishHandler=='function' ? finishHandler : null;
	}
	start(startValue){
		var selfObj = this;
		if(this.timer) clearInterval(this.timer); //this.stop();
		this._Seconds = parseInt(startValue || this.startSeconds);
		if(this.startHandler) this.startHandler();
		if(this.timerBox) this.timerBox.text(this.startSeconds);
        this.timer = setInterval(function() {
            if (selfObj._Seconds > 0) {
				selfObj._Seconds--;
				if(selfObj.timerBox) selfObj.timerBox.text(selfObj._Seconds);
            } else {
				selfObj.stop();
            }
		}, 1000);
	}
	stop(){
		clearInterval(this.timer);
		if(this.finishHandler) this.finishHandler();
	}
	seconds(){
		return this._Seconds;
	}
};
class FormCallBack {
	constructor(elm){
		this.$elm = elm;
		this.$form = elm.find('form');
		this.$message = elm.find('textarea');
		this.init();
	}
	init() {
		var $self=this;
		this.$form.submit(function(e){
			e.preventDefault();
			const data = new FormData(this);
			
			var capId = $('#re-captcha-callback').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
			if (!captcha.length) {
				popups.mobileAlert('* Вы не прошли проверку "Я не робот"');
				return false;
			}
		
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);

			$.ajax({
				type: 'POST',
				url: MOBIL + '/ajax/callback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_callback');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'callback');

						popups.mobileAlert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время!');
						$self.$form.trigger('reset');
						$self.$elm.find('.modal__close').click();
					}
					else
					{
						popups.mobileAlert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				}
			});

			return false;
		});
		
		this.$form.find('.system_popup_tag').on('click', function () {
			let txt = $(this).text();
			if($self.$message.val().indexOf(txt)==-1)
				$self.$message.val($self.$message.val() + txt + ' ');

		});
	}
}
class FormFeedBack {
	constructor(elm){
		this.$el = $(elm);
		const self = this;
		const $themes = this.$el.find('input[name=contacts_theme]');
		const $shops = this.$el.find('.js-feedback-shops');
		const $labels = this.$el.find('.system_popup_tag');
		const $themesList = this.$el.find('.system_popup_tags_container:not(.js-feedback-shops) li.system_popup_tag');
		const $shopsList = this.$el.find('.js-feedback-shops li.system_popup_tag');
		this.$form = this.$el.find('form');

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
		this.init();
	}
	init() {
		var $self=this;
		this.$form.submit(function(e){
			e.preventDefault();
			const data = new FormData(this);

			var capId = $('#re-captcha-feedback').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
			if (!captcha.length) {
				popups.mobileAlert('* Вы не прошли проверку "Я не робот"');
				return false;
			}
		
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);

			$.ajax({
				type: 'POST',
				url: MOBIL + '/ajax/feedback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_send_message');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'send_message');

						popups.mobileAlert('Сообщение отправлено.');
						$self.$form.trigger('reset');
						$self.$el.find('.system_popup_hide_new').click();
					}
					else
					{
						popups.mobileAlert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if(jqXHR.status == 413)
						popups.mobileAlert('Ошибка! Максимальный размер всех файлов '+maxFileSize+' Мб.');
					else
						console.error(textStatus, jqXHR.responseText);
				}
			});

			return false;
		});
		

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
			popups.mobileAlert('Слишком большой файл.');
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

		popups.mobileAlert('Недопустимое расширение файла.');

		return false;
	}
}
class FormSuggestion {
	constructor(elm){
		this.$elm = elm;
		this.$form = elm.find('form');
		this.$message = elm.find('textarea');

		this.init();
	}
	init() {
		var $self=this;
		this.$form.submit(function(e){
			e.preventDefault();
			const data = new FormData(this);

			var capId = $('#re-captcha-suggestion').data('widget-id'),
				captcha = grecaptcha.getResponse(capId);
			if (!captcha.length) {
				popups.mobileAlert('* Вы не прошли проверку "Я не робот"');
				return false;
			}
		
			const $submit=$('button[type="submit"]',this);
			$submit.html('<img src="/img/ajax-loader.gif" height="34" style="vertical-align: middle;"/>Отправляем...').prop('disabled', true);

			$.ajax({
				type: 'POST',
				url: MOBIL + '/ajax/feedback/',
				data: data,
				processData: false,
				contentType: false,
				dataType: 'json',
				success: function (result) {
					if (result.success)
					{
						if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'form_submit_send_message');
						if (typeof ga != 'undefined') ga('send', 'event', 'form', 'submit', 'send_message');

						popups.mobileAlert('Сообщение отправлено.');
						$self.$form.trigger('reset');
						$self.$fCont.html();
						$self.$elm.find('.modal__close').click();
					}
					else
					{
						popups.mobileAlert(result.error);
					}
				},
				complete: function(jqXHR, textStatus){
					$submit.html('Отправить').prop('disabled', false);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					if(jqXHR.status == 413)
						popups.mobileAlert('Ошибка! Максимальный размер всех файлов '+maxFileSize+' Мб.');
					else
						console.error(textStatus, jqXHR.responseText);
				}
			});

			return false;
		});
		
		this.$form.find('button.system_popup_file_btn').on('click', function (e) {
			event.preventDefault();

			const total = $self.$elm.find('input[type=file]').length + 1;
			const name = 'contacts_files_' + total;

			if (total < 5)
			{
				const $input = $('<input type="file" name="' + name + '" accept="image/jpeg,image/png,image/gif,application/pdf,application/zip,application/x-rar-compressed,application/rtf,application/msword,application/vnd.ms-excel,application/vnd.oasis.opendocument.text,application/vnd.oasis.opendocument.spreadsheet">');

				$input.on('change', function () {
					const $e = $(this);
					if (!$self.validateFile(this))
					{
						$e.remove();
						return;
					}

					const f = this.files[0];
					$self.$form.append($e);
					$self.$form.find('ul.system_popup_file_container').show();
					$self.$form.find('ul.system_popup_file_container').append('<li><div class="item">' + f.name + ' (' + f.size + ')</div><div class="item_delete" data-id="' + name + '"><svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 0.875L9.125 0L5 4.125L0.875 0L0 0.875L4.125 5L0 9.125L0.875 10L5 5.875L9.125 10L10 9.125L5.875 5L10 0.875Z" fill="#AEAEAE"/></svg></div></li>');
				});

				$input.hide();
				$input.trigger('click');
			} else 
				popups.mobileAlert('Достигнут лимит отправляемых за раз файлов');
		});
		
		this.$form.on('click', '.item_delete', function () {
			const $e = $(this);
			const total = $self.$elm.find('input[type=file]').length-1;
			const name = $e.data('id');

			$e.parent().remove();
			$self.$elm.find('input[type=file][name="' + name + '"]').remove();
			if(total<1){
				$self.$form.find('ul.system_popup_file_container').hide();
			}
		});
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
			popups.mobileAlert('Слишком большой файл.');
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

		popups.mobileAlert('Недопустимое расширение файла.');

		return false;
	}
}

var modList = {}, cardInfo = frmBack = null;
const modFunction = function(aim, elm){
	var aim = aim || '', elm = elm || null, modalMode = false, popup = modList[aim] || null;
	if(popup && !popup.is(':visible')){
		if(aim=='cardinfo'){
			let id = +$(elm).closest('.js-card').data('id');
            if (typeof ym != 'undefined') ym(ymID,'reachGoal','offer_click_availability');
			$.get({url: MOBIL+'/ajax/goods_popup/',  cache: false}, {id: id}, function(response) {
				cardInfo.html(response);
				popup.show();
				modalControl.openModal();				
			});				
		}else if(aim=='modalCart'){			
			const goods_id = +$(elm).data('id');
			$.get({url: MOBIL+'/ajax/add_cart_catalog/',  cache: false}, {id: goods_id}, function(response) {
				$('.modalCart').html(response);
				goodCart.init(ajax_token);
				if(+$(elm).find('span').length==0){
					goodCart._input.change();
					if (typeof ym != 'undefined') ym(ymID, 'reachGoal', 'mac_click_katalog_list_addtocart');
				}
				popup.show();
				modalControl.openModal();	
			});
		} else{
			if(aim === 'login'){
                if (typeof ym != 'undefined' && typeof ymID != 'undefined') ym(ymID, 'reachGoal', 'auth_click');
                if (typeof ga != 'undefined') ga('send', 'event', 'click', 'button', 'auth_click');
            } else if (aim === 'registration'){
                if (typeof ym != 'undefined' && typeof ymID != 'undefined') ym(ymID, 'reachGoal', 'reg_click');
                if (typeof ga != 'undefined') ga('send', 'event', 'click', 'button', 'reg_click');
            }
			popup.show();
			modalControl.openModal();
		}
	}
}
	
function allow_sms_send(retry_allowed, setmark)
{
	var result, now = new Date();
	setmark ??= false;

	if (window['_last_sms'])
	{
		var time = new Date();
		result = window._last_sms < time.setSeconds(time.getSeconds() - retry_allowed);
	}
	else
	{
		result = true;
	}

	if(setmark) window._last_sms = now.setSeconds(now.getSeconds());

	if (!result)
	{
		popups.mobileAlert('Повторная отправка доступа через '+retry_allowed+' секунд(ы).');
	}

	return result;
}
function showNeedLogin(){
	if (!IS_AUTH)
	{
		popups.mobileAlert('Данный раздел доступен только авторизованным пользователям. <span class="js-login-open" style="color: #374F81">Авторизоваться</span> ');
		return false;
	}
	return true;
}
$(document).ready(function () {
	modList.cardinfo = $('.cardModal');
	modList.modalDraft = $('.modalDraft');
	modList.modalBarCode = $('.modalBarCode');
	modList.modalCallBack = $('.modalCallBack');
	modList.modalFeedBack = $('.modalFeedBack');
	modList.modalSuggestion = $('.modalSuggestion');
	modList.chatModal = $('.chatModal');
	modList.profileModal = $('.profile_author_popup_menu');
	modList.feedbackModal = $('.feedback_popup');
	modalControl.init();
	
	$('[href="#openCallback"]').attr('data-aim', 'modalCallBack');
	$('[href="#openMessage"]').attr('data-aim', 'modalFeedBack');
	$('.js-chat-open').attr('data-aim', 'chatModal');
	$('[href="#chatConsult"]').attr('data-aim', 'chatModal');
	$('.service__page__contactCol__sublink').attr('data-aim', 'chatModal');
	new FormCallBack(modList.modalCallBack);
	new FormFeedBack(modList.modalFeedBack);
	new FormSuggestion(modList.modalSuggestion);
	cardInfo = $('.cardModal.modal .modal-wrapper');
	
	const helper = {
		$body: $('body'),
		$mcont: $('.main-content'),
		perare: function(){
			helper.$body.css({'overflow':'visible', 'padding-right':'0'});
			helper.$mcont.css('padding-right', '0');
		}
	}



	$('body').on('click', '.top_catalog_btn', function() {
		if ($('.header__catalouge').hasClass('hidden')) {
			$('.header__catalouge').removeClass('hidden');
			$(this).find('.top_catalog_btn_icon').addClass('open');
			const doc = document.documentElement;
			doc.style.setProperty('--heightHeader', `${($('.header').offset().top-$(window).scrollTop()+$('.header').innerHeight())}px`);
			
			$('body').css('overflow','hidden');
		} else {
			$(this).find('.top_catalog_btn_icon').removeClass('open')
			$('.header__catalouge').addClass('hidden');
			$('body').css('overflow','visible');
		}
	});

	$('.search_container__content_header, .top_menu_item_search').on('click', function () {
		$('.modalSearch').show();
		modalControl.openModal();
		$('.search_container_modal .search_input--main').focus();
		var len = $(this).find('.search_input--main').val().length;
		if(len){
			$('#search_history_list2').hide();
			$('.h_s_list_categories_wrap').show();
		} else {
			if ($('#search_history_list2').length) {
				$('.h_s_list_categories_wrap').hide();
				$('#search_history_list2').show();
			} else {
				$('.h_s_list_categories_wrap').show();
				$('#search_history_list2').hide();
			}
		}
		// if (!len) {
		// 	if ($('.menu_catalog__suggestions__item').length) {
		// 		$('.h_s_list_categories_wrap').hide();
		// 		$('#search_history_list2').hide();
		// 	} else if ($(this).val().length) {
		// 		$('#search_history_list2').hide();
		// 		$('.h_s_list_categories_wrap').show();
		// 	}
		// } else {
		// 	if ($('#search_history_list2').length) {
		// 		$('.h_s_list_categories_wrap').hide();
		// 		$('#search_history_list2').show();
		// 	} else {
		// 		$('.h_s_list_categories_wrap').show();
		// 		$('#search_history_list2').hide();
		// 	}
		// }

		$('.header_search_module').show();

	})
	$('#search_history_list2 span').click(function(e) {
		e.stopPropagation();
		var self = $(this),
			lnk = self.prev();
		self.css('background-image', 'url("/img/ajax-loader.gif)"').css('background-size', '30px');
		$.getJSON(MOBIL+'/ajax/searches/', {
			op: 'remove',
			s: lnk.text()
		}, function(res) {
			if (!res.error) {
				lnk.parent().remove();
				if (!$('#search_history_list2 a').length) {
					$('#search_history_list2').remove();
					$('.h_s_list_categories_wrap').show();
				}

			} else
				self.css('background-image', 'url("/img/icons/cross.png)"').css('background-size', '');
		});
	});
	$('.menu_catalog__history__resetAll').click(function(e) {
		$.getJSON(MOBIL+'/ajax/searches/', {
			op: 'clear'
		}, function(res) {
			if (!res.error) {
				$('#search_history_list2').remove();
				$('.h_s_list_categories_wrap').show();
			}
		});
	});

	$('.search_clear--main').on('click', function(e) {
		e.stopPropagation();
		$(this).next().val('').attr('style', '').focus().end().hide();
		$(this).next().trigger('input')
	});

	$(document).on('click', '.header__catalouge__item,.back-btn', function () {
		var cls = $(this).data('cid');
		if(cls!=''){
			var catlist=$('.header__catalouge__list.'+cls);
			if(catlist.length){
				$('.header__catalouge__list').hide();
				catlist.show();
			}else{
				var self=this;
				$(this).find('a').after('<img src="/img/ajax-loader.gif" style="width: 30px;margin-top: -15px;margin-bottom: -20px;">');
				$.post(MOBIL+'/ajax/catmenu/', {'cid':cls}, function(data){
					$(self).find('img').remove();
					if(data.length){
						$('.header__catalouge').append(data);
						$('.header__catalouge__list').hide();
						$('.header__catalouge__list.'+cls).show();
					}
				});
			}
			return false;
		}
    });
	
    const isFixedSupported = (function () {
        let isSupported = null;
        if (document.createElement) {
            let el = document.createElement('div');
            if (el && el.style) {
                el.style.position = 'fixed';
                el.style.top = '10px';
                let root = document.body;
                if (root && root.appendChild && root.removeChild) {
                    root.appendChild(el);
                    isSupported = (el.offsetTop === 10);
                    root.removeChild(el);
                }
            }
        }
        return isSupported;
    })();
    window.onload = function () {
        if (!isFixedSupported) {
            // добавляем контекст для "старичков"
            document.body.className += ' no-fixed-supported';
            // имитируем position: fixed;
            let topbar = document.querySelector('.header');
            // обрабатываем события touch и scroll
            window.ontouchmove = function (e) {
                if (event.target !== topbar) {
                    topbar.style = '';
                }
            }
            window.onscroll = function () {
                let scrollTop = window.scrollY;
                topbar.style.top = scrollTop + 'px';
            };
        }
        // первичный scroll
        window.scrollBy(0, 1);
    }

    const appHeight = () => {
        const doc = document.documentElement;
		doc.style.setProperty('--app-height', `${window.innerHeight}px`);

    }
    window.addEventListener('resize', appHeight);
    appHeight();

    $('.cat-slider .swiper-slide').click(function () {
        $(this).closest('.swiper-wrapper').find('.swiper-slide').removeClass('active');
        $(this).addClass('active');
    });

	$(document).on('click', '[data-aim]', function (e) {
		e.preventDefault();
		e.stopPropagation();
		modFunction( $(this).data('aim'), this );
		return false;
	}).on('click', '.modal__close, .system_popup_hide_new, .cancle, .system_popup_hide',  function (e) {
		e.preventDefault();
        modalControl.closeModal();
		$(this).closest('.modal').hide();
		if( $(this).data('func') ) window[ $(this).data('func') ]();
	});
	if(location.hash) modFunction(location.hash.substring(1));
	
	//document.getElementsByClassName('img.card__img').addEventListener('load', function() { console.log(this); });
	
    $('img.card__img').on('error', function(e){
		$(this).attr('src', '/images/goods_no_photo.jpg');
	});
	
	helper.$body.on('click', 'a[href="'+MOBIL+'/profile/?profile"], a[href="'+MOBIL+'/profile/?orders"], a[href="'+MOBIL+'/profile/?drafts"], a[href="'+MOBIL+'/profile/?account"]', function (e) {
		return showNeedLogin();
	});	
	const menuBtn = $('.js-card-actionModal'),
			menu = $(".actionModalInfo");
	$('body').on('click','.js-card-actionModal', function(e) {

		e.stopPropagation();
		e.stopImmediatePropagation();
		menu.hide();
		const $card = $(this).closest('.js-card');
		const id = $card.data('id');
		$('.actionModalInfo-wrapper').html('');
		const elem=$(this);
		if(!elem.hasClass('js-card-actionModal-active')){
			$('body').find('.js-card-actionModal').removeClass('js-card-actionModal-active');
			elem.addClass('js-card-actionModal-active')
			$.get(MOBIL+'/ajax/goods_popupAction/', {id: id}, function(response) {
				$('.actionModalInfo-wrapper').html(response);
				menu.css('top',(elem.offset().top+18)+'px')
				menu.show();
			});
		} else {
			elem.removeClass('js-card-actionModal-active');
			
		}
		// cache does not support fav/compare changes


	});
	
	$('body').on('click','.actionModalInfo .goods_card_mini_popup_hidden_icon', function(){
		menu.hide();
		$('body').find('.js-card-actionModal').removeClass('js-card-actionModal-active');
	})
	// $('body').on('click', function(){
	// 	let container=$('.actionModalInfo');
	// 	if (!container.is(e.target) && container.has(e.target).length === 0) {
	// 		container.hide();
	// 	}
	// })




		$(document).click(function (e) {
			if (!menuBtn.is(e.target) && !menu.is(e.target) && menu.has(e.target).length === 0) {
				menu.hide();
				$('body').find('.js-card-actionModal').removeClass('js-card-actionModal-active');
			};
		});
		$(window).on('resize', function(){
			let heigth=$(window).height()-24 - 24 - 80 - 16 - 24 - 42 - 40;
			if(heigth<500){
				$('.addToDraft_popup_capcha_block').css('max-height', heigth+'px');
			} else {
				$('.addToDraft_popup_capcha_block').css('max-height', '500px');
			}
		})


		
	$(window).on('scroll load', function(){
		if($(window).scrollTop()>160){
			$('.header').addClass('header--scroll')
		} else {
			$('.header').removeClass('header--scroll')
		}
	})
	if(!IS_AUTH && location.search.indexOf('?needAuth')!==-1)
		showNeedLogin();


	let tippyInstances=[];
	$('body').on('click', '.goods_card_price_tooltip_wrapper', function(e){
		e.preventDefault();
		e.stopPropagation();
		let button=$(this).find('.goods_card_price_tooltip')[0]
		let tip=$(this).find('.tippy-box');
		if(tip.length==0){
			let tooltip=tippy(button, {
				content:"<div class='tippy-box-wrapper'>\
							<h3 class='tippy-box__title'>Карта лояльности «Стандартное оборудованиеа»</h3>\
							<div class='tippy-box-cont'>\
								<p class='tippy-box__text'>Дает возможность на получение дополнительных скидок и предложений.</p>\
								<a href='/structure/Programma-loyalnosti/' class='tippy-box__link'>Подробнее в разделе «Покупателям»</a>\
							</div>\
						</div>",
				trigger: 'click',
				allowHTML: true,
				placement: "top-start",
				interactive: true,
			});
			tippyInstances = tippyInstances.concat(tooltip);
			tooltip.show();
		} else {
			tippyInstances.forEach(instance => {
				instance.destroy();
			});
			tippyInstances=[];
		}

		// $('.tooltip_to_open_button').click();

	})


});
