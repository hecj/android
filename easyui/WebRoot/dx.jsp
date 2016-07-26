<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
	String starttime = request.getParameter("starttime");
	String endtime = request.getParameter("endtime");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>dhtmx</title>
<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxgrid.css">


<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxgrid_dhx_skyblue.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxcalendar.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxgrid_pgn_bricks.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxcalendar_dhx_skyblue.css">
<link rel="stylesheet" type="text/css" href="<%=basePath %>dhtmlx/dhtmlxcalendar_dhx_black.css">
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxgrid.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxgridcell.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxcommon.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxgrid_pgn.js"></script>


<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxcalendar.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/dhtmlx/dhtmlxgrid_excell_dhxcalendar.js"></script>
<script type="text/javascript" src="http://127.0.0.1:8081/easyui/jquery-1.8.1.js"></script>
</head>
<body>
<div>Name<br>
	<input type="text" id="search_name"/>
</div>	

<div>Chname<br/>
	<input type="text" id="search_chname"/>
	<button onclick="reloadGrid()" id="submmitButton" style="margin-left: 30px;">Search</button>
</div>

<div id="gridBox" style="width: 100%;height: 200px;margin-top: 20px;margin-bottom: 10px">
</div>

<div><span id="pagingArea"></span></div>






	

</body>
</html>

<script type="text/javascript">

 	function tableId(){
 		
 		 mygrid = new dhtmlXGridObject('gridBox');
 		 mygrid.setImagePath("/imgs/");
 		 mygrid.setHeader("id,name,email");
 		 mygrid.setInitWidths("100,100,100");
 		 mygrid.setColAlign("left,center,left");
 		 mygrid.setColSorting("server,na,na");
 		 mygrid.setColTypes("ro,ro,ro");
 		 mygrid.setSkin("light");
 		 mygrid.enableAutoHeight(true);
 		 mygrid.init();
 		 
 		 ////////////////
 		 mygrid.enablePaging(true, 10, 5, "pagingArea", true);
 		 mygrid.setPagingSkin("bricks");
 		 
 		 mygrid.loadXML("ss.htm");
 	}

</script>


