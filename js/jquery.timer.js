/**
 * jQuery Carousel w/Timer plugin
 *
 * Copyright (c) 2012 Austin Burns (http://austinburns.com)
 * Licensed under the MIT License:
 *	http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
	var defaults = {
		minutes:	0,
		seconds:  5,
		timerColor: '#dc602b',
		timerBGClass: ".timer-background",
		timerBGColor: '#96573d',
		autoplay: 1,
		loop: 1
	};

	$.fn.timer = function(settings) {		
		$.extend(this, {
			reset: function(){
				img.each(function(i){				
					if(i === 0)
						img.eq(i).css({ "position" : "absolute", "display" : "", "z-index" : totalImages - i }).addClass("current");
					else
						img.eq(i).css({ "position" : "absolute", "display" : "none", "z-index" : (totalImages - i) }).removeClass("current");
				});
			}
		});
		
		$.extend(this, defaults, settings);
		
		var img = $(this).parent().find("img");
			totalImages = img.length;
		
		if(totalImages > 1){
			init(this);

			var timer = this,
				timerProgress = timer.find(".timer-progress"),
				pause = timer.find(".pause"),
				outerDiv = $(timer).parent(),
				time = (timer.seconds) + (timer.minutes * 60),
				interval = time * 0.01 * 1000,
				percent = 0,
				currentIndex = null,
				clicked = 0,
				selected = 0;
			
			var intID = window.setInterval(function(){progressBar()}, interval);
			
			$(outerDiv).hover(
				function(){
					window.clearInterval(intID);
				},
				function(){
					if(clicked === 0)
						intID = window.setInterval(function(){progressBar()}, interval);
				}
			)
			
			$(pause).click(function(){
				if(clicked === 0){
					clicked = 1;
					$(this).removeClass("pause").addClass("play");
				}
				else{
					clicked = 0;
					$(this).removeClass("play").addClass("pause");
				}
			});
			
			$(".picture-link").click(function(){
				var obj = $(this),
					index = obj.prevAll("a").length;
				switchImages(index);
					
			});
		}
		
		function progressBar(){
			if(percent <= 100){
				$(timerProgress).width(percent + "%");
				percent++;
			}
			else{
				if(timer.loop === 1){
					percent = 0;
					switchImages(currentIndex);
				}
				else
					return;
			}
		};
		
		function init(timer){
			var link = "";
			var current = "";
			
			img.each(function(i){
				if(i === 0){
					current = "current";
					img.eq(i).css({ "position" : "absolute", "z-index" : totalImages - i }).addClass("current");
				}
				else{
					img.eq(i).css({ "position" : "absolute", "display" : "none", "z-index" : (totalImages - i) });
					current = "";
				}
					
				link += "<a class='picture-link " + current + "' href='javascript:void(0)' rel='" + i + "'>Pic / <span style='color: " + timer.timerColor + "'>0" + (i + 1) + "</span></a>";
			});
			
			$(timer).append('<div class="pause"></div>' + link +
							'<div class="timer-background" style="background-color: ' + timer.timerBGColor + ';">' +
								'<div class="timer-progress" style="background-color: ' + timer.timerColor + ';"></div>' +
							'</div>');
		};
		
		function switchImages(currentIndex){
			var startIndex = $(timer).parent().find("img[class*='current']").index();
			
			if(currentIndex === null)
				currentIndex = $(timer).parent().find("img").eq(startIndex).index() + 1;
			else
				selected = 1;
			
			img.eq(startIndex)
			   .fadeOut("slow")
			   .removeClass("current")
			   .parent().parent()
			   .find("a.current")
			   .removeClass("current");
			
			for(i=0; i < totalImages; i++){
				
				if(selected !== 1)
					currentIndex = currentIndex + i;
				else if(selected === 1 && i !== 0) 
					currentIndex++;
						
				if(currentIndex < totalImages)
					currentIndex = $(timer).parent().find("img").eq(currentIndex).index();
				else
					currentIndex = 0;
				
				img.eq(currentIndex).css({ "position" : "absolute", "z-index" : (totalImages - i) });
				
				if(i === 0){
					img.eq(currentIndex)
					   .fadeIn("slow")
					   .addClass("current")
					   .parent().parent()
					   .find(".picture-link")
					   .eq(currentIndex)
					   .addClass("current");
				}
			}
		}
		return this;
	};
})(jQuery);
