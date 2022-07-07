jQuery(window).load(function () {
    portfolioJustifyLayout();
});

jQuery(document).ready(function () {

    jQuery('.portdesign-meta-fields p').each(function () {
        var classname = jQuery(this).attr('class');
        var maxHeight = Math.max.apply(null, jQuery("." + classname).map(function () {
            return jQuery(this).height();
        }).get());
        jQuery("." + classname + " span").height(maxHeight);
    });

    // For isotopes
    if (jQuery('.portfolio_filter_gallery').length > 0) {
        var layoutMode = '';
        if(jQuery('.portfolio_gallery').hasClass('portfolio_gallery_masonary')){
            layoutMode = 'masonry';
        }else{
            layoutMode = 'fitRows';
        }
        jQuery('.portfolio_filter_class .portfolio_gallery').isotope({
            itemSelector: '.portfolio_single_wrapp',
            layoutMode: layoutMode,
            containerStyle: {
                position: 'relative',
                overflow: 'visible'
            },
            getSortData: {
                category: '[data-slug]'
            }
        });
        jQuery('.portfolio_filter_gallery_ul').on('click', 'li', function () {
            jQuery('.portfolio_filter_gallery_ul li a').removeClass('portfolio_gallery_selected');
            jQuery(this).children('a').addClass('portfolio_gallery_selected');
            var filterValue = jQuery(this).attr('data-filter');
            
            if(jQuery(this).closest('.portfolio_filter_class').find('.portfolio_gallery').hasClass('justified-gallery')) {
                jQuery(".justified-gallery").justifiedGallery({ filter: filterValue});
            }
            else {
                jQuery(this).closest('.portfolio_filter_class').find('.portfolio_gallery').isotope({filter: filterValue});
            }
        });
    }

    if (jQuery('.portfolio_gallery_masonary').length > 0) {
        jQuery('.portfolio_gallery_masonary').imagesLoaded().done(function(){
            jQuery('.portfolio_gallery_masonary').masonry({
                itemSelector: '.portfolio_single_wrapp',
                animate: true,
                animationOptions: {
                    duration: 700,
                    queue: true
                }
            });
            jQuery('.portfolio_gallery_masonary').masonry('reload').masonry('layout');
        });
    }

    // Fancybox Setup
    jQuery('.portfolio_single_wrapp a.port_fancybox').on('click', function () {
        var rel = jQuery(this).attr('rel');
        jQuery('.portfolio_single_wrapp a[rel=' + rel + ']').fancybox({
        //    type: 'iframe',
//            href: this.href,
            helpers: {
                title: {type: 'over'},
                overlay: {showEarly: false}
            },
            'fitToView' : true,
            'autoScale' : true,
            onComplete : function() {
                alert('ddddd');
            }
        });
//        return false;
    });

    // Single Page Fancybox Setup
    jQuery('.portdesign-single .post-thumbnail a.port_fancybox').on('click', function () {
        var rel = jQuery(this).attr('rel');
        jQuery('.portdesign-single .post-thumbnail a[rel=' + rel + ']').fancybox({
            helpers: {
                title: {type: 'over'},
                overlay: {showEarly: false}
            }
        });
    });

    // Related Post Fancybox Setup
    jQuery('.portdesign_related_post a.port_fancybox').on('click', function () {
        var rel = jQuery(this).attr('rel');
        jQuery('.portdesign_related_post a[rel=' + rel + ']').fancybox({
            helpers: {
                title: {type: 'over'},
                overlay: {showEarly: false}
            }
        });
    });

    var paged = parseInt(jQuery('#portdesign-load-more-hidden #portdesign_paged').val());
    var max_num_pages = parseInt(jQuery('#portdesign-load-more-hidden #portdesign_max_num_pages').val());
    if (paged >= max_num_pages) {
        jQuery('.portdesign_loadmore').remove();
        jQuery('.portdesign-load-more-btn').hide();
        jQuery('.portfolio_loader').hide();
    }

    //For load more functionality
    jQuery(".portdesign-load-more-btn").on('click', function () {
        var shortcode_id = jQuery(this).parent().attr("data-shortcode-id");

        if(shortcode_id != '' && shortcode_id != undefined) {
            parent_class = ".portfolio_designer_id_"+shortcode_id+" ";
        }
        var paged = parseInt(jQuery(parent_class + '#portdesign-load-more-hidden #portdesign_paged').val());
        var max_num_pages = parseInt(jQuery(parent_class + '#portdesign-load-more-hidden #portdesign_max_num_pages').val());
        jQuery(parent_class + '.portdesign-load-more-btn').fadeOut();
        jQuery(parent_class + '.portfolio_loader').fadeIn();

        paged = paged + 1;
        if (paged <= max_num_pages) {
            jQuery.ajax({
                type: 'POST',
                url: portdesigner_script_ajax.ajaxurl,
                data: 'action=portdesign_get_loadmore&' + jQuery(parent_class + '#portdesign-load-more-hidden').serialize(),
                async: false,
                success: function (response) {
                    jQuery(parent_class + ".portfolio_gallery").append(response);

                    if (jQuery(parent_class + '.portfolio_gallery_masonary').length > 0) {
                        jQuery(parent_class + '.portfolio_gallery_masonary').imagesLoaded().done(function(){
                            jQuery(parent_class + '.portfolio_gallery_masonary').masonry({
                                itemSelector: '.portfolio_single_wrapp',
                                animate: true,
                                animationOptions: {
                                    duration: 700,
                                    queue: true
                                }
                            });
                            jQuery(parent_class + '.portfolio_gallery_masonary').masonry('reload').masonry('layout');
                        });
                    }

                    if (jQuery(parent_class + '.portfolio_single_wrapp').hasClass('left_side') || jQuery(parent_class + '.portfolio_single_wrapp').hasClass('right_side')) {
                        jQuery(parent_class + '.portfolio_gallery').imagesLoaded().done(function(){
                            portfolioImageContentHeight();
                        });
                    }

                    jQuery(parent_class + '.portfolio_single_wrapp a.port_fancybox').on('click', function () {
                        var rel = jQuery(this).attr('rel');
                        jQuery('.portfolio_single_wrapp a[rel=' + rel + ']').fancybox({
                            helpers: {
                                title: {type: 'over'},
                                overlay: {showEarly: false}
                            }
                        });
                    });

                    jQuery(parent_class + '#portdesign-load-more-hidden #portdesign_paged').val(paged);
                    if (paged == max_num_pages || paged >= max_num_pages) {
                        jQuery(parent_class + '.portdesign-load-more-btn').hide();
                        jQuery(parent_class + '.portfolio_loader').hide();
                    } else {
                        jQuery(parent_class + '.portdesign-load-more-btn').fadeIn();
                        jQuery(parent_class + '.portfolio_loader').fadeOut();
                    }
                    portfolioJustifyLayout();
                }
            });
        } else {
            jQuery(parent_class + '.portdesign-load-more-btn').hide();
            jQuery(parent_class + '.portfolio_loader').hide();
            jQuery(parent_class + '.portdesign_loadmore').remove();
        }
    });

    jQuery(window).scroll(function () {
        clearTimeout(jQuery.data(this, 'scrollTimer'));
        jQuery.data(this, 'scrollTimer', setTimeout(function () {
            jQuery('.portdesign_autoload .portdesign-load-more-btn').trigger('click');
        }, 250));
    });
    //Add to cart button click
    jQuery('.add_to_cart_button.ajax_add_to_cart').on('click', function () {
        var addtocart = jQuery(this);
        window.setTimeout(function(){
            if(addtocart.hasClass('added')){
               addtocart.find('.fa.fa-shopping-cart').addClass('fa-cart-plus');
               addtocart.find('.fa.fa-cart-plus').removeClass('fa-shopping-cart');
            }
        }, 1000);
    });


    // whatsapp share only in mobile
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    if (!isMobile.any()) {
        jQuery('.social-component .pd-whatsapp-share, .social-component .whatsapp-share').remove();
    }
    jQuery(document).on("click", '.pd-whatsapp-share, .whatsapp-share', function () {
        if (isMobile.any()) {

            var text = jQuery(this).attr("data-text");
            var url = jQuery(this).attr("data-link");
            var message = encodeURIComponent(text) + " - " + encodeURIComponent(url);
            var whatsapp_url = "whatsapp://send?text=" + message;
            window.location.href = whatsapp_url;
        } else {
            alert(portdesigner_front_translations.whatsapp_mobile_alert);
        }
    });
    portfolioImageContentHeight();

});

jQuery(document).resize(function () {

    // For isotpes
    if (jQuery('.portfolio_filter_gallery').length > 0) {
        var layoutMode = '';
        if(jQuery('.portfolio_gallery').hasClass('portfolio_gallery_masonary')){
            layoutMode = 'masonry';
        }else{
            layoutMode = 'fitRows';
        }
        jQuery('.portfolio_filter_class .portfolio_gallery').isotope({
            itemSelector: '.portfolio_single_wrapp',
            layoutMode: layoutMode,
            containerStyle: {
                position: 'relative',
                overflow: 'visible'
            },
            getSortData: {
                category: '[data-slug]'
            }
        });
    }

    if (jQuery('.portfolio_gallery_masonary').length > 0) {
        jQuery('.portfolio_gallery_masonary').imagesLoaded().done(function(){
            jQuery('.portfolio_gallery_masonary').masonry({
                itemSelector: '.portfolio_single_wrapp',
                animate: true,
                animationOptions: {
                    duration: 700,
                    queue: true
                }
            });
        });
    }
});

jQuery(window).load(function () {
    // For isotpes
    if (jQuery('.portfolio_filter_gallery').length > 0) {
        var layoutMode = '';
        if(jQuery('.portfolio_gallery').hasClass('portfolio_gallery_masonary')){
            layoutMode = 'masonry';
        }else{
            layoutMode = 'fitRows';
        }
        jQuery('.portfolio_filter_class .portfolio_gallery').isotope({
            itemSelector: '.portfolio_single_wrapp',
            layoutMode: layoutMode,
            containerStyle: {
                position: 'relative',
                overflow: 'visible'
            },
            getSortData: {
                category: '[data-slug]'
            }
        });
    }
    if (jQuery('.portfolio_gallery_masonary').length > 0) {
        jQuery('.portfolio_gallery_masonary').imagesLoaded().done(function(){
            jQuery('.portfolio_gallery_masonary').masonry({
                itemSelector: '.portfolio_single_wrapp',
                animate: true,
                animationOptions: {
                    duration: 700,
                    queue: true
                }
            });
            jQuery('.portfolio_gallery_masonary').masonry('reload').masonry('layout');
        });
    }
    jQuery('.portfolio_gallery').imagesLoaded().done(function(){
        portfolioImageContentHeight();
    });    
});

function portfolioImageContentHeight() {

    if(jQuery('.portfolio_gallery').hasClass('column-layout-1')) {
        jQuery('.portfolio_single_wrapp').each(function() {
            var height = jQuery('.mask-wrapper').height();
            jQuery('.mask-contents').css('min-height', height);
            jQuery('.mask-contents-wrapp').css('max-height', height);
        });
    } else {
        jQuery('.portfolio_single_wrapp').each(function() {
            if (jQuery(this).hasClass('left_side') || jQuery(this).hasClass('right_side')) {
                var height = jQuery(this).find('.mask-wrapper').outerHeight();
                jQuery(this).find('.mask-contents').css('min-height', height);
                jQuery(this).find('.mask-contents-wrapp').css('max-height', height);
            }
        });

    }

}
function portfolioJustifyLayout(){
    jQuery(".portfolio_gallery.justified-gallery").each(function(){
        var id = jQuery(this).attr('data-layout-id');
        var margin = jQuery(this).attr('data-layoutjustifyspace');
        var rowHeight = jQuery(this).attr('data-justifyheight');
        if(typeof id === 'undefined') {
            id = 0;
        }
        jQuery(".portfolio_designer_id_"+id+" .justified-gallery").justifiedGallery({
            rowHeight : rowHeight,
            lastRow : 'nojustify',
            imgSelector  : '> div a img',
            margins : margin,
            sizeRangeSuffixes: {
                100 : '_t', // used with images which are less than 100px on the longest side
                240 : '_m', // used with images which are between 100px and 240px on the longest side
                320 : '_n', // ...
                500 : '',
                640 : '_z',
                1024 : '_b' // used which images that are more than 640px on the longest side
            }
        });
    });

}
