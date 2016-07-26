$(function(){
	
	$(".succ_bn").click(function(){
		var passwd = $.trim($("input[name=passwd]").val());
		if(passwd.length == 0){
			$("#passwd_tips").text("请输入密码");
			return false;
		}
		var repasswd = $.trim($("input[name=repasswd]").val());
		if(repasswd.length == 0){
			$("#repasswd_tips").text("请输入确认密码");
			return false;
		}
		if(passwd != repasswd){
			$("#repasswd_tips").text("两次密码输入不一致");
			return false;
		}
		
		$.ajax({
			url:"/user/setpwd",
			type:"post",
			data:{"passwd":passwd,"repasswd":repasswd,"token":$("input[name=token]").val()},
			success: function(data){
				if(data.code == 200){
					location.href = "/";
				} else{
					alert(data.message);
				}
			}
		});
		return false;
		
	});
});