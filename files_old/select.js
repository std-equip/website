const slctControl = {
	clsSlct: '.select',
	clsHead: '.select__head',
	callbacks: [],
	slct: null,
	init: function(){
		slctControl.slct = $(slctControl.clsSlct);
		slctControl.slct.on('click', slctControl.clsHead, function () {
			const head = $(this);
			if (head.hasClass('open')) {
				head.removeClass('open');
				slctControl.slct.removeClass('select--open');
				head.next().fadeOut();
			} else {
				head.addClass('open');
				slctControl.slct.addClass('select--open');
				head.next().fadeIn();
			}
		});

		slctControl.slct.on('click', '.select__item', function () {
			const item = $(this), 
				slctRev = item.closest(slctControl.clsSlct).hasClass('select-reviews') || item.closest(slctControl.clsSlct).hasClass('select-catalog'),
				ul = slctRev ? item.parent().parent() : item.parent(), 
				head = ul.prev();

			head.removeClass('open');
			slctControl.slct.removeClass('select--open');
			ul.fadeOut();
			if(slctRev){
				head.find('span').text( item.text() );
				head.siblings('input[type=hidden]').val( item.data('id') );	
			}else{
				head.html( item.html() );
				head.prev().val( item.data('value') );
			}
			for (let i in slctControl.callbacks)
				slctControl.callbacks[i](item);
		});
		
		$(document).click(function (e) {
			if (!$(e.target).closest(slctControl.clsSlct).length) {
				$(slctControl.clsHead).removeClass('open');
				slctControl.slct.removeClass('select--open');
				$('.select__list').fadeOut();
			}
		});
	}
}
$(function() {
	slctControl.init();
});
//	for vacancy module by Ilya
function select_custom()
{
	const $select = $('.select');
	$select.off('click', '.select__head');
	$select.on('click', '.select__head', function () {
		if ($(this).hasClass('open'))
		{
			$(this).removeClass('open');
			$(this).next().fadeOut();
		}
		else
		{
			$('.select__head').removeClass('open');
			$('.select__list').fadeOut();
			$(this).addClass('open');
			$(this).next().fadeIn();
		}
	});

	$select.off('click', '.select__item');
	$select.on('click', '.select__item', function () {
		$('.select__head').removeClass('open');

		const $e = $(this);
		const $parent = $e.parent();
		$parent.fadeOut();
		$parent.prev().text($e.text());

		const id = $e.data('id');
		$parent.prev().prev().val(typeof id !== 'undefined' ? id : $e.text());

		$parent.find('.selected').removeClass('selected');
		$e.addClass('selected');
	});
}