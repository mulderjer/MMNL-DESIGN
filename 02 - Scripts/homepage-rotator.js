    (function () {
        "use strict";

        $(document).ready(function () {
            /////////// EDIT HERE ///////////
            var slides = [
				{
                    title: "Cadeau collectie",
                    link: "https://www.mediamarkt.nl/nl/shop/kerstcadeau.html",
                    imgDesktop: "{{MEDIA_REF_cadeauDesktop}}",
                    imgMobile: "{{MEDIA_REF_cadeauMobile}}"
                },
				{
                    title: "Dyson Airwrap en Dyson Supersonic",
                    link: "https://www.mediamarkt.nl/nl/search.html?query=1671448||1671449&searchProfile=onlineshop&channel=mmnlnl&campaign=true",
                    imgDesktop: "{{MEDIA_REF_dysonDesktop}}",
                    imgMobile: "{{MEDIA_REF_dysonMobile}}"
                },
				{
                    title: "Oral-B elektrische tandenborstels",
                    link: "https://www.mediamarkt.nl/nl/search.html?query=1659063||1659064&searchProfile=onlineshop&channel=mmnlnl&campagne=true",
                    imgDesktop: "{{MEDIA_REF_oralbDesktop}}",
                    imgMobile: "{{MEDIA_REF_oralbMobile}}"
                },
				{
                    title: "Tv-kalibratie",
                    link: "https://www.mediamarkt.nl/nl/shop/service-tv-kalibreren.html",
                    imgDesktop: "{{MEDIA_REF_kalibratieDesktop}}",
                    imgMobile: "{{MEDIA_REF_kalibratieMobile}}"
                },
            ];
            /////////// DON'T EDIT BELOW ///////////

            // time each slide is visible
            var intervalTime = 8000;

            // fade time on animation
            var fadeTime = 500;

            // fade time when clicking tab
            var fadeTimeFast = 200;

            var slideAnimator, channel = $('#wrapper-main').length > 0 ? 'MOBILE' : 'DESKTOP';
            var mySwiper = null;
            var swiperInterval = null;
            var swiperCssInit = false;
            
            var imgSizeBase = channel === 'DESKTOP' ? { width: 1188, height: 370 } : { width: 640, height: 320 };
            var imgRatio = imgSizeBase.width / imgSizeBase.height;
            
            var breakPoints = {
                tabletWide: {
                    breakPoint: 1199,
                    rotatorWidth: 948,
                    rotatorHeight: 295
                },
                tabletNarrow: {
                    breakPoint: 954,
                    rotatorWidth: 708,
                    rotatorHeight: 221
                },
                mobile: {
                    breakPoint: 739
                }
            };

            // create slides
            $(slides).each(function (i) {
                var img = channel === 'DESKTOP' ? slides[i].imgDesktop : slides[i].imgMobile;
                var slideClasses = i === 0 ? 'slide swiper-slide active' : 'slide swiper-slide';
                var tabClasses = i === 0 ? 'tab active' : 'tab';

                $('<div class="' + slideClasses + '"><a href="' + slides[i].link + '" data-title="' + slides[i].title + '"><img src="' + img + '" alt="' + slides[i].title + '" /></a></div>').appendTo('.slider .slides');
                $('<a href="#" title="' + slides[i].title + '" class="' + tabClasses + '">' + slides[i].title + '</a>').appendTo('.slider .tabs .inner');
            });

            // handle slide clicks
            $('.slider .slide a').click(function (e) {
                e.preventDefault();

                var activeSlide = $('.slider .swiper-slide-active').length > 0 ? $('.slider .swiper-slide-active a') : $('.slider .slide.active a');

                dataLayer.push({ event: 'gaEvent', eventCategory: 'Product and Teaser Clicks', eventAction: 'Rotator', eventLabel: activeSlide.data('title').trim() });
                window.location = activeSlide.attr('href');
            });

            // handle tab clicks
            $('.slider .tabs a').click(function (e) {
                e.preventDefault();

                if (slideAnimator) {
                    clearInterval(slideAnimator);
                }

                var nextSlideNmbr = $(this).index();
                switchSlides(nextSlideNmbr, fadeTimeFast);

                if (mySwiper !== null) {
                    var thisSwiper = document.querySelector('.swiper-container:first-of-type').swiper;
                    thisSwiper.slideTo(nextSlideNmbr);
                    $('.slider .tabs a').removeClass('active');
                    $('.slider .tabs a').eq(nextSlideNmbr).addClass('active');
                }

                dataLayer.push({ event: 'gaEvent', eventCategory: 'Product and Teaser Clicks', eventAction: 'Stage name', eventLabel: $(this).text().trim() });
            });
            
            if ($('.slider .slide').length > 0) {
                if (channel === 'DESKTOP') {
                    // animate slides
                    slideAnimator = setInterval(animateSlides, intervalTime);
                } else {
                    // set up swiper
                    var swiperCss = '/static/assets/css/swiper.css';
                    var swiperJs = '/static/assets/js/swiper.min.js';

                    $.ajax({
                        url: swiperCss,
                        cache: true,
                        success: function () {
                            if (!swiperCssInit) {
                                $('<link rel="stylesheet" href="' + swiperCss + '">').appendTo('head');
                                swiperCssInit = true;
                            }
                        }
                    });

                    $.ajax({
                        url: swiperJs,
                        dataType: 'script',
                        cache: true,
                        success: function () {
                            if (mySwiper !== null) {
                                mySwiper.destroy();
                            }

                            // init new swiper
                            mySwiper = new Swiper('.swiper-container:first-of-type', {
                                autoplay: false,
                                spaceBetween: 15,
                                pagination: {
                                    el: '.swiper-pagination',
                                    type: 'bullets',
                                    clickable: true
                                },
                                on: {
                                    init: function () {
                                        // swiperInterval = setupInterval(mySwiper);
                                        waitForElement('.slider .tabs .swiper-pagination-bullet', function () {
                                            // handle bullet clicks
                                            $('.slider .tabs .swiper-pagination-bullet').click(function () {
                                                dataLayer.push({ event: 'gaEvent', eventCategory: 'Product and Teaser Clicks', eventAction: 'Stage name', eventLabel: $('.slider .slide').eq($(this).index()).find('a').data('title').trim() });
                                            });
                                        });
                                    }
                                }
                            })[0];

                            // mySwiper.on('slideChange', function () {
                            //     // var index = mySwiper.activeIndex;
                            //     // $('.slider .tabs a').removeClass('active');
                            //     // $('.slider .tabs a').eq(index).addClass('active');
                            // });

                            // mySwiper.on('touchStart touchMove', function () {
                            //     clearInterval(swiperInterval);

                            //     swiperInterval = setupInterval(mySwiper);

                            //     mySwiper.pagination.update();
                            // });

                            // mySwiper.update();
                        }
                    });
                }
            }

            setLayout();

            window.addEventListener('resize', setLayout);
            window.addEventListener('orientationchange', setLayout);

            function setLayout() {
                var windowWidth = document.documentElement.clientWidth;
                var slides = document.querySelector('.slider .slides');
                var imgFluidWidth = slides.clientWidth;
                var imgFluidHeight = Math.round(imgFluidWidth / imgRatio);

                if (windowWidth <= breakPoints.mobile.breakPoint || channel === 'MOBILE') {
                    slides.style.height = imgFluidHeight + "px";
                } else if (windowWidth <= breakPoints.tabletNarrow.breakPoint) {
                    slides.style.height = breakPoints.tabletNarrow.rotatorHeight + "px";
                } else if (windowWidth <= breakPoints.tabletWide.breakPoint) {
                    slides.style.height = breakPoints.tabletWide.rotatorHeight + "px";
                } else {
                    slides.style.height = imgSizeBase.height + "px";
                }

                refreshLayout();
            }

            function refreshLayout() {
                if (mcs.jQuery) {
                    mcs.jQuery(document).trigger("fee.fgrid_refresh");
                }
            }

            // loop swiper
            function setupInterval(mySwiper) {
                return setInterval(function () {
                    if (mySwiper.isEnd) {
                        mySwiper.slideTo(0);
                    }

                    else {
                        mySwiper.slideNext(fadeTime);
                    }
                }, intervalTime);
            }

            function switchSlides(nextSlideNmbr, fadeTime) {
                // change state of tabs
                $('.slider .tabs a').removeClass('active');
                $('.slider .tabs a').eq(nextSlideNmbr).addClass('active');

                // fade out active slide, fade in new slide
                $('.slider .slide.active').stop().animate({ 'opacity': 0 }, fadeTime, 'linear');

                var slideElms = $('.slider .slide');
                slideElms.eq(nextSlideNmbr).stop().animate({ 'opacity': 1 }, fadeTime, 'linear', function () {
                    slideElms.removeClass('active');
                    slideElms.eq(nextSlideNmbr).addClass('active');
                });
            }

            function animateSlides() {
                var nextSlideNmbr = ($('.slider .slide.active').index() + 1) === $('.slider .slide').length ? 0 : $('.slider .slide.active').index() + 1;
                switchSlides(nextSlideNmbr, fadeTime);
            }

            function waitForElement(selector, callback) {
                if (document.querySelectorAll(selector).length > 0) {
                    callback(selector);
                }

                else {
                    var polling = setInterval(function () {
                        if (document.querySelectorAll(selector).length > 0) {
                            clearInterval(polling);
                            callback(selector);
                        }
                    }, 20);
                }
            }
        });
    })();
