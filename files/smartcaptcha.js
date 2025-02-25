let captchaReviewWidgetId, captchaQuestionWidgetId;
const vueSmartCaptcha = Vue.component('smartcaptcha', {
    props: ['id'],
    template: '<div :id="id" :data-sitekey="sitekey"></div>',
    data: function () {
        return {
            sitekey: 'ysc1_5Dl20DXM0p8JcITqj4parvt6c5TEztKIxZrVQ2cQ08f1bb24',
            invisible: true,
            test: false,
            widgetId: 0,
        }
    },
    methods: {
        execute: function () {
            window.smartCaptcha.execute(this.widgetId)
        },
        reset: function () {
            window.smartCaptcha.reset(this.widgetId)
        },
        check: function () {
            return window.smartCaptcha.getResponse(this.widgetId);
        },
        render: function () {
            if (window.smartCaptcha) {
                this.widgetId = window.smartCaptcha.render(this.id, {
                    sitekey: this.sitekey,
                    invisible: this.invisible,
                    test: this.test,
                    callback: (response) => {
                        this.$emit('verify', response).$emit('submit');
                    }
                });
            } else {
                const self = this;
                setTimeout(function(){
                    self.render();
                    }, 500);
            }
        }
    },
    mounted: function () {
        this.render();
    }

});


function onCaptchaLoadFunction() {
    if (!window.smartCaptcha) {
        return;
    }
    let smartCaptchaLoaded = 1;

    let company_review_captcha = document.getElementById('smartcaptcha_company_review');
    if (typeof (company_review_captcha) != 'undefined' && company_review_captcha != null) {
        captchaReviewWidgetId = window.smartCaptcha.render('smartcaptcha_company_review', {
            sitekey: 'ysc1_5Dl20DXM0p8JcITqj4parvt6c5TEztKIxZrVQ2cQ08f1bb24',
            invisible: true,
            test: false,
            hl: 'ru',
            callback: (response) => {
                let $form = $('#popup_reviewCompany form');
                $form.submit();
            }
        });
    }
    let question_captcha = document.getElementById('smartcaptcha_company_question');

    if (typeof (question_captcha) != 'undefined' && question_captcha != null) {
        captchaQuestionWidgetId = window.smartCaptcha.render('smartcaptcha_company_question', {
            sitekey: 'ysc1_5Dl20DXM0p8JcITqj4parvt6c5TEztKIxZrVQ2cQ08f1bb24',
            invisible: true,
            test: false,
            hl: 'ru',
            callback: (response) => {
                let $form = $('#questions_form');
                $form.submit();
            }
        });
    }
}
