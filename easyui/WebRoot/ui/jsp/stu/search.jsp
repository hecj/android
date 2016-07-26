<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<form id="form_stu" onsubmit="return paramTable()">
	<label for="name">姓名:</label> <input id="name"
		class="easyui-validatebox" type="text" name="name"
		data-options="required:true" /> 
		<label for="name">地址:</label>
		<select id="cc" class="easyui-combotree" style="width:200px;"
			data-options="url:'http://127.0.0.1:8081/easyui/ui/jsp/stu/address.json',required:true"></select>
	<a id="search" href="#" class="easyui-linkbutton"
		data-options="iconCls:'icon-search'">查询</a>
</form>
<div style="height: 50px"></div>
<table id="stu_table" style="height:300px;margin: 15px"></table>
<div id="toolbar" style="display: none;">
	<a href="javascript:void(0)" class="easyui-linkbutton"
		iconCls="icon-add" plain="true" onclick="newUser()">添加</a> 
		<a href="javascript:void(0)" class="easyui-linkbutton"
		iconCls="icon-edit" plain="true" onclick="editUser()">编辑</a>
	    <a href="javascript:void(0)" class="easyui-linkbutton"
		iconCls="icon-remove" plain="true" onclick="destroyUser()">删除</a>
	    <a href="javascript:void(0)" class="easyui-linkbutton"
		iconCls="icon-remove" plain="true" onclick="excelUpload()"><b>导出Excel数据</b></a>
	    <a href="javascript:void(0)" class="easyui-linkbutton"
		iconCls="icon-remove" plain="true" onclick="txtUpload()"><b>下载说明文件(.txt)</b></a>
</div>


<div style="display: none;">
	<!-- 导出Excel对话框 -->
	<div id="dialog_excel">  
		<b style="color:red">确定要导出数据?</b>
	</div>  
	<!-- 导出txt对话框 -->
	<div id="dialog_txt">  
		<b style="color:red">确定要导出说明文件?</b>
	</div> 
</div>


<script type="text/javascript">
	$(document).ready(function() {
		$("#search").click(function() {
			$("#form_stu").submit();
		});

		//init table
		$('#stu_table').datagrid({
			title : '学生管理',
			toolbar : '#toolbar',
			singleSelect : true,
			striped : true,
			pagination : true,
			rownumbers : true,
			fitColumns : true,
			pageList : [ 5, 10, 15 ],
			autoRowHeigh : true,
			url : 'stu.htm',
			pageSize : 5,
			pageNumber : 1,
			columns : [ [ {
				field : 'id',
				title : '编号',
				width : 200
			}, {
				field : 'name',
				title : '姓名',
				width : 200
			}, {
				field : 'age',
				title : '年龄',
				width : 200
			}, {
				field : 'address',
				title : '地址',
				width : 200
			}, {
				field : 'email',
				title : '邮箱',
				width : 200
			} ] ],
			queryParams : {
				name : ''
			}
		});

		initPagination();

	});

	//分页器
	function initPagination() {

		var p = $('#stu_table').datagrid('getPager');
		$(p).pagination({
			beforePageText : '第',//页数文本框前显示的汉字  
			afterPageText : '页    共 {pages} 页',
			displayMsg : '当前 {from} - {to} 条&nbsp;&nbsp;共 {total} 条'
		/*onBeforeRefresh:function(){ 
		    $(this).pagination('loading'); 
		    alert('before refresh'); 
		    $(this).pagination('loaded'); 
		}*/
		});
	}

	function paramTable() {

		var name = $('#name').val();
		$('#stu_table').datagrid({
			url : 'stu.htm',
			queryParams : {
				name : name
			}
		});
		initPagination();
		return false;
	}
	
	//导出Excel数据
	function excelUpload(){
		
		$('#dialog_excel').dialog({  
		    title: '导出数据',  
		    width: 200,  
		    height: 100,  
		    closed: false,  
		    cache: false,  
		    modal: true,
		    buttons:[{
				text:'Save',
				iconCls:'icon-ok',
				handler:function(){
					
					var name = $("#name").val();
					url="name="+name;
					//url=encodeURI(encodeURI(url));
					//请求servelt导出文件
					window.location.href="<%=basePath%>uploadExcel.do?"+url;
					$('#dialog_excel').dialog('close');
				}
			},{
				text:'Close',
				handler:function(){
					//关闭dialog
					$('#dialog_excel').dialog('close');
				}
			}]
		});  
	}
	
	//导出txt文件
	function txtUpload(){
		
		$('#dialog_txt').dialog({  
		    title: '导出说明文件',  
		    width: 200,  
		    height: 100,  
		    closed: false,  
		    cache: false,  
		    modal: true,
		    buttons:[{
				text:'Save',
				iconCls:'icon-ok',
				handler:function(){
					
					//请求servelt导出文件
					window.location.href="<%=basePath%>uploadTxt.do";
					$('#dialog_txt').dialog('close');
				}
			},{
				text:'Close',
				handler:function(){
					//关闭dialog
					$('#dialog_txt').dialog('close');
				}
			}]
		});  
	}
	
	
	
	
</script>

