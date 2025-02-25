'use strict';

/**
 * Корректировка округления десятичных дробей.
 *
 * @param {String}  type  Тип корректировки.
 * @param {Number}  value Число.
 * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
 * @returns {Number} Скорректированное значение.
*/
function decimalAdjust(type, value, exp)
{
	// Если степень не определена, либо равна нулю...
	if (typeof exp === 'undefined' || +exp === 0)
	{
		return Math[type](value);
	}

	value = +value;
	exp = +exp;

	// Если значение не является числом, либо степень не является целым числом...
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
	{
		return NaN;
	}

	// Сдвиг разрядов
	value = value.toString().split('e');
	value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));

	// Обратный сдвиг
	value = value.toString().split('e');

	return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Десятичное округление к ближайшему
if (!Math.round10)
{
	Math.round10 = function(value, exp) {
		return decimalAdjust('round', value, exp);
	};
}
// Десятичное округление вниз
if (!Math.floor10)
{
	Math.floor10 = function(value, exp) {
		return decimalAdjust('floor', value, exp);
	};
}
// Десятичное округление вверх
if (!Math.ceil10)
{
	Math.ceil10 = function(value, exp) {
		return decimalAdjust('ceil', value, exp);
	};
}
/**
 *
 * @param {Number} price
 * @returns {number}
 */
function price_rounding(price)
{
	return Math.round10(price, -1)
}

function zeroFill(number, width)
{
	width -= number.toString().length;
	if ( width > 0 )
	{
		return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
	}
	return number + '';
}

function deepFreeze(obj)
{
	Object.freeze(obj);
	if (obj === undefined)
	{
		return obj;
	}

	Object.getOwnPropertyNames(obj).forEach(function (prop) {
		if (obj[prop] !== null
			&& (typeof obj[prop] === "object" || typeof obj[prop] === "function")
			&& !Object.isFrozen(obj[prop])) {
			deepFreeze(obj[prop]);
		}
	});

	return obj;
}

function random_string(length)
{
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++)
	{
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
}

function v2time(value, delta, step)
{
	const step_h = 60 / step;
	const h = Math.floor(value / step_h) + delta;
	let m = ':' + (step * (value % step_h));
	if (m === ':0')
	{
		m = ':00';
	}

	return zeroFill(h, 2) + m;
}

function number_text(number, textes)
{
	const cases = [2, 0, 1, 1, 1, 2];
	const option = (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5];

	return number + ' ' + textes[option];
}

function number_format(number, decimals, dec_point, thousands_sep)
{
	let i, j, kw, kd, km;

	if (isNaN(decimals = Math.abs(decimals)))
	{
		decimals = 0;
	}
	if (dec_point === undefined)
	{
		dec_point = '.';
	}
	if (thousands_sep === undefined)
	{
		thousands_sep = ' ';
	}

	i = parseInt(number = (+number || 0).toFixed(decimals)) + '';

	if( (j = i.length) > 3 ){
		j = j % 3;
	} else{
		j = 0;
	}

	km = (j ? i.substring(0, j) + thousands_sep : '');
	kw = i.substring(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
	kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : '');

	return km + kw + kd;
}

function nf_price(price, decimal)
{
	if (typeof decimal == 'undefined')
	{
		if (price < 10)
		{
			decimal = 2;
		}
		else if (Math.round(price) !== price)
		{
			decimal = 2;
		}
		else
		{
			decimal = 0;
		}
	}

	return number_format(price, decimal, ',', ' ');
}

/**
 * @param {String} phone
 */
function phone_format(phone)
{
	if ('9998887766'.length !== phone.length)
	{
		return phone;
	}

	const prefix = phone.slice(0, 3);
	const code1 = phone.slice(3, 6);
	const code2 = phone.slice(6, 8);
	const code3 = phone.slice(8, 10);

	return '+7 (' + prefix + ') ' + code1 + '-' + code2 + '-' + code3;
}

function form2values($form)
{
	const list = $form.serializeArray();
	const values = {};

	$.each(list, function() {
		let value = this.value != null ? this.value : '';

		if (values[this.name] != null)
		{
			if (!values[this.name].push)
			{
				values[this.name] = [values[this.name]];
			}

			values[this.name].push(value);
		}
		else
		{
			values[this.name] = value;
		}
	});

	return values;
}

function dataLayerPush(event) {
	if (typeof dataLayer !== 'undefined') {
		dataLayer.push({'event': event});
	}
    if (typeof ym != 'undefined') {
        ym(ymID, 'reachGoal', event);
    }
}
