function reach_goal(goal, params)
{
	if (typeof ym !== 'undefined')
	{
		if (typeof params !== 'undefined')
		{
            ym(ymID, 'reachGoal', goal, params);
		}
		else
		{
            ym(ymID, 'reachGoal', goal);
		}
	}
}

function ecommerce(type, products, actions)
{
	//detail - просмотр полного описания
	//add - добавление в корзину
	//remove - удаление из корзины
	//purchase - покупка
	
	var e = {};
	e[type] = {'products': products};
	if (typeof actions !== 'undefined')
	{
		e[type]['actionField'] = actions;
	}
	
	var e2 = {'ecommerce': e};
	var size = JSON.stringify(e2).length;
	
	if (size > 2048)
	{
		if (typeof actions === 'undefined')
		{
			var actions = {type: type};
		}
		else
		{
			actions['type'] = type;
		}
		reach_goal('over2048', actions);
	}
	window.dataLayer.push(e2);
}
let ecommerce_list_cache = {};
function ecommerce_list(products, listname, start) {
    let i = start + 1;
    $.each(products, function(index, product) {
        if(typeof ecommerce_list_cache[product['id']] === 'undefined') {
            ecommerce_list_cache[product['id']] = product;
        }
        product['list'] = listname;
        product['position'] = i;
        i += 1;
    });
    let data = {
        "ecommerce": {
            "currencyCode": "RUB",
            "impressions": products,
        }
    };
    window.dataLayer.push(data);
}

function ecommerce_product_click(id) {
    if (typeof ecommerce_list_cache[id] !== 'undefined') {
        let data = {
            "ecommerce": {
                "currencyCode": "RUB",
                "click": {
                    "products": [
                        ecommerce_list_cache[id]
                    ]
                }
            }
        };
        window.dataLayer.push(data);
    }
}
function ecommerce_promo(action, promos) {
    let data = {
        "ecommerce": {
        }
    };

    data.ecommerce[action] = {
        "promotions": promos
    }

    window.dataLayer.push(data);
}
function ecommerce_ga_products(products, type, details)//detail click ..etc
{
	$.each(products, function(index, product) {
		ga('ec:addProduct', product);
	});
	if (typeof details === 'undefined')
	{
		ga('ec:setAction', type);
	}
	else
	{
		ga('ec:setAction', type, details);
	}
	ga('send', 'event', 'Ecommerce', 'Data');
}

var ecommerce_ga_cache = {}
function ecommerce_ga_list(products, listname, start)
{
	ecommerce_ga_cache[listname] = products;
	var i = start + 1;
	$.each(products, function(index, product) {
		if ((index % 5)==0)
		{
			ga('ec:setAction', 'detail');
			ga('send', 'event', 'Ecommerce', 'Data');
		}
		product['list'] = listname;
		product['position'] = i;
		i += 1;
		ga('ec:addImpression', product);
	});
	ga('ec:setAction', 'detail');
	ga('send', 'event', 'Ecommerce', 'Data');
}

function ecommerce_ga_loaded()
{
	var loaded = false;
	ga(function(){
		loaded = true;
	});
	return loaded;
}

function ecommerce_ga_list_click(id, listname, redirect)
{
	if (!ecommerce_ga_loaded())
	{
		return true;
	}
	
	if (!(listname in ecommerce_ga_cache))
	{
		return true;
	}
	
	var finded = false;
	$.each(ecommerce_ga_cache[listname], function(index, product){
		if (product.id==id)
		{
			finded = true;
			ga('ec:addProduct', product);
			ga('ec:setAction', 'click', {list: listname});
			ga('send', 'event', 'Ecommerce', 'Data', listname, {
				hitCallback: function() {
					document.location = redirect;
				}
			});
		}
	});

	return !finded;
}

/* Yandex Metrika Goals */
$(function() {
    $('.js-login-open').on('click', function () {
        ym(ymID, 'reachGoal', 'auth_click');
        ga('send', 'event', 'click', 'button', 'auth_click');
        return true;
    });
    $('.openRegistrationModal').on('click', function () {
            ym(ymID, 'reachGoal', 'reg_click');
            ga('send', 'event', 'click', 'button', 'reg_click');
            return true;
    });

    $('.goods_card_link a').on('click', function(e) {
        let parent = $(this).closest('.goods_card_wrap');
        ecommerce_product_click(parent.data('id'));
    });
});
