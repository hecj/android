<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE HTML>
<html>
  <head>
    <base href="<%=basePath%>">
    <title>UI框架</title>
    <meta charset="UTF-8">
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<link rel="stylesheet" type="text/css" href="ui/css/demo.css">
    <link rel="stylesheet" type="text/css" href="ui/themes/default/easyui.css">
    <link rel="stylesheet" type="text/css" href="ui/themes/icon.css">
    <script type="text/javascript" src="ui/uijs/jquery-1.8.1.js"></script>
    <script type="text/javascript" src="ui/uijs/jquery.easyui.min.js"></script>
    	<script type="text/javascript" src="ui/js/main.js"></script>
	
</head>
 <body class="easyui-layout">  
    <div region="north" title="North Title" split="true" style="height:100px;"></div>  
    <div region="south" title="South Title" split="true" style="height:100px;"></div>  
    <div region="east" iconCls="icon-reload" title="East" split="true" style="width:100px;"></div>  
    <div id="west" region="west" split="true" title="West" style="width:100px;"></div>  
    <div id="center" region="center" class="easyui-tabs" style="padding:5px;background:#eee;"></div>  
</body> 
</html>


<script type="text/javascript">

	/*function open1(plugin,title){
			$('#center').tabs('add',{
				title:title,
				href:plugin,
				closable:true
			});
	}*/
	
	function open1(plugin,title){
		if ($('#center').tabs('exists',title)){
			$('#center').tabs('select', title);
		} else {
			$('#center').tabs('add',{
				title:title,
				href:plugin,
				closable:true
			});
				
	}
}
	
	
</script>



