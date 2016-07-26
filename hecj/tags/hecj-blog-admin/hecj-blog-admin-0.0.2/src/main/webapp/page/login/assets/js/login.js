    /**
     */
    $(function(){
        // 闭眼动画
        $('#password').focus(function() {
            $('#owl').find('.arm').stop().first().animate({top:'5px',left:'65px'},300).next().animate({top:'5px',left:'120px'},300);
        }).blur(function() {
            $('#owl').find('.arm').stop().first().animate({top:'40px',left:'20px'},300).next().animate({top:'40px',left:'160px'},300);
        });

        // use cookie, tooltip, overlay
        seajs.use(['bui/cookie', 'bui/tooltip' ,'bui/overlay'], function( cookie, Tooltip ){

            var username = $("#username").focus(),
                remember = $('#remember'),
                c_username = cookie.get('username');

            if( !!c_username ){
                // 如果已经记住账号
                username.val( c_username );
                remember.attr('checked',true );
            }

            // 构建3个提示
            var conf = {
                autoRender : true,
                trigger : null,
                alignType : 'right',
                offset : 10,
                title : null,
                elCls : 'tips tips-notice ',
                titleTpl : '<span class="x-icon x-icon-small x-icon-warning"><i class="icon icon-white icon-info"></i></span>\ <div class="tips-content">{title}</div>'
            };
           /* var tipsMsg = [
                { trigger : '#username', title : '测试账号：admin'},
                { trigger : '#password', title : '密码：d'},
                { trigger : '#imageCode',  title : '3257'}
            ];
            $.each( tipsMsg, function(i , n){
                $.extend( conf, n );
                new Tooltip.Tip( conf );
            });*/

            // 表单回车事件
            $('#theForm').keydown(function( e ){
                if( e.keyCode == 13 ){
                    $("#loginBtn").trigger('click');
                }
            });
            // 登录事件
            $("#loginBtn").click(function(){
                var $this = $(this);
                $.ajax({
                    url : '/doLogin',
                    type : 'POST',
                    cache : false,
                    dataType : 'json',
                    data : $("#theForm").find('input').serialize(),
                    success : function( data ){
                        if ( data.code == 200 ) {

                            // 如果选择了记住账号，账号记住于cookies
                            if( $('#remember').is(':checked') ){
                                cookie.set( 'username', $('#username').val(), 1);// 1天
                            } else {
                                cookie.remove('username');
                            }
                            // 登录成功
                            window.location = '/';
                            //BUI.Message.Alert( data.message, 'success' );
                        } else {

                            // 登录失败提示 - 改变提示样式
                            $("#noticeTip").slideUp(200, function(){
                                var $this = $(this), tip = $this.find('.tips-notice');
                                if( tip[0] ){
                                    tip.removeClass('tips-notice').addClass('tips-warning')
                                       .find('.x-icon-warning').addClass('x-icon-error')
                                       .find('.icon-volume-up').addClass('icon-bell');
                                }
                                $this.find('.tips-content').text( data.message );
                                $this.slideDown(200);
                            });
                        }
                    },
                    beforeSend : function( XHR ){

                        // 如果按钮被disabled //禁止发送
                        if ( $this.attr('disabled') ) {
                            //禁止发送
                            return false;
                        } else {
                            $this.attr('disabled', true);
                        }
                    },
                    complete : function( XHR, TS ){
                        $this.attr('disabled', false);
                    }
                });
                return false;
            });
        });


        // 拦截请求 模拟数据生成
        // 开启数据模拟 - config.js -> mock : true
        if ( seajs.data.mock ) {
            seajs.use(['mock'],function( Mock ){

                Mock.getParam = function( key, strURL ){
                    strURL = strURL || window.location.search;
                    return new RegExp( "(^|\\?|&)" + key + "=([^&]*)(\\s|&|$)", "i" ).test( strURL ) ?
                            decodeURIComponent( RegExp.$2.replace( /\+/g, " " ) ) : "";
                };

                // 登录
                Mock.mock('login', function( options ){
                    var strData = 'get' == options.type.toLowerCase() ? options.url : options.data;
                    var username = Mock.getParam('username', strData),
                        password = Mock.getParam('password', strData),
                        imageCode  = Mock.getParam('imageCode',  strData);

                    var result = { flag : true, msg : '登录成功.' };
                    if ( '3257' != captcha ) {
                        result.flag = false;
                        result.msg = '您输入的验证码错误。';
                        return result
                    }
                    if ( 'admin' != username || '123' != password ) {
                        result.flag = false;
                        result.msg = '您输入的用户名或密码错误。'
                    }
                    return result
                });
            });
        }
    });

    // 刷新验证码
    function flushImageCode(){
    	$("#validateCode").attr("src","/validateCode/imageCode?"+new Date().getTime());
    }