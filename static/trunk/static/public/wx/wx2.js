    var wx_share_img_url = __imgHead__ + "/img/logo3.png"
    var wx_share_title = "多美贷-实现平凡人的财富梦想！";
    var wx_share_desc = "www.duomeidai.com";
    jQuery.getScript("/index_sign.jsp?url=" + encodeURIComponent(location.href.split('#')[0]), function() {
      wx.config({
        debug: false,
        appId: wx_share_appid,
        timestamp: wx_timestamp,
        nonceStr: wx_nonceStr,
        signature: wx_signature,
        jsApiList: [
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
          'hideOptionMenu',
          'hideMenuItems'
        ]
      });
      wx.ready(function() {
        wx.onMenuShareAppMessage({
          title: wx_share_title,
          desc: wx_share_desc,
          link:__wwwHead__ +"/#/project/list",
          imgUrl: wx_share_img_url,
          trigger: function(res) {
            
          },
          success: function(res) {

          },
          cancel: function(res) {

          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        });

        wx.onMenuShareTimeline({
          title: wx_share_title,
          link: __wwwHead__ +"/#/project/list",
          imgUrl: wx_share_img_url,
          trigger: function(res) {

          },
          success: function(res) {
          },
          cancel: function(res) {
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        });

      });
      wx.error(function(res) {
        alert(res.errMsg);
      });
    });