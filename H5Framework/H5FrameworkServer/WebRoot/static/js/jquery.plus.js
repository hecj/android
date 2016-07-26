; (function ($) {
            jQuery.extend({
                handleError: function (s, xhr, status, e) {
                    if (s.error) {
                        s.error.call(s.context || s, xhr, status, e);
                    }
                    if (s.global) {
                        (s.context ? jQuery(s.context) : jQuery.event).trigger("ajaxError", [xhr, s, e]);
                    }
                },
                httpData: function (xhr, type, s) {
                    var ct = xhr.getResponseHeader("content-type"),
            xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
            data = xml ? xhr.responseXML : xhr.responseText;
                    if (xml && data.documentElement.tagName == "parsererror")
                        throw "parsererror";
                    if (s && s.dataFilter)
                        data = s.dataFilter(data, type);
                    if (typeof data === "string") {
                        if (type == "script")
                            jQuery.globalEval(data);
                        if (type == "json")
                            data = window["eval"]("(" + data + ")");
                    }
                    return data;
                }
            });
});


Date.prototype.format = function(format){
	 /*
	  * eg:format="YYYY-MM-dd hh:mm:ss";
	  */
	 var o = {
	  "M+" :  this.getMonth()+1,  //month
	  "d+" :  this.getDate(),     //day
	  "h+" :  this.getHours(),    //hour
	      "m+" :  this.getMinutes(),  //minute
	      "s+" :  this.getSeconds(), //second
	      "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
	      "S"  :  this.getMilliseconds() //millisecond
	   };
	  
	   if(/(y+)/.test(format)) {
	    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	   }
	 
	   for(var k in o) {
	    if(new RegExp("("+ k +")").test(format)) {
	      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	    }
	   }
	 return format;
	};
            
            
            