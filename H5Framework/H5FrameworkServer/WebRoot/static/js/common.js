
// 发送命令
function sendCommand(command, data, callback) {
	data = data || {};
	data.t = new Date().getTime();
	connectH5Bridge(function (currentBradge) {
        currentBradge.call(command, data, callback);
    });
}

//设置在app中上传图片时的处理
function imageUploadForm(url, file, fileName, callback) {
	sendCommand("upload_image",{url: url, file:file,fileName:fileName}, callback);
}

// 连接Native程序的方法
function connectH5Bridge(callback) {
    if (window.H5Bridge) {
        callback(window.H5Bridge);
    } else {
        document.addEventListener('H5BridgeReady', function () {
            callback(window.H5Bridge);
        }, false);
    }
}


var H5 = H5 || {};

H5.util={//基本工具
		isMobile:function () {//是否是移动端
		    if (/Android|webOS|iPhone|iPod|BlackBerry|iPad/i.test(navigator.userAgent)) {
		        return true;
		    }
		    return false;
		},
				isAndroid:function () {//是否是android
		    if (/Android/i.test(navigator.userAgent)) {
		        return true;
		    }
		    return false;
		},
		isIos:function () {//是否是ios
		    if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
		        return true;
		    }
		    return false;
		},
		
		//拼接参数
		obj2parm:function(obj){
			var ss=[];
			for(var i in obj){
				ss.push(i+"="+obj[i]);
			}
			return ss.join("&");
		},
		time:{
			format:function(d,f){
				if(f=="short") {f="yyyy-MM-dd";}
				f=f||"yyyy-MM-dd hh:mm:ss";
				return new Date(d).format(f);
			},
			getYMD:function(d){
				return this.format(d).split(" ")[0];
			},
			getHMS:function(d){
				var dz=this.format(d).split(" ");
				return (dz.length>1)?dz[1]:"";
			}
		},
		browser:{
			//浏览器代理特征
			userAgent:function(){ 
				return navigator.userAgent.toLowerCase(); 
			},
			h5App:function(){//是否是app
				var ua = H5.util.browser.userAgent();
			    if(ua.match(/h5app/i) == 'h5app'){
			        return true;
			    }else{
			        return false;
			    }
			},
			isH5Android:function(){//是否app android
				var ua = H5.util.browser.userAgent();
				if(H5.util.browser.h5App()){
					if(ua.match(/android/i) == 'android'){
				        return true;
				    }else{
				        return false;
				    }
				}
			   
			},
			isH5Ios:function(){//是否是app ios
				var ua = H5.util.browser.userAgent();
				if(H5.util.browser.h5App()){
					if(ua.match(/ios/i) == 'ios'){
				        return true;
				    }else{
				        return false;
				    }
				}
			    
			},
			isWx:function(){//是否是微信
			    var ua = H5.util.browser.userAgent();
			    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
			        return true;
			    }else{
			        return false;
			    }
			}
		},
		getCookie:function (name) { 
		    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		 
		    if(arr=document.cookie.match(reg))
		 
		        return unescape(arr[2]); 
		    else 
		        return null; 
		},
		/**
		 * 替换标签内容
		 */
		replaceObject:function(content,obj){
			for (var prop in obj) {
				content = content.replace("{"+prop+"}",eval("obj."+prop));
			}
			return $(content).show();
		}
};


H5.app = {
		// 注销
		logout: function (){
			if(H5.util.browser.h5App()){
				 sendCommand("logout",{},null);
			} else{
				location.href="/";
			}
		}
		
};


var $win = $(window); $body = $('body'), story_page = 0, total_page = 2,isLoadingStroy = false,$document=$(document);
var scrollType = 2;
var isLoaded=true;
var isIptClick = false;

!function($){
	$win.on('scroll load resize', scrollData);
}(window.jQuery);

function scrollData(){
//	setTimeout(scrollData_proxy, 150);
	scrollData_proxy();
}

function beginLoad(dontShowLoading) {
	isLoadingStroy = true;
	scrollLoaddingMessage("正在加载...");
//	if (!dontShowLoading) {
//		sendCommand('show_loading');
//	}
}
// 显示加载信息
function scrollLoaddingMessage(message){
	$(".data-over").remove();
	$('#dataList').after("<div class='data-over'>"+message+"</div>");
}

function endLoad(dontShowLoading) {
	isLoadingStroy = false;
//	if (!dontShowLoading) {
//		sendCommand('hide_loading');
//	}
}

function scrollData_proxy(){

	//comyy.bindScrollToTop();
	
	if((typeof(scrollUrl) == 'undefined'&&typeof(scrollUrl)) || isIptClick) {
		$win.off('scroll load resize', scrollData);
		isIptClick = false;
		return;
	}
	if (scrollType==0) {
		
		var scrollTop = $win.scrollTop(), offset = ($body.height()- $win.height() - scrollTop), minOffset = 150;

		if (offset < minOffset && !isLoadingStroy&& (story_page < total_page)) {
			story_page++;
			var url=scrollUrl+(scrollUrl.indexOf('?')==-1?'?':'&')+'pageNum='+story_page;
			
			url = encodeURI(url);
			beginLoad();
			$.ajax({
				 url: url,
				 type: 'get',
		         cache: false,
		         dataType: 'json',
				 success: function (data) {
					total_page = data.data.totalPage;
					callBack(data);
					endLoad();
					
				 },
				 complete: function() {
					 endLoad();
				 },
				 error: function (jqXHR, textStatus, errorThrown) {
					 endLoad();
				 }
			});
		}
	}else if(scrollType==2){
		var scrollTop = $win.scrollTop(), offset = ($('#dataList').height() -$win.height()- scrollTop), minOffset = 10;
		if (offset < minOffset && !isLoadingStroy && (story_page < total_page)) {
			story_page++;
			var url=scrollUrl+(scrollUrl.indexOf('?')==-1?'?':'&')+'pageNum='+story_page;
			beginLoad();
			$.ajax({
				 url: url,
				 dataType: 'json',
				 timeout: 10000,
				 success: function (data) {  
					total_page = data.data.totalPage;
					callBack(data);
					endLoad();
					if(data.data.totalPage == data.data.pageNumber){
						scrollLoaddingMessage("亲，数据加载完了");
					} else{
						scrollLoaddingMessage("加载更多");
					}
				 },
				 complete: function() {
					 endLoad();
				 },
				 error: function (jqXHR, textStatus, errorThrown) {
					 endLoad();
				 }
				});
			}
		}
}

