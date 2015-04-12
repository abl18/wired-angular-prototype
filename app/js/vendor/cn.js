/*global CN, console, window, location, document, Option, jQuery, setTimeout, clearTimeout, clearInterval, setInterval */ /* for jsLint */

/*
 * Conde Nast Digital Core JavaScript
 * @copyright   2008-2010 Conde Nast Digital except where specified. All rights reserved
 */

/*
    SECTION: CN CORE METHODS
*/


if (typeof CN === 'undefined' || !CN)  {
    /**
     * CN global namespace object
     * @namespace CN global namespace object
     */
    var CN = {};
}

/**
 * Determines whether or not the provided object is a boolean
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isBoolean = function(mixed) {
    return typeof mixed === 'boolean';
};

/**
 * Determines whether or not the provided object is a date
 * @param  {mixed}   mixed  The object being tested
 * @return {boolean}        the result
 */
CN.isDate = function(mixed) {
    return Object.prototype.toString.call(mixed) === '[object Date]';
};

/**
 * Determines whether or not the provided string is empty
 * @param  {string}  str    The string being tested
 * @return {boolean}        the result
 */
CN.isEmpty = function(str) {
    return !/\S/.test(str || '');
};

/**
 * Determines whether or not the provided object is null
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isNull = function(mixed) {
    return mixed === null;
};

/**
 * Determines whether or not the provided object is a legal number
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isNumber = function(mixed) {
    return typeof mixed === 'number' && isFinite(mixed);
};

/**
 * Determines whether or not the provided object is of type object
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isObject = function(mixed) {
    return typeof mixed === 'object';
};

/**
 * Determines whether or not the provided object is a string
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isString = function(mixed) {
    return typeof mixed === 'string';
};

/**
 * Determines whether or not the provided object is undefined
 * @param  {mixed}   mixed  The object being testing
 * @return {boolean}        the result
 */
CN.isUndefined = function(mixed) {
    return typeof mixed === 'undefined';
};


/*
    SECTION: CN STATIC CLASSES
*/


/**
 * @class       CN URL Object
 * @description Contains methods for dealing with urls, query and hash params
 * @public
 * @author      Paul Bronshteyn
 * @author      Eric Shepherd
 */
CN.url = (function() {
    var
        /**
         * Path Cache Array.
         * @memberOf    CN.url
         * @private
         * @type        object
         */
        pathCache = [];

    /**
     * @scope CN.url
     */
    return {
        /**
         * Retrieves domain name from the url in the form of domain.com
         * @param   {string} [url]  Url to be parsed
         * @return  {string}        domain.com
         */
        domain : function(url) {
            var d = ((url) ? url.replace(/^https*:\/\/|(:|\/).*$/g, '') : location.hostname).split('.'),
                dl = d.length;
            return d.slice(dl - 2, dl).join('.');
        },

        /**
         * Retrieve current site section
         * @return {string} Section name
         */
        section : function() {
             return ((location.pathname.split('/')[1] || '').match(/^[^\.]*$/) || [''])[0];
        },

        /**
        * Returns url secure state
        * @return {boolean}
        */
        isSecure: function() {
            return location.protocol === 'https:';
        },

        /**
         * Get query params as object of key, value pairs or a value of a param passed in.
           If query is not provided, location.search will be used.
           Result will be caches to queryCache variable for faster access on next call.
         * @param   {string}        param     Parameter to lookup
         * @param   {string}        query     Query string to parse
         * @param   {string}        regex     String key representing regular expression in parsers object
         * @return  {object|string}
         */
        params : function(param, query, regex) {
            var result = CN.utils.parseStr((query || location.search), (regex || 'query'));
            return (param) ? result[param] || '' : result;
        },

        /**
         * Retrive current site path
         * @return {array} Path
         */
        path : function() {
            if (pathCache.length === 0) {
                pathCache = location.pathname.match(/([^\/]+)/g) || ['']; // remove leading and trailing slash.
            }
            return pathCache;
        },

        /**
         * Retrieve the URL fragment identifier
         * @return {string|boolean} fragment id
         */
        getFragment : function() {
            return location.hash.substring(1) || false;
        },

        /**
         * Sets the fragment identifier string
         */
        setFragment : function(value) {
            location.hash = value || '';
            return this;
        }
    };
})();


/**
 * @class           CN Utilities
 * @description     Collection of utility helper functions
 * @public
 * @author          Paul Bronshteyn
 * @author          Eric Shepherd
 */
CN.utils = (function() {
    var
        /**
         * Cache object.
         * @description Contains result objects for all parsed string using parseStr function.
         * @memberOf    CN.utils
         * @private
         * @type        object
         */
        cache = {},

        /**
         * Regular expression parsers
         * @memberOf    CN.utils
         * @private
         * @type        object
         */
        parsers = {
            /**
             * Query, hash parser expression.
             * @description Will parse a url string in the form of ?var=value&var1=value#hash=value&hash1=value1 into
                            key value pair object.
             * @memberOf    CN.utils
             * @private
             * @type        RegEx expression
             */
            query : /([^?=&]+)(=([^&]*))?/g,

            /**
             * Hash parser expression.
             * @description Will parse url hash string in the form of
                            ?var=value&var1=value into key value pair object.
             * @memberOf CN.utils
             * @private
             * @type RegEx expression
             */
            hash : /([^#=&]+)(=([^&]*))?/g,

            /**
             * User cookie hash parser expression.
             * @description  Will parse a cookie value in the form of var=value|var1=value|var2=value into
                             key value pair object.
             * @memberOf     CN.utils
             * @private
             * @type         RegEx expression
             */
            usercookie : /([^=|]+)(=([^|]*))?/g
        },

        /**
         * Takes an argument and a goal length and prepends or appends
           padding character to reach that length.
         * @param {string} str A number or string representing a number
         * @param {integer} total A length to make the return string
         * @param {string} padding A number or string to pad with
         * @param {string} dir Direction to pad on
         * @return {string} Padded string
         */
        pad = function(str, total, padding, dir) {
            str     = String(str || '');
            padding = String(padding || ' ');

            var strLen = str.length,
                padLen = padding.length;

            if (strLen >= total) {
                return str;
            }

            while (strLen < total) {
                str = (dir === 'left') ? padding + str : str + padding;
                strLen += padLen;
            }

            return str;
        };

    /**
     * @scope CN.utils
     */
    return {
        /**
         * Parse string using a regular expression and return object of key, value pairs.
         * @param   {string}    query   Query to be parsed
         * @param   {string}    regex   String key representing regular expression in parsers object
         * @return  {object}            Result object of key, value pairs
         */
        parseStr : function(str, regex) {
            if (cache[str+"_"+regex]) {
                return cache[str+"_"+regex];
            }
            cache[str+"_"+regex] = {};

            (str || '').replace(parsers[regex], function($0, $1, $2, $3) {
                cache[str+"_"+regex][$1] = $3;
            });

            return cache[str+"_"+regex];
        },



        /**
         * URI encode/decode a string
         * @private
         * @param {string} str String to encoded or decoded
         * @param {boolean} [encode] Will encode if set to true, otherwise decode
         * @return {string} Encoded or decoded string
         */
        uriencdec : function(str, encode) {
            return (encode) ? encodeURIComponent(str) : decodeURIComponent(str);
        }

    };
})();


/**
 * CN Debug Object
 * @requires    jQuery
 * @class       CN Debug Object
 * @public
 * @constructor
 * @author      Paul Bronshteyn
 */
CN.debug = (function() {
    var
        /**
         * Log Types (error, warn, info, user)
         * @memberOf    CN.debug
         * @private
         * @type        object
         */
        eType = {
            error : { f: 'error', msg: 'ERROR' },
            warn  : { f: 'warn',  msg: 'WARNING' },
            info  : { f: 'info',  msg: 'INFO' },
            user  : { f: 'error', msg: 'USER' }
        },

        /**
         * Log Types (DEV, STAG, PREV, PROD)
         * @memberOf    CN.debug
         * @private
         * @type        object
         */
        eEnv = {
            DEV  : 'Development',
            STAG : 'Staging',
            PREV : 'Preview',
            PROD : 'Production'
        },

        /**
         * Shows error information in console or alert
         * @memberOf    CN.debug
         * @private
         * @param       {string}    type    Error Type
         * @param       {string}    msg     Error message
         * @param       {array}     [args]  Error details
         */
        show = function(type, msg, args) {
            var t = eType[type] || eType.debug;

            if (CN.site.env === 'PROD' && !CN.site.debug) {
                return;
            }

            msg = msg || 'NO MSG';
            args = args || [];

            if (typeof console === 'object') {
                var func = console[t.f] || console.info;

                args.unshift(t.msg, msg);

                for (var i = 0; i < args.length - 1; i += 2) {
                    var part = args.splice(0, i + 1);
                    part.push(' :: ');
                    args = part.concat(args);
                }

                if (console.firebug) {
                    func.apply(this, args);
                } else {
                    console[t.f](args);
                }
            }
        };

        if (CN.url.params("debugOff") === 'true') {
            show = function() { return; };
        }

    /**
     * @scope CN.debug
     */
    return {
        /**
         * Log error messages
         * @param   {string}    msg     Error message
         * @param   {array}     [args]  Error details
         */
        error : function(msg, args) {
            show('error', msg, args);
            return this;
        },

        /**
         * Log warning messages
         * @param   {string}    msg     Warning message
         * @param   {array}     [args]  Warning details
         */
        warn : function(msg, args) {
            show('warn', msg, args);
            return this;
        },

        /**
         * Log info messages
         * @param   {string}    msg     Info message
         * @param   {array}     [args]  Info details
         */
        info : function(msg, args) {
            show('info', msg, args);
            return this;
        },

        /**
         * Log Try/Catch messages
         * @param   {object}        e Error object
         * @param   {array} [args]  Error details
         */
        user : function(e, args) {
            show('user', e.message, [args, e.fileName, e.lineNumber, e.name, e.stack]);
            return this;
        },

        /**
         * Speed test your function
         * @param   {function|string}   f           Function name or it's string representation
         * @param   {array}             [args]      Arguments that will be passed to the function
         * @param   {integer}           [cycles]    How many cycles to run the test (default 10000)
         * @return  {console|alert}                 Prints time in ms in console in FF,Safari,Chrome and alert() on IE
         */
        speedtest : function(f, args, cycles) {
            var x, i;

            if (CN.isNumber(args)) {
                cycles = args;
                args = [];
            }

            if (!jQuery.isArray(args)) {
                args = [];
            }

            cycles = cycles || 10000;

            if (!jQuery.isFunction(f)) {
                CN.debug.error('Not a function', [f]);
                return this;
            }

            if (typeof console === 'object') {
                if (console.time) {
                    x = 'timer' + Math.floor(Math.random() * 1000000);
                    console.time(x);
                    for (i = 0; i < cycles; i++) {
                        f.apply(this, args);
                    }
                    console.timeEnd(x);
                } else {
                    x = new Date() - 0;
                    for (i = 0; i < cycles; i++) {
                        f.apply(this, args);
                    }
                    x = new Date() - x;
                    // console.log(x);
                }
            } else {
                x = new Date() - 0;
                for (i = 0; i < cycles; i++) {
                    f.apply(this, args);
                }
                x = new Date() - x;
                alert(x);
            }

            return this;
        },

        /**
         * CN Application Debug Object
         * @class       CN Application Debug Object
         * @constructor
         * @public
         * @author      Paul Bronshteyn
         */
        app : function() {
            var
                /**
                 * Holds setLevel options
                 * @memberOf    CN.debug.app
                 * @private
                 * @type        object
                 */
                options = {},

                /**
                 * Shows error information in console or alert.
                 * @description     Uses setLevel options to display or supress error messages.
                                    Calls parent show() method if setLevel options match
                 * @memberOf        CN.debug.app
                 * @link            CN.debug.show
                 * @private
                 * @param           {string}    type    Error Type
                 * @param           {string}    msg     Error message
                 * @param           {array}     [args]  Error details
                 */
                _show = function(type, msg, args) {
                    if (options[CN.site.env][type]) {
                        show(type, msg, args);
                    }
                };

            /**
             * @scope CN.debug.app
             */
            return {
                /**
                 * Set Levels of debuging messages
                 * @param   {array}     type    Log Types (error, warn, info, debug, user)
                 * @param   {string}    [env]   Enviroment (DEV, STAG, PREV, PROD)
                 */
                setLevel : function(type, env) {
                    if (!type || !jQuery.isArray(type) || type.length === 0) {
                        return this;
                    }
                    env = (env && env in eEnv) ? env : 'DEV';
                    options[env] = type;
                    return this;
                },

                /**
                 * Get Levels of debuging messages
                 * @param   {string}        [env]   Enviroment (DEV, STAG, PREV, PROD)
                 * @return  {object|array}          If enviroment not provided returns reporting object, if provided levels array
                 */
                getLevel : function(env) {
                    return (env) ? options[env] || '' : options;
                },

                /**
                 * Log error messages
                 * @link    CN.debug.error
                 * @param   {string}    msg     Error message
                 * @param   {array}     [args]  Error details
                 */
                error : function(msg, args) {
                    _show('error', msg, args);
                    return this;
                },

                /**
                 * Log warning messages
                 * @link    CN.debug.warn
                 * @param   {string}    msg     Warning message
                 * @param   {array}     [args]  Warning details
                 */
                warn : function(msg, args) {
                    _show('warn', msg, args);
                    return this;
                },

                /**
                 * Log info messages
                 * @link    CN.debug.info
                 * @param   {string}    msg     Info message
                 * @param   {array}     [args]  Info details
                 */
                info : function(msg, args) {
                    _show('info', msg, args);
                    return this;
                },

                /**
                 * Log Try/Catch messages
                 * @link    CN.debug.user
                 * @param   {object}    e       Error object
                 * @param   {array}     [args]  Error details
                 */
                user : function(e, args) {
                    _show('user', e.message, [args, e.fileName, e.lineNumber, e.name, e.stack]);
                    return this;
                }
            };
        }
    };
})();


/**
 * CN Site Object
 * @class    CN Site Object
 * @public
 * @author   Paul Bronshteyn
 */
CN.site = (function() {
    /** @scope CN.site */
    return {
        /**
         * Site code
         * @type string
         */
        code : '',

        /**
         * Site title
         * @type string
         */
        title : '',

        /**
         * Site name - Lower cased title
         * @type string
         */
        name : '',

        /**
         * Site alias - Upper case title
         * @type string
         */
        alias: '',

        /**
         * Site environment
         * @type string
         */
        env : '',

        /**
        * Site CND Request
        * @type boolean
        */
        cnd: false,

        /**
         * Site debug.
         * @description If set will console debug messages in any enviroment.
                        Use query parameter magdebug to toggle debuger.
         * @type boolean
         */
        debug : !!CN.url.params('magdebug') && !this.cnd,

        /**
         * Site no ads.
         * @description If set will disable ad calls on the page.
         * @type boolean
         */
        noads : !!CN.url.params('magnoads') && !this.cnd,

        /**
         * Test ads.
         * @description If not empty we will use this as dart site and zone
         * @type String
         */
        testads : CN.url.params('dartAdOverride') && !this.cnd,

        /**
         * Initiate site specific object, sets document.domain
         * @param {object} settings S
         * @type function
         */
        init : function(settings) {
            settings = settings || {};
            for (var s in settings) {
                if (settings.hasOwnProperty(s)) {
                    this[s] = settings[s];
                }
            }

            /**
             * @name        CN.site#dynamicName
             * @description Dynamically generated site object based on the name of the site.
                            All site specific code will be in this object.
             * @memberOf    CN.site
             * @type        object
             * @example     CN.site.glamour
             */
            this[this.name] = {};

            this.domain = CN.url.domain();

            try {
                if (this.domain) {
                    document.domain = this.domain;
                }
                CN.debug.info('Document domain was set', [this.domain]);
            } catch(e) {
                CN.debug.error(e);
            }

            CN.debug.info('CN Started', [this.code, this.title, this.env, this.name, this.alias, this.cnd, this.debug, this.noads]);

            return this;
        }
    };
})();


/*********************************************************************************************************************
 The above namespaces need to be in the order listed
 All namespaces below will follow in alphabetical order
*********************************************************************************************************************/



/**
 * @class    CN Cookie
 * @public
 * @author   Paul Bronshteyn
 */
CN.cookie = (function() {
    var
        /**
         * Cookie Cache Object.
         * @description     Contains all the cookies parsed on the page.
         * @memberOf        CN.cookie
         * @private
         * @type            object
         */
        cookieCache = {};

    /**
     * @scope CN.cookie
     */
    return {
        /**
         * Get the value of a cookie with the given name.
         * @param   {string}    name   Cookie name
         * @return  {string}            Cookie value
         *
         * @example
             Get the value of a cookie:
             CN.cookie.get('the_cookie');
         */
        get : function(name) {
            if (cookieCache[name]) {
                return cookieCache[name];
            }

            var cookies = document.cookie.split('; '),
                cookie  = [],
                c       = 0,
                cl      = cookies.length;

            for (; c < cl; c++) {
                cookie = cookies[c].split('=');
                cookieCache[cookie[0]] = decodeURIComponent(cookie.slice(1).join('='));
                if (cookie[0] === name) {
                    return cookieCache[cookie[0]];
                }
            }

            this.delCache(name);
            return '';
        },

        /**
        * Delete the cookie with the given name.
        * @param {string} name Cookie name
        * @param {object} [options] Cookie options
        *
        * @example
            Delete the cookie:
            CN.cookie.del('the_cookie');

            Delete the cookie set with path:
            CN.cookie.del('the_cookie', { path: '/' });
        */
        del : function(name, options) {
            options = options || {};
            options.expires = -1;
            return this.set(name, '', options);
        },

        /**
         * Create a cookie with the given name and value and other optional parameters.
         * @param   {string}    name        Cookie name
         * @param   {string}    [value]     Cookie value
         * @param   {object}    [options]   Cookie options
         *
         * @example
             Create or set the value of a cookie:
             CN.cookie.set('the_cookie', 'the_value');

             Create a cookie with all available options:
             CN.cookie.set('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'condenast.com', secure: true });

             Delete the cookie:
             CN.cookie.set('the_cookie', '', { expires: -1 });
         */
        set : function(name, value, options) {
            this.delCache(name);

            options = options || {};
            value = value || '';
            options.expires = CN.isDate(options.expires) ? options.expires.toUTCString() : CN.isNumber(options.expires) ? (new Date(+(new Date) + options.expires * 60 * 60 * 1000)).toUTCString() : ''; // TODO: fails jslint - second new Date needs ()?

            var cookie = [name + '=' + encodeURIComponent(value)];

            if (options.expires) {
                cookie.push('expires=' + options.expires);
            }
            if (options.path) {
                cookie.push('path=' + options.path);
            }
            if (options.domain) {
                cookie.push('domain=' + options.domain);
            }
            if (options.secure) {
                cookie.push('secure');
            }

            return document.cookie = cookie.join('; '), cookieCache[name] = value, true; // TODO: crashes jslint with assignment operator in return
        },

        delCache: function(name) {
            delete cookieCache[name];
            return this;
        }
    };
})();


/**
 * @class        CN Frame
 * @description  Contains methods for dealing with iFrames.
 * @public
 * @requires     jQuery
 * @author       Paul Bronshteyn
 */
CN.frame = (function($) {
    var
        /**
         * Resize iFrame height to fit content on load.
         * @description This is a private function that is triggered by the onload
                        event of the iFrame. This will also be triggered by the
                        public resize method.
         * @memberOf    CN.frame
         * @private
         * @event
         */
        _resize = function(e) {
            var frame = (e.data && e.data.use) ? e.data.use : this;

            try {
                var body = frame.contentWindow.document.body;
            } catch(e) {
                return CN.debug.user(e, [frame, frame.id]);
            }

            if (typeof e.data === 'undefined') {
                $('iframe', body).bind('load', { use: frame }, _resize);
            }

            if (!$('.textAd', body).length || !$('#adHolder a', body).eq(0).text()) {
                $('#adHolder', body).css({ 'font-size': 0, 'line-height': 0 });
            }

            $(frame).css({
                border : 'none',
                margin : 0,
                height : $(body).css({ overflow: 'hidden', margin: 0, border: 0 }).outerHeight()
            });
        };

    /**
     * @scope CN.frame
     */
    return {
        /**
         * Bind iFframe resize on iFrame load.
         * @description     Binds the load event to the element passed in.
         * @param           {string}    frame   ID or class of the iFrame in jQuery excepted format.
         * @uses            CN.frame._resize
         *
         * @example
             Using element id:
             CN.frame.bindResize('#frame_id');

             Using element class:
             CN.frame.bindResize('.frame_class');

             Using multiple and combinations:
             CN.frame.bindResize('#frame_id, .frame_class');
         */
        bindResize : function(frame) {
            $(frame).bind('load', _resize);
            return this;
        },

        /**
         * Refresh iFrame
         * @description Refreshes an iFrame with the current url or with the url if the
                        param (if provided), resizes the frame onload to fit content.
         * @param       {string,array}  frames      Array, CSV or space-delimitted list of iframe
                                                    classes or ids or mixed
         * @param       {string}        [url]       Url for the iFrame(s) to be refreshed with, defaults to
                                                    refreshing current iFrame url
         * @param       {boolean}       [resize]    Resize iFrame after refresh, default is true
         * @uses        CN.frame._resize
         *
         * @example
             Refresh iFrame:
             CN.frame.refresh('#frame_id');

             Refresh multiple iFrames (comma-separated):
             CN.frame.refresh('#frame_id,.frame1,#frame2');

             Refresh multiple iFrames (space-separated):
             CN.frame.refresh('#frame_id .frame1 #frame2');

             Refresh iFrame with url:
             CN.frame.refresh('#frame_id', 'http://www.example.com');

             Refresh iFrame with url and do not resize:
             CN.frame.refresh('#frame_id', 'http://www.example.com', false);
         */
        refresh : function(frames, url, resize, funcs) {
            frames = (CN.isString(frames)) ? frames.split(/,|\s+/) : ($.isArray(frames)) ? frames : [];
            // frames array empty? exit
            if (!frames.length) {
                return this;
            }

            // shift arguments if resize was ommited
            if(CN.isObject(resize)){
                funcs=resize,resize=true;
            }

            // shift arguments if url and resize were ommited
            if(CN.isObject(url)){
                funcs=url,url='';
            }

            // shift arguments if url was ommited
            if (CN.isBoolean(url)) {
                resize = url;
                url = '';
            }

            // NOTE: == is intentional and checks for values that are null or undefined
            resize = (resize == null) ? true : resize;

            // update each frame
            $.each(frames, function(i, v) {
                if (!/\S/.test(v)) {
                    return true;
                }

                var frame = $(v);
                if (!frame.length) {
                    return true;
                }

                // bind load event
                if (resize) {
                    frame.bind('load', _resize);
                }

                //execute callbefore, and bind callafter
                CN.callwhen.run(funcs,frame);

                url = url || frame[0].src;

                // load url provided or refresh
                // adblock extension throws error, catch it, kill it
                try {
                    frame[0].contentWindow.location.replace(url);
                    CN.debug.info('CN Frame Refresh', [v, url, resize]);
                } catch(e) {
                    CN.debug.user(e, [v, url, resize]);
                }
            });

            return this;
        },

        /**
         * Resize iFrame height to fit content.
         * @description     Binds the load event to the element passed in and then triggers it.
         * @param           {string}    frame   ID or class of the iFrame in jQuery excepted format.
         * @uses            CN.frame._resize
         *
         * @example
             Using element id:
             CN.frame.resize('#frame_id');

             Using element class:
             CN.frame.resize('.frame_class');

             Using multiple and combinations:
             CN.frame.resize('#frame_id, .frame_class');
         */
        resize : function(frame) {
            $(frame).bind('load', _resize).triggerHandler('load');
            return this;
        }
    };
})(jQuery);

/**
 * @class       CN.modules
 * @description Holds page module APIs and provides methods for interacting with modules
 * @public
 * @author      Eric Shepherd
 */
CN.modules = (function() {
    CN.customEvents = CN.customEvents || {};
    CN.customEvents.moduleLoaded = {};

    var register,
        loaded = [];

    register = function(moduleName) {
        CN.modules.loaded.push(moduleName);
        jQuery(window).trigger('CN.customEvents.moduleLoaded.' + moduleName);
    };

    return {
        register : register,
        loaded   : loaded
    }
})();
