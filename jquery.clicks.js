/*
 * jQuery Clicks Plugin.
 *
 * Written by Omri Yariv.
 *
 * This script is for triggering event on special click actions (such as slow click for editing name).
 * The code will be executed when registering on the event, i.e. this.ui.name.on('singleclick', this.gotoEditMode);
 * Currently used for library items renaming on slow click.
 * 
 * Dependencies:
 * http://benalman.com/projects/jquery-outside-events-plugin/
 */

(function(jQuery) {

    // Triggered when an element is clicked/doubleclicked once for selection, 
    // And then clicked again for 'editing'. Similar to windows files renaming behavior.
    jQuery.event.special.sdblclick = {

        setup: function(data, namespaces) {
            var $elem = jQuery(this);
            $elem.bind('click', jQuery.event.special.sdblclick.clickHandler);
            $elem.bind('clickoutside', jQuery.event.special.sdblclick.clickoutsideHandler);
        },

        teardown: function(namespaces) {
            var $elem = jQuery(this);
            $elem.unbind('click', jQuery.event.special.sdblclick.clickHandler);
            $elem.unbind('clickoutside', jQuery.event.special.sdblclick.clickoutsideHandler);
        },

        clickHandler: function(event) {
            var $elem = jQuery(this);
            $elem.unbind('singleclick', jQuery.event.special.sdblclick.singleclickHandler);
            $elem.bind('singleclick', jQuery.event.special.sdblclick.singleclickHandler);
        },

        clickoutsideHandler: function(event) {
            var $elem = jQuery(this);
            $elem.unbind('singleclick', jQuery.event.special.sdblclick.singleclickHandler);
        },

        singleclickHandler: function(event) {
             var $elem = jQuery(this);
             event.type = 'sdblclick';
             $elem.trigger("sdblclick", event);
        }

    };

    // Triggered after an element is clicked once. A double click will not trigger this event.
    // The 'singleclick' event is triggered in a 250ms delay from the click in order to make
    // sure this isn't a doubleclick.
    jQuery.event.special.singleclick = {

        setup: function(data, namespaces) {
            var $elem = jQuery(this);
            $elem.bind('click', jQuery.event.special.singleclick.clickHandler);
            $elem.bind('dblclick', jQuery.event.special.singleclick.dblclickHandler);
        },

        teardown: function(namespaces) {
            var $elem = jQuery(this);
            $elem.unbind('click', jQuery.event.special.singleclick.clickHandler);
            $elem.unbind('dblclick', jQuery.event.special.singleclick.dblclickHandler);
        },

        clickHandler: function(event) {
            var $elem = jQuery(this);

            jQuery.event.special.singleclick.abortTrigger($elem);
            jQuery.event.special.singleclick.tryTrigger($elem, arguments);
        },

        dblclickHandler: function(event) {
            var $elem = jQuery(this);
            jQuery.event.special.singleclick.abortTrigger($elem);
        },

        tryTrigger: function(elem, args) {
            var event = args[0];
            var timeout = setTimeout(function() {
                event.type = "singleclick";
                elem.trigger("singleclick", event);
            }, 250);

            elem.data('timeout', timeout);
        },

        abortTrigger: function(elem) {
            var timeout = elem.data('timeout');
            if (timeout) {
                clearTimeout(timeout);
                elem.data('timeout', false);
            }
        }

    };

})(jQuery);