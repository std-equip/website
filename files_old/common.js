'use strict';

/**
 *
 * @returns {boolean}
 */
function is_chat_supported()
{
	if (!('WebSocket' in window))
	{
		return false;
	}

	if (!is_es6_support())
	{
		return false;
	}

	return is_localstorage_supported();
}

/**
 *
 * @returns {boolean}
 */
function is_es6_support()
{
	'use strict';

	if (typeof Symbol == "undefined") return false;
	try
	{
		eval('class Foo { get x() { return 0;} }');
		eval('var bar = (x) => x+1');
	} catch (e) { return false; }

	return true;
}

/**
 *
 * @returns {boolean}
 */
function is_localstorage_supported()
{
	try
	{
		const storage = window.localStorage;
		const x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e)
	{
		return false;
	}
}

/**
 *
 * @param {string} open_selector
 * @param {string} view_selector
 * @param {boolean} enabled
 * @param {boolean} is_desktop
 * @returns {boolean}
 */
function chat_init(open_selector, view_selector, enabled, is_desktop)
{
	const $open = $(open_selector);
	const $view = $(view_selector);

	if (!is_chat_supported() || !enabled)
	{
		$view.hide();
		return false;
	}
	
	if (is_desktop)
	{
		$view.hide();
	}
	else
	{
		$open.parent().hide();
	}

	$view.load('/api-chat/ajax/', function(){
		if (typeof chat == 'undefined')
		{
			if (!is_desktop)
			{
				$view.show();
			}
			return;
		}

		chat.$view = $view;

		if (chat.isAuthorized && chat.open && !chat.banned)
		{
			chat_start();
		}

		if (!is_desktop)
		{
			$open.parent().hide();
			if (typeof chat == 'undefined')
			{
				$view.open();
			}
			else
			{
				chat.show();
			}
		}
	});

	$open.on('mousedown', function() {
		if (typeof chat == 'undefined')
		{
			$view.toggle();
			return;
		}

		if (chat.started)
		{
			chat.toggle();
		}
		else if (chat.isAuthorized)
		{
			chat_start();
		}
		else
		{
			chat.toggle();
		}

		return false;
	});

	return true;
}

function chat_init_mobile()
{
	const features = 'menubar=no,location=no,resizable=yes,scrollbars=yes,status=no,width=500,height=700';
	if ((typeof window.chat_window != 'undefined') && (window.chat_window != null))
	{
		window.chat_window.focus();
		return true;
	}

	window.chat_window = window.open('/api-chat/', 'chat', features);
	return window.window.chat_window != null;
}

/**
 *
 * @returns {boolean}
 */
function is_emoji_supported()
{
	if (is_emoji_supported.cache !== null)
	{
		return is_emoji_supported.cache
	}

	if (typeof window === 'undefined')
	{
		return false;
	}

	const node = window.document.createElement('canvas');
	const ctx = node.getContext('2d');
	if (!ctx)
	{
		return false;
	}
	const backingStoreRatio =
		ctx.webkitBackingStorePixelRatio ||
		ctx.mozBackingStorePixelRatio ||
		ctx.msBackingStorePixelRatio ||
		ctx.oBackingStorePixelRatio ||
		ctx.backingStorePixelRatio ||
		1;

	ctx.fillStyle = '#000';
	ctx.textBaseline = 'top';
	ctx.font = '32px Arial';
	ctx.fillText('\u2764\uFE0F', 0, 0); // ❤️

	const image_data = ctx.getImageData(22 * backingStoreRatio, 10 * backingStoreRatio, 1, 1);
	const support = (image_data.data[0] !== 0)
		&& (image_data.data[3] !== 0)
		&& (image_data.data[0] > (image_data.data[1] * 2))
		&& (image_data.data[0] > (image_data.data[2] * 2));

	is_emoji_supported.cache = support;

	return support;
}

is_emoji_supported.cache = null;

/**
 * 
 * @param {string} str 
 * @returns string
 */
function twemoji_parse(str)
{
	return twemoji.parse(str, {
		className: 'img-emoji'
	});
}

/**
 *
 * @param {string} src
 * @param {string} [integrity='']
 * @param {string} [crossOrigin='']
 */
function load_script(src, integrity, crossOrigin)
{
	if (typeof integrity == 'undefined')
	{
		integrity = '';
	}
	if (typeof crossOrigin == 'undefined')
	{
		crossOrigin = '';
	}

	const js = document.createElement('script');
	js.type = 'text/javascript';
	if (crossOrigin)
	{
		js.crossOrigin = crossOrigin;
	}
	if (integrity)
	{
		js.integrity = integrity;
	}
	js.src = src;

	const head = document.getElementsByTagName('head')[0];
	head.appendChild(js);
}

/**
 *
 * @param {ChatUser} user
 * @returns {boolean}
 */
function chat_validate_user(user)
{
	if (user.name === '')
	{
		alert('Не указано имя.');
		return false;
	}

	if (user.phone === '')
	{
		alert('Не указано телефон.');
		return false;
	}

	return true;
}




// $(document).ready(function() {
// 	$('.menuProf_checkbox_container').on('click', function() {
// 		if(($('.menuProf_checkbox_svg-unchecked').css('background')) == '#fff') {
// 			// $('.menuProf_checkbox_svg-checked').removeClass('checkbox_hidden');
// 			$('.menuProf_checkbox_svg-unchecked').css('background', '#ea0208 url(/img/ico_checked_consult.png) center center no-repeat');
// 			// $('.menuProf_checkbox_svg-unchecked').removeClass('checkbox_visible');
// 			// $('.menuProf_checkbox_svg-unchecked').addClass('checkbox_hidden');
// 		} else if (($('.menuProf_checkbox_svg-unchecked').css('background')) != '#fff') {
// 			$('.menuProf_checkbox_svg-unchecked').css('background', '#fff');
// 			// $('.menuProf_checkbox_svg-unchecked').addClass('checkbox_hidden');
// 		}
// 	});
// });
