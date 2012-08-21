/**
 * jQuery Carousel w/Timer plugin
 *
 * Copyright (c) 2012 Austin Burns (http://austinburns.com)
 * Licensed under the MIT License:
 *	http://www.opensource.org/licenses/mit-license.php
 */
;(function($) {
	//Initialize defaults
	var defaults = {
		minutes:	0,
		seconds:  5,
		timerColor: '#dc602b',
		timerBGClass: ".timer-background",
		timerBGColor: '#96573d',
		height: "100%",
		width: "100%",
		autoplay: 1,
		loop: 1
	};

	$.fn.timer = function(settings) {		
		$.extend(this, {
			//Add a reset function to be used outside of the plugin in case user would like to reset the plugin
			reset: function(){
				img.each(function(i){				
					if(i === 0)
						img.eq(i)
						   .css({ 
								"position" : "absolute", 
								"display"  : "", 
								"opacity"  : 1, 
								"width"    : timer.width,
								"height"   : timer.height,
								"z-index"  : totalImages - i 
							   })
						   .addClass("current");
					else
						img.eq(i)
						   .css({ 
								"position" : "absolute", 
								"display"  : "none", 
								"opacity"  : 1,
								"width"    : timer.width,
								"height"   : timer.height,
								"z-index"  : totalImages - i
							   })
						   .removeClass("current");
				});
			}
		});
		
		$.extend(this, defaults, settings);
		//Get the images and find out the total length to be used in the init function
		var img = $(this).parent().find(".timer-img");
			totalImages = img.length;
			
		if(this.height !== "100%" || this.width !== "100%"){
			if(typeof this.height !== "number" || typeof this.width !== "number")
				console.error("You can only put a number as a parameter for width and height");
		}

		//If there are multiple images display the carousel timer and run the plugin, otherwise just display the single image
		if(totalImages > 1){
			init(this);
			
			var timer = this,
				timerProgress = timer.find(".timer-progress"),
				outerDiv = $(timer).parent(),
				time = (timer.seconds) + (timer.minutes * 60),
				interval = time * 0.01 * 1000,
				percent = 0,
				currentIndex = null,
				selected = 0,
				pauseplay,
				intID;
			
			//If Autoplay is set to false change the pause button to a play button and show the progress bar but do not start timer
			if(timer.autoplay === 0){
				pauseplay = "play";
				timer.find(".pause").removeClass("pause").addClass("play");
				progressBar();
			}
			//If set to true, start the timer
			else{
				pauseplay = "pause";
				intID = startTimer();	
			}
			
			/*
			  If the outer div (div class carousel) is hovered over the setInterval is destroyed 
			  when the mouse is not hovering anymore and the pause button wasn't clicked the setInterval continues
			*/
			$(outerDiv).hover(
				function(){
					clearTimer(intID);
				},
				function(){
					if(pauseplay === "pause")
						intID = startTimer();
				}
			);
			
			//If the pause button is clicked set the pauseplay variable to pause and change the bg image to a pause button and vice versa
			$("." + pauseplay).click(function(){
				if(pauseplay === "pause"){
					pauseplay = "play";
					$(this).removeClass("pause").addClass("play");
					
				}
				else{
					pauseplay = "pause";
					$(this).removeClass("play").addClass("pause");
				}
			});
			
			/*
			  When one of the picture links is clicked i.e. "PIC / 01" grab the 
			  index and send it to the switchImages function to change the image to that index
			*/
			$(".picture-link").click(function(){
				var obj = $(this),
					index = obj.prevAll("a").length;
				switchImages(index);
					
			});
		}
		
		function startTimer(){
			/*
			  Set the setInterval ID so when the mouse hovers over the image we can use the setInterval ID to 
			  destroy the current setInterval thus causing a "pause" in the timer
			*/
			var intID = window.setInterval(function(){progressBar()}, interval);
			return intID;
		}
		
		function clearTimer(id){
			// Destroy the current setInterval
			window.clearInterval(id);
		}
		
		/*
		  If the percentage is 100 or less increase the width of the timerProgress div by said percentage.
		  If auto loop is set to true then restart the timer and switch the image
		*/
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
		
		/*
		  Initialize the images and the timer interface
		*/
		function init(timer){
			var link = "", 
				current = "", 
				tallestHeight = 0, 
				height;
			
			img.each(function(i){
				if(i === 0){
					current = "current";
					img.eq(i)
					   .css({ 
							"position" : "absolute", 
							"z-index"  : totalImages - i,
							"width"    : timer.width,
							"height"   : timer.height
						   })
					   .addClass("current");
				}
				else{
					img.eq(i)
					   .css({ 
							"position" : "absolute", 
							"display"  : "none", 
							"z-index"  : totalImages - i,
							"width"    : timer.width,
							"height"   : timer.height
						   });
						   
					current = "";
				}
				
				if(timer.height !== "100%")
					jQuery(".carousel").height(+timer.height + 20);
				else{
					//Preload the images in memory to get the tallest image height and set the height of the outerDiv to that height
					$("<img/>").attr("src", $(img.eq(i)).attr("src")).load(function() {
				        if(this.height > tallestHeight)
							tallestHeight = this.height;
						
						jQuery(".carousel").height(tallestHeight + 20);
					});
				}
				
				link += "<a class='picture-link " + current + "' href='javascript:void(0)' rel='" + i + "'>Pic / <span style='color: " + timer.timerColor + "'>0" + (i + 1) + "</span></a>";
			});
			
			$(timer).append('<div class="pause"></div>' + link +
							'<div class="timer-background" style="background-color: ' + timer.timerBGColor + ';">' +
								'<div class="timer-progress" style="background-color: ' + timer.timerColor + ';"></div>' +
							'</div>');
		};
		
		/*
		  Takes an an optional parameter of currentIndex, if currentIndex is null then 
		  switchImages starts from the index of the image that has a the class of "current"
		  on it.
		*/
		function switchImages(currentIndex){
			
			//Get the index of the image with class of "current"
			var startIndex = $(timer).parent().find("img[class*='current']").prevAll(".timer-img").length;
			
			if(currentIndex === null)
				//Get the index of the image that will loaded next 
				currentIndex = $(timer).parent().find(".timer-img").eq(startIndex).prevAll(".timer-img").length + 1;
			else
				selected = 1;
			
			//Fade the current image out and remove the class of "current"
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
				
				/*
				  If we have not reached the last image we want to continue adding to currentIndex,
				  if we have reached the last image and are not at the end of the for loop we want
				  to start the count over to go back to the first image
				*/		
				if(currentIndex < totalImages)
					currentIndex = $(timer).parent().find(".timer-img").eq(currentIndex).prevAll(".timer-img").length;
				else
					currentIndex = 0;
				
				//Set the images new z-index so the next image can show and the current can hide
				img.eq(currentIndex).css({ "position" : "absolute", "z-index" : (totalImages - i) });
				
				//Show the next image
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
