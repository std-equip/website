'use strict';

class ChatCommandsDefinition
{
	constructor()
	{
		/**
		 * 
		 * @type {string}
		 */
		this.AUTH = 'auth';

		/**
		 * 
		 * @type {string}
		 */
		this.RIGHTS = 'rights';

		/**
		 * 
		 * @type {string}
		 */
		this.SCORE = 'score';

		/**
		 * 
		 * @type {string}
		 */
		this.TYPING = 'typing';

		/**
		 * 
		 * @type {string}
		 */
		this.STATUS = 'status';

		/**
		 * 
		 * @type {string}
		 */
		this.HISTORY = 'history';
		
		/**
		 * 
		 * @type {string}
		 */
		this.MESSAGE = 'message';

		/**
		 * 
		 * @type {string}
		 */
		this.MESSAGE_EDIT = 'message-edit';

		/**
		 * 
		 * @type {string}
		 */
		this.MESSAGE_DELETE = 'message-delete';

		/**
		 * 
		 * @type {string}
		 */
		this.MESSAGE_ATTACHMENT = 'message-attachment';

		/**
		 * 
		 * @type {string}
		 */
		this.MESSAGE_READED = 'message-readed';

		/**
		 * 
		 * @type {string}
		 */
		this.REDIRECT = 'redirect';

		/**
		 * 
		 * @type {string}
		 */
		this.CHAT_ID_CHANGE = 'chat-id-change';

		/**
		 * 
		 * @type {string}
		 */
		this.CLIENTS = 'clients';

		/**
		 * 
		 * @type {string}
		 */
		this.CLIENT = 'client';

		/**
		 * 
		 * @type {string}
		 */
		this.OPERATORS = 'operators';

		/**
		 * 
		 * @type {string}
		 */
		this.OPERATOR = 'operator';

		/**
		 * 
		 * @type {string}
		 */
		this.OPERATOR_CHANGE = 'operator-change';

		/**
		 * 
		 * @type {string}
		 */
		this.OPERATOR_CHANGE_SELF = 'operator-change-self';

		/**
		 * 
		 * @type {string}
		 */
		this.OPERATOR_OFFLINE = 'operator-offline';

		/**
		 * 
		 * @type {string}
		 */
		this.VISIBLE = 'visible';

		/**
		 * 
		 * @type {string}
		 */
		this.BAN = 'ban';

		/**
		 * 
		 * @type {string}
		 */
		this.EMAIL = 'email';

		/**
		 * 
		 * @type {string}
		 */
		this.EMAIL_SENDED = 'email-sended';

		/**
		 * 
		 * @type {string}
		 */
		this.EMAIL_UNSPECIFIED = 'email-unspecified';

		/**
		 * 
		 * @type {string}
		 */
		this.CONFIRMATION = 'confirmation';

		/**
		 * 
		 * @type {string}
		 */
		 this.ALIVE = 'alive';

		/**
		 *
		 * @type {string}
		 */
		this.CHANGE_PASSWORD = 'change-password';
	}
}
'use strict';

class ChatSettings
{
	constructor()
	{
		/**
		 * 
		 * @type {string}
		 */
		this.url = '';

		/**
		 * enum[desktop, mobile, app]
		 * @type {string}
		 */
		this.platform = 'desktop';

		/**
		 * 
		 * @type {string}
		 */
		this.key = '';

		/**
		 * Chat view selector.
		 * @type {string}
		 */
		this.view = '';

		/**
		 * Chat template selector.
		 * @type {string}
		 */
		this.template = '';

		/**
		 * Audio selector.
		 * @type {string}
		 */
		this.beep = '';

		/**
		 * Is desktop.
		 * @type {boolean}
		 */
		this.is_desktop = true;

		/**
		 * 
		 * @type {boolean}
		 */
		this.online = false;

		/**
		 * 
		 * @type {string}
		 */
		this.status_view = '';

		/**
		 * Current region.
		 * @type {number}
		 */
		this.regions_id = 1;

		/**
		 * Available regions ids.
		 * @type {number[]}
		 */
		this.regions_ids = [];

		/**
		 * 
		 * @type {string}
		 */
		this.ajax_token = '';

		/**
		 * 
		 * @type {boolean}
		 */
		this.operator = false;

		/**
		 * 
		 * @type {number}
		 */
		this.operators_id = false;

		/**
		 * 
		 * @type {string[]}
		 */
		this.regions = [];

		/**
		 * 
		 * @type {string[]}
		 */
		this.domains = [];

		/**
		 * 
		 * @type {string[]}
		 */
		this.departments = [];
		
		/**
		 * 
		 * @type {string[]}
		 */
		this.templates = [];

		/**
		 * 
		 * @type {number}
		 */
		this.status_delay = 60000;

		/**
		 * 
		 * @type {number}
		 */
		this.reconnect_delay = 15000;

		/**
		 * 
		 * @type {number}
		 */
		this.typing_delay = 5000;
	}
}
'use strict';

/**
 * 
 * @callback ChatSocketStatsResponse
 * @param {ChatSocketStats} stats
 */

/**
 * 
 * @class
 */
class ChatSocketStats
{
	/**
	 * 
	 * @param {ChatSocketStatsResponse} stats 
	 */
	constructor(stats)
	{
		/**
		 * 
		 * @type {ChatSocketStatsResponse[]}
		 */
		this._callback = [];

		if (typeof stats != 'undefined')
		{
			this._callback.push(stats);
		}

		/**
		 * 
		 * @type {Boolean}
		 */
		this._connection = true;

		/**
		 * 
		 * @type {Number}
		 */
		this._reconnections = 0;

		/**
		 * 
		 * @type {Number}
		 */
		this._sended = 0;

		/**
		 * 
		 * @type {Number}
		 */
		this._queue = 0;
	}

	/**
	 *
	 * @type {boolean}
	 */
	get connection()
	{
		return this._connection;
	}

	set connection(value)
	{
		if (this._connection != value)
		{
			this._connection = value;
			this._stats();
		}
	}
	
	/**
	 *
	 * @type {Number}
	 */
	get reconnections()
	{
		return this._reconnections;
	}

	set reconnections(value)
	{
		if (this._reconnections != value)
		{
			this._reconnections = value;
			this._stats();
		}
	}

	/**
	 *
	 * @type {Number}
	 */
	get sended()
	{
		return this._sended;
	}

	set sended(value)
	{
		if (this._sended != value)
		{
			this._sended = value;
			this._stats();
		}
	}

	/**
	 *
	 * @type {Number}
	 */
	get queue()
	{
		return this._queue;
	}

	set queue(value)
	{
		if (this._queue != value)
		{
			this._queue = value;
			this._stats();
		}
	}

	_stats()
	{
		for (let i = 0; i < this._callback.length; i++)
		{
			this._callback[i](this);
		}
	}
}
'use strict';

/**
 * 
 * @callback ChatSocketResponse
 * @param {string} type
 * @param {object} data
 */

/**
 * 
 * @callback ChatSocketStatsResponse
 * @param {ChatSocketStats} stats
 */

/**
 * 
 * @class
 */
class ChatSocket
{
	/**
	 * 
	 * @param {string} url 
	 * @param {string} key_prefix 
	 * @param {ChatSocketResponse} message 
	 * @param {ChatSocketResponse} reconnect 
	 * @param {ChatSocketStatsResponse} stats 
	 */
	constructor(url, key_prefix, message, reconnect, stats)
	{
		/**
		 * 
		 * @type {string}
		 */
		this.url = url;

		/**
		 * 
		 * @type {WebSocket}
		 */
		this._socket = null;
	
		/**
		 * 
		 * @type {ChatSocketResponse[]}
		 */
		this._messageCallback = [];
	
		/**
		 * 
		 * @type {ChatSocketResponse[]}
		 */
		this._reconnectCallback = [];

		/**
		 * 
		 * @type {any[]}
		 */
		this._queue = [];
	
		/**
		 * 
		 * @type {number}
		 */
		this.delay = 15000;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.reconnect = true;
 
		this._messageCallback.push(message);
		this._reconnectCallback.push(reconnect);

		/**
		 * 
		 * @type {any[]}
		 */
		this._sended = [];

		/**
		 * 
		 * @type {string}
		 */
		this.key_prefix = key_prefix;

		/**
		 * 
		 * @type {Number}
		 */
		this.key_index = 0;

		/**
		 * 
		 * @type {ChatSocketStats}
		 */
		this._stats = new ChatSocketStats(stats);
	}

	/**
	 * 
	 * @type {boolean}
	 */
	get isOpen()
	{
		return (this._socket != null) && (this._socket.readyState === this._socket.OPEN);
	}

	/**
	 * 
	 * @returns {Promise}
	 */
	connect()
	{
		const promise = new Promise((resolve, reject) => {
			this._socket = new WebSocket(this.url);

			this._socket.addEventListener('open', (event) => {
				this._open(event);
				resolve();
			});
			this._socket.addEventListener('close', (event) => this._close(event));
			this._socket.addEventListener('error', (event) => this._error(event));
			this._socket.addEventListener('message', (event) => this._message(event));
		});

		return promise;
	}

	/**
	 * 
	 * @param {Event} event 
	 */
	_open(event)
	{
	}

	/**
	 * 
	 * @param {CloseEvent} event 
	 */
	_close(event)
	{
		this._socket = null;
		
		if (this.reconnect)
		{
			setTimeout(() => {
				this.connect().then(() => this._reconnect());
				this._stats.reconnections += 1;
			}, this.delay);
		}
	}

	/**
	 * 
	 * @param {Event} event 
	 */
	_error(event)
	{
	}

	/**
	 * 
	 * @param {MessageEvent<any>} event 
	 */
	_message(event)
	{
		const response = JSON.parse(event.data);

		if (response.type === 'confirmation')
		{
			this._received(response.data);
			return;
		}

		for (let i = 0; i < this._messageCallback.length; i++)
		{
			this._messageCallback[i](response.type, response.data);
		}
	}

	/**
	 * 
	 * @param {string} key 
	 */
	_received(key)
	{
		const index = _index(this._sended, 'key', key);
		if (index !== -1)
		{
			this._sended.splice(index, 1);
			this._stats.sended = this._sended.length;
		}
	}

	/**
	 * 
	 */
	_reconnect()
	{
		for (let i = 0; i < this._reconnectCallback.length; i++)
		{
			this._reconnectCallback[i]();
		}

		for (let i = 0; i < this._sended.length; i++)
		{
			let query = this._sended[i];
			this._socket.send(JSON.stringify(query));
		}

		while (this._queue.length)
		{
			let query = this._queue.shift();
			this._request(query[0], query[1], query[2]);
		}

		this._stats.queue = this._queue.length;
	}

	/**
	 * 
	 * @param {ChatSocketResponse} callback 
	 */
	addMessageCallback(callback)
	{
		this._messageCallback.push(callback);
	}

	/**
	 * 
	 * @param {string} type 
	 * @param {object} data 
	 * @param {number} [chats_id]
	 */
	request(type, data, chats_id)
	{
		if (this.isOpen)
		{
			this._request(type, data, chats_id);
		}
		else
		{
			this._queue.push([type, data, chats_id]);
			this._stats.queue = this._queue.length;
		}
	}

	/**
	 * 
	 * @param {string} type 
	 * @param {object} data 
	 * @param {number} chats_id 
	 */
	_request(type, data, chats_id)
	{
		const query = {
			type: type,
			data: data,
			key: this.key_prefix + this.key_index
		};
		this.key_index += 1;

		if ((typeof chats_id != 'undefined') && (chats_id != null))
		{
			query.chats_id = chats_id;
		}

		this._socket.send(JSON.stringify(query));

		this._sended.push(query);
		this._stats.sended = this._sended.length;
	}
}
'use strict';

class ChatStatus
{
	/**
	 * 
	 * @param {ChatSettings} settings
	 */
	constructor(settings)
	{
		/**
		 * @type {ChatSettings}
		 */
		this._settings = settings;

		/**
		 * 
		 * @type {anu}
		 */
		this._$view = $(this._settings.status_view);
	
		/**
		 * 
		 * @type {number}
		 */
		this._timer = 0;

		/**
		 * 
		 * @type {boolean}
		 */
		this.online = this._settings.online;
 
		if (this._settings.operator)
		{
			this._$view.hide();
			return;
		}
		
		this.start();
	}

	/**
	 * 
	 */
	start()
	{
		if (this._settings.operator)
		{
			return;
		}

		this.stop();
		this._$view.show();

		this._timer = setInterval(() => this._update(), this._settings.status_delay);
	}

	/**
	 * 
	 */
	stop()
	{
		if (this._settings.operator)
		{
			return;
		}

		//this._$view.hide();

		if (this._timer)
		{
			clearInterval(this._timer);
			this._timer = null;
		}
	}

	/**
	 * 
	 */
	_update()
	{
		$.getJSON('/api-chat/status/', {regions_id: this._settings.regions_id}, (data) => this.online = data);
	}

	/**
	 * 
	 * @type {boolean}
	 */
	get online()
	{
		return this._settings.online;
	}

	/**
	 * 
	 * 
	 */
	set online(value)
	{
		this._settings.online = value;

		if (value)
		{
			if (this._$view.hasClass('offline'))
			{
				this._$view.removeClass('offline');	
			}

			if (!this._$view.hasClass('online'))
			{
				this._$view.addClass('online');
			}
		}
		else
		{
			if (this._$view.hasClass('online'))
			{
				this._$view.removeClass('online');	
			}

			if (!this._$view.hasClass('offline'))
			{
				this._$view.addClass('offline');
			}
		}
	}
}
'use strict';

class ChatRights
{
	/**
	 * 
	 * @param {any} data 
	 */
	constructor(data)
	{
		/**
		 * 
		 * @type {boolean}
		 */
		this.attachment = false;

		/**
		 * 
		 * @type {string[]}
		 */
		this.attachment_extensions = [];
	
		/**
		 * 
		 * @type {number}
		 */
		this.attachment_limit = 0;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.message_delete = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.message_edit = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.redirect = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.score = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.history = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.invisible = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.operator_change = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.operator_change_self = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.export = false;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.ban = false;
	
		/**
		 * 
		 * @type {boolean} 
		 */
		this.others_view = false;
 
		if (typeof data != 'undefined')
		{
			this.attachment = data.attachment;
			this.attachment_extensions = data.attachment_extensions;
			this.attachment_limit = data.attachment_limit;

			this.score = data.score;

			this.message_edit = data.message_edit;
			this.message_delete = data.message_delete;
			this.redirect = data.redirect;

			this.history = data.history;
			this.invisible = data.invisible;
			this.operator_change = data.operator_change;
			this.operator_change_self = data.operator_change_self;
			this.export = data.export;
			this.ban = data.ban;
			this.others_view = data.others_view;
		}
	}
}
'use strict';

/**
 * 
 * @class
 */
class ChatUser
{
	/**
	 * 
	 * @param {string} platform 
	 * @param {string} token 
	 * @param {boolean} authorized 
	 * @param {boolean} operator 
	 */
	constructor(platform, token, authorized, operator)
	{
		/**
		 * 
		 * @type {string}
		 */
		this._platform = platform;

		/**
		 * 
		 * @type {string}
		 */
		this._token = token;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this._authorized = authorized;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this._operator = operator;
	
		/**
		 * 
		 * @type {boolean}
		 */
		this.visible = true;
		
		/**
		 * 
		 * @type {string}
		 */
		this.name = '';
	
		/**
		 * 
		 * @type {string}
		 */
		this.phone = '';
	
		/**
		 * 
		 * @type {string}
		 */
		this.email = '';
	
		/**
		 * 
		 * @type {ChatRights}
		 */
		this.rights = new ChatRights();
	}

	/**
	 * 
	 * @type {string}
	 */
	get platform()
	{
		return this._platform;
	}

	/**
	 * 
	 * @type {string}
	 */
	get token()
	{
		return this._token;
	}

	/**
	 * 
	 * @type {boolean}
	 */
	get authorized()
	{
		return this._authorized;
	}

	/**
	 * 
	 * @type {boolean}
	 */
	get operator()
	{
		return this._operator;
	}
}
'use strict';

/**
 *
 * @class
 */
class ChatEmoji
{
	/**
	 *
	 * @param {emoji} platform
	 */
	constructor(emoji)
	{
		/**
	 	 *
	 	 * @type {string}
	 	 */
		this._emoji = emoji;

		/**
		 *
	 	 * @type {string}
	 	 */
		this._view = is_emoji_supported() ? emoji : twemoji_parse(emoji);
	}

	/**
	 *
	 * @type {string}
	 */
	get emoji()
	{
		return this._emoji;
	}

	/**
	 *
	 * @type {string}
	 */
	get view()
	{
		return this._view;
	}
}

'use strict';

class Chat
{
	/**
	 *
	 * @param {ChatSettings} settings
	 * @param {ChatUser} user
	 */
	constructor(settings, user)
	{
		/**
	 	* @type {ChatSettings}
	 	*/
		this._settings = settings;

		/**
		 *
		 * @type {ChatSocket}
		 */
		this._socket = null;

		/**
		 *
		 * @type {ChatUser}
		 */
		this._user = user;

		/**
		 *
		 * @type {any}
		 */
		this._app = null;

		/**
		 *
		 * @type {number}
		 */
		this._message_key = 0;

		/**
		 *
		 * @type {ChatStatus}
		 */
		this._status = new ChatStatus(this.settings);

		/**
		 *
		 * @type {Readonly<ChatCommandsDefinition>}
		 */
		this.commands = Object.freeze(new ChatCommandsDefinition());

		/**
		 *
		 * @type {boolean}
		 */
		this.banned = this.isBanned();

		/**
		 *
		 * @type {any}
		 */
		this.$view = null;
	}

	/**
	 *
	 * @type {boolean}
	 */
	get started()
	{
		return this._app != null;
	}

	/**
	 *
	 * @type {ChatUser}
	 */
	get user()
	{
		return this._user;
	}

	/**
	 *
	 * @type {ChatSettings}
	 */
	get settings()
	{
		return this._settings;
	}

	/**
	 *
	 * @type {boolean}
	 */
	get windowVisible()
	{
		// or document.hasFocus()
		return document.visibilityState === 'visible';
	}

	/**
	 *
	 * @type {boolean}
	 */
	get open()
	{
		return this._load('open') || false;
	}

	/**
	 *
	 */
	set open(value)
	{
		this._save('open', value);

		if (this.$view == null)
		{
			return;
		}

		if (value)
		{
			this.$view.show();
		}
		else
		{
			this.$view.hide();
		}
	}

	/**
	 *
	 */
	toggle()
	{
		this.open = !this.open;
	}

	/**
	 *
	 */
	show()
	{
		this.open = true;
	}

	/**
	 *
	 */
	hide()
	{
		this.open = false;
	}

	/**
	 *
	 * @param {string} type
	 * @param {any} data
	 */
	_response(type, data)
	{
		if (type === this.commands.RIGHTS)
		{
			this._app.user.rights = new ChatRights(data);
		}
		else if (type === this.commands.STATUS)
		{
			this._status.online = data;
			this._app.online = data;
		}
		else if (type === this.commands.HISTORY)
		{
			this._app.addMessages(data);
		}
		else if (type === this.commands.MESSAGE)
		{
			this._app.addMessage(data);

			if (this.windowVisible)
			{
				if (!this.user.operator && (data.message_type === this.commands.REDIRECT))
				{
					if (chat.settings.is_desktop)
					{
						document.location = data.redirect;
					}
					else
					{
						// maybe redirect parent window?
					}
				}

				this.show();
			}
		}
		else if (type === this.commands.MESSAGE_DELETE)
		{
			this._app.deleteMessage(data);
		}
		else if (type === this.commands.MESSAGE_READED)
		{
			this._app.markReaded(data);
		}
		else if (type === this.commands.OPERATOR)
		{
			if (this.user.operator)
			{
				this._app.addOperator(data);
			}
			else
			{
				this._app.operator = data;
			}
		}
		else if ((type === this.commands.CHAT_ID_CHANGE) && (this.user.operator))
		{
			this._app.changeChatsId(data.old_id, data.new_id);
		}
		else if ((type === this.commands.CLIENTS) && (this.user.operator))
		{
			this._app.addClients(data);
		}
		else if ((type === this.commands.CLIENT) && (this.user.operator))
		{
			if (data.online || data.active)
			{
				this._app.addClient(data);
			}
			else
			{
				this._app.deleteClient(data);
			}
		}
		else if ((type === this.commands.OPERATORS) && (this.user.operator))
		{
			this._app.addOperators(data);
		}
		else if ((type === this.commands.OPERATOR_OFFLINE) && (this.user.operator))
		{
			this._app.deleteOperator(data);
		}
		else if (type === this.commands.TYPING)
		{
			if (this.user.operator)
			{
				this._app.clientTyping(data.chats_id, data.typing);
			}
			else
			{
				this._app.operatorTyping(data);
			}
		}
		else if ((type === this.commands.BAN) && (!this.user.operator))
		{
			this._save(this.commands.BAN, date_decode(data));
			this.banned = true;
			this._app.banned = true;
			this._socket.reconnect = false;
		}
		else if (type === this.commands.EMAIL)
		{
			if (data === 'sended')
			{
				this._app.alert('Диалог успешно отправлен на e-mail.');
			}
			else if (data === 'invalid')
			{
				this._app.alert('Отправка диалога невозможна: указан некорректный e-mail.');
			}
			else if (data === 'unspecified')
			{
				this._app.alert('Отправка диалога невозможна: не указан e-mail.');
			}
		}
		else if (type === this.commands.ALIVE)
		{
			this._socket.request(this.commands.ALIVE, data);
		}
		else if ((type === this.commands.CHANGE_PASSWORD) && (this.user.operator))
		{
			this._app.change_password_status = data;
		}
		else
		{
			console.error('unknown response: ', type);
			console.error(data);
		}
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isBanned()
	{
		const ban_until = this._load(this.commands.BAN);
		if (ban_until == null)
		{
			return false;
		}

		return new Date(ban_until) > new Date();
	}

	/**
	 *
	 * @param {Vue} app
	 * @returns {Promise}
	 */
	connect(app)
	{
		this.show();

		this._status.stop();

		this._app = app;
		//this._app.banned = this.banned;

		if (this._socket == null)
		{
			this._socket = new ChatSocket(
				this.settings.url,
				'confirm.' + this.settings.key,
				(type, data) => this._response(type, data),
				() => this._auth(),
				(stats) => this._app.stats = stats
			);
			this._socket.delay = this.settings.reconnect_delay;

			return this._socket.connect().then(() => this._auth());
		}
		else
		{
			return new Promise((resolve) => {
				resolve();
			});
		}
	}

	/**
	 *
	 * @param {number} message_id
	 * @param {string} text
	 */
	editMessage(message_id, text)
	{
		if (!this.user.rights.message_edit)
		{
			return;
		}

		let request = {
			id: message_id,
			text: text
		};

		this._socket.request(this.commands.MESSAGE_EDIT, request);
	}

	/**
	 *
	 * @param {string} text
	 * @param {number} chats_id
	 * @returns {string}
	 */
	message(text, chats_id)
	{
		this._message_key += 1;

		let request = {
			key: this.settings.key + this._message_key,
			text: text
		};

		this._socket.request(this.commands.MESSAGE, request, chats_id);

		return request.key;
	}

	/**
	 *
	 * @param {number[]} ids
	 * @param {number} chats_id
	 */
	readed(ids, chats_id)
	{
		if (ids.length === 0)
		{
			return;
		}

		this._socket.request(this.commands.MESSAGE_READED, ids, chats_id);
	}

	/**
	 *
	 * @param {number} operators_id
	 * @param {number} chats_id
	 */
	operatorChange(operators_id, chats_id)
	{
		if (!this.user.rights.operator_change)
		{
			return;
		}

		this._socket.request(this.commands.OPERATOR_CHANGE, operators_id, chats_id);
	}

	/**
	 *
	 * @param {number} chats_id
	 */
	operatorChangeSelf(chats_id)
	{
		if (!this.user.rights.operator_change_self)
		{
			return;
		}

		this._socket.request(this.commands.OPERATOR_CHANGE_SELF, chats_id);
	}

	/**
	 *
	 * @param {string} email
	 * @param {number} chats_id
	 */
	email(email, chats_id)
	{
		this._socket.request(this.commands.EMAIL, email, chats_id);
	}

	/**
	 *
	 * @param {string} message_key
	 * @param {number} attachments_id
	 * @param {number} chats_id
	 */
	attachment(message_key, attachments_id, chats_id)
	{
		if (!this.user.rights.attachment)
		{
			return;
		}

		const request = {
			message_key: message_key,
			attachments_id: attachments_id
		};
		this._socket.request(this.commands.MESSAGE_ATTACHMENT, request, chats_id);
	}

	/**
	 *
	 * @param {string} message_key
	 * @param {File} file
	 * @param {number} chats_id
	 */
	createAttachment(message_key, file, chats_id)
	{
		if (!this.user.rights.attachment)
		{
			return;
		}

		const data = new FormData();
		data.append('file', file);
		if (this.user.operator)
		{
			data.append('operator', '1');
		}

		$.ajax({
			method: 'POST',
			url: '/api-chat/attachments/',
			data: data,
			headers: {
				'X-Chat-Request': this.settings.ajax_token
			},
			processData: false,
			contentType: false,
			dataType: 'json',
			success: (attachments_id) => this.attachment(message_key, parseInt(attachments_id), chats_id)
		});
	}

	/**
	 *
	 * @param {boolean} visible
	 */
	visible(visible)
	{
		if (this.user.operator && this.user.rights.invisible)
		{
			this._socket.request(this.commands.VISIBLE, visible);
		}
	}

	/**
	 *
	 * @param {boolean} typing
	 * @param {number} chats_id
	 */
	typing(typing, chats_id)
	{
		this._socket.request(this.commands.TYPING, typing, chats_id);
	}

	/**
	 *
	 * @param {Number[]} chats_ids
	 */
	history(chats_ids)
	{
		if (!this.user.operator)
		{
			return;
		}

		this._socket.request(this.commands.HISTORY, chats_ids);
	}

	/**
	 *
	 * @param {*} request
	 */
	changePassword(request)
	{
		if (!this.user.operator)
		{
			return;
		}

		this._socket.request(this.commands.CHANGE_PASSWORD, request);
	}

	/**
	 *
	 * @param {number} id
	 */
	deleteMessage(id)
	{
		if (!this.user.rights.message_delete)
		{
			return;
		}

		this._socket.request(this.commands.MESSAGE_DELETE, id);
	}

	/**
	 *
	 * @param {string} redirect
	 * @param {number} chats_id
	 */
	redirect(redirect, chats_id)
	{
		if (!this.user.rights.redirect)
		{
			return;
		}

		this._socket.request(this.commands.REDIRECT, redirect, chats_id);
	}

	/**
	 *
	 * @param {string} reason
	 * @param {number} chats_id
	 */
	ban(reason, chats_id)
	{
		if (!this.user.rights.ban)
		{
			return;
		}

		this._socket.request(this.commands.BAN, reason, chats_id);
	}

	/**
	 *
	 * @param {number} score
	 */
	score(score)
	{
		if (!this.user.rights.score)
		{
			return;
		}

		this._socket.request(this.commands.SCORE, score);
	}

	client()
	{
		if (this.user.operator)
		{
			return;
		}

		this._socket.request(this.commands.CLIENT, {
			name: this.user.name,
			phone: this.user.phone,
			email: this.user.email
		});

		const data = this._load(this.commands.AUTH);

		data.user.name = this.user.name;
		data.user.phone = this.user.phone;
		data.user.email = this.user.email;

		this._save(this.commands.AUTH, data);
	}

	/**
	 *
	 * @type {boolean}
	 */
	get isAuthorized()
	{
		const data = this._load(this.commands.AUTH);
		if (data == null)
		{
			return false;
		}

		return (data.user.token === this.user.token);
	}

	/**
	 *
	 * @param {string} key
	 * @returns {any}
	 */
	_load(key)
	{
		const valid_key = 'chat.' + this._user.operator + '.' + this._user.authorized + '.' + key;
		let data = localStorage.getItem(valid_key);
		// legacy support
		if (data == null)
		{
			const obsolete_key = 'chat.' + this._user.operator + '.' + key;
			data = localStorage.getItem(obsolete_key);
		}

		if (data == null)
		{
			return null;
		}

		data = JSON.parse(data);

		if ((key === 'auth') && !this._user.authorized && ((typeof data.user.name === 'undefined') || (typeof data.user.phone === 'undefined')))
		{
			return null;
		}

		return data;
	}

	/**
	 *
	 * @param {string} key
	 * @param {any} data
	 */
	_save(key, data)
	{
		localStorage.setItem('chat.' + this._user.operator + '.' + key, JSON.stringify(data));
	}

	/**
	 *
	 * @returns {any}
	 */
	_auth_request()
	{
		if (this.isAuthorized)
		{
			const auth = this._load(this.commands.AUTH);
			if (!this.user.authorized)
			{
				this.user.name = auth.user.name;
				this.user.phone = auth.user.phone;
				this.user.email = auth.user.email;

				this._app.user_edit.name = auth.user.name;
				this._app.user_edit.phone = auth.user.phone;
				this._app.user_edit.email = auth.user.email;
			}

			return auth;
		}

		const info = required_system_info();
		let request = {
			platform: this._user.platform,
			os: info.os,
			browser: info.browser,
			user_agent: info.user_agent,
			information: info.information,
			url: document.location.toString(),
			user: {
				token: this._user.token
			}
		};

		if (!this._user.authorized)
		{
			request.user.name = this._user.name;
			request.user.phone = this._user.phone;
			request.user.email = this._user.email;
		}

		if (this._user.operator)
		{
			request.operator = this._user.operator;
			request.user.visible = this._user.visible;
		}

		this._save(this.commands.AUTH, request);

		return request;
	}

	/**
	 *
	 */
	_auth()
	{
		const request = this._auth_request();

		this._socket.request(this.commands.AUTH, request);
	}
}

'use strict';

const _defaults_functions = {};
_defaults_functions.addMessages = function(messages)
{
	messages = messages.map(_parse_message);
	if (this.user.operator)
	{
		for (let i in messages)
		{
			_add2array(this.messages, messages[i], ['key', 'id']);
		}
	}
	else
	{
		this.messages = messages;
	}

	this.allowScroll = true;
	this.scroll();
};

_defaults_functions.addMessage = function(message)
{
	const at_bottom = this.atBottom();
	message = _parse_message(message);
	const is_new = _add2array(this.messages, message, ['key', 'id']);
	if (is_new)
	{
		this._notify(message);
	}

	if (at_bottom)
	{
		this.scroll();
	}
};

_defaults_functions._notify = function(message)
{
	if (!this._shouldNotify(message))
	{
		return;
	}

	this._beep();

	if (this.user.operator)
	{
		this._titleFlash();
		this.notification(message);
	}
}

_defaults_functions._titleFlash = function() {
	if (typeof this._flash == 'undefined')
	{
		this._flash = {
			title: document.title,
			favicons: ['/favicon.ico', '/api-chat/files/favicon-1.ico', ], // '/api-chat/files/favicon-2.ico'

			timer: 0,
			state: 0,
			favicon: null
		};

		this._flash.favicon = document.querySelector("link[rel~='icon']");
		if (!this._flash.favicon)
		{
			this._flash.favicon = document.createElement('link');
			this._flash.favicon.rel = 'icon';
			document.getElementsByTagName('head')[0].appendChild(this._flash.favicon);
		}
	}

	if (this._flash.timer > 0)
	{
		return;
	}

	const flash = () => {
		this._flash.state += 1;
		if (this._flash.state == this._flash.favicons.length)
		{
			this._flash.state = 0;
		}

		this._flash.favicon.href = this._flash.favicons[this._flash.state];
		document.title = (this._flash.state % 2) ? ('* ' + this._flash.title) : this._flash.title;
	};

	flash();

	this._flash.timer = setInterval(() => {
		if (document.hasFocus())
		{
			clearInterval(this._flash.timer);
			this._flash.timer = 0;

			this._flash.state = this._flash.favicons.length - 1;
		}

		flash();
	}, 750)
}

_defaults_functions._beep = function() {
	if (!this.sound)
	{
		return;
	}
	
	const audio = $(chat.settings.beep)[0];
	audio.pause();
	audio.currentTime = 0;
	audio.volume = 0.25;
	audio.play();
}

_defaults_functions._shouldNotify = function(message)
{
	if (message.sender.type == 'system')
	{
		return false;
	}

	if (message.sender.type == this.user_type)
	{
		return false;
	}

	// no sound if message for other operators
	if (this.user.operator && (message.sender.type == 'client'))
	{
		//const allowed = ['text', 'redirect', 'score'];
		const allowed = ['text', ];
		if (!allowed.includes(message.message_type))
		{
			return false;
		}

		const client = this._getClient(message.chats_id);
		if (typeof client.operators_id != 'undefined')
		{
			if ((client.operators_id != 0) && (client.operators_id != chat.settings.operators_id))
			{
				return false;
			}
		}

		if (!this.validRegion(client.regions_id))
		{
			return false;
		}
	}

	return true;
};

_defaults_functions.deleteMessage = function(message_id)
{
	if (this.selected_edit_id == message_id)
	{
		this.resetForm();
	}

	const index = _index(this.messages, ['id'], message_id);
	if (index != -1)
	{
		this.messages.splice(index, 1);
	}
};

_defaults_functions.message = function()
{
	if (!this.canSendMessage)
	{
		return;
	}

	this.typing(false);

	const text = this.$refs.message.getValue();

	//if ((text == '') && (!this.hasAttachment()))
	if (text == '')
	{
		this.$refs.message.focus();
		return;
	}

	if (this.user.rights.message_edit && (this.edit_id > 0))
	{
		const index = _index(this.messages, ['id'], this.edit_id);
		if (index == -1)
		{
			return;
		}

		let message = this.messages[index];
		if (this.canEdit(message))
		{
			chat.editMessage(this.edit_id, text, message.chats_id);
			message = _object_replace(message, {text: text});
			Vue.set(this.messages, index, message);

			this.scroll();
		}
	}
	else
	{
		this.sendMessage(text);
	}

	this.typing(false);

	this.resetForm();
};

_defaults_functions.hasAttachment = function()
{
	return ('file' in this.$refs) && (this.$refs.file.files.length > 0);
};

_defaults_functions.sendMessage = function(text)
{
	if (!this.canSendMessage)
	{
		return;
	}

	this.templates_show = false;

	if (this.user.rights.redirect && is_url(text))
	{
		this.redirect(text);
	}
	else
	{
		if (this.hasAttachment())
		{
			/**
			 * 
			 * @type {File}
			 */
			const file = this.$refs.file.files[0];
			const rights = this.user.rights;
			const extension = file.name.split('.').pop().toLowerCase();
			if ((rights.attachment_limit > 0) && (file.size > rights.attachment_limit))
			{
				const mb = rights.attachment_limit / 1024 / 1024;
				alert('Размер файла больше допустимого. Максимальный размер: ' + mb.toFixed(2) + ' Мб.');
				return;
			}

			if (!rights.attachment_extensions.includes(extension))
			{
				alert('Недопустимый тип файла. Разрешены: ' + rights.attachment_extensions.join(', ') + '.');
				return;
			}
		}

		const chats_id = this.user.operator ? this.active_chats_id : null;
		const message_key = chat.message(text, chats_id);

		if (this.hasAttachment())
		{
			chat.createAttachment(message_key, this.$refs.file.files[0], chats_id);
			this.$refs.file.value = '';
			if (!this.user.operator)
			{
				this.file_value = '';
			}
		}

		const message = Object.freeze({
			key: message_key,
			text: text,
			id: 0,
			message_type: 'text',
			created: new Date(),
			edited: null,
			chats_id: chats_id,
			sender: {
				id: 0,
				name: this.user.name,
				type: this.user_type
			},

			attachment: null,
			previews: [],
			redirect: '',
			score: 0,
			text_formatted: null,
			readed: false
		});

		this.messages.push(message);

		this.scroll();
	}
}

_defaults_functions.resetForm = function()
{
	this.selected_edit_id = -1;

	if (typeof this.$refs.file != 'undefined')
	{
		this.$refs.file.value = ''
	}

	this.$refs.message.setValue('');
	this.$refs.message.focus('');
}

_defaults_functions.attachment = function(message_id, attachments_id)
{
	chat.attachment(message_id, attachments_id);
};

_defaults_functions.typing = function(typing)
{
	if (typing && (this.$refs.message.getValue() == ''))
	{
		typing = false;
	}

	if (this.typing_state == typing)
	{
		return ;
	}

	this.typing_state = typing;
	chat.typing(this.typing_state, this.active_chats_id);

	if (this.typing_timer != null)
	{
		clearInterval(this.typing_timer);
		this.typing_timer = null;
	}

	if (this.typing_state)
	{
		this.typing_timer = setInterval(() => this.typing(false), chat.settings.typing_delay);
	}
};

_defaults_functions.score = function(score)
{
	if ((!this.user.operator) && (this.operator != null))
	{
		this.score_show = false;
		chat.score(score);
	}
};

_defaults_functions.readed = function(ids)
{
	if (this.user.operator)
	{
		const client = this._getClient(this.active_chats_id);
		if (!this.isOwn(client))
		{
			return;
		}

		chat.readed(ids, this.active_chats_id);
	}
	else
	{
		chat.readed(ids);
	}
};

_defaults_functions.markReaded = function(ids)
{
	for (let index in this.messages)
	{
		let message = this.messages[index];
		if (!ids.includes(message.id))
		{
			continue;
		}

		message = _object_replace(message, {readed: true});
		Vue.set(this.messages, index, message);
	}
};

_defaults_functions.emoji = function(emoji)
{
	this.$refs.message.insert(emoji);
};

_defaults_functions.format = function(dt)
{
	return date_format(dt);
};

_defaults_functions.date_format = function(dt)
{
	//const options = { year: 'numeric', month: 'long', day: 'numeric' };
	const options = { month: 'numeric', day: 'numeric' };
	return dt.toLocaleString('ru', options);
};

_defaults_functions.atBottom = function()
{
	if (typeof this.$refs.messages === 'undefined')
	{
		return true;
	}

	return this.$refs.messages.atBottom();
};

_defaults_functions.scroll = function(is_typing)
{
	if (typeof is_typing === 'undefined')
	{
		is_typing = false;
	}

	if (!this.allowScroll)
	{
		return;
	}

	if (typeof this.$refs.messages === 'undefined')
	{
		return;
	}

	this.$refs.messages.scroll(is_typing);
};

_defaults_functions.updateScroll = function(at_bottom)
{
	this.allowScroll = at_bottom;
};

_defaults_functions.canEdit = function(message)
{
	if (message.id == 0)
	{
		return false;
	}

	if (!this.user.rights.message_edit)
	{
		return false;
	}

	return message.sender.type == this.user_type;
};

_defaults_functions.edit = function(message)
{
	if (!this.canEdit(message))
	{
		return;
	}

	this.selected_edit_id = message.id;
	this.$refs.message.value = message.text;
};

_defaults_functions.canRemove = function(message)
{
	if (message.id == 0)
	{
		return false;
	}

	if (!this.user.rights.message_delete)
	{
		return false;
	}

	return message.sender.type == this.user_type;
};

_defaults_functions.remove = function(message)
{
	if (!this.canRemove(message))
	{
		return;
	}

	this.deleteMessage(message.id);
	chat.deleteMessage(message.id);
};

_defaults_functions.hide = function()
{
	chat.hide();
};

_defaults_functions.basename = function(path)
{
	return path.split(/[\\/]/).pop();
};

_defaults_functions.email = function(email)
{
	if (email == '')
	{
		this.alert('Отправка диалога невозможна: не указан e-mail.');
		return;
	}

	if (this.user.operator)
	{
		chat.email(email, this.active_chats_id);
	}
	else
	{
		chat.email(email);
	}

	this.email_show = false;
};

_defaults_functions.alert = function(message)
{
	alert(message);
};

_defaults_functions.check_readed = function()
{
	if (typeof this.$refs.messages == 'undefined')
	{
		return;
	}

	this.$refs.messages.readed();
}

const _defaults_computed = {};

_defaults_computed.allow_attachment = function()
{
	return this.user.rights.attachment;
};

_defaults_computed.attachment_extensions = function()
{
	if (this.user.rights.attachment_extensions.length == 0)
	{
		return '*';
	}
	return '.'+ this.user.rights.attachment_extensions.join(', .');
};

_defaults_computed.attachment_limit = function()
{
	return this.user.rights.attachment_limit;
};

_defaults_computed.user_type = function()
{
	return this.user.operator ? 'operator' : 'client';
};

_defaults_computed.edit_id = function()
{
	const index = _index(this.messages, ['id'], this.selected_edit_id);
	if (index == -1)
	{
		return -1;
	}

	const message = this.messages[index];
	if (!this.canEdit(message))
	{
		return -1;
	}

	return this.selected_edit_id;
};

_defaults_computed.edit_message = function()
{
	const index = _index(this.messages, ['id'], this.selected_edit_id);
	if (index == -1)
	{
		return null;
	}

	const message = this.messages[index];
	if (!this.canEdit(message))
	{
		return null;
	}

	return message;
};
'use strict';

/**
 *
 * @param {object} frozen
 * @param {object} replace
 * @returns
 */
function _object_replace(frozen, replace)
{
	const result = Object.assign({}, frozen, replace);
	return Object.freeze(result);
}

/**
 *
 * @param {object[]} array
 * @param {object} item
 * @param {string[]} key_fields
 * @returns {boolean}
 */
function _add2array(array, item, key_fields)
{
	let index = -1;
	for (let i in key_fields)
	{
		let key_field = key_fields[i];
		index = _index(array, key_field, item[key_field]);
		if (index > -1)
		{
			break;
		}
	}

	if (index == -1)
	{
		array.push(item);
		return true;
	}
	else
	{
		Vue.set(array, index, item);
		return false;
	}
}

/**
 *
 * @param {object[]} array
 * @param {string} key_field
 * @param {any} key_value
 * @returns {number}
 */
function _index(array, key_field, key_value)
{
	if (key_value == '')
	{
		return -1;
	}

	for (let index in array)
	{
		if (array[index][key_field] == key_value)
		{
			return index;
		}
	}

	return -1;
}

/**
 *
 * @param {object} message
 * @returns {object}
 */
function _parse_message(message)
{
	message.created = date_decode(message.created);
	if (message.edited != null)
	{
		message.edited = date_decode(message.edited);
	}

	return Object.freeze(message);
}

/**
 *
 * @param {object} client
 * @returns {object}
 */
function _parse_client(client)
{
	client.clients_start_dt = date_decode(client.clients_start_dt);
	client.clients_last_dt = date_decode(client.clients_last_dt);
	client.operators_last_dt = date_decode(client.operators_last_dt);
	client.last_dt = date_decode(client.last_dt);
	client.typing = false;

	return Object.freeze(client);
}

/**
 *
 * @param {object} message
 * @returns {object}
 */
function _parse_operator(operator)
{
	return Object.freeze(operator);
}

/**
 *
 * @param {string} str
 * @returns {boolean}
 */
function is_url(str)
{
	try
	{
		const url = new URL(str);

		if (!url.host.endsWith('.std-equip.ru'))
		{
			return false;
		}

		const path = url.pathname.toLowerCase();
		const extensions = ['.jpeg', '.jpg', '.png', '.gif', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.rar', '.zip', ];
		for (let i in extensions)
		{
			if (path.endsWith(extensions[i]))
			{
				return false;
			}
		}

		return true;
	}
	catch (e)
	{
		return false;
	}

	return false;
}

/**
 *
 * @param {object} a
 * @param {number} b
 */
function compare_messages(a, b)
{
	if (a.id == b.id)
	{
		return 0;
	}

	if (a.id == 0)
	{
		return 1;
	}

	if (b.id == 0)
	{
		return -1;
	}

	if (a.id < b.id)
	{
		return -1;
	}

	return 1;
}

/**
 *
 * @returns {ChatEmoji[]}
 */
function supported_emoji()
{
	const values = [
		new ChatEmoji('😀'),
		new ChatEmoji('😁'),
		new ChatEmoji('😂'),
		new ChatEmoji('🤣'),
		new ChatEmoji('😃'),
		new ChatEmoji('😄'),
		new ChatEmoji('😅'),
		new ChatEmoji('😆'),

		new ChatEmoji('😉'),
		new ChatEmoji('😊'),
		new ChatEmoji('😋'),
		new ChatEmoji('😎'),
		new ChatEmoji('😍'),
		new ChatEmoji('😘'),
		new ChatEmoji('🥰'),
		new ChatEmoji('😗'),

		new ChatEmoji('😙'),
		new ChatEmoji('😚'),
		new ChatEmoji('🙂'),
		new ChatEmoji('🤗'),
		new ChatEmoji('🤩'),
		new ChatEmoji('🤔'),
		new ChatEmoji('🤨'),
		/*new ChatEmoji('☺'), */

		new ChatEmoji('😐'),
		new ChatEmoji('😑'),
		new ChatEmoji('😶'),
		new ChatEmoji('🙄'),
		new ChatEmoji('😏'),
		new ChatEmoji('😣'),
		new ChatEmoji('😥'),
		new ChatEmoji('😮'),

		new ChatEmoji('🤐'),
		new ChatEmoji('😯'),
		new ChatEmoji('😪'),
		new ChatEmoji('😫'),
		new ChatEmoji('🥱'),
		new ChatEmoji('😴'),
		new ChatEmoji('😌'),
		new ChatEmoji('😛')
	];

	return values;
}

/**
 *
 * @param {string} text
 * @returns {string}
 */
function htmlspecialchars(text)
{
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};

	return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * JavaScript Client Detection
 * (C) viazenetti GmbH (Christian Ludwig)
 */
function full_system_info()
{
	const unknown = '-';

	// screen
	let screenSize = '';
	if (screen.width)
	{
		let width = (screen.width) ? screen.width : '';
		let height = (screen.height) ? screen.height : '';
		screenSize = '' + width + " x " + height;
	}

	// browser
	const nVer = navigator.appVersion;
	const nAgt = navigator.userAgent;
	let browser = navigator.appName;
	let version = '' + parseFloat(navigator.appVersion);
	let majorVersion = parseInt(navigator.appVersion, 10);
	let nameOffset;
	let verOffset;
	let ix;

	// Opera
	if ((verOffset = nAgt.indexOf('Opera')) != -1)
	{
		browser = 'Opera';
		version = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf('Version')) != -1)
		{
			version = nAgt.substring(verOffset + 8);
		}
	}

	// Opera Next
	if ((verOffset = nAgt.indexOf('OPR')) != -1)
	{
		browser = 'Opera';
		version = nAgt.substring(verOffset + 4);
	}
	// Legacy Edge
	else if ((verOffset = nAgt.indexOf('Edge')) != -1)
	{
		browser = 'Microsoft Legacy Edge';
		version = nAgt.substring(verOffset + 5);
	}
	// Edge (Chromium)
	else if ((verOffset = nAgt.indexOf('Edg')) != -1)
	{
		browser = 'Microsoft Edge';
		version = nAgt.substring(verOffset + 4);
	}
	// MSIE
	else if ((verOffset = nAgt.indexOf('MSIE')) != -1)
	{
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(verOffset + 5);
	}
	// Chrome
	else if ((verOffset = nAgt.indexOf('Chrome')) != -1)
	{
		browser = 'Chrome';
		version = nAgt.substring(verOffset + 7);
	}
	// Safari
	else if ((verOffset = nAgt.indexOf('Safari')) != -1)
	{
		browser = 'Safari';
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1)
		{
			version = nAgt.substring(verOffset + 8);
		}
	}
	// Firefox
	else if ((verOffset = nAgt.indexOf('Firefox')) != -1)
	{
		browser = 'Firefox';
		version = nAgt.substring(verOffset + 8);
	}
	// MSIE 11+
	else if (nAgt.indexOf('Trident/') != -1)
	{
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(nAgt.indexOf('rv:') + 3);
	}
	// Other browsers
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/')))
	{
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() == browser.toUpperCase())
		{
			browser = navigator.appName;
		}
	}

	// trim the version string
	if ((ix = version.indexOf(';')) != -1)
	{
		version = version.substring(0, ix);
	}

	if ((ix = version.indexOf(' ')) != -1)
	{
		version = version.substring(0, ix);
	}

	if ((ix = version.indexOf(')')) != -1)
	{
		version = version.substring(0, ix);
	}

	majorVersion = parseInt('' + version, 10);

	if (isNaN(majorVersion))
	{
		version = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	// mobile version
	const mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

	// system
	let os = unknown;
	const clientStrings = [
		{s:'Windows 10', r:/(Windows 10.0|Windows NT 10.0)/},
		{s:'Windows 8.1', r:/(Windows 8.1|Windows NT 6.3)/},
		{s:'Windows 8', r:/(Windows 8|Windows NT 6.2)/},
		{s:'Windows 7', r:/(Windows 7|Windows NT 6.1)/},
		{s:'Windows Vista', r:/Windows NT 6.0/},
		{s:'Windows Server 2003', r:/Windows NT 5.2/},
		{s:'Windows XP', r:/(Windows NT 5.1|Windows XP)/},
		{s:'Windows 2000', r:/(Windows NT 5.0|Windows 2000)/},
		{s:'Windows ME', r:/(Win 9x 4.90|Windows ME)/},
		{s:'Windows 98', r:/(Windows 98|Win98)/},
		{s:'Windows 95', r:/(Windows 95|Win95|Windows_95)/},
		{s:'Windows NT 4.0', r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
		{s:'Windows CE', r:/Windows CE/},
		{s:'Windows 3.11', r:/Win16/},
		{s:'Android', r:/Android/},
		{s:'Open BSD', r:/OpenBSD/},
		{s:'Sun OS', r:/SunOS/},
		{s:'Chrome OS', r:/CrOS/},
		{s:'Linux', r:/(Linux|X11(?!.*CrOS))/},
		{s:'iOS', r:/(iPhone|iPad|iPod)/},
		{s:'Mac OS X', r:/Mac OS X/},
		{s:'Mac OS', r:/(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
		{s:'QNX', r:/QNX/},
		{s:'UNIX', r:/UNIX/},
		{s:'BeOS', r:/BeOS/},
		{s:'OS/2', r:/OS\/2/},
		{s:'Search Bot', r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
	];

	for (let id in clientStrings)
	{
		let cs = clientStrings[id];
		if (cs.r.test(nAgt))
		{
			os = cs.s;
			break;
		}
	}

	let osVersion = unknown;

	if (/Windows/.test(os))
	{
		osVersion = /Windows (.*)/.exec(os)[1];
		os = 'Windows';
	}

	switch (os)
	{
		case 'Mac OS':
		case 'Mac OS X':
		case 'Android':
			osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
			break;

		case 'iOS':
			osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
			break;
	}

	return {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		browserMajorVersion: majorVersion,
		mobile: mobile,
		os: os,
		osVersion: osVersion
	};
}

function required_system_info()
{
	const info = full_system_info();
	return {
		os: info.os + ' (Версия ' + info.osVersion + ')',
		browser: info.browser + ' (Версия ' + info.browserVersion + ')',
		user_agent: window.navigator.userAgent,
		information: "Экран: " + info.screen + "\r\n"
	}
}

/**
 *
 * @param {string} date
 * @returns {Date}
 */
function date_decode(date)
{
	const t = date.split(/[- :]/);
	return new Date(Date.UTC(t[0], t[1]-1, t[2], t[3] - 3, t[4], t[5]));
}

/**
 *
 * @param {Date} dt
 * @returns {string}
 */
function date_format(dt)
{
	let hours = '' + dt.getHours();
	if (hours.length == 1)
	{
		hours = '0' + hours;
	}

	let minutes = '' + dt.getMinutes();
	if (minutes.length == 1)
	{
		minutes = '0' + minutes;
	}

	return hours + ':' + minutes;
}

/**
 *
 * @param {HTMLElement} target
 */
function scroll_to_bottom(target)
{
	target.scrollTop = target.scrollHeight;
}

/**
 *
 * @param {string} str
 * @returns {string}
 */
function nl2br(str)
{
	return str.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2');
}

/**
 *
 * @param {string} content
 */
function insert_html(content)
{
	if (0)
	{
		// not used because undo not supported
		const selection = window.getSelection();
		if (selection.rangeCount == 0)
		{
			return;
		}

		const range = selection.getRangeAt(0);
		const is_collapsed = range.collapsed;
		const fragment = document.createRange().createContextualFragment(content);

		range.deleteContents();
		range.insertNode(fragment);

		if (is_collapsed)
		{
			range.collapse(false);
		}

		selection.removeAllRanges();
		selection.addRange(range);
	}
	else
	{
		document.execCommand('insertHTML', false, content);
	}
}

Object.unfreeze = function(frozen)
{
	let result = undefined;
	if (frozen instanceof Array)
	{
		result = [];
		const clone = function(value, index) {
			result[index] = value;
		};
		frozen.forEach(clone);
	}
	else if (frozen instanceof String)
	{
		result = new String(frozen).toString();
	}
	else if (typeof frozen == 'object')
	{
		result = {};
		for (let property in frozen)
		{
			result[property] = frozen[property];
		}
	}

	return result;
}

/**
 *
 * @param {Date} date1
 * @param {Date} date2
 * @returns {boolean}
 */
function is_same_day(date1, date2)
{
	return (date1.getFullYear() === date2.getFullYear())
		&& (date1.getMonth() === date2.getMonth())
		&& (date1.getDate() === date2.getDate())
}

'use strict';

/**
 * 
 * @param {Chat} chat 
 * @returns {Vue}
 */
function chat_create_app(chat)
{
	const data = {
		user: chat.user, // пользователь
		messages: [], // сообщения
	
		stats: new ChatSocketStats(),

		file_value: '', // выбранный файл
		selected_edit_id : -1,
		typing_state: false, // пользователь печатает
		typing_timer: null, // таймер сброса печати
		sound: true, // проигрывать звук при получении сообщения
		allowScroll: true // разрешить прокрутку к новому сообщению
	};

	$(chat.settings.beep)[0].load();

	if (chat.user.operator)
	{
		return _chat_app_operator(chat, data);
	}

	return _chat_app_client(chat, data);
}
'use strict';

/**
 *
 * @param {Chat} chat
 * @param {*} base_data
 * @returns {Vue}
 */
function _chat_app_client(chat, base_data)
{
	const data = base_data;
	data.online = chat.settings.online; // наличие операторов онлайн
	data.banned = false;
	data.operator = null;
	data.operator_typing = false;
	data.score_show = false;
	data.profile_show = false;
	data.email_show = false;
	data.can_close = chat.settings.is_desktop;

	if (!chat.user.authorized)
	{
		data.user_edit = {
			name: data.user.name,
			phone: data.user.phone,
			email: data.user.email
		};
	}

	const app = new Vue({
		el: chat.settings.view,
		template: chat.settings.template,
		data: data,
		watch: {
			operator: function(new_value, old_value) {
				if (old_value != new_value)
				{
					this.operator_typing = false;
				}
			}
		},
		methods: {
			addMessages: _defaults_functions.addMessages,
			addMessage: _defaults_functions.addMessage,
			_notify: _defaults_functions._notify,
			_shouldNotify: _defaults_functions._shouldNotify,
			_titleFlash: _defaults_functions._titleFlash,
			_beep: _defaults_functions._beep,

			deleteMessage: _defaults_functions.deleteMessage,

			hasAttachment: _defaults_functions.hasAttachment,
			message: _defaults_functions.message,
			sendMessage: _defaults_functions.sendMessage,

			readed: _defaults_functions.readed,
			markReaded: _defaults_functions.markReaded,

			attachment: _defaults_functions.attachment,
			typing: _defaults_functions.typing,
			score: _defaults_functions.score,

			emoji: _defaults_functions.emoji,
			format: _defaults_functions.emoji,

			atBottom: _defaults_functions.atBottom,
			scroll: _defaults_functions.scroll,
			updateScroll: _defaults_functions.updateScroll,

			hide: _defaults_functions.hide,

			resetForm: _defaults_functions.resetForm,
			canEdit: _defaults_functions.canEdit,
			edit: _defaults_functions.edit,
			canRemove: _defaults_functions.canRemove,
			remove: _defaults_functions.remove,

			basename: _defaults_functions.basename,
			email: _defaults_functions.email,
			alert: _defaults_functions.alert,
			check_readed: _defaults_functions.check_readed,

			updateUser: function() {
				if (!chat_validate_user(this.user_edit))
				{
					return;
				}

				this.user.name = this.user_edit.name;
				this.user.email = this.user_edit.email;
				this.user.phone = this.user_edit.phone;

				this.profile_show = false;

				chat.client();
			},

			operatorTyping: function(typing) {
				this.operator_typing = typing;

				this.scroll(true);
			},
			scroll2messages: function($event) {
				if (!$event.isTrusted)
				{
					return;
				}

				if (typeof this.$refs.messages == 'undefined')
				{
					return;
				}
/*
				if ($event.path.includes(this.$refs.messages.$el))
				{
					return;
				}
*/
				this.$refs.messages.$el.scrollTop += $event.deltaY / 2;
				this.$refs.messages.scrolled($event);
				$event.preventDefault();
				$event.stopPropagation();
			}
		},
		computed: {
			canSendMessage: function() {
				return !this.banned;
			},
			allow_attachment: _defaults_computed.allow_attachment,
			attachment_extensions: _defaults_computed.attachment_extensions,
			attachment_limit: _defaults_computed.attachment_limit,
			user_type: _defaults_computed.user_type,
			edit_id: _defaults_computed.edit_id,
			edit_message: _defaults_computed.edit_message
		}
	});

	$(window).on('beforeunload', () => app.typing(false));

	return app;
}

'use strict';

/**
 * 
 * @param {Chat} chat 
 * @param {object} base_data 
 * @returns {Vue}
 */
function _chat_app_operator(chat, base_data)
{
	const data = base_data;

	data.regions_ids = chat.settings.regions_ids; // id регионов
	data.self_id = chat.settings.operators_id;

	data.chats_ids = []; // список id открытых чатов
	data.active_chats_id = 0; // id активного чата
	data.clients = []; // список клиентов
	data.operators = []; // список операторов
	data.templates_show = false; // показывать шаблоны
	data.email_show = false; // показывать отправку на email
	data.notify = true; // уведомления
	data.change_password_status = {
		success: false,
		message: ''
	};

	const app = new Vue({
		el: chat.settings.view,
		template: chat.settings.template,
		data: data,
		methods: {
			addMessages: _defaults_functions.addMessages,
			addMessage: _defaults_functions.addMessage,
			_notify: _defaults_functions._notify,
			_shouldNotify: _defaults_functions._shouldNotify,
			_titleFlash: _defaults_functions._titleFlash,
			_beep: _defaults_functions._beep,
			deleteMessage: _defaults_functions.deleteMessage,

			hasAttachment: _defaults_functions.hasAttachment,
			message: _defaults_functions.message,
			sendMessage: _defaults_functions.sendMessage,

			readed: _defaults_functions.readed,
			markReaded: _defaults_functions.markReaded,

			attachment: _defaults_functions.attachment,
			typing: _defaults_functions.typing,
			emoji: _defaults_functions.emoji,
			format: _defaults_functions.format,

			atBottom: _defaults_functions.atBottom,
			scroll: _defaults_functions.scroll,
			updateScroll: _defaults_functions.updateScroll,

			hide: _defaults_functions.hide,

			resetForm: _defaults_functions.resetForm,
			canEdit: _defaults_functions.canEdit,
			edit: _defaults_functions.edit,
			canRemove: _defaults_functions.canRemove,
			remove: _defaults_functions.remove,

			basename: _defaults_functions.basename,
			email: _defaults_functions.email,
			alert: _defaults_functions.alert,
			check_readed: _defaults_functions.check_readed,

			changePassword: function (request) {
				chat.changePassword(request);
			},
			addClients: function(clients) {
				this.clients = clients.map(_parse_client);

				const chats_ids = this.clients.filter(c => !this.isOthers(c) && !this.isInactive(c)).map(c => c.chats_id);
				chat.history(chats_ids);
			},
			addClient: function(client) {
				client = _parse_client(client);
				const index = _index(this.clients, ['chats_id'], client.chats_id);
				const prev_operators_id = (index != -1) ? this.clients[index] : 0;

				_add2array(this.clients, client, ['chats_id']);

				if (!this.messages.some(x => x.chats_id==client.chats_id))
				{
					chat.history([client.chats_id]);
				}

				if ((prev_operators_id != 0) && (prev_operators_id != this.self_id))
				{
					this._beep();
				}
			},
			deleteClient: function(client) {
				client = _parse_client(client);
				const index = _index(this.clients, ['chats_id'], client.chats_id);
				if (index != -1)
				{
					this.clients.splice(index, 1);
				}
			},

			addOperators: function(operators) {
				this.operators = operators.map(_parse_operator);
				this._updateVisible();
			},
			addOperator: function(operator) {
				operator = _parse_operator(operator);
				_add2array(this.operators, operator, ['id']);
				this._updateVisible();
			},
			deleteOperator: function(operator) {
				operator = _parse_operator(operator);
				const index = _index(this.operators, ['id'], operator.id);
				if (index != -1)
				{
					this.operators.splice(index, 1);
				}
			},
			_updateVisible: function() {
				for (let i in this.operators)
				{
					let operator = this.operators[i];
					if (operator.id == chat.settings.operators_id)
					{
						this.user.visible = operator.visible;
						break;
					}
				}
			},
			_setVisible: function() {
				for (let index in this.operators)
				{
					let operator = this.operators[index];
					if (operator.id == chat.settings.operators_id)
					{
						operator = _object_replace(operator, {visible: this.user.visible});

						Vue.set(this.operators, index, operator);
						break;
					}
				}
			},

			changeChatsId: function(old_id, new_id) {
				for (let index in this.clients)
				{
					let client = this.clients[index];
					if (client.chats_id == old_id)
					{
						client = _object_replace(client, {chats_id: new_id});

						Vue.set(this.clients, index, client);
					}
				}

				for (let index in this.messages)
				{
					let message = this.messages[index];
					if (message.chats_id == old_id)
					{
						message = _object_replace(message, {chats_id: new_id});

						Vue.set(this.messages, index, message);
					}
				}

				const index = this.chats_ids.indexOf(old_id);
				if (index > -1)
				{
					this.chats_ids[index] = new_id;
				}

				if (this.active_chats_id == old_id)
				{
					this.active_chats_id = new_id;
				}
			},

			clientTyping: function(chats_id, typing) {
				let client = this._getClient(chats_id);
				if (client.typing != typing)
				{
					client = _object_replace(client, {typing: typing});

					_add2array(this.clients, client, ['chats_id']);
				}

				this.scroll(true);
			},

			redirect: function(redirect) {
				chat.redirect(redirect, this.active_chats_id);
			},
			ban: function(reason) {
				chat.ban(reason, this.active_chats_id);
			},
			toggleVisible: function(visible) {
				this.user.visible = visible;
				this._setVisible();

				chat.visible(visible);
			},
			open: function(chats_id) {
				if (!this.chats_ids.includes(chats_id))
				{
					this.chats_ids.push(chats_id);
				}

				const client = this._getClient(chats_id);
				if (this.isOthers(client) || this.isInactive(client))
				{
					chat.history([chats_id]);
				}

				this.active_chats_id = chats_id;

				this.allowScroll = true;
				this.scroll();

				this.$nextTick(() => {
					if (typeof this.$refs.message !== 'undefined')
					{
						this.$refs.message.focus();
					}
				});
			},
			close: function(chats_id, event) {
				if (event)
				{
					event.stopPropagation();
				}
				
				const index = this.chats_ids.indexOf(chats_id);
				if (index > -1)
				{
					this.chats_ids.splice(index, 1);
				}

				this.active_chats_id = (this.chats_ids.length > 0) ? this.chats_ids[0] : 0;
			},
			operatorChange: function(operators_id) {
				if (this.active_chats_id == 0)
				{
					return;
				}

				chat.operatorChange(operators_id, this.active_chats_id);
			},
			operatorChangeSelf: function() {
				if (this.active_chats_id == 0)
				{
					return;
				}

				if (!this.user.rights.operator_change_self)
				{
					return;
				}

				if (confirm('Перехватить диалог?'))
				{
					chat.operatorChangeSelf(this.active_chats_id);
				}
			},

			count: function(chats_id) {
				let result = 0;
				for (let i in this.messages)
				{
					if (this.messages[i].chats_id == chats_id)
					{
						result += 1;
					}
				}

				return result;
			},
			_getClient: function(chats_id) {
				const clients = this.clients.filter(c => c.chats_id == chats_id);

				if (clients.length == 0)
				{
					return {typing: false};
				}

				return clients[0];
			},
			_operator: function() {
				const operators = this.operators.filter(o => o.id == chat.settings.operators_id);

				if (operators.length == 0)
				{
					return null;
				}

				return operators[0];
			},

			template: function() {
				const i = this.$refs.template.value;
				if (i)
				{
					this.sendMessage(this.templates[parseInt(i)]);
				}

				this.$refs.template.value = '';
			},
			validRegion: function(id) {
				return this.regions_ids.includes(id);
			},
			process_text: function(text) {
				return is_emoji_supported() ? htmlspecialchars(text) : twemoji_parse(text);
			},

			canSendMessage2Client: function(client) {
				return this.validRegion(client.regions_id)
					&& client.active
					&& ((client.operators_id==0) || (client.operators_id==chat.settings.operators_id));
			},
			isWaitOnline: function(client) {
				return this.validRegion(client.regions_id)
					&& client.online
					&& client.active
					&& client.operators_id==0;
			},
			isWaitOffline: function(client) {
				return this.validRegion(client.regions_id)
					&& !client.online
					&& client.active
					&& client.operators_id==0;
			},
			isOwn: function(client) {
				return this.validRegion(client.regions_id)
					&& client.active
					&& client.operators_id > 0
					&& client.operators_id==chat.settings.operators_id;
			},
			isOthers: function(client) {
				return this.validRegion(client.regions_id)
					&& client.active
					&& client.operators_id > 0
					&& client.operators_id != chat.settings.operators_id;
			},
			isInactive: function(client) {
				return this.validRegion(client.regions_id)
					&& client.online
					&& !client.active
					&& !this._old(client.last_dt);
			},
			_old: function(dt) {
				const now = new Date();
				let temp = new Date(dt);
				temp.setHours(temp.getHours() + 8);

				return temp <= now;
			},
			
			selectTemplate: function(template) {
				this.$refs.message.setValue(template.text);
				this.templates_show = false;
			},

			notificationsEnable: function() {
				this.notify = false;
				window.Notification.requestPermission((_) => this.notify = true);
			},
			notification: function(message) {
				if (!this.notificationsEnabled)
				{
					return;
				}
				if (!this.notify)
				{
					return;
				}

				if ((document.visibilityState == "visible") && document.hasFocus())
				{
					//return;
				}

				const notification = new Notification('Новое сообщение в чате', {
					body: message.text,
					silent: false
				});
			},

			getMessages: function(chats_id) {
				let result = [];
				if (chats_id == 0)
				{
					return result;
				}

				return this.messages.filter(m => m.chats_id == chats_id).sort(compare_messages);
			}
		},
		computed: {
			canSendMessage: function() {
				if (!this.user.visible)
				{
					return false;
				}

				const client = this._getClient(this.active_chats_id);
				return this.canSendMessage2Client(client);
			},
			canChangeSelf: function() {
				const client = this._getClient(this.active_chats_id);

				return this.user.visible
					&& this.user.rights.operator_change_self
					&& this.validRegion(client.regions_id)
					&& client.active
					&& (client.operators_id!=0)
					&& (client.operators_id!=this.self_id);
			},

			notificationsSupported: function() {
				return 'Notification' in window;
			},
			notificationsEnabled: function() {
				this.notify = this.notify; // force vue update
				return this.notificationsSupported && (window.Notification.permission === "granted");
			},

			allow_attachment: _defaults_computed.allow_attachment,
			attachment_extensions: _defaults_computed.attachment_extensions,
			attachment_limit: _defaults_computed.attachment_limit,
			user_type: _defaults_computed.user_type,
			edit_id: _defaults_computed.edit_id,
			edit_message: _defaults_computed.edit_message,

			region_operators: function() {
				const regions = chat._settings.regions_ids;
				return this.operators.filter(o => {
					const same_regions = o.regions_ids.filter(id => regions.includes(id));
					return same_regions.length > 0;
				});
			},
			regions: function() {
				return chat._settings.regions;
			},
			last_messages: function() {
				const result = {};
				const types = ['text', 'redirect'];
				const messages = this.messages.sort(compare_messages);

				for (let i = 0; i < messages.length; i++)
				{
					const message = messages[i];

					if (!types.includes(message.message_type))
					{
						continue;
					}

					if (message.text == '')
					{
						continue;
					}

					result[message.chats_id] = message;
				}

				return result;
			},

			new_messages: function() {
				const result = {};

				for (let i = 0; i < this.messages.length; i++)
				{
					const message = this.messages[i];
					if (!(message.chats_id in result))
					{
						result[message.chats_id] = 0;
					}

					if ((message.sender.type != 'client') || (message.message_type != 'text'))
					{
						continue;
					}

					if (!message.readed)
					{
						result[message.chats_id] += 1;
					}
				}

				return result;
			},
			active_clients: function() {
				let result = [];
				if (this.chats_ids.length == 0)
				{
					return result;
				}

				return this.clients.filter(c => this.chats_ids.includes(c.chats_id));
			},
			active_client: function() {
				return this._getClient(this.active_chats_id);
			},
			chats_messages: function() {
				return this.getMessages(this.active_chats_id);
			},
			templates: function() {
				if (!this.user.visible)
				{
					return [];
				}

				const client = this._getClient(this.active_chats_id);
				if (!('name' in client))
				{
					return [];
				}

				if (!this.canSendMessage2Client(client))
				{
					return [];
				}

				const operator = this._operator();
				if (operator == null)
				{
					return [];
				}
				
				return chat.settings.templates.map(x => {
					let text = x.template;
					text = text.replace('{client.name}', client.name);
					text = text.replace('{client.phone}', client.phone);
					text = text.replace('{operator.name}', operator.name);
					text = text.replace('{city.domain}', chat.settings.domains[client.regions_id]);
					text = text.replace('{city.id}', client.regions_id);

					return {
						name: x.name,
						text: text,
					};
				});
			},

			clients_wait_online: function() {
				return this.clients.filter(c => this.isWaitOnline(c));
			},
			clients_wait_offline: function() {
				return this.clients.filter(c => this.isWaitOffline(c));
			},
			clients_own: function() {
				return this.clients.filter(c => this.isOwn(c));
			},
			clients_others: function() {
				return this.clients.filter(c => this.isOthers(c));
			},
			clients_inactive: function() {
				return this.clients.filter(c => this.isInactive(c)).sort((x, y) => x.clients_last_dt.getTime() - y.clients_last_dt.getTime());
			}
		}
	});

	if (app.notificationsSupported && !app.notificationsEnabled)
	{
		app.notificationsEnable();
	}

	$(window).on('beforeunload', () => app.typing(false));	

	return app;
}
// https://github.com/ericnorris/striptags

"use strict";
var __assign = (this && this.__assign) || function () {
	__assign = Object.assign || function(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++)
		{
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
			{
				t[p] = s[p];
			}
		}

		return t;
	};

	return __assign.apply(this, arguments);
};

function isSpace(character)
{
	return character == " " || character == "\n" || character == "\r" || character == "\t";
}

function isQuote(character)
{
	return character == '"' || character == "'";
}

var TAG_START = "<";
var TAG_END = ">";
var ENCODED_TAG_START = "&lt;";
var ENCODED_TAG_END = "&gt;";

var InPlaintextState = /** @class */ (function () {
	function InPlaintextState(options)
	{
		this.options = options;
	}

	InPlaintextState.prototype.consume = function (character, transition)
	{
		if (character == TAG_START)
		{
			transition(new InTagNameState(this.options));
			return "";
		}
		else if (character == TAG_END && this.options.encodePlaintextTagDelimiters)
		{
			return ENCODED_TAG_END;
		}

		return character;
	};

	return InPlaintextState;
}());

var InTagNameState = /** @class */ (function () {
	function InTagNameState(options)
	{
		this.options = options;
		this.nameBuffer = "";
		this.isClosingTag = false;
	}

	InTagNameState.prototype.consume = function (character, transition)
	{
		if (this.nameBuffer.length == 0)
		{
			if (isSpace(character))
			{
				transition(new InPlaintextState(this.options));
				return ((this.options.encodePlaintextTagDelimiters ? ENCODED_TAG_START : "<") + character);
			}

			if (character == "/")
			{
				this.isClosingTag = true;
				return "";
			}
		}

		if (isSpace(character))
		{
			if (this.isNameBufferAnAllowedTag())
			{
				transition(new InTagState(0 /* Allowed */, this.options));
				return TAG_START + (this.isClosingTag ? "/" : "") + this.nameBuffer + character;
			}
			else
			{
				transition(new InTagState(1 /* Disallowed */, this.options));
				return this.options.tagReplacementText;
			}
		}

		if (character == TAG_START)
		{
			this.nameBuffer += ENCODED_TAG_START;
			return "";
		}

		if (character == TAG_END)
		{
			transition(new InPlaintextState(this.options));
			if (this.isNameBufferAnAllowedTag())
			{
				return TAG_START + (this.isClosingTag ? "/" : "") + this.nameBuffer + character;
			}
			else
			{
				return this.options.tagReplacementText;
			}
		}

		if (character == "-" && this.nameBuffer == "!-")
		{
			transition(new InCommentState(this.options));
			return "";
		}

		this.nameBuffer += character;
		return "";
	};

	InTagNameState.prototype.isNameBufferAnAllowedTag = function ()
	{
		var tagName = this.nameBuffer.toLowerCase();
		if (this.options.allowedTags)
		{
			return this.options.allowedTags.indexOf(tagName) != -1;
		}
		else if (this.options.disallowedTags)
		{
			return !(this.options.disallowedTags.indexOf(tagName) != -1);
		}
		else
		{
			return false;
		}
	};

	return InTagNameState;
}());
var InTagState = /** @class */ (function () {

	function InTagState(mode, options)
	{
		this.mode = mode;
		this.options = options;
	}

	InTagState.prototype.consume = function (character, transition)
	{
		if (character == TAG_END)
		{
			transition(new InPlaintextState(this.options));
		}
		else if (isQuote(character))
		{
			transition(new InQuotedStringInTagState(this.mode, character, this.options));
		}

		if (this.mode == 1 /* Disallowed */)
		{
			return "";
		}

		if (character == TAG_START)
		{
			return ENCODED_TAG_START;
		}
		else
		{
			return character;
		}
	};

	return InTagState;
}());

var InQuotedStringInTagState = /** @class */ (function () {

	function InQuotedStringInTagState(mode, quoteCharacter, options)
	{
		this.mode = mode;
		this.quoteCharacter = quoteCharacter;
		this.options = options;
	}

	InQuotedStringInTagState.prototype.consume = function (character, transition)
	{
		if (character == this.quoteCharacter)
		{
			transition(new InTagState(this.mode, this.options));
		}

		if (this.mode == 1 /* Disallowed */)
		{
			return "";
		}

		if (character == TAG_START)
		{
			return ENCODED_TAG_START;
		}
		else if (character == TAG_END)
		{
			return ENCODED_TAG_END;
		}
		else
		{
			return character;
		}
	};

	return InQuotedStringInTagState;
}());
var InCommentState = /** @class */ (function () {

	function InCommentState(options)
	{
		this.options = options;
		this.consecutiveHyphens = 0;
	}

	InCommentState.prototype.consume = function (character, transition)
	{
		if (character == ">" && this.consecutiveHyphens >= 2)
		{
			transition(new InPlaintextState(this.options));
		}
		else if (character == "-")
		{
			this.consecutiveHyphens++;
		}
		else
		{
			this.consecutiveHyphens = 0;
		}

		return "";
	};

	return InCommentState;
}());

var DefaultStateMachineOptions = {
	tagReplacementText: "",
	encodePlaintextTagDelimiters: true,
};

var StateMachine = /** @class */ (function () {
	
	function StateMachine(partialOptions)
	{
		var _this = this;
		if (typeof partialOptions == 'undefined')
		{
			partialOptions = {};
		}

		this.state = new InPlaintextState(__assign(__assign({}, DefaultStateMachineOptions), partialOptions));
		this.transitionFunction = (function (next) {
			_this.state = next;
		}).bind(this);
	}

	StateMachine.prototype.consume = function (text)
	{
		var outputBuffer = "";
		for (var _i = 0, text_1 = text; _i < text_1.length; _i++)
		{
			var character = text_1[_i];
			outputBuffer += this.state.consume(character, this.transitionFunction);
		}

		return outputBuffer;
	};

	return StateMachine;
}());

function strip_tags(text, options)
{
	if (typeof options == 'undefined')
	{
		options = {};
	}

	return new StateMachine(options).consume(text);
}
