# touchable.js
A common interaction on desktop browsers is to apply a mousedown state on user interface elements. 

The need for mousedown type states are also needed on mobile devices but there is not standard API for applying an active state to an element while it is being touched.

Use touchable.js to create press states on 
+ Standard desktop browsers with mouse interactions
+ Mobile devices with touch interactions

## Sample Usage:
````javascript
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
````

If you need to modify the threshold of allowed movement before a "clicked" is canceled, pass a `threshold_x` or `threshold_y` value to the initialization. The default for both is 25 which means if the mouse or touch has traveled more than 25 pixels in any direction, the press state is canceled.