function create_goods_installment(element, data, cart)
{

	const app = new Vue({
		el: element,
		data: data,
		computed: {
			number_format() {
				return number_format;
			}
		},
		methods: {
			changeTotal(goods_list) {
				if (!goods_list[this.goods_id])
				{
					this.total = 0;
					return;
				}

				const g = goods_list[this.goods_id];
				this.total = g.total;
			}
		}
	});

	cart.callbacks.push(function(response) {
		app.changeTotal(response.result.list);
	});

	return app;
}
function create_goods_credit(element, data, cart)
{
	/*
	data = {
		goods_id: int,
		price: 0,
		rates: {string: float, /...}
	};
	*/

	const app = new Vue({
		el: element,
		data: data,
		mounted:function(){
			// console.log(data)
		},
		computed: {
			number_format() {
				return number_format;
			}
		},
		methods: {
			changeTotal(goods_list) {
				if (!goods_list[this.goods_id])
				{
					this.total = 0;
					return;
				}

				const g = goods_list[this.goods_id];
				this.total = g.total;
			},
			openSubListCredit(){
				$('.credit_installment_popup .select__list__new').slideToggle();
				$('.credit_installment_popup .select_new').toggleClass('select--open')
			},
			setCreditValue(value){
				this.currentCreditPeriodKey=value;
				$('.credit_installment_popup .select__list__new').slideUp();
				$('.credit_installment_popup .select_new').removeClass('select--open')
			},
		}
	});

	cart.callbacks.push(function(response) {
		app.changeTotal(response.result.list);
	});

	return app;
}