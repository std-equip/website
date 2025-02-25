$(document).ready(function () {
	let startBlock = $('header.header'), siteTopOffset = 0;
	if (startBlock.length)
		siteTopOffset = startBlock.offset().top + startBlock.height();
	$('.fix-top-offset').css('top', siteTopOffset + 'px');

	// Меню
	$('.footer__links__block__title-block__arrow').click(function(){
		$(this).toggleClass('animationFooterArrow').closest('.footer__links__block__title-block').next().slideToggle();
	});
	// Форма оплатить заказ
	$('.footer__payBlock__top').click(function(){
		$('.footer__payBlock__top__arrow', this).toggleClass('animationPayblockFooterArrow').closest('.footer__payBlock__top').next().slideToggle();
	});
	$('.phone_mask').mask('+ 7 (999) 999-99-99');
	
	$('#pay-order-form').on('submit', function() {
		const $e = $(this);

		const request = {
			order_id: $e.find('input[name="order_id"]').val(),
			phone: $e.find('input[name="phone"]').val()
		};

		$.getJSON('/ajax/pay/', request, function(response) {
			if (response.error) {
				popups.mobileAlert(response.error);
			} else {
				if(typeof ym=='function') ym(ymID, 'reachGoal', 'form_submit_payment_online');
				if(typeof ga=='function') ga('send', 'event', 'form', 'submit', 'payment_online');

				document.location = response.redirect;
			}
		});

		return false;
	});	
});
