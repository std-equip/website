Vue.component('recaptcha', {
	props: ['id','size'],
	template: '<div :id="id" :data-sitekey="sitekey" :size="size"></div>',
	data: function () {
		return {
			sitekey: '6Lc7eP8jAAAAAKVg4reHTi3nrDdTbDo7KchSzzZV',
			widgetId: 0,
		}
	},
	methods: {
		execute: function() {
			window.grecaptcha.execute(this.widgetId)
		},
		reset: function() {
			window.grecaptcha.reset(this.widgetId)
		},
		check: function() {
			return window.grecaptcha.getResponse(this.widgetId);
		},
		render: function() {
			if (window.grecaptcha && window.grecaptcha.render) {
				this.widgetId = window.grecaptcha.render(this.id, {
					sitekey: this.sitekey,
					size: this.size,
					callback: (response) => {
						this.$emit('verify', response);
					}
				});
			}
		},
		checkCaptchaLoaded: function() {
			if(gCaptchaLoaded)
				this.render();
			else
				setTimeout(this.checkCaptchaLoaded, 200);
		},
	},
	mounted: function() {
		this.checkCaptchaLoaded();
	}
});