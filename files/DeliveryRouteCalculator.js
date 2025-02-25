function DeliveryShop(shop)
{
	this.name = shop.name;
	this.coords = [shop.latitude, shop.longitude];
	this.id = shop.id;
	this.distance = null;
	this.success = false;
	this.is_repair = shop.is_repair == '1';
	this.is_new = shop.is_new == '1';

	this.route = null;
	this.waypoints = null;
}

DeliveryShop.prototype.active = function() {
	return !(this.is_repair || this.is_new);
};

DeliveryShop.prototype.disable = function() {
	this.distance = -1;
	this.success = false;
};

DeliveryShop.prototype.isValidRoute = function(route) {
	if (route == null)
	{
		return false;
	}
	
	if (route.properties.get('rawProperties').RouteMetaData.hasFerries)
	{
		return false;
	}
	
	if (route.properties.get('hasTolls'))
	{
		return false;
	}
			
	return true;
};

DeliveryShop.prototype.shortestRoute = function(routes) {
	let shortest = null;

	const nested_routes = routes.getRoutes();
	for (let i = 0; i < nested_routes.getLength(); i++)
	{
		const route = nested_routes.get(i);
		if (!this.isValidRoute(route))
		{
			continue ;
		}
		
		if (shortest == null)
		{
			shortest = route;
		}
		else if (shortest.properties.get('distance').value > route.properties.get('distance').value)
		{
			shortest = route;
		}
	}

	return shortest;
};

DeliveryShop.prototype.setRoutes = function(routes) {
	const route = this.shortestRoute(routes);

	if (route != null)
	{
		this.route = route;
		this.distance = Math.ceil(route.properties.get('distance').value / 1000); //расстояние км
		this.success = true;
	}
	else
	{
		this.disable();
	}

	if (typeof app != 'undefined')
	{
		app.log(this.name + ' => routes: ' + routes.getRoutes().getLength() + '; valid: ' + this.success);
	}
};

function DeliveryRouteCalculator(shops)
{
	this.shops = shops;
	this.shop = null;
    this.disableYandexRoute = false;
}

DeliveryRouteCalculator.prototype.reset = function() {
	this.shop = null;
};

DeliveryRouteCalculator.prototype.nearestShop = function(shops) {
	if (typeof app != 'undefined')
	{
		app.log('Расчет расстояния:');
		app.logTable(shops);
	}
			
	const shops_valid = [];
	for (let s in shops)
	{
		if (shops[s].success)
		{
			shops_valid.push(shops[s]);
		}
	}
			
	if (shops_valid.length === 0)
	{
		return shops[0];
	}
			
	let shop = shops_valid[0];
	if (shops_valid.length === 1)
	{
		return shop;
	}
			
	for (let i = 1; i < shops_valid.length; i++)
	{
		if (shop.distance > shops_valid[i].distance)
		{
			shop = shops_valid[i];
		}
	}
			
	return shop;
};

DeliveryRouteCalculator.prototype._findRoutes = function(shop, coords)
{
	const options = {
		multiRoute: true,
		avoidTrafficJams: false,
		results: 9,
	};
    return ymaps.route([shop.coords, coords], options).then(
        function (routes) {
            shop.setRoutes(routes);

            return shop;
        },
        function () {
            shop.disable();
            return shop;
        }
    );

};

DeliveryRouteCalculator.prototype._findSimpleRoutes = function(shop, coords)
{
    shop.distance = Math.ceil(ymaps.coordSystem.geo.getDistance(shop.coords, coords) / 1000);
    shop.success = true;
    return shop;
};

DeliveryRouteCalculator.prototype.isAllowedShop = function(shop, target_shop)
{
	if (target_shop === null)
	{
		return true;
	}

	return shop.warehouses_ids.includes(target_shop.warehouses_id);
};

DeliveryRouteCalculator.prototype.calculate = function(coords, target_shop)
{
	this.reset();

	const promises = [];

	for (let id in this.shops)
	{
		if (!this.isAllowedShop(this.shops[id], target_shop))
		{
			continue;
		}

		const shop = new DeliveryShop(this.shops[id]);
		if (!shop.active())
		{
			shop.disable();
			continue;
		}
        let promise;
        if(this.disableYandexRoute === true){
            promise = this._findSimpleRoutes(shop, coords);
        } else {
            promise = this._findRoutes(shop, coords);
        }
		promises.push(promise);
	}

	const self = this;

	return Promise.all(promises).then(function(shops){
		self.shop = self.nearestShop(shops);
		return self.shop;
	});
};