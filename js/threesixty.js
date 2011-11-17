$(document).ready(function () {
	var pointers = ["mouse", "finger"];
	var pointer;
	var dragging = false;
	var pointerStartPosX = 0;
	var pointerEndPosX = 0;
	var pointerDistance = 0;
	var pointerSpeed = 0;
	
	var monitorStartTime = 0;
	var monitorInt = 10;
	var ticker = 0;
	
	var speedMultiplier = 10;
	
	var totalFrames = 180;
	var currentFrame = 0;
	var frames = [];
	var endFrame = 0;
	var loadedImages = 0;
	var sequence_name = "img/rob_###.jpg";
	
	var spinner;
	
	/**
	*
	*/
	function showThreesixty () {
		$("#threesixty_images").fadeIn("slow");
		
		endFrame = 360;
		refresh();
	};
	
	/**
	* 
	*/
	function imageLoaded() {
		++loadedImages;
		if (loadedImages === totalFrames) {
			frames[0].removeClass("previous-image");
			frames[0].addClass("current-image");
			
			$("#spinner").fadeOut("slow", function(){
				//spinner.hide();
				showThreesixty();
			});
		} else {
			loadImage();
		}
	};
	
	/**
	* 
	*/
	function loadImage() {
		
		var li = document.createElement("li");
		var imageName = "img/threesixty_" + (loadedImages + 1) + ".jpg";
		var img = li.appendChild(document.createElement("img"));
		img.setAttribute("src", imageName);
		$(img).addClass("previous-image");
		frames.push($(img));
		
		$(img).load(function() {
			imageLoaded();
		});
	};
	
	/**
	*
	*/
	function addSpinner () {
		spinner = new CanvasLoader("spinner");
		spinner.setShape("spiral");
		spinner.setDiameter($(".preloader").width());
		spinner.setDensity(120);
		spinner.setRange(1);
		spinner.setColor("#333333");
		spinner.show();
	};
	
	/**
	*
	*/
	function init () {
		addSpinner();
		$("#spinner").hide().fadeIn("slow");
		$(".threesixty_images").hide();
		loadImage();
	};
	init();
	
	/**
	*
	*/
	$(".threesixty").live("touchstart", function (event) {
		event.preventDefault();
		pointer = pointers[1];
		dragging = true;
	});
	
	/**
	*
	*/
	$(".threesixty").live("touchmove", function (event) {
		event.preventDefault();
		trackPointer(event);
	});
	
	/**
	*
	*/
	$(".threesixty").live("touchend", function (event) {
		event.preventDefault();
		dragging = false;
	});
	
	/**
	*
	*/
	$(".threesixty").mousedown(function (event) {
		event.preventDefault();
		pointer = pointers[0];
		dragging = true;
	});
	
	$(document).mouseup(function (event){
		event.preventDefault();
		dragging = false;
	});
	/**
	*
	*/
	$(document).mousemove(function (event){	
		event.preventDefault();
		trackPointer(event);
	});
	
	
	/**
	*
	*/
	function getNormalizedCurrentFrame() {
		var c = -Math.ceil(currentFrame % (totalFrames));
		if (c < 0) c += (totalFrames - 1);
		return c;
	};
	
	/**
	*
	*/
	function hidePreviousImage() {
		frames[getNormalizedCurrentFrame()].removeClass("current-image");
		frames[getNormalizedCurrentFrame()].addClass("previous-image");
	};
	
	/**
	*
	*/
	function showCurrentImage() {
		frames[getNormalizedCurrentFrame()].removeClass("previous-image");
		frames[getNormalizedCurrentFrame()].addClass("current-image");
	};
	
	/**
	* 
	*/
	function trackPointer(event) {
		if (dragging) {
			pointerEndPosX = pointer === pointers[0] ? event.pageX : event.originalEvent.targetTouches[0].pageX;
			
			if(monitorStartTime < new Date().getTime() - monitorInt) {
				monitorStartTime = new Date().getTime();
				calculatePointerSpeed();
				refresh();
				pointerStartPosX = pointer === pointers[0] ? event.pageX : event.originalEvent.targetTouches[0].pageX;
				if(!dragging) {
					endFrame = currentFrame + Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $(".threesixty").width()) * pointerSpeed);
				} else {
					endFrame = currentFrame + Math.ceil((totalFrames - 1) * speedMultiplier * (pointerDistance / $(".threesixty").width()));
				}
			}
		}
	};
	
	/**
	*
	*/
	function calculatePointerSpeed() {
		pointerDistance = pointerEndPosX - pointerStartPosX;
		pointerSpeed = pointerDistance / monitorInt;
	};
	
	/**
	*
	*/
	function refresh () {
		if (ticker === 0) {
			ticker = self.setInterval(function () { render(); }, Math.round(1000 / 60));
		}
	};
	
	/**
	*
	*/
	function render () {
		if(currentFrame !== endFrame)
		{	
			var inertia = endFrame < currentFrame ? Math.floor((endFrame - currentFrame) * 0.1) : Math.ceil((endFrame - currentFrame) * 0.1);
			hidePreviousImage();
			currentFrame += inertia;
			showCurrentImage();
		} else {
			window.clearInterval(ticker);
			ticker = 0;
		}
	};
});