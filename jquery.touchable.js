/**
 * jquery.touchable.js
 * @author Josh Schumacher (http://joshschumacher.com)
 *
 * Abstract: 
 *  Use touchable.js to replication press states on both 
 *  standard desktop browsers with mouse interactions and
 *  mobile devices with touch interactions
 *
 *
 * Sample Usage:
    $('ul li').touchable({
        touch_start: function() {
            $(this).addClass('active');
        },
        touch_end: function() {
            $(this).removeClass('active');
        },
        clicked: function() {
            if (href = $(this).attr('href')) {
                document.location.href= href;
            }
        }
    });
 *
 *
 */
(function($) {
    $.fn.touchable = function(options) {
        var defaults = {
            threshold_x: 25,
            threshold_y: 25,
            touch_start: function() {},
            touch_end: function() {},
            clicked: function() {}
        };
        var options = $.extend(defaults, options);
        
        // Helper function to get (x,y) object from a touch or click event
        var getCoords = function(e) {
            var c = {'x':0,'y':0};
            if (e.originalEvent) {
                e = e.originalEvent;
            }
            if (e.changedTouches) {
                c.x = e.changedTouches[0].screenX;
                c.y = e.changedTouches[0].screenY;
            } else {
                c.x = e.clientX;
                c.y = e.clientY;
            }
            return c;
        };

        if (!this) return false;

        // Attach to all elements passed to touchable 
        // ex: $('li').touchable() would attach to all li elements
        return this.each(function() {
            var _this = this,
            	$this = $(this),
            	isTouchDevice = 'ontouchstart' in window;
            
            var bind = isTouchDevice ? 'touchstart' : 'mousedown';
            $this.bind(bind, function(event) {
                var c = getCoords(event),
                	$me = $(this);

                $me.attr('touch_x', c.x);
                $me.attr('touch_y', c.y);
                $me.attr('inTouch', 'true');
                $me.trigger('touch_start');
            });

            $this.bind('touchmove', function(event) {
                var $me = $(this);
                if ($me.attr('inTouch') == 'false') {
                    return;
                }
                var c = getCoords(event);

                // If touch has gone beyond x or y threshold, inTouch set to false
                if (Math.abs($me.attr('touch_x')-c.x) > options.threshold_x || 
                    Math.abs($me.attr('touch_y')-c.y) > options.threshold_y) 
                {
                    $me.trigger('touch_end');
                    $me.attr('inTouch', 'false');
                    $me.attr('touch_x', 0);
                    $me.attr('touch_y', 0);
                }
            });

            var bind = isTouchDevice ? 'touchend touchcancel' : 'mouseup mouseout';
            $this.bind(bind, function(event) {
            	var c = getCoords(event),
            		$me = $(this);
            	
            	// Need to track the mouseout event but shouldn't ever generate a click
            	if (event.type == 'mouseout' && $me.attr('inTouch') == 'true') {
                    $me.trigger('touch_end');
            		$me.attr('inTouch', 'false');
            	}
                
                if ($me.attr('inTouch') == 'true') {
                    $me.trigger('touch_end');

                    // Trigger clicked if didn't move too much
                    if (Math.abs($me.attr('touch_x')-c.x) < options.threshold_x && 
                        Math.abs($me.attr('touch_y')-c.y) < options.threshold_y) 
                    {
                        $me.trigger('clicked');
                    }
                }
                $me.attr('inTouch', 'false');
            });

            $this.bind('touch_start', function() {
                options.touch_start.apply(this);
            });

            $this.bind('touch_end', function() {
                options.touch_end.apply(this);
            });

            $this.bind('clicked', function() {
                var _this = this;
                // Short timeout fixes issue of a touchstart getting triggered after click on iOS
                setTimeout(function() {
                    options.clicked.apply(_this);
                }, 50);
            });
        });
    };
})(jQuery);