/*global CN, console, window, location, document, jQuery, setTimeout */
/* for jsLint */
if (typeof CN === 'undefined' || !CN) {
    throw ('CN and/or jQuery library is missing!');
}


/**
 * Mobile takeover ad. Drops an ad after x number of page views/actions that takes over the entire
 * page.
 *
 * @version 1.0
 * @requires    CN.ads
 * @requires    CN
 * @requires    jQuery
 * @author Dennis Pierce, Hon Chih Chen
 */
CN.ad.mobileTakeover = (function($, $CNd, $D) {
    'use strict';
    var
        frequency = 5, // how many page views per session before making an ad call.

        frequencyCap = 0, // Max number of times to display the takeover. If 0, then no frequency cap.

        cookieName = 'CNADMV', // name of the cookie to check.

        msgPre = 'CN Ad: Mobile Takeover ', // Re-used string for logging info messages.

        adName = 'takeOver', // Name of the ad div id. doesn't include the underscore or size; those are automatically added to generate div ID.

        adCalled = false, // Flag if ad has been called. If so, then just run refresh instead of call.
        /**
         * Allow overrides to be passed in via cn.dartconfig.js
         * @private
         */
        setDefaults = function() {
            // page view frequence
            if ($CNd.get('configData').mobileTakeoverFreq) {
                frequency = $CNd.get('configData').mobileTakeoverFreq;
            }

            // name of ad div.
            if ($CNd.get('configData').mobileTakeoverName) {
                adName = $CNd.get('configData').mobileTakeoverName;
            }

            // total frequency cap per session
            if ($CNd.get('configData').mobileTakeoverFreqCap) {
                frequencyCap = $CNd.get('configData').mobileTakeoverFreqCap;
            }
        },

        build = function(ad) {
            setDefaults(ad);
            readCookie();
            $D.info(plugin.name + " assembled", [{}]);
        },

        /*
         * 2 args:
         * val1 : number of page views.
         * val2 : number of time ad seen this session.
         */
        setCookie = function (val1, val2) {
            CN.cookie.set(cookieName, val1+'|'+val2, {
                path: '/'
            });
        },

        /**
         * Builds a div to hold the 300x250. Used if it's not in the page
         * already.
         * @returns this.
         * @private
         */
        buildAdDiv = function() {
            $("body").prepend('<div id="'+ adName + '_300x250_frame' +'" class="displayAd displayAd300x250Js" style="width:1px;height: 0px;" data-cb-ad-id="'+ adName + '_300x250_frame' +'"></div>');
            return this;
        },

        /**
         * Makes a call to CN.dart.call.
         * @returns {Object}
         * @private
         */
        callAd = function() {
            if (adCalled) {
                CN.dart.refresh(adName + '_');
            } else {
                // If the div doesn't exist, then manually add it.
                if ($('#' + adName + '_300x250_frame').length === 0) {
                    buildAdDiv();
                }

                adCalled = true;
                CN.dart.call(adName + '_', {
                    sz: '300x250',
                    kws: ["takeover", "mobile"]
                });
            }
        },

        /**
         * Binds to ready event from CN.dart and when ready, then calls the method to make an ad call.
         * Why not just call callAd() directly? Have to wait until the ad library is ready before calling an ad.
         * @private
         */
        insertAd = function() {
            // If ads are ready, call setup.
            if (CN.dart && CN.dart.getGPTAdsRenderStatus() === true) {
                // Otherwise bind to event.
                callAd();
            } else {
                jQuery(window).bind('CN.customEvents.GPTAdsRendered', function(e) {
                    callAd();
                });
            }
        },

        /**
         * Parses cookie and returns object with 2 properties.
         * pageViews : number of pages seen before next ad.
         * timesSeen : number of times the ad has been seen this session.
         * @private
         */
        parseCookie = function(c) {
            var val = c.split('|');
            // No cookie
            if (c === '') {
                val = [0,0];
            // Only have page view counter.
            } else if (c.length === 1) {
                val = [c[0], 0];
            }
            return {
                pageViews : parseInt(val[0], 10),
                timesSeen : parseInt(val[1], 10)
            };
        },


        /**
         * Reads cookie to get current page view. If greater than threshold, bind event to call an ad.
         * @private
         */
        readCookie = function() {
            var c = parseCookie(CN.cookie.get(cookieName));

            // If we've hit the frequency cap, then stop reading cookies and showing ads.
            if (frequencyCap > 0 && c.timesSeen >= frequencyCap) {
                $D.info(msgPre + 'Exceeded frequency cap for session. Take Over Ad disabled.');
                return this;
            }

            if (frequency !== 0) {
                $D.info(msgPre + 'Take Over Ad Exist', []);
                if (c.pageViews === '') {
                    setCookie('1', c.timesSeen);
                } else {
                    if (c.pageViews < frequency) {
                        c.pageViews += 1;
                        setCookie(c.pageViews, c.timesSeen);
                        $D.info(msgPre + 'counter :' + c.pageViews);
                    } else {
                        $D.info(msgPre + 'Take Over Ad');
                        insertAd();
                        setCookie('0', c.timesSeen+1);
                        $D.info(msgPre + 'counter = ' + c.pageViews);
                    }
                }
            } else {
                insertAd();
                setCookie('0', c.timesSeen+1);
            }
            return this;
        },

        finished = function(ret) {
            var i = 0,
                len = plugin.callbacks.length;

            plugin.isFinished = true;
            $(window).trigger('CN.customEvents.dartPlugin', [plugin, ret]);

            for (i = 0; i < len; i += 1) {
                plugin.callbacks[i]["func"].apply((plugin.callbacks[i]["scope"] || null), (plugin.callbacks[i]["args"] || []));
            }
        },

        /**
         *
         * @param {String} obj A reference to CN.dart's plugin object
         * @private
         */
        init = function(obj) {
            var run = function() {
                    build();
                    finished({});
                };
            run();
        },

        /*
         * Make sure this obj is below the init, otherwise it won't be a valid plugin to the DART library.
         */
        plugin = {
            init: init,
            name: 'CN Ad Mobile Takeover',
            modifies: [],
            requires: [],
            callbacks: [],
            isFinished: false
        },

        register = function() {
            $CNd.register(plugin);
        };

    register(plugin);

    return {
        triggerPageView : readCookie // Used for ajax interfaces where you need to trigger page view increment without browser reload.
    };

}(jQuery, CN.dart, CN.debug));