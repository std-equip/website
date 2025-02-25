function get_placemark_image(shop)
{
	const result = {
		src: '/img/svg/map/icon_placeholder.svg',
		width: 48,
		height: 62
	};

/* 	if (shop.shop_type==2)
	{
		if (shop.is_main==1)
		{
			result.src = '/img/svg/map/sklad_main.svg';
			result.width = 37;	
			result.height = 38;		
		}
		else
		{
			result.src = '/img/svg/map/sklad.svg';	
			result.width = 30;	
			result.height = 30;	
		}		
	}
	else
	{
		if (shop.is_main==1)
		{
			result.src = '/img/svg/map/main_magazin.svg';	
			result.width = 35;	
			result.height = 35;	
		}
		else
		{				
			result.src = '/img/svg/map/magazin.svg';
			result.width = 30;	
			result.height = 30;	
		}
	} */

/* 	if (shop.id=='197' || shop.id=='shop_197' || shop.id =='37')
	{
		result.src = '/img/svg/map/office_sale.svg';
		result.width = 30;
		result.height = 30;
	} */
	return result;
}

function get_placemark_image_grey(shop)
{
	const result = {
		src: '',
		width: 0,
		height: 0
	};

	if (shop.shop_type==2)
	{
		if (shop.is_main==1)
		{
			result.src = '/img/svg/map/grey_sklad_main.svg';
			result.width = 35;	
			result.height = 37;		
		}
		else
		{
			result.src = '/img/svg/map/grey_sklad.svg';
			result.width = 28;	
			result.height = 29;		
		}		
	}
	else
	{
		if (shop.is_main==1)
		{
			result.src = '/img/svg/map/grey_shop_main.svg';
			result.width = 36;	
			result.height = 38;	
		}
		else
		{				
			result.src = '/img/svg/map/grey_shop.svg';
			result.width = 29;	
			result.height = 29;	
		}
	}
	if (shop.id=='197' || shop.id=='shop_197' || shop.id =='37')
	{
		result.src = '/img/svg/map/office_sale.svg';
		result.width = 30;
		result.height = 30;
	}
	return result;
}

let shops_placemarks_grey = []
let balloon_layout_grey;
let balloon_content_layout_grey;
let clusterer;

function set_placemarks_grey(shops, map)
{
	let i = 0;
	
	$.each(shops, function(key2, shop) {
		shop.latitude = shop.latitude;
		shop.longitude = shop.longitude;
		
		const image = get_placemark_image_grey(shop);
	
		shops_placemarks_grey.push(new ymaps.Placemark([shop.latitude,shop.longitude], {
			name: shop.id,
			balloonContentHeader: shop.name,
			balloonContent: placemark_content(shop),
			hintContent: shop.name
		},{
			balloonShadow: false,
			balloonLayout: balloon_layout_grey,
			balloonContentLayout: balloon_content_layout_grey,
			balloonPanelMaxMapArea: 0,
			hideIconOnBalloonOpen: true,
			//preset: 'islands#nightDotIcon'
			iconLayout: 'default#image',
			iconImageHref: image.src,
			iconImageSize: [image.width, image.height],
			iconImageOffset: [-Math.ceil(image.width/2), -Math.ceil(image.height/2)]
		}));

		shops_placemarks_grey[i].events.add('click', function (e) {
			map.setCenter(e.get('target').geometry.getCoordinates(), 15);
		});

		i = i + 1;
	});
	clusterer = new ymaps.Clusterer({
		clusterIcons: [{
			href: '/img/svg/map/grey_cluster.svg',
			size: [29, 29],
			offset: [-21, -21]
		}],

		zoomMargin:200,
		clusterDisableClickZoom: false,
		clusterHideIconOnBalloonOpen: false,
		geoObjectHideIconOnBalloonOpen: false
	});
	
	clusterer.add(shops_placemarks_grey);
	
	map.geoObjects.add(clusterer);
}

function placemark_content(shop)
{
	let str = '';
	str += '<div class="popover-description"><div class="popover-title popover_description-title">'+shop.name+'</div>';
	str += '<div class="popover-line popover-address"><i class="icon icon-navigation_full"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/svg/sprite_new.svg#icon-navigation_full"></use></svg></i><div class="popover-line-title">'+shop.address+'</div></div>';
	str += ((shop.phone) ? '<div class="popover-line popover-phone"><i class="icon icon-phon_full"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/svg/sprite_new.svg#icon-phon_full"></use></svg></i><div class="popover-line-title">'+shop.phone+'</div></div>': '');
	str += ((shop.metro) ? '<div class="popover-line popover-metro"><i class="icon"><svg><use xlink:href="/img/svg/sprite_new.svg#icon-metro_full"></use></svg></i><div className="popover-line-title">'+shop.metro+'</div></div> ' : '');				
	str += ((shop.business_hours) ? '<div class="popover-line popover-time"><i class="icon icon-calendar_full"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/img/svg/sprite_new.svg#icon-calendar_full"></use></svg></i><div class="popover-line-title">'+shop.business_hours+'</div></div>': '');
	str += '</div>';

	return str;
}
