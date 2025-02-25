/***
 *
 * @param {String} element_id
 * @param {String} template_id
 * @param {*} data
 * @param {YandexMap} map
 * @param {*} constants
 * @returns {*}
 */
function create_news_action_app(element_id, template_id, data, map, constants)
{
	const mixins = vue_cart._mixins(constants);

	data.map = map.key;

	const app = new Vue({
		el: element_id,
		template: template_id,
		data: data_news,
		mixins: mixins,
		computed: {
			current_action() {
				return this.getDeliveryAction(this.view_action_delivery_id);
			}
		},
		watch: {
			view_action_delivery_id(new_value, old_value) {
				if (new_value !== old_value)
				{
					this._refreshMap();
				}
			}
		},
		methods: {
			_refreshMap() {
				if (!map.created())
				{
					const self = this;
					setTimeout(function () {
						self._refreshMap()
					}, 500);
					return;
				}

				map.updateAreas();
				const area_ids = this.getDeliveryActionAreas(this.view_action_delivery_id);

				setTimeout(function() {
					map.setBounds(area_ids);
				}, 200);
			},
			confirm(messsage, action, button) {
				popups.confirm(messsage, action, button);
			},

			getDeliveryActionAreas: function(action_id) {
				if (typeof action_id === 'undefined')
				{
					action_id = this.view_action_delivery_id;
				}

				const action = this.getDeliveryAction(action_id);
				if (action == null)
				{
					return [];
				}

				return ('area_ids' in action) ? action.area_ids : [];
			},
			getDeliveryAction: function(action_id) {
				for (let i in this.actions_delivery)
				{
					const action = this.actions_delivery[i];
					if (action_id === action.id)
					{
						return action;
					}
				}

				return null;
			},
			setCoords: function(coords) {
				// do nothing
			},
			getPrices: function(area) {
				// do nothing
			}
		}
	});

	map.app = app;

	return app;
}