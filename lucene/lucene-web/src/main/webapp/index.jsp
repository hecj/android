<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="jsp/base/basePath.jsp" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>首页</title>
</head>
<body>
	<table align="center" border="1px" style="margin-top: 50px">
		<tr>
			<th colspan="2">${N }</th>
		</tr>
		<tr>
			<td>测试Servlet</td>
			<td><a href="<%=basePath %>testServlet">进入Servlet</a></td>
		</tr>
		<tr>
			<td>测试Action</td>
			<td><a href="<%=basePath %>test/test.htm">进入Action</a></td>
		</tr>
	
	</table>
</body>
</html>