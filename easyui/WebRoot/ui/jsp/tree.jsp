<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<ul id="tree_id" class="easyui-tree">  
    <li>  
        <span>根菜单</span>  
        <ul>  
            <li>  
                <span>学生管理</span>  
                <ul>  
                    <li >  
                        <label onclick="open1('http://127.0.0.1:8081/easyui/ui/jsp/stu/search.jsp','查询学生')">查询学生</label>
                    </li>  
                    <li >  
                        <label onclick="open1('ui/jsp/tree','删除学生')">删除学生</label>
                    </li>  
                </ul>  
            </li>  
        </ul>  
    </li>  
</ul> 

<script type="text/javascript">



</script>

 