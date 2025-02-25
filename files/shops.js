/**
 *
 * @param {String} id
 * @param data
 * @param {YandexMap} shops_map
 * @returns {*}
 */
function create_shops_app(id, data, shops_map)
{
	data.map = shops_map.key;

	const app = new Vue({
		el: id,
		data: data,
		template: '#shops-template',
		watch: {
		},
		computed: {
			region() {
				if (this.regions_id === 0)
				{
					return this.all;
				}

				return this.regionById(this.regions_id);
			},
			delivery_shops() {
				return this.region.shops;
			},
			all() {
				const result = {
					id: 0,
					name: 'Вся Россия',
					longitude: 70.569774,
					latitude: 55.699105,
					zoom: 4,
					shops: []
				};
				for (let k in this.list)
				{
					result.shops = result.shops.concat(this.list[k].shops);
				}

				return result;
			}
		},
		methods: {
			setCoords(coords) {
			},
			getDeliveryActionAreas() {
				return [];
			},
			getPrices() {
				return null;
			},
			regionById(regions_id) {
				if (regions_id === 0)
				{
					return this.all;
				}

				for (let k in this.list)
				{
					const region = this.list[k];
					if (region.id === regions_id)
					{
						return region;
					}
				}

				return null;
			},
			regionName(regions_id) {
				return this.regionById(regions_id).name;
			},
			changeRegion(regions_id) {
				this.regions_id = regions_id;

				shops_map.setCenter([this.region.latitude, this.region.longitude], this.region.zoom);
				shops_map._initShops(this.regionById(regions_id).shops);
			},
			regionsOpen() {
				this.$refs.regions.open = true;
				this.regions_open = true;

				const target = $(this.$refs.button);
				const left = target.offset().left;
				const top = target.parents('.shop__nav').offset().top + target.parents('.shop__nav').outerHeight();

				$(this.$refs.regions.$el).offset({
					top: top
				}).css('padding-left', left);

				$('body').css({
					'border-right-style': 'solid',
					'border-right-color': '#EDF0F4',
					'border-right-width': window.innerWidth - document.documentElement.clientWidth
				}).addClass('withOpenBreadcrumbNav');
			},
			regionsClose() {
				this.regions_open = false;

				$(this.$refs.regions.$el).offset({
					top: 0
				}).css('padding-left', 0);

				$('body').css('border-right', 'none').removeClass('withOpenBreadcrumbNav');
			},
			shopById(id) {
				for (let k in this.all.shops)
				{
					const shop = this.all.shops[k];
					if (shop.id === id)
					{
						return shop;
					}
				}

				return null;
			},
			center(shop, popup) {
				if (!shop)
				{
					return;
				}

				if (typeof popup === 'undefined')
				{
					popup = true;
				}

				this.mode = 'map';
				const self=this;
				setTimeout(function(){
					shops_map.setCenter([shop.latitude, shop.longitude], 15, -200);
					if (popup)
					{
						const index = self.delivery_shops.indexOf(shop);
						if (index !== -1)
						{
							const placemark = shops_map.shops_clusterer.getGeoObjects()[index];
							placemark.balloon.open();
						}
					}
	
					// const top = $(self.$el).offset().top;
					// window.scrollTo({top: top});
				}, 200,shop,shops_map)

			},
			formatPhone(schedule) {
				const res2 =  schedule.replaceAll(/(\b[0-9\-() ]{11,}\b)(?=\s*\(|\b)/g, function (match) {
					const rawPhone = match.replaceAll(/[^0-9]+/g, '');
					const linkPhone = '+7' + rawPhone.substring(1);
					const formattedPhone = rawPhone.substring(0, 1)
						+ ' (' + rawPhone.substring(1, 4) + ') '
						+ rawPhone.substring(4, 7) + '-'
						+ rawPhone.substring(7, 9) + '-'
						+ rawPhone.substring(9, 11);
				
					return `<a href="tel:${linkPhone}">${formattedPhone}</a>`;
				});
				return res2;
			},
			showTypes(shop, is_mob){
				let src_icon, content = '';
				const shop_types = shop.shop_type.split(',');
				for(let idx in shop_types){
					let typeVal = +shop_types[idx];
					switch(typeVal){
						case 1: src_icon = '/img/svg/map/icon_shop.svg'; break;
						case 2: src_icon = '/img/svg/map/icon_store.svg'; break;
						case 3: src_icon = '/img/svg/map/icon_office.svg'; break;
						case 4: src_icon = '/img/svg/map/icon_sale_office.svg'; break;
						default: src_icon = '/img/svg/map/icon_shop.svg'; typeVal=1;
					}
					content += '<img src="'+src_icon+'" alt="shop_type_icon" width="24" height="24"/> ' + this.shop_types[typeVal];
					
					if(typeof shop_types[+idx+1] != 'undefined') content += is_mob ? ' ' : '<br/>';
				}
				return content;
			}
		}
	});
	shops_map.app = app;

	return app;
}