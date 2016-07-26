    var wx_share_img_url = "http://dev.static.duomeidai.com/redenvelope/img/wx120.jpg"
    var wx_share_title = "多美贷给我一个会长大的红包，戳戳就会变大，最高1000元~";
    var wx_share_desc = "【多美贷】给你发红包了,好友越多，红包越大，最高1000元，这里的红包会长大!";
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
      }
    }

    function clocseWin() {


      WeixinJSBridge.invoke('closeWindow', {}, function(res) {

        //alert(res.err_msg);
        return false;

      });
    }


    function onBridgeReady(f) {
      WeixinJSBridge.call(f);
    }

    function hideNav(f) {

      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady(f);
      }
    }
    hideNav('showToolbar');

    function getNet() {

      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        WeixinJSBridge.invoke('getNetworkType', {},
          function(e) {
            //alert(e.err_msg);
          });
      }
    }

    function getTitle() {
      $.ajax({
        url: "/p/red/envelope/-1",
        success: function(res) {
          //console.log(res);
          if (res) {
            res = eval('(' + res + ')');
            var amount = res.data.e.amount;
            var need = res.data.e.next_receive_level_red - res.data.e.amount;
            if (res.data.p.nick != "") {
              wx_share_title = "“" + res.data.p.nick + "”已经拿到了" + amount + "元红包，还差" + need + "元就可以领取了。";
            }
          }
          return wx_share_title;
        }
      });
    }


    function sendMessage() {

      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', sendMessage, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', sendMessage);
        document.attachEvent('onWeixinJSBridgeReady', sendMessage);
      }

      WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        // alert(2);
        $.ajax({
          url: "/p/red/envelope/-1",
          success: function(res) {
            //console.log(res);
            if (res) {
              res = eval('(' + res + ')');
              var amount = res.data.e.amount;
              var need = res.data.e.next_receive_level_red - res.data.e.amount;
              need = need.toFixed(2);
              if(res.data.p.busId==""){
                res.data.p.busId=-1;
              }
              if (res.data.p.nick != "") {
                wx_share_desc = "我是【"+res.data.p.nick+"】，已经戳到了" + amount + "元红包，还差" + need + "元就可以领取了，求戳求帮我~"
              }
              if(res.data.bus.busName!=''){
                wx_share_title=res.data.bus.busName+"和多美贷给我一个会长大的红包，戳戳就会变大，最高1000元~";
              }
            }
            WeixinJSBridge.invoke('sendAppMessage', {

              "appid": wx_share_appid, //appid ÉèÖÃ¿Õ¾ÍºÃÁË¡£
              "img_url": wx_share_img_url, //·ÖÏíÊ±Ëù´øµÄÍ¼Æ¬Â·¾¶
              "img_width": "120", //Í¼Æ¬¿í¶È
              "img_height": "120", //Í¼Æ¬¸ß¶È
              "link": wx_share_url+"/"+res.data.p.busId, //·ÖÏí¸½´øÁ´½ÓµØÖ·
              "desc": wx_share_desc, //·ÖÏíÄÚÈÝ½éÉÜ
              "title": wx_share_title
            }, function(res) {
              //alert(res);
              /*** »Øµ÷º¯Êý£¬×îºÃÉèÖÃÎª¿Õ ***/

            });
          }
        });

      });



      WeixinJSBridge.on('menu:share:timeline', function(argv) {
        $.ajax({
          url: "/p/red/envelope/-1",
          success: function(res) {
            //console.log(res);
            if (res) {
              res = eval('(' + res + ')');
              var amount = res.data.e.amount;
              var need = res.data.e.next_receive_level_red - res.data.e.amount;
              need = need.toFixed(2);
              if(res.data.p.busId==""){
                res.data.p.busId=-1;
              }
              if (res.data.p.nick != "") {
                wx_share_desc = "我是【"+res.data.p.nick+"】，已经戳到了" + amount + "元红包，还差" + need + "元就可以领取了，求戳求帮我~"
              }
              if(res.data.bus.busName!=''){
                wx_share_title=res.data.bus.busName+"和多美贷给我一个会长大的红包，戳戳就会变大，最高1000元~";
              }
            }
            WeixinJSBridge.invoke('shareTimeline', {
              "appid": wx_share_appid, //appid ÉèÖÃ¿Õ¾ÍºÃÁË¡£
              "img_url": wx_share_img_url, //·ÖÏíÊ±Ëù´øµÄÍ¼Æ¬Â·¾¶
              "img_width": "120", //Í¼Æ¬¿í¶È
              "img_height": "120", //Í¼Æ¬¸ß¶È
              "link": wx_share_url+"/"+res.data.p.busId, //·ÖÏí¸½´øÁ´½ÓµØÖ·
              "desc": wx_share_desc, //·ÖÏíÄÚÈÝ½éÉÜ
              "title": wx_share_title
            }, function(res) {
              //alert(res);
              /*** »Øµ÷º¯Êý£¬×îºÃÉèÖÃÎª¿Õ ***/
            });
          }
        });

      });



      WeixinJSBridge.on('menu:share:weibo', function(argv) {
        $.ajax({
          url: "/p/red/envelope/-1",
          success: function(res) {
            //console.log(res);
            if (res) {
              res = eval('(' + res + ')');
              var amount = res.data.e.amount;
              var need = res.data.e.next_receive_level_red - res.data.e.amount;
              need = need.toFixed(2);
              if(res.data.p.busId==""){
                res.data.p.busId=-1;
              }
              if (res.data.p.nick != "") {
                wx_share_desc = "我是【"+res.data.p.nick+"】，已经戳到了" + amount + "元红包，还差" + need + "元就可以领取了，求戳求帮我~"
              }
              if(res.data.bus.busName!=''){
                wx_share_title=res.data.bus.busName+"和多美贷给我一个会长大的红包，戳戳就会变大，最高1000元~";
              }
            }
            WeixinJSBridge.invoke('shareWeibo', {
              "content": "" + "'" + wx_share_title + "'" + " " + wx_share_url+"/"+res.data.p.busId,
              "url": "" + wx_share_url+"/"+res.data.p.busId
            }, function(res) {
              //  alert(res);
            });
          }
        });

      });



    }

    sendMessage();