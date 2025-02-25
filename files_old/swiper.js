var arrSwiper = {};

const swiper_ecommerce = function (action, slideIndex) {
    if (typeof ecommerce_promo == 'function') {
        let slide = sliderData[slideIndex];
        let promo = {
            id: slide.id,
            name: slide.name,
            creative: "Баннер_на_главной",
            position: slideIndex
        };
        ecommerce_promo(action,[promo]);
    }
}
$(function() {
	// const swiper = new Swiper(".swiper", {
	// speed: 400,
	// spaceBetween: 10,
	// slidesPerView: "auto",
	// freeMode:true,
	// });

	/* MAIN SLIDER */
	const mainSwiper = new Swiper(".mainSlider", {
		speed: 400,
		spaceBetween: 0,
		slidesPerView: 1.045,
		centeredSlides: true,
		loop: true,
		autoplay: (currRegion == 22) ? false : {delay: 5000} ,
		noSwiping: true,
		noSwipingClass:'swiper-no-swiping',
  		noSwipingSelector: '.swiper-no-swiping',
        on: {
            click: function (swiper, event) {
                swiper_ecommerce('promoClick', swiper.realIndex);
            },
            slideChange: function (swiper) {
                swiper_ecommerce('promoView', swiper.realIndex);
            }
        },
	});

	/* index page action filter slider */
	main__goodsBlock__filterSlider = new Swiper(".main__goodsBlock__filterSlider", {
		speed: 400,
		spaceBetween: 8,
		slidesPerView: "auto",
		freeMode:true,
		
	});

	/* index page action slider */
	const main__goodsBlock__actionSlider = new Swiper(".main__goodsBlock__actionSlider", {
		speed: 400,
		spaceBetween: 10,
		slidesPerView: 1,
		loop: true,
		autoplay: {
			delay: 4000,
		  },
		  noSwiping: true,
		  noSwipingClass:'swiper-no-swiping',
			noSwipingSelector: '.swiper-no-swiping',
	});

	/* index page action services slider */
	const main__goodsBlock__servicesSlider = new Swiper(".main__goodsBlock__servicesSlider", {
		speed: 400,
		spaceBetween: 10,
		slidesPerView: 1,
		loop: true,
		autoplay: {
			delay: 4000,
		  },
	});

	/* index page action watched slider */
	const main__goodsBlock__watchedSlider = new Swiper(".main__goodsBlock__watchedSlider", {
		speed: 400,
		spaceBetween: 24,
		slidesPerView: "auto",
		freeMode:true,
	});
	const catalog__popular__popularSlider = new Swiper(".catalog__popular__popularSlider", {
		speed: 400,
		spaceBetween: 15,
		slidesPerView: "auto",
		freeMode:true,
	})
	const catalog__popular__popularSliderCart = new Swiper(".catalog__popular__popularSlider__cart", {
		speed: 400,
		spaceBetween: 16,
		slidesPerView: "auto",
		breakpoints: {
			// when window width is >= 320px
			320: {
			  spaceBetween: 24,
			},
			// when window width is >= 480px
			576: {
			  spaceBetween: 16
			},
		  },
		freeMode:true,
	})
	const breadcrumps__breadcrumpSlider = new Swiper(".breadcrumps__breadcrumpSlider", {
		speed: 400,
		spaceBetween: 15,
		slidesPerView: "auto",
		freeMode:true,
	});

	/* Clients unloading page slider */
	const service__page__slider = new Swiper(".service__page__slider__container", {
		speed: 400,
		spaceBetween: 10,
		slidesPerView: "auto",
		freeMode:true,
	});
	
	/* Clients pay page slider */
	// const service__pay__slider = new Swiper(".service__pay__slider", {
	// 	speed: 400,
	// 	spaceBetween: 20,
	// 	slidesPerView: "auto",
	// });
	
	/*Item Page*/
	const replacementItems = new Swiper(".replacementItems", {
		speed: 400,
		spaceBetween: 24,
		slidesPerView: "auto",
		freeMode:true,
	});
	const buyWithThisProduct = new Swiper(".buyWithThisProduct", {
		speed: 400,
		spaceBetween: 24,
		slidesPerView: "auto",
		freeMode:true,
	});
	const itCanBeUseful = new Swiper(".itCanBeUseful", {
		speed: 400,
		spaceBetween: 24,
		slidesPerView: "auto",
		freeMode:true,
	});
	arrSwiper.itCanBeUseful = itCanBeUseful;

	const service__page__sliderLoad = new Swiper(".service__page__deliveryCalculate__typeCar", {
		speed: 400,
		slidesPerView: "auto",
		freeMode:true,
        spaceBetween: 10,
	});



	// const stockListSliderItem = new Swiper(".stockListSliderItem", {
	// 	speed: 400,
	// 	spaceBetween: 20,
	// 	slidesPerView: "auto",
	// 	freeMode:true,
	// });
	// const stockListSliderStock = new Swiper(".stockListSliderStock", {
	// 	speed: 400,
	// 	spaceBetween: 10,
	// 	slidesPerView: "auto",
	// 	centeredSlides: true,
	// 	IOSEdgeSwipeDetection: true,
	// 	initialSlide: 1,
	// 	loop: true,
	// 	freeMode:true,
	// 	autoplay: true,

	// });
});
var main__goodsBlock__filterSlider;
function returnSldier(){
	return main__goodsBlock__filterSlider;
}
