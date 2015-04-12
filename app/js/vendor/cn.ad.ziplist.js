/*global CN, console, window, location, document, jQuery, setTimeout */ /* for jsLint */
if (typeof CN === 'undefined' || !CN) {
    throw('CN and/or jQuery library is missing!');
}

/**
 * @class    CN ad
 * @public
 * @memberOf CN
 * @author   Robert Sethi
 */
CN.ad = CN.ad || {};

/**
 * Ziplist Tag Manager DFP plugin.
 * Extend current kw-set with kws from pulled from Ziplist
 *
 * @requires    CN.dart
 * @requires    CN
 * @requires    jQuery
 * @author      Robert Sethi
 */
CN.ad.ziplist = (function($, $CNd, $D) {
    var
        ready           = false,

        protocol        = location.protocol || 'http:',

        timeout         = 800,

        ziplistUrl      = '//3po.ziplist.com/recipe/tags',

        siteUrl         = location.href,

        url             = [ protocol + ziplistUrl + '?url=' + siteUrl + '&jsonp=CN.ad.ziplist.tags='],

        /**
         * Grab the list of Ziplist kws, and if the
         * request is successful, register the plugin with CN.dart.
         * @private
         */
        getZLKws = function(){
            $.ajax({
                url         : url,
                dataType    : 'script',
                timeout     : timeout,
                error       : function(x,t){
                    finished(false);
                    $D.info(plugin.name + ' plugin disabled',['script ' + t, 'using site code ']);
                },
                cache       : true,
                success     : function(data) {
                    ready = true;
                    parse();
                },
                complete    : function(){
                    $D.info(plugin.name + ' ziplist call complete');
                }
            });
            return true;
        },


        init = function(obj){
            getZLKws();

            // Schedule parse to run in 5 seconds as a failsafe
            setTimeout(function() {
                if (!plugin.isFinished && !ready) {
                    parse();
                }
            }, 5000);
        },

        finished = function(ret) {
            var
                i = 0,
                len = plugin.callbacks.length;

            plugin.isFinished = true;
            $(window).trigger('CN.customEvents.dartPlugin', [plugin, ret]);

            for (; i < len; i++) {
                plugin.callbacks[i]["func"].apply((plugin.callbacks[i]["scope"] || null), (plugin.callbacks[i]["args"] || []));
            }
        },

        /**
         * Parse the ziplist tags object, extract usable kws, and
         * return an ad object with the kws appened for CN.dart validation.
         * @private
         */
        parse = function(){
            var
                i = 0,
                len,
                aud,
                ret = [],
                    // Note: this value is populated by the ziplist script.
                    // The variable name is configured above in the url array.
                tags = CN.ad.ziplist.tags;

            if (!tags) {
                $D.warn("Ziplist Request Timed Out", ["Setting plugin to finished to procceed to render ads"]);
                return finished(false);
            }

            if (tags.tags) {
                aud = tags.tags;
                len = aud.length;
                for (; i < len; i++) {
                    ret.push(aud[i]);
                }
            }

            finished({
                ad : {kws : $CNd.get('ad').kws.concat(ret)}
            });
        },

        plugin = {
            init       : init,
            name       : 'CN Ad Ziplist kws',
            modifies   : ['keywords'],
            requires   : [],
            callbacks  : [],
            isFinished : false
        },

        register = function(){
            $CNd.register(plugin);
        };



    // Register immediately.
    register();


    return {
        tags : false
    };
}(jQuery, CN.dart, CN.debug));
