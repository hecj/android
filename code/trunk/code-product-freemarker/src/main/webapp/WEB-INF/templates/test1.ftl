<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>freemarker示例</title>
</head>
<body>
	你好${user}
	<div>
		------------list-------
		<table>
			<tr>
				<td>编号</td>
				<td>姓名</td>
				<td>年龄</td>
			</tr>
			<#list students as student>
			<tr>
				<td>${student.id}</td>
				<td>${student.name}</td>
				<td>
					<#if student.age gte 18>
						成年（#{student.age}）${student.age}
					<#else>
						未成年（#{student.age}）${student.age}
					</#if>
				</td>
			</tr>
			</#list>
		</table>
	</div>
	<div>
		----------include--------
		<#include "include1.txt"/>
	<div>
	<div>
		----------自定义指令------<br>
		<#macro method1 name num1 num2>
			<b>我是包含的文件，姓名：${name}</b>${num1}+${num2}=${num1+num2}
		</#macro>
		---------我开始调用了-----<br>
		<@method1 name="张三" num1=1 num2=2></@method1>
	</div>
	<#assign mail = "bjsxt@163.com"><br/>
	我是一个邮件：${mail}<br>
	-------nestet------
	<#macro border> 
  	<table border=4 cellspacing=0 cellpadding=4><tr><td> 
	    <#nested> 
	  </td></tr>
	</table> 
	</#macro>
	<@border>1表格中的内容1！</@border><br>
	--------------命令空间--------<br>	
	<#import "imp.ftl" as im/>
	我的新邮件：${im.mail}

</body>
</html>