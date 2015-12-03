snazzy = (function () {
	var t = {
		_timer: 0,
		raf: (function () {
			var r = {},
				lastTime = 0,
		    	vendors = ['webkit', 'moz', 'o','ms'];

	        r.requestAnimationFrame = function (f) {
	        	var o = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
	        	return o.call(window, f)
	        }
	        r.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame;

			if (!r.requestAnimationFrame) {
			    r.requestAnimationFrame = function(callback, element) {
				    var currTime = new Date().getTime(),
				    	timeToCall = Math.max(0, 16 - (currTime - lastTime)),
				    	id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);

				    lastTime = currTime + timeToCall;
				    return id;
				}
			}

			if (!r.cancelAnimationFrame) {
			    r.cancelAnimationFrame = function(id) {
				    window.clearTimeout(id);
				}
			};

			return r;
		}()),
		

		create: function (element, icon) {
        	stage = new swiffy.Stage(element, icon.swiffyobject, {});
    		stage.start();
    		return stage
		},
		
		replace: function () {
			for (var k in t.icons) {
				var icon = t.icons[k],
					_b = document.body,
					els;
				_b.innerHTML = _b.innerHTML.replace(new RegExp('\\[' + k + '\\]', 'g'), '<div class="snazzy-icon snazzy-icon-' + k + '" style="width: ' + icon.width + 'px; height: ' + icon.height + 'px"></div>');
				_b.innerHTML = _b.innerHTML.replace(new RegExp('\\[{' + k + '}\\]', 'g'), '[' + k + ']');
			}
			
			t.raf.requestAnimationFrame(function () {

				for (var k in t.icons) {
						els = document.querySelectorAll('.snazzy-icon-' + k)
						for (var i in els) {
							if (typeof els[i] === 'object') {
								t.create(els[i], t.icons[k])
							}
						}
				}

			})
		},
		
		run: function () {
			//t._timer = (t._timer + 1) % 60;
			//if (t._timer === 0) {
			//}
			t.replace()
		}
	};

	t.raf.requestAnimationFrame(t.run);

	return t;
}());