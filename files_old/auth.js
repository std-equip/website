function _app_authorization(urls) {
	const data = {
		errors: {
			phone: '',
			timer: '',
			code: '',
			captcha_login: '',
			block: '',
			password:'',
			login_value:'',
		},

		urls: urls,

		step: 0,
		visible: false,
		sended: false,

		phone: '',
		code: '',
		card: '',
		password: '',
		login_value:'',
		delay: 0,
		countdown: 60,
		url_skip: '',
		focus_mask: false,
		valid_phone: false,
		_delay_start: null,
		_delay_timer: null,
		valid_code: false,
		need_reg: false,
		loading: false,
		loading_phone:false,
		loading_password:false,
		//captchaToken: '',
		allowed: '0123456789',
		full_code: Array(5),
		countRequestCode: 0,
		mode: 'password',
		mask: null,
		mask_phone: null,
		type_login: false,
		show_inputPassword: false,
		valid_login_auth: false,
		showEight: false,
		firstEmail: false,
		typeTel: false,
		phoneMaskLogin: {
			mask: '+{7} (000) 000-00-00',
			lazy: false,
		},
		emailMaskLogin: {
			mask: /^\S*@?\S*$/,
			lazy: false,
		},
		checkValuePress: null,
		checkValuePress2: null,
		checkValuePress3: null,
		unmaskVal: '',
		showButtonLoginPhone:true,
		validate_phone_before:false,
		loading_check_value:false,
		haveChangeVal:false,
	};

	return new Vue({
		el: "#app_authorization",
		data: data,
		watch: {
			phone(new_value) {
				let newPhone = new_value.replace(/[^0-9]/g, "");
				if (newPhone.length == 11) {
					this.errors.phone = "";
					this.valid_phone = true;
				} else {
					this.valid_phone = false;
				}
			},
			"mask_phone.unmaskedValue": function (new_value) {
				this.phone = new_value;
			},
		},
		methods: {
			insertAtPosition(originalString, insertString, position) {
				return (
					originalString.slice(0, position) +
					insertString +
					originalString.slice(position)
				);
			},
			formattedPhone(new_val) {
				let formattedNumber = "+7 (";
				if (new_val.length > 0) {
					formattedNumber += new_val.substring(0, 3);
				}
				if (new_val.length >= 3) {
					formattedNumber += ") " + new_val.substring(3, 6);
				}
				if (new_val.length >= 6) {
					formattedNumber += "-" + new_val.substring(6, 8);
				}
				if (new_val.length > 8) {
					formattedNumber += "-" + new_val.substring(8, 10);
				}
				return formattedNumber;
			},
			removePreviousChar(originalString, position) {
				if (position > 0) {
					return (
						originalString.slice(0, position - 1) +
						originalString.slice(position)
					);
				}
				return originalString;
			},
			phone_formatFunct(phoneItem) {
				const rawPhone = phoneItem.replaceAll(/[^0-9]+/g, "");
				let formattedPhone = "";
				if (rawPhone.length == 11) {
					formattedPhone =
						"+7" +
						" (" +
						rawPhone.substring(1, 4) +
						") " +
						rawPhone.substring(4, 7) +
						"-" +
						rawPhone.substring(7, 9) +
						"-" +
						rawPhone.substring(9, 11);
				} else {
					formattedPhone =
						"+7" +
						" (" +
						rawPhone.substring(0, 3) +
						") " +
						rawPhone.substring(3, 6) +
						"-" +
						rawPhone.substring(6, 8) +
						"-" +
						rawPhone.substring(8, 10);
				}

				return formattedPhone;
			},
			authPassword: function () {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginpass');
                    this.sended = false;
                    return false;
                }
				if (this.sended) return false;
				this._resetErrors();
				this.loading_password=true;
				const self = this;
				this.sended = true;
				this._request(
					{
						auth_phone: this.login_value,
						password: this.password,
						type_login: this.type_login,
                        token: this.captchaToken
					},
					function (response) {
						self.loading_password=false;
                        self.resetSmartCaptcha('loginpass');
						if (response.success) {
							var url = new URL(window.location);
							url.searchParams.delete("authorization");
							window.history.pushState({}, "", url);
							document.location.reload();
						} else {
							Object.assign(self.errors, response.errors);
							if (response.errors.allInfo) {
								response.errors.login_value =
									response.errors.password;
							}
						}
					}
				);
			},
			clearItemValue: function (nameInput) {
				this[nameInput] = "";
				this.errors[nameInput] = "Поле обязательно для заполнения";
				if (nameInput == "login_value") {
					//this.mask.value = "";
					// this.mask.updateOptions({
					// 	mask: /^\S*@?\S*$/,
					// 	lazy: false,
					// });
					//this.mask.updateValue();
					//this.mask.unmaskedValue = "";
					this.show_inputPassword = false;
					this.showEight = false;
					this.firstEmail = false;
					this.typeTel = false;
					this.unmaskVal = "";
					this.$refs.inp_login.value='';
					this.showButtonLoginPhone=true;
				}
				this.valid_login_auth = false;
				this.validate_phone_before=false;

				this.loading_check_value=false;
				this.haveChangeVal=false;
			},
			checkEmptyPassword: function () {
				if (this.password.length > 0) {
					this.errors.password = "";
				}
				if (
					this.password.length > 1 &&
					this.errors.login_value == "" &&
					this.show_inputPassword
				) {
					this.valid_login_auth = true;
				} else {
					this.valid_login_auth = false;
				}
			},
			validateInputType() {
				this.login_value = this.unmaskVal;
				this.show_inputPassword = false;
				if (/^\d+$/.test(this.login_value)) {
					if (this.login_value.length == 10) {
						this.login_value='7'+this.login_value;
						this.type_login = "tel";
						this.errors.login_value = "";
						this.loading_check_value=true;
						this.checkClientsInBase();
					} else {
						this.errors.login_value = "Некорректный формат";
						self.haveChangeVal=false;
					}
				} else {
					var emailRegex =
						/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if (emailRegex.test(this.login_value)) {
						this.errors.login_value = "";
						this.type_login = "email";
						this.loading_check_value=true;
						this.checkClientsInBase();
					} else if (this.login_value.length == 0) {
						this.errors.login_value =
							"Поле обязательно для заполнения";
						self.haveChangeVal=false;
					} else {
						this.errors.login_value = "Некорректный формат";
						self.haveChangeVal=false;
					}
				}
			},
			checkClientsInBase() {
				if(!this.type_login) return;
				const self = this;
				self.need_reg=false;
				this._request(
					{
						checkClients: this.login_value,
						type_login: this.type_login,
					},
					function (response) {
						let result = response.res !== undefined ? response.res : response, timerVal = 0;
						if(response.timer !== undefined) timerVal = response.timer;
						else if(response.errors.timer !== undefined) timerVal = response.errors.timer; 
						if (timerVal) {
							self.countdown=timerVal;
							// self._codeStep1();
						}
						self.loading_check_value=false;

						if (result.success)
						{
							let have_clients = response.need_reg !== undefined && !response.need_reg;
							self.showButtonLoginPhone = self.type_login != 'tel' && !have_clients;
							self.show_inputPassword = have_clients;
							
							if(have_clients)
								self.checkEmptyPassword();
							else {
								if(self.type_login=='tel'){
									if(response.send_code){
										self.phone=self.login_value.substr(1);
										self.countRequestCode=0;
										self.need_reg=true;
										self._codeStep1();
									}
								} else
									self.errors.login_value='Email не обнаружен. Войдите по номеру телефона';
							}
						}
						else
						{
							Object.assign(self.errors, result.errors);
						}
					}
				);
			},
			handleSubmit(event) {
                if (event !== undefined) {
                    event.preventDefault(); // предотвращаем перезагрузку страницы
                }

				if (this.mode === "resetPassword") {
					this.resetCode();
				} else {
					this.requestCode();
				}
			},
			handleSubmitStep2(event) {
                if (event !== undefined) {
                    event.preventDefault();
                }
				if (this.mode === "resetPassword") {
					this.forgetPasswordCode();
				} else {
					this.authCode();
				}
			},
			resetCode() {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginsms');
                    this.sended = false;
                    return false;
                }
				if (this.sended) return false;
				this._resetErrors();
				this.loading_phone=true;
				const self = this;
				this.sended = true;
				let captcha = true;
				this._request(
					{ forgot: this.phone, token: this.captchaToken},
					function (response) {
                        self.resetSmartCaptcha('loginsms');
						self.loading_phone=false;
						let result = response.res !== undefined ? response.res : response;
						if (result.success) {
							if (response.timer) self.countdown=response.timer;
							self._codeStep1();
						} else {
							Object.assign(self.errors, response.errors);
						}
					}
				);
			},
			forgetPasswordCode() {
				if (this.sended) return false;
				this._resetErrors();
				this.loading=true;
				const self = this;
				this.sended = true;
				this._request(
					{ restore: this.phone, code: this.code },
					function (response) {
						self.loading = false;
						if (response.success) {
							self._reset();
							setTimeout(function () {
								var ip;
								if (
									self.mode == "sms" ||
									self.mode == "resetPassword"
								) {
									ip = self.$refs.inp_phone.$el;
								} else {
									ip = self.$refs.inp_login;
								}
								self.setCursorPosition();

								ip.focus();
							}, 10);
							popups.mobilealertNew(
								"Пароль изменен",
								"Новый пароль отправлен Вам на указанный номер",
								true
							);
						} else {
							
							self.valid_code = false;
							Object.assign(self.errors, response.errors);
						}
					}
				);
			},
			toggleMode(newVal) {
				this.mode = newVal;
				const self = this;
				self._resetValue();
				setTimeout(function () {
					var ip;
					if (self.mode == "sms" || self.mode == "resetPassword") {
						ip = self.$refs.inp_phone;
					} else {
						ip = self.$refs.inp_login;
					}
					self.setCursorPosition();

					ip.focus();
				}, 10);
			},
			showMaskFunction: function () {
				var self = this;

				//this.setCursorPosition()
				this.focus_mask = true;
				let phoneNumber = self.mask_phone.unmaskedValue;
				if (phoneNumber.length == 0) {
					let maskOptions2 = {
						mask: "+{7} (#00) 000-00-00",

						definitions: {
							"#": /[01234569]/,
						},
						placeholderChar: "_",
						lazy: false,
					};
					self.mask_phone.updateOptions(maskOptions2);
					self.mask_phone.updateValue();
				}
				setTimeout(function () {
					//let newPhone = self.phone.replace(/[^0-9]/g, '');

					if (phoneNumber.length == 0) {
						self.setCursorPosition();
					}
				});
			},
			setCursorPosition: function () {
				var ip;
				if (this.mode == "sms" || self.mode == "resetPassword") {
					ip = this.$refs.inp_phone;
				} else {
					ip = this.$refs.inp_login;
				}
				if (ip.createTextRange) {
					var part = ip.createTextRange();
					part.move("character", 4);
					part.select();
				} else if (ip.setSelectionRange) {
					ip.setSelectionRange(4, 4);
				}
			},
			hideMaskFunction: function () {
				let newPhone = this.mask_phone.unmaskedValue;
				if (newPhone.length === 1 || newPhone.length === 0) {
					this.phone = "";
					this.focus_mask = false;
					this.valid_phone = false;
					this.errors.phone = "Поле обязательно для заполнения";
					let maskOptions2 = {
						mask: "+{7} (#00) 000-00-00",

						definitions: {
							"#": /[01234569]/,
						},
						placeholderChar: "_",
						lazy: true,
					};
					this.mask_phone.updateOptions(maskOptions2);
					this.mask_phone.updateValue();
					this.mask_phone.value = "";
					this.mask_phone.unmaskedValue = "";
				} else if (newPhone.length > 1 && newPhone.length < 11) {
					this.errors.phone = "Некорректно введен номер ";
				}
			},
			clearPhoneInput: function () {
				this.phone = "";
				this.focus_mask = false;
				this.valid_phone = false;
				this.errors.phone = "Поле обязательно для заполнения";
				let maskOptions2 = {
					mask: "+{7} (#00) 000-00-00",

					definitions: {
						"#": /[01234569]/,
					},
					placeholderChar: "_",
					lazy: true,
				};
				this.mask_phone.updateOptions(maskOptions2);
				this.mask_phone.value = "";
				this.mask_phone.unmaskedValue = "";
			},
			open: function (url_skip) {
				const self = this;
				var url = new URL(window.location);
				url.searchParams.set("authorization", "open");
				window.history.pushState({}, "", url);

				if (typeof url_skip == "undefined") {
					url_skip = "";
				}

				this.url_skip = url_skip;
				this.visible = true;
				this.focus_mask = true;
				$("body").css(
					"padding-right",
					window.innerWidth -
						document.documentElement.clientWidth +
						"px"
				);
				$("body").css("overflow-y", "hidden");
				setTimeout(function () {
					var ip;
					if (self.mode == "sms") {
						ip = self.$refs.inp_phone;
					} else {
						ip = self.$refs.inp_login;
					}
					self.setCursorPosition();

					ip.focus();
				}, 10);
			},
			close: function () {
				this._reset();
				this.visible = false;
				var url = new URL(window.location);
				url.searchParams.delete("authorization");
				window.history.pushState({}, "", url);
				$("body").css("padding-right", "0px");
				$("body").css("overflow-y", "scroll");
			},
			_resetErrors: function () {
				for (let k in this.errors) {
					this.errors[k] = "";
				}
			},
			_reset: function () {
				this.step = 0;
				this.mode = "password";
				this._resetValue();
			},
			_resetValue: function () {
				this.phone = "";
				this.code = "";
				this.password = "";
				this.login_value = "";
				this.captcha_login = "";
				this.valid_code = false;
				this.valid_phone = false;
				this.focus_mask = false;
				(this.full_code = Array(5)), this._resetErrors();
				this.countRequestCode = 0;
				//this.mask.value = "";
				// this.mask.updateOptions({
				// 	mask: /^\S*@?\S*$/,
				// 	lazy: false,
				// });
				//this.mask.updateValue();
				//this.mask.unmaskedValue = "";
				this.mask_phone.value = "";
				this.mask_phone.unmaskedValue = "";
				this.show_inputPassword = false;
				this.showEight = false;
				this.firstEmail = false;
				this.typeTel = false;
				this.unmaskVal = "";
				this.$refs.inp_login.value='';
				this.valid_login_auth = false;
				this.loading_phone=false;
				this.loading=false;
				this.loading_password=false;
				this.validate_phone_before=false;
				this.showButtonLoginPhone=true;
				this.loading_check_value=false;
				this.haveChangeVal=false;
			},

			_codeStep1: function () {
				this.step = 1;
				this._delay_start = new Date();
				this.code = '';
				this.full_code = Array(5);
				this.valid_code = false;
				setTimeout(() => {
					$('.auth-codeForm__input')[0].focus();
				}, 150);

				const self = this;
				this._delay_timer = setInterval(function () {
					self._delayHandler();
				}, 1000);
			},
			codeInputFunction: function (event, key) {
				if (this.allowed.includes(event.data)) {
					this.full_code[key] = event.data;
					$(event.target).next().focus();
					this.trySendCode();
				} else {
					this.full_code[key] = '';
					event.preventDefault();
					if (this.countRequestCode < 3) {
						this.errors.code = '';
					}
					//event.stopPropagation();
				}
			},
			CheckLengthCodeItem: function (key, $event) {
				if ($event.code === 'ArrowLeft' && key > 0) {
					$event.preventDefault();
					$event.stopPropagation();
					$($event.target).prev().focus();
				} else if ($event.code === 'ArrowRight' && key < 6) {
					$event.preventDefault();
					$event.stopPropagation();
					$($event.target).next().focus();
				} else if ($event.code === 'Backspace' && key > 0) {
					// if (this.full_code[key] !== '')
					// {
					// 	$($event.target).val('');
					// 	this.full_code[key] = '';

					// }
					// else if (this.full_code[key-1] !== '')
					// {
					// 	$($event.target).prev().val('');
					// 	//$event.target.prev().value='';
					// 	this.full_code[key-1] = '';
					// 	$($event.target).prev().focus();
					// }
					$($event.target).val('');
					this.full_code[key] = '';
					$($event.target).prev().focus();
					$event.preventDefault();
					$event.stopPropagation();
					if (this.countRequestCode < 3) {
						this.errors.code = '';
					}
				}
			},
			_delayHandler: function () {
				const seconds = Math.round(((new Date()) - this._delay_start) / 1000);
				this.delay = Math.max(0, this.countdown - seconds);
				if (this.delay === 0)
				{
					clearInterval(this._delay_timer);
				}
			},
			requestCode: function () {
                if(this.captchaToken === undefined){
                    this.smartCaptchaExecute('loginsms');
                    this.sended = false;
                    return false;
                }
				if (this.sended) return false;
				this._resetErrors();
				this.loading_phone=true;
				const self = this;
				let captcha = true;
				this.sended = true;
				this.countRequestCode = 0;
				this._request(
					{
						request_code: this.phone,
                        token: this.captchaToken,
					},
					function (response) {
						self.resetSmartCaptcha('loginsms');
						self.loading_phone=false;
						let result = response.res !== undefined ? response.res : response;
                        if(response.res !== undefined) {
                            if (result.success) {
								if (response.timer) self.countdown=response.timer;
                                self.need_reg = response.need_reg;
                                self._codeStep1();
                            } else {
                                Object.assign(self.errors, result.errors);
                            }
                        } else {
                            Object.assign(self.errors, result.errors);
                        }
					}
				);
			},
			authCode: function () {
				if (this.sended) return false;
				if (this.errors.block) return false;
				this._resetErrors();
				this.loading = true;
				const self = this;
				this.sended = true;
				this.countRequestCode++;
				this._request({ auth_code: this.code, phone: this.phone, need_reg: this.need_reg?1:0}, function (response) {
					if (response.success) {
						if (self.need_reg) {
							self.step = 3;
						} else {
							var url = new URL(window.location);
							url.searchParams.delete("authorization");
							window.history.pushState({}, "", url);
							document.location.reload();
						}
					} else {
						Object.assign(self.errors, response.errors);
						self.loading = false;
						self.valid_code = false;
						// self.code='';
						// self.full_code=Array(5);
						// setTimeout(()=>{$('.auth-codeForm__input')[0].focus();},150);
					}
				});
			},

			_request: function (request, onresponse) {
				const self = this;
				const settings = {
					method: "POST",
					data: request,
					dataType: "json",
					success: onresponse,
					complete: function (jqXHR, textStatus) {
						self.sended = false;
					},
				};

				$.ajax("/ajax/authorization/", settings);
			},

			// get recaptcha token when user resolved it
			recaptchaVerify(response) {
				//this.captchaToken = response;
			},
			// check the recaptcha widget
			checkRecaptcha(ref) {
				return this.$refs["recaptcha_" + ref].check();
			},
			resetRecaptcha(ref) {
				this.$refs["recaptcha_" + ref].reset();
			},
            smartCaptchaExecute(ref){
                return this.$refs['smartcaptcha_'+ref].execute();
            },
            smartCaptchaVerify(response){
                this.captchaToken = response;
            },
            checkSmartCaptcha(ref){
                return this.$refs['smartcaptcha_'+ref].check();
            },
            resetSmartCaptcha(ref){
                this.captchaToken = undefined;
                return this.$refs['smartcaptcha_'+ref].reset();
            },
			full_codeFunction() {
				let code = "";
				this.full_code.forEach((num) => {
					if (!!num) {
						code = code + num;
					}
				});
				//const code = this.full_code[0] + this.full_code[1] + this.full_code[2] + this.full_code[3] + this.full_code[4] + this.full_code[5];
				return code;
			},
			trySendCode() {
				this.code = this.full_codeFunction();
				if (this.code.length === 6)
				{
					if(this.countRequestCode>=3){
						this.errors.code='Вы неверно ввели код 3 раза. Запросите новый.';
						return false;
					}
					this.errors.code = "";
					this.valid_code = true;

					if (this.mode === "resetPassword") {
						this.forgetPasswordCode();
					} else {
						this.authCode();
					}
				} else {
					this.valid_code = false;
				}
			},
			togglePassword: function ($event, password) {
				const $e = $($event.currentTarget);
				if (password.type === "text") {
					password.type = "password";
					$e.removeClass("view");
				} else {
					password.type = "text";
					$e.addClass("view");
				}
			},
			checkPositionInunMaskVal:function(cursorPosition){
				switch (cursorPosition){
					case 1:
					case 3:
					case 4:
						return 0;
					case 2:
					case 5:
						return 1;
					case 6: return 2;
					case 7:
					case 8:
					case 9:
						return 3
					case 10: return 4;
					case 11: return 5;
					case 12:
					case 13:
						return 6;
					case 14: return 7;
					case 15: return 8;
					case 16: return 9;
					case 17:
					case 18:
						return 10;
					case 19:
						return 11;
				}
				// console.log()
				// return new_pos_val;
			},
			checkPositionInunMaskVal2:function(cursorPosition){
				switch (cursorPosition + 1) {
					case 1:
					case 2:
					case 3:
					case 4:
						return 0;
					case 5: return 1;
					case 6: return 2;
					case 7:
					case 8:
					case 9:
						return 3;
					case 10: return 4;
					case 11: return 5;
					case 12:
					case 13:
						return 6;
					case 14: return 7;
					case 15:
					case 16:
						return 8;
					case 17:
						return 9;
					case 18:
						return 10;
				}
				// console.log()
				// return new_pos_val;
			},
			checkInputValueMaskLogin: function () {
				const regex = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
				const self = this;
				let keyPressVal = event.target.value.charAt(
					event.target.selectionStart - 1
				);
				if(event.target.value.length==18 && event.target.value.startsWith('+7')){
					self.typeTel = true;
					self.unmaskVal = event.target.value.replace(/[\D]+/g,'').slice(1);
					self.validate_phone_before=true;
					return;
				}
				if(event.target.value.length==12 && event.target.value.startsWith('+7') && event.target.value.replace(/[\D]+/g,'').length==11){
					self.typeTel = true;
					self.unmaskVal = event.target.value.replace(/[\D]+/g,'').slice(1);
					event.target.value=self.formattedPhone(event.target.value.replace(/[\D]+/g,'').slice(1));
					self.validate_phone_before=true;
					return;
				}
				let cursorPosition = event.target.selectionStart;
				if (event.target.value.length == 0) {
					self.showEight = false;
					self.firstEmail = false;
					self.typeTel = false;
					self.unmaskVal = "";
					return;
				}
				if (
					event.target.value.length == 11 &&
					(event.target.value.startsWith("8") ||
						event.target.value.startsWith("7")) &&
					!/\D/.test(event.target.value)
				) {
					if (event.target.value.startsWith("8")) {
						self.showEight = true;
					}
					self.typeTel = true;
					self.unmaskVal = event.target.value.slice(1);

					event.target.value = self.formattedPhone(
						event.target.value.slice(1)
					);
					self.validate_phone_before=true;
					return;
				}
				if(event.target.value.length==16 && event.target.value.startsWith('+7') && regex.test(event.target.value)){
					self.typeTel = true;
					self.unmaskVal = event.target.value.replace(/[\D]+/g,'').slice(1);
					event.target.value=self.formattedPhone(event.target.value.replace(/[\D]+/g,'').slice(1));
					self.validate_phone_before=true;
					return;
				  }
				  self.validate_phone_before=false;
				if (self.typeTel) {
					if (
						event.target.value.length ==
						self.formattedPhone(self.unmaskVal).length
					) {
						return;
					}

					if (
						event.target.value.length <
						self.formattedPhone(self.unmaskVal).length
					) {
						if(self.formattedPhone(self.unmaskVal).length-event.target.value.length>1){

							if(event.target.value.length==1){
								self.unmaskVal=event.target.value;
								self.showEight=false;
								if(self.allowed.includes(keyPressVal) && keyPressVal !=8 && keyPressVal !=7){
									event.target.value = self.formattedPhone(
										self.unmaskVal
									);
								} else {
									self.typeTel = false;
									
								}
								return;
							}
						}
						let useForm = true;
						let swithcCas;
						if(self.showEight){
							swithcCas=cursorPosition;
						} else {
							swithcCas=cursorPosition + 1;
						}
						switch (swithcCas) {
							case 1:
							case 2:
								useForm = false;
								break;
							case 3:
							case 4:
								useForm = false;
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									0
								);
								break;
							case 5:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									1
								);
								break;
							case 6:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									2
								);
								break;
							case 7:
							case 8:
							case 9:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									3
								);
								break;
							case 10:
							case 11:
							case 12:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									swithcCas - 6
								);
								break;
							case 13:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									6
								);
								break;
							case 14:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									7
								);
								break;
							case 15:
							case 16:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									8
								);
								break;
							case 17:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									9
								);
								break;
							case 18:
								self.unmaskVal = self.removePreviousChar(
									self.unmaskVal,
									10
								);
								break;
						}
						if (useForm) {
							event.target.value = self.formattedPhone(
								self.unmaskVal
							);
						}
						return;
					}
				} else {
					if (event.target.value.length == self.unmaskVal.length) {
						return;
					}
					if (event.target.value.length < self.unmaskVal.length) {
						self.unmaskVal = event.target.value;
						return;
					}
				};

					if(self.typeTel){
						let newPos=self.checkPositionInunMaskVal(cursorPosition);
						self.unmaskVal = self.insertAtPosition(
							self.unmaskVal,
							keyPressVal,
							newPos-1
						);
					} else {
						if(((event.target.value.length-self.unmaskVal.length)==event.target.value.length)&&event.target.value.length>1){
							self.unmaskVal=event.target.value;
						} else{
							self.unmaskVal = self.insertAtPosition(
								self.unmaskVal,
								keyPressVal,
								cursorPosition - 1
							);
						}
	
					}			

				if (self.unmaskVal == "8") {
					return;
				}
				if (
					self.unmaskVal.startsWith("8") &&
					self.unmaskVal.length == 2 &&
					self.allowed.includes(keyPressVal)
				) {
					self.showEight = true;
					self.typeTel=true;
					self.unmaskVal = self.unmaskVal.slice(1);
					event.target.value = self.formattedPhone(self.unmaskVal);
					return;
				}

				if (
					self.unmaskVal.length < 11 &&
					self.unmaskVal.length > 0 &&
					!/\D/.test(self.unmaskVal)
				) {
					self.firstEmail = false;
					self.typeTel = true;
					event.target.value = self.formattedPhone(self.unmaskVal);
				} else {
					self.typeTel = false;
					if (self.showEight && !self.firstEmail) {
						self.unmaskVal = "8" + self.unmaskVal;
						self.firstEmail = true;
					}
					event.target.value = self.unmaskVal;
				}
				if(self.unmaskVal.length==10 && self.unmaskVal.replace(/[\D]+/g,'').length==10){
					self.validate_phone_before=true;
				} else {
					var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
					if(emailRegex.test(self.unmaskVal)) {
						self.validate_phone_before=true;
					} else{
						self.validate_phone_before=false;
					}
					
				}
			},
			focusLoginValue(){
				const self=this;
				if(!this.haveChangeVal){
					setTimeout(function(){
						self.validateInputType();
					}, 500)
				}

			},
			changeValueItem(){
				this.haveChangeVal=true;
				const self=this;
				setTimeout(function(){
					self.validateInputType();
				}, 500)
			}
			
		},
		mounted() {
			const element = document.getElementById("login_auth");
			// this.mask = IMask(element, this.emailMaskLogin);

			const maskOptions = {
				mask: [
					{
						mask: "+{7} (000) 000-00-00",
					},
					{
						mask: /^\S*@?\S*$/,
					},
				],
			};
			//this.mask = IMask(element, maskOptions);

			const element2 = document.getElementById("phone_auth");
			let maskOptions2 = {
				mask: "+{7} (#00) 000-00-00",

				definitions: {
					"#": /[01234569]/,
				},
				placeholderChar: "_",
			};
			this.mask_phone = IMask(element2, maskOptions2);
			this.validateInputType();
		},
		created() {
			var urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get("authorization") === "open") {
				this.open();
			}
		},
	});
}
