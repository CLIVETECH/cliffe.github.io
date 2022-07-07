/*
 SocialShare - jQuery plugin
 */
(function ($) {

    function get_class_list(elem) {
        if (elem.classList) {
            return elem.classList;
        } else {
            return $(elem).attr('class').match(/\S+/gi);
        }
    }

    $.fn.ShareLink = function (options) {
        var defaults = {
            title: '',
            text: '',
            image: '',
            url: window.location.href,
            class_prefix: 's_'
        };

        var options = $.extend({}, defaults, options);

        var class_prefix_length = options.class_prefix.length;

        var templates = {
            facebook: 'https://www.facebook.com/sharer.php?s=100&p[title]={title}&u={url}&t={title}&p[summary]={text}&p[url]={url}',
            plus: 'https://plus.google.com/share?url={url}',
            linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}&summary={text}&source={url}',
            pinterest: 'https://www.pinterest.com/pin/create/button/?media={image}&url={url}&description={text}',
            twitter: 'https://twitter.com/intent/tweet?url={url}&text={text}',
            gmail: 'http://mail.google.com/mail/?view=cm&fs=1&to=&su={title}&body={text}&ui=1',
            whatsapp: 'whatsapp://send?text={url} {title}',
            pocket: 'https://getpocket.com/edit?url={url}&title={title}',
            tumblr: 'https://tumblr.com/share?s=&v=3&t={title}&u={url}',
            google: 'http://www.google.com/bookmarks/mark?op=add&bkmk={url}&title={title}&annotation={text}',
            webnews: 'http://www.webnews.de/einstellen?url={url}&title={title}',
            wordpress: 'http://wordpress.com/wp-admin/press-this.php?u={url}&t={title}&s={text}&v=2',
            telegram: 'https://telegram.me/share/url?url={url}'
        }

        function link(network) {
            var url = templates[network];
            url = url.replace(/{url}/g, encodeURIComponent(options.url));
            url = url.replace(/{title}/g, encodeURIComponent(options.title));
            url = url.replace(/{text}/g, encodeURIComponent(options.text));
            url = url.replace(/{image}/g, encodeURIComponent(options.image));
            return url;
        }

        return this.each(function (i, elem) {
            var classlist = get_class_list(elem);
            for (var i = 0; i < classlist.length; i++) {
                var cls = classlist[i];
                if (cls.substr(0, class_prefix_length) == options.class_prefix && templates[cls.substr(class_prefix_length)]) {
                    var final_link = link(cls.substr(class_prefix_length));
                    $(elem).attr('href', final_link).click(function () {
                        if ($(this).attr('href').indexOf('http://') === -1 && $(this).attr('href').indexOf('https://') === -1) {
                            return window.open($(this).attr('href')) && false;
                        }
                        var screen_width = screen.width;
                        var screen_height = screen.height;
                        var popup_width = options.width ? options.width : (screen_width - (screen_width * 0.2));
                        var popup_height = options.height ? options.height : (screen_height - (screen_height * 0.2));
                        var left = (screen_width / 2) - (popup_width / 2);
                        var top = (screen_height / 2) - (popup_height / 2);
                        var parameters = 'toolbar=0,status=0,width=' + popup_width + ',height=' + popup_height + ',top=' + top + ',left=' + left;
                        return window.open($(this).attr('href'), '', parameters) && false;
                    });
                }
            }
        });
    }

    $.fn.ShareCounter = function (options) {
        var defaults = {
            url: window.location.href,
            class_prefix: 'c_',
            display_counter_from: 0,
            increment: false
        };

        var options = $.extend({}, defaults, options);

        var class_prefix_length = options.class_prefix.length

        var social = {
            'vk': vk,
            'myworld': myworld,
            'linkedin': linkedin,
            'odnoklassniki': odnoklassniki,
            'pinterest': pinterest,
            'plus': plus,
            'facebook': facebook
        }

        return this.each(function (i, elem) {
            var classlist = get_class_list(elem);
            for (var i = 0; i < classlist.length; i++) {
                var cls = classlist[i];
                if (cls.substr(0, class_prefix_length) == options.class_prefix && social[cls.substr(class_prefix_length)]) {
                    social[cls.substr(class_prefix_length)](options.url, function (count) {
                        count = parseInt(count);
                        if (count >= options.display_counter_from) {
                            var current_value = parseInt($(elem).text());
                            if (options.increment && !isNaN(current_value)) {
                                count += current_value;
                            }
                            $(elem).text(count);
                        }
                    })
                }
            }
        });

        function vk(url, callback) {
            if (window.VK === undefined) {
                VK = {
                    CallbackList: [],
                    Share: {
                        count: function (idx, value) {
                            VK.CallbackList[idx](value);
                        }
                    }
                }
            }

            var current_callback_index = VK.CallbackList.length;
            VK.CallbackList.push(callback);

            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://vk.com/share.php',
                data: {'act': 'count', 'index': current_callback_index, 'url': url}
            })
                    .fail(function (data, status) {
                        if (status != 'parsererror') {
                            for (i in VK.CallbackList) {
                                VK.CallbackList[i](0)
                            }
                        }
                    })
        }

        function myworld(url, callback) {
            var results = [];
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://connect.mail.ru/share_count',
                jsonp: 'func',
                data: {'url_list': url, 'callback': '1'}
            })
                    .done(function (data) {
                        callback(data[url].shares)
                    })
                    .fail(function (data) {
                        callback(0)
                    })
        }

        function linkedin(url, callback) {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://www.linkedin.com/countserv/count/share',
                data: {'url': url, 'format': 'jsonp'}
            })
                    .done(function (data) {
                        callback(data.count)
                    })
                    .fail(function () {
                        callback(0)
                    })
        }

        function odnoklassniki(url, callback) {
            if (window.ODKL === undefined) {
                ODKL = {
                    CallbackList: [],
                    updateCount: function (uid, value) {
                        ODKL.CallbackList[parseInt(uid)](value);
                    }
                }
            }

            var current_callback_index = ODKL.CallbackList.length;
            ODKL.CallbackList.push(callback);

            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://ok.ru/dk',
                data: {'st.cmd': 'extLike', 'ref': url, 'uid': current_callback_index}
            })
                    .fail(function (data, status) {
                        if (status != 'parsererror') {
                            for (i in ODKL.CallbackList) {
                                ODKL.CallbackList[i](0)
                            }
                        }
                    })
        }

        function pinterest(url, callback) {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://api.pinterest.com/v1/urls/count.json',
                data: {'url': url}
            })
                    .done(function (data) {
                        callback(data.count)
                    })
                    .fail(function () {
                        callback(0)
                    })
        }

        function plus(url, callback) {
            $.ajax({
                type: 'POST',
                url: 'https://clients6.google.com/rpc',
                processData: true,
                contentType: 'application/json',
                data: JSON.stringify({
                    'method': 'pos.plusones.get',
                    'id': location.href,
                    'params': {
                        'nolog': true,
                        'id': url,
                        'source': 'widget',
                        'userId': '@viewer',
                        'groupId': '@self'
                    },
                    'jsonrpc': '2.0',
                    'key': 'p',
                    'apiVersion': 'v1'
                })
            })
                    .done(function (data) {
                        callback(data.result.metadata.globalCounts.count)
                    })
                    .fail(function () {
                        callback(0)
                    })
        }

        function facebook(url, callback) {
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://graph.facebook.com',
                data: {'id': url}
            })
                    .done(function (data) {
                        if (data.share != undefined && data.share.share_count != undefined) {
                            callback(data.share.share_count)
                        }
                    })
                    .fail(function () {
                        callback(0)
                    })
        }
    }


    $('.pd-email-share').live('click',function(event){
        event.preventDefault();
        $('.pd_email_form').show();
        var email_share = $(this);
        var email_share_left = email_share.offset().left;
        var email_share_top = email_share.offset().top;
        var email_share_div = jQuery('.pd_email_share');
        email_share_div.show(500);
        email_share_div.css('left',email_share_left);
        email_share_div.css('top',email_share_top);
        jQuery('#pdPostId').val(email_share.attr('data-id'));
        jQuery('#pdShortcodeId').val(email_share.attr('data-shortcode-id'));
        $('.pd_email_sucess').html('');
        $('.pd_email_sucess').hide();
    });

    $('.pd-close,.pd-close_button').live('click',function(){
        $(this).closest('.pd_email_share').hide(500);
    });

    $('#pdEmailShareForm').live('submit',function(event){
        event.preventDefault();
        var cur_page = portdesigner_front_translations.current_page;
        var cur_id = portdesigner_front_translations.current_id;
        var pd_email_share_form = jQuery(this).serialize()+"&cur_page="+cur_page+"&cur_id="+cur_id;
        $.ajax({
            type: 'post',
            url: portdesigner_script_ajax.ajaxurl,
            data: pd_email_share_form,
            success: function(data) {
                $('.pd_email_sucess').show();
                if(data == 'sent') {
                    $('#pdToEmail').val('');
                    $('#pdYourName').val('');
                    $('#pdYourEmail').val('');
                    $('.pd_email_form').hide();
                    $('.pd_email_sucess').html(portdesigner_front_translations.pd_shared);
                } else {
                    $('.pd_email_sucess').html('<font color="#ff0000">'+ portdesigner_front_translations.pd_error +'</font>');
                }
            }
        });
    });


})(jQuery);