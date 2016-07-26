/**
 * by HECJ
 */
$.ajaxSetup({
	contentType : "application/x-www-form-urlencoded;charset=utf-8",
	complete : function(XMLHttpRequest, textStatus) {
		if (XMLHttpRequest.status == 999) {
			location.href = "/login?b="+encodeURIComponent(window.location.href);
		}
	}
});

$(function(){
	
	/*搜索*/
	$("button[type=submit]").click(function(){
		var form_control = $("input[class=form-control]").val();
		if(form_control.length == 0){
			$("input[class=form-control]").focus();
			return false;
		}
		location.href = "/article?sq="+encodeURIComponent(form_control);
		return false;
	});
})