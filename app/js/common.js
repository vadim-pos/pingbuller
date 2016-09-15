'use strict';

var mainNavigation = (function() {
	var navigation = document.body.querySelector('.navigation'),
		trigger    = navigation.querySelector('.navigation__trigger');

	function _setupListeners() {
		trigger.addEventListener('click', function(e) {
			e.preventDefault();
			if (navigation.classList.contains('navigation--active')) {
				navigation.classList.remove('navigation--active');
				trigger.classList.remove('navigation__trigger--active');
			} else {
				navigation.classList.add('navigation--active');
				trigger.classList.add('navigation__trigger--active');
			}
		});
		navigation.addEventListener('mouseleave', function() {
			navigation.classList.remove('navigation--active');
			trigger.classList.remove('navigation__trigger--active');
		});
	}
	function init() {
		_setupListeners();
	}
	return {init: init};
}());

if (document.body.querySelector('.navigation')) {
	mainNavigation.init();
}

// -------------------- Slider --------------------
function Slider(options) {
	var _self = this;
	//DOM Nodes
	var sliderNode     = document.body.querySelector(options.selector),
		slidesWrap     = sliderNode.querySelector('.slider__wrap'),
		slides         = slidesWrap.querySelector('.slider__slides'),
		prevSlideLink  = sliderNode.querySelector('.slider__prev'),
		nextSlideLink  = sliderNode.querySelector('.slider__next'),
		pagination     = sliderNode.querySelector('.slider__pagination');
	// Other variables
	var currentSlideIndex = options.currentSlide || 0,
		slideDuration     = options.duration || 0.3,
		slidesCount       = slides.children.length,
		slideSize         = slidesWrap[(options.slideStyle === 'vertical') ? 'offsetHeight' : 'offsetWidth'],
		autoSlideDelay    = options.delay || 6000,
		timer;
		
	this.prevSlide = function() {
		if (currentSlideIndex === 0) {
			currentSlideIndex = slidesCount - 1;
			return;
		}
		currentSlideIndex--;	
	};

	this.nextSlide = function() {
		if (currentSlideIndex === slidesCount - 1) {
			currentSlideIndex = 0;
			return;
		}
		currentSlideIndex++;
	};

	this.createPagination = function() {
		var fragment = document.createDocumentFragment();

		for (var i = 0; i < slidesCount; i++) {
			var pagItem = document.createElement('li');
			pagItem.classList.add(options.pagItemClass);

			var pagLink = document.createElement('a');
			pagLink.classList.add(options.pagLinkClass);
			pagLink.setAttribute('data-slide', i);

			pagItem.appendChild(pagLink);
			fragment.appendChild(pagItem);
		}
		pagination.appendChild(fragment);
		pagination.children[currentSlideIndex].querySelector('a').classList.add('active');
	};

	this.render = function() {
		var margin = (options.slideStyle === 'vertical') ? 'marginTop' : 'marginLeft';
		slides.style[margin] = (-currentSlideIndex * slideSize) + 'px';
		pagination.querySelector('.active').classList.remove('active');
		pagination.children[currentSlideIndex].querySelector('a').classList.add('active');
	};

	this.setupListeners = function() {
		if (prevSlideLink) {
			prevSlideLink.addEventListener('click', function (e) {
				e.preventDefault();
				_self.prevSlide();
				_self.render();
				clearInterval(timer);
			});
		}
		if (nextSlideLink) {
			nextSlideLink.addEventListener('click', function (e) {
				e.preventDefault();
				_self.nextSlide();
				_self.render();
				clearInterval(timer);
			});
		}
		pagination.addEventListener('click', function(e) {
			e.preventDefault();
			var target = e.target;
			if (target.tagName !== 'A') { return; }

			clearInterval(timer);
			currentSlideIndex = +target.dataset.slide;
			_self.render();	
		});
		window.addEventListener('resize', function (argument) {
			slideSize = slidesWrap[(options.slideStyle === 'vertical') ? 'offsetHeight' : 'offsetWidth'];
			_self.render();
		});		
	};

	this.autoSlide = function() {
		timer = setInterval(function() {
			_self.nextSlide();
			_self.render();	
		}, autoSlideDelay);
	}
	
	this.init = function() {
		slides.style.transition = 'margin ' + slideDuration + 's' + ' linear';
		this.createPagination();
		if (options.slideStyle === 'vertical') {
			slides.style.whiteSpace = 'normal';
		}
		this.setupListeners();
		this.render();
		this.autoSlide();
	}

	this.init();
}

var mainSlider = new Slider({
	selector: '.main-slider',
	pagItemClass: 'main-slider__dot',
	pagLinkClass: 'main-slider__dot-link',
	slideStyle: 'vertical',
	duration: 0.4
});
var testimonialsSlider = new Slider({
	selector: '.testimonials',
	pagItemClass: 'testimonials__nav-item',
	pagLinkClass: 'testimonials__nav-link',
	slideStyle: 'horizontal',
	duration: 0.4
});

// -------------------- Scroll --------------------
var scrollModule = (function() {
	var body           = document.body,
		animationTime  = 900,
		navNodes       = body.querySelectorAll('nav');

		function scrollTo(targetNode) {
			var currentPosition = pageYOffset,
				targetTop       = targetNode.getBoundingClientRect().top + pageYOffset,
				distance        = (targetTop > currentPosition) ? (targetTop - currentPosition) : (currentPosition - targetTop),
				speed           = Math.round(distance / 100),
				step 			= Math.round(distance / 50),
				timer           = 0,

				leapY = (targetTop > currentPosition) ? (currentPosition + step) : (currentPosition - step);
			
			if (targetTop > currentPosition) {
				for ( var i=currentPosition; i<targetTop; i+=step ) {
					setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
					leapY += step; if (leapY > targetTop) leapY = targetTop; timer++;
				} return;
			}
			for ( var i=currentPosition; i>targetTop; i-=step ) {
				setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
				leapY -= step; if (leapY < targetTop) leapY = targetTop; timer++;
			}
		}

		function setupListeners() {
			for (var i = navNodes.length - 1; i >= 0; i--) {

				navNodes[i].addEventListener('click', function(e) {
					e.preventDefault();
					if (!e.target.dataset.dest) { return; }

					var targetString = e.target.dataset.dest,
						targetNode   = body.querySelector('.' + targetString);
					scrollTo(targetNode);
				});
			}
		}

		function init() {
			setupListeners();
		}

		return {init: init};
}());

scrollModule.init();