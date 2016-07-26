
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<title>ajax</title>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
	<script type="text/javascript" src="http://hechaojie.com/js/page/common/jquery/jquery.js"></script>
	<script type="text/javascript">
	/* -- 跨域请求cookie无法传递
	$.ajax({
        data: {},
       // url: '/GetCookie.jsp',
       url:'http://a.m.com:8888/GetCookie.jsp', 
       type: 'get',
        cache: false,
      //  dataType: 'json',
        success: function (data) {
			alert(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
     		
		}
     });
	*/
	
	function getDataCallBack(data){
		alert("callback:"+data);
	}
	
	/*jsonp实现 无法获取cookie---*/
	$.ajax({
        data: {},
       // url: '/GetCookie.jsp',
       url:'http://b:8888/GetCookie.jsp', 
       type: 'get',
        cache: false,
        dataType: 'jsonp',
       jsonp: "callback",
       jsonpCallback:"getDataCallBack",
  xhrFields: {
              withCredentials: true
       },
     crossDomain: true, 
        success: function (data) {
			alert(data);
		},
		error : function(jqXHR, textStatus, errorThrown) {
     		
		}
     });
	
	
	
	</script></head>
<body>
</body>

</html>