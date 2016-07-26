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
