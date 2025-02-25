class DeliveryTarget
{
	/**
	 *
	 * @param {*} area
	 * @param {String} delivery_type
	 * @param {*} transport
	 * @param {Number} distance
	 * @param {*} shop
	 * @param {Number} order_price
	 * @param {Boolean} is_company
	 * @param parking
	 * @param {Boolean} free
	 * @param {Number} free
	 * @param {Number} warehouse_id
	 * @param {Boolean} calculation
	 * @param {Number} vat
	 * @constructor
	 */
	constructor(area, delivery_type, transport,
				distance, shop, order_price, is_company,
				parking, free, warehouse_id, calculation, vat)
	{
		this.area = area;
		this.delivery_type = delivery_type;
		this.transport = transport;
		this.distance = distance;
		this.shop = shop;
		this.order_price = order_price;

		this.is_company = is_company;
		this.parking = parking;
		this.free = free;
		this.warehouse_id = warehouse_id;
		this.calculation = calculation;
		this.vat = vat;
	}
}

class DeliveryPrice
{
	/**
	 * @type {Number|null}
	 */
	price = null;

	/**
	 * @type {Number|null}
	 */
	action = null;

	/**
	 * @type {String|null}
	 */
	error = null;

	setPrice(price)
	{
		this.price = price;
		this.action = price;
	}
}

class DeliveryAreaPrices
{
	constructor(prices, transport)
	{
		if (prices != null)
		{
			this.id = prices.id;
			this.order_price = prices.order_price;
			this.colored = prices.colored;
			this.min_unload_price = prices.min_unload_price;

			this.day = null;
			this.standard = null;
			this.express = null;
			this.exact = null;
			this.courier = null;
		}
		else
		{
			this.id = 0;
			this.order_price = transport.free_delivery_from;
			this.colored = 0;
			this.min_unload_price = 0;

			this.day = transport.price_start;
			this.standard = transport.price_start;
			this.express = transport.price_start;
			this.exact = transport.price_start;
			this.courier = transport.price_start;
		}
	}
}

function DeliveryPriceCalculator(constants, courier_id, data_references)
{
	this.rates = deepFreeze(Object.assign({}, constants.RATES));
	this.delivery_page = constants.DELIVERY_PAGE;
	this.delivery_exceptions = constants.DELIVERY_EXCEPTIONS;
	this.courier_id = courier_id;

	this.only_areas_fields = {
		'standard': 'only_areas',
		'exact': 'only_areas_by_time',
		'express': 'only_areas_express',
		'day': 'only_areas_by_day',
		
		'courier': 'only_areas'
	};

	this.data_references = data_references;
}

DeliveryPriceCalculator.prototype.onlyAreasField = function(delivery_type) {
	return this.only_areas_fields[delivery_type];
};

/**
 *
 * @param {DeliveryTarget} target
 * @param {DeliveryAreaPrices} prices
 * @returns {boolean}
 * @private
 */
DeliveryPriceCalculator.prototype._isFree = function(target, prices) {
	if (target.free)
	{
		return true;
	}

	const valid_type = (target.delivery_type === 'standard') || (target.delivery_type === 'day');
	if (!valid_type)
	{
		return false;
	}

	if (!prices)
	{
		return false;
	}

	if (prices.order_price <= 0)
	{
		return false;
	}

	return (prices.colored) && (target.order_price >= prices.order_price);
};

DeliveryPriceCalculator.prototype.get = 
/**
 * 
 * @param {DeliveryTarget} target 
 * @returns DeliveryPrice
 */
function(target)
{
	const result = new DeliveryPrice();
	if (!target.calculation)
	{
		result.error = 'Стоимость доставки для данного заказа будет рассчитана оператором.';
		return result;
	}

	if ((target.distance == null) || (target.distance === -1))
	{
		result.error = 'Расчет не возможен. Ошибка построения маршрута.';
		return result;
	}

	if (target.transport == null)
	{
		if (target.vat !== 1)
		{
			result.error = 'Нет доступного транспорта для доставки данного заказа. Стоимость будет рассчитана менеджером';
		}
		else if (target.parking)
		{
			result.error = 'Учитывая установленное ограничение по высоте проезда, а также весогабаритные характеристики Вашего заказа, для его доставки потребуется несколько автомобилей. Стоимость доставки не может быть рассчитана автоматически, её Вам сообщит оператор в момент подтверждения заказа.';
		}
		else
		{
			result.error = 'Нет доступного транспорта.';
		}

		return result;
	}

	if (target.free)
	{
		result.setPrice(0);
		return result;
	}

	const prices = this.areaPrices(target);

	/*
	if ((target.area) && (prices) && (target.delivery_type=='day') && (this.tech.time_day.value==0))
	{
		if (this.delivery_exceptions[target.transport.id][target.area.id])
		{
			prices.order_price = this.delivery_exceptions[target.transport.id][target.area.id];
		}
	}
	*/
	const only_areas_field = this.onlyAreasField(target.delivery_type);
	if ((prices) && (prices.price > 0))
	{
		result.setPrice(prices.price);
	}
	else if (((prices === null) || (prices.id === 0) || (prices.price === 0)) && target.transport[only_areas_field])
	{
		result.error = this.delivery_page
			? 'Выбранный тип доставки по данному адресу не возможен. Выберите другое транспортное средство.'
			: 'Стоимость доставки для данного заказа не может быть рассчитана автоматически. Пожалуйста, обратитесь к оператору по тел. 8 (800) 100-21-12';
		return result;
	}
	else if (target.area || (target.shop == null))
	{
		result.error = this.delivery_page
			? 'Выбранный тип доставки по данному адресу не возможен. Выберите другое транспортное средство.'
			: 'Стоимость доставки для данного заказа не может быть рассчитана автоматически. Пожалуйста, обратитесь к оператору по тел. 8 (800) 100-21-12';
		return result;
	}
	else
	{
		const min_price = parseFloat(target.transport.price_start);
		const shop_rate = parseFloat(target.shop.delivery_rate);
		let price_rate = (shop_rate > 0)
			? 1 + (shop_rate / 100) + (-10) / 100
			: 1;
		price_rate = 1;

		const transport_price = parseFloat(target.transport.price_load) + parseFloat(target.transport.price_unloading) + (target.distance * parseFloat(target.transport.price_per_km) * price_rate);
		result.setPrice(Math.ceil(Math.max(transport_price, min_price) * this.rates[target.delivery_type]));
	}

	if (target.vat !== 1)
	{
		result.setPrice(parseFloat((parseFloat((result.price / 6).toFixed(2)) * 6 * target.vat).toFixed(2)));
	}

	if (this._isFree(target, prices))
	{
		result.setPrice(0);
	}
	
	if(typeof target.distance == 'number' && target.distance > 300)
	{
		result.setPrice(null);
		result.error = "Проверьте корректность адреса доставки или\r\nВам позвонит оператор для уточнения деталей после подтверждения заказа.";
	}

	return result;
};

DeliveryPriceCalculator.prototype.areaPrices = function(target)
{
	const prices = this.areaTransportPrices(target);
	if (prices == null)
	{
		return null;
	}

	const denied_15_tons = false;//(target.delivery_type=='exact') || (target.delivery_type=='standard');
	if (denied_15_tons && (parseFloat(target.transport.max_weight) > 15000))
	{
		return null;
	}

	prices.price = prices[target.delivery_type];

	prices.is_courier = this.courier_id === target.transport.id;

	return prices;
};

DeliveryPriceCalculator.prototype.areaTransportPrices = 
/**
 * 
 * @param {DeliveryTarget} target 
 * @returns {DeliveryAreaPrices|null}
 */
function(target) {

	if (target.area == null)
	{
		return null;
	}
	
	if (target.transport == null)
	{
		return null;
	}

	if (target.shop == null)
	{
	//	return null;
	}

	if (this.data_references.areas.length === 0)
	{
		return new DeliveryAreaPrices(null, target.transport);
	}

	const transport_prices = this.data_references.transports_prices[target.transport.id];
	if (!transport_prices)
	{
		return null;
	}
	
	const key = target.is_company
		? target.area.id + '.' + target.warehouse_id
		: target.area.id;
	const prices = transport_prices[key];
	if (!prices)
	{
		return null;
	}

	const result = new DeliveryAreaPrices(prices);
	
	result.day = prices.price_day;
	result.standard = prices.price_standard;
	result.exact = prices.price_exact;
	result.courier = this.courier_id ? prices.price_courier : null;

	if (target.transport.express)
	{
		result.express = prices.price_express;
	}

	return result;
};