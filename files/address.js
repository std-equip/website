/**
 *
 * @param {String} id
 * @param data
 * @param {YandexMap} map_main
 * @param {YandexMap} map_popup
 * @returns {*}
 */
function create_address_app(id, data, map_main, map_popup)
{
	const app = new Vue({
		el: id,
		data: data,
		template: '#address-template',
		watch: {
			current(new_value) {
				if (new_value === null)
				{
					return;
				}

				this.setPopupCenter(new_value.address);
			},
			'current.address': _.debounce(function (new_value) {
				if (!new_value)
				{
					return;
				}
				if (new_value.length < 5)
				{
					return;
				}

				this.setPopupCenter(new_value);
			}, 1500)
		},
		computed: {
			filteredList() {
				const lower = this.filter.toLowerCase();
				if (lower.length === 0)
				{
					return this.list;
				}

				const result = [];
				for (let i = 0; i < this.list.length; i++)
				{
					const address = this.list[i].address.toLowerCase();
					if (address.indexOf(lower) !== -1)
					{
						result.push(this.list[i]);
					}
				}
				
				return result;
			},
		},
		methods: {
			resetNewTimeOut(){
				clearTimeout(this.timeoutElement);
			},
			setPopupCenter(address) {
				if (map_popup.placemark === null)
				{
					return;
				}

				map_popup.setCenterByAddress(address);
			},
			setMainCenter(item) {
				if (map_main.placemark === null)
				{
					return;
				}

				this.highlighted = item;
				map_main.setCenterByAddress(item.address);
			},
			setCoords(coords) {
				if (!this.popup)
				{
					return;
				}

				if (this.current === null)
				{
					return;
				}

				//map_popup.setCenter(coords);
				map_popup._setPlacemark(coords);

				const self = this;

				map_popup.coords2address(coords).then(function (address) {
					self.current.address = address;
					self.tech.autocomplete.item = address;
				});
				self.showCancel=true;
			},

			add() {
				const dt = new Date();
				const m = dt.getMonth() >= 9 ? (dt.getMonth() + 1).toString() : '0' + (dt.getMonth() + 1);
				const d = dt.getDate() >= 9 ? dt.getDate().toString() : '0' + dt.getDate();
				const date = '' + dt.getFullYear() + '-' + m + '-' + d;
				this.current = {
					id: 0,
					_create: date + ' 00:00:00',

					address: '',
					comments: '',

					floor: 1,
					entrance: 1,

					pass_entry: false,
					narrow_road: false,
					arch: false,
					barrier: false,
					narrow_stairs: false,
					technical_floor: false,
					allow_edit: true
				};
				this.popup = true;
				this.showCancel=false;
				this.tech.autocomplete.item = '';
				$('body').css('overflow','hidden');
				map_popup.reset();
			},
			edit(address) {
				if (!address.allow_edit)
				{
					return;
				}
				this.current = {...address};
				this.popup = true;
				this.tech.autocomplete.item = this.current.address;
				$('body').css('overflow','hidden');
				this.showCancel=true;
			},
			toggleTooltip(address, show, element) {
				if (show===null)
				{
					show = this.tooltip.text == '' ? true : false;
				}

				if (show && this.allow_share)
				{
					const shared = this.shared_ids.includes(address.id) || !address.allow_edit;
					this.tooltip.text = shared ? 'Доступен для всех коллег из «' + this.company + '»' : 'Сделать адрес доступным для всех коллег из «' + this.company + '»';
					var top=0, left=0;
					element = $(element).closest('div');
					left = element.position().left;
					if(!$(element).hasClass('addresses_item')) { 
						element = $(element).closest('.addresses_item').get(0);
						if(element!=undefined){
							top = $(element).position().top;
						}
					}
					/*if(!$(element).hasClass('addresses_item')) { 
						element = $(element).closest('.addresses_item').get(0);
						if(element!=undefined)
							top = $(element).position().top;
					}*/
					this.tooltip.top =  top + 35 + 'px';
					this.tooltip.left = left + 30 +'px';
				}
				else
				{
					this.tooltip.text = '';
				}
			},
			share(address) {
				if (!address.allow_edit || !this.share)
				{
					return;
				}

				const self = this;
				const request = {
					address: address.id,
					share: this.shared_ids.includes(address.id) ? 0 : 1
				};
				this._request(request, function (response) {
					self.shared_ids = response;
				});
			},
			remove(address) {
				if (!address.allow_edit)
				{
					return;
				}
				
				const index = this.list.indexOf(address);
				if (index !== -1)
				{
					this.list.splice(index, 1);

					this._request({remove: address.id}, function () {
						
					});
					if(!this.list.length){
						this.emptyList=true;
					}
				}
			},
			save() {
				if (!this.current.allow_edit)
				{
					return;
				}
				if (this.current.address === '')
				{
					popups.alertNew('Не указан адрес.','',false);
					return;
				}

				this.current.pass_entry = this.current.pass_entry ? 1 : 0;
				this.current.narrow_road = this.current.narrow_road ? 1 : 0;
				this.current.arch = this.current.arch ? 1 : 0;
				this.current.barrier = this.current.barrier ? 1 : 0;
				this.current.narrow_stairs = this.current.narrow_stairs ? 1 : 0;
				this.current.technical_floor = this.current.technical_floor ? 1 : 0;

				this.emptyList=false;
				const self = this;
				const address = this.current;
				this._request({save: address}, function (response) {
					if (address.id === 0)
					{
						self.list.push(response);
					} else {
						let result = self.list.find(obj => obj.id === address.id);
						if(result.address!=address.address){
							self.setMainCenter(address)
						}
						if (result) {
							Object.assign(result, address);
						}
					}
				});

				this.closePopup();
			},
			_request(data, success) {
				$.ajax({
					type: 'POST',
					url: '/ajax/address/',
					data: data,
					success: success,
					//processData: false,
					dataType: 'json'
				});
			},

			autocompleteGetLabel: function (item) {
				return item;
			},
			autocompleteFind: function (request) {
				const self = this;
				if (!request)
				{
					self.showCancel=false;
					return;
				}
				self.showCancel=true;
				if (request.length < 5)
				{
					return;
				}

				
				self.timeoutElement=setTimeout(function(){
					const myGeocoder = window.ymaps.geocode(request, {boundedBy: map_popup.getBounds()});
					const max = 30;
					myGeocoder.then(
						function (res) {
							const n = Math.min(max, res.geoObjects.getLength());
							const options = [];
							for (let i = 0; i < n; i++)
							{
								const obj = res.geoObjects.get(i);
								options.push(obj.properties.get('text').replace('Россия, ', ''));
							}
							self.tech.autocomplete.items = options;
						},
						function (err) {
							//alert('Ошибка');
						}
					);
				}, 2000)
			},
			setAddressAutocomplete: _.debounce(function (item) {
				if (item)
				{
					this.setAddress(item);
				}
			}, 500),
			setAddress: function (new_value) {
				if ((new_value === '') || (new_value === this.current.address))
				{
					return;
				}

				this.current.address = new_value.trim();
				this.tech.autocomplete.item = this.current.address;
				this.showCancel=true;
			},

			getDeliveryActionAreas() {
				return [];
			},
			getPrices() {
				return null;
			},
			closePopup(){
				this.popup = false;
				$('body').css('overflow','auto');
			}, 
			clearSearchValue(){
				this.filter='';
			},
			clearValueSearch(){
				// console.log('click')
				this.resetNewTimeOut();
				this.showCancel=false;
				this.tech.autocomplete.items=[];
				this.tech.autocomplete.item='';
				this.current.address_coords=[];
				this.current.address='';
				this.$refs.autocompleteInput.searchText='';
				map_popup.resetRoute();

			},
		}
	});
	map_main.app = app;
	map_popup.app = app;

	$(app.$refs.shared).hide();

	return app;
}