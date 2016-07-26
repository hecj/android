<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String starttime = request.getParameter("starttime");
	String endtime = request.getParameter("endtime");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<script type='text/javascript' src='dwr/engine.js'>
</script>
<script type='text/javascript' src='dwr/util.js'>
</script>
<script type='text/javascript' src='dwr/interface/test.js'>
</script>
<script type="text/javascript">
	function dwrTest() {
		var obj = document.getElementById("name");
		test.get(obj.value, {
			callback : function(data) {
				alert(data);
			},
			timeout : 1000, //连接服务器超时间
			errorHandler : function(message) {
				alert("连接服务期超时！" + message); //错误信息
			}
		});
	}

	function dwrAdd() {

		var myJSPerson = {
			name : "Fred Bloggs",
			age : 42,
			appointments : [ new Date(), new Date("1 Jan 2008") ]
		};

		test.doSomethingWithPerson(myJSPerson, function(data) {
			alert(data.appointments.length);
		});
	}

	function dwrMap() {
		var map = {
				id: 42,
				name : [ "1","2","3" ]
		};
		test.map(map, function(data) {
			alert(data.id);
		});
	}

	function dwrList() {
		test.list(function(data) {
			alert(data[0].age);
		});
	}
	
	
	function eexcel(){
		// window.location.href="/easyui/uploadExcel.do"; 
		 
		 url=encodeURI(encodeURI("id=1"));
		 window.location.href="<%=basePath%>uploadExcel.do?"+url;
		 
	}
	
</script>
</head>
<body>
	<input id="name" />
	<button onclick="dwrTest()">onclick</button>
	<button onclick="dwrAdd()">Object</button>
	<button onclick="dwrMap()">map</button>
	<button onclick="dwrList()">list</button>
	<input type="button" value="导出excel" class="button" onclick="eexcel()">
</body>
</html>