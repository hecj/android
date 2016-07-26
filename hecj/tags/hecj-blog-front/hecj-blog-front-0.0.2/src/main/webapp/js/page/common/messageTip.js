var _confirmDiv = "<div id='blog-confirm'>"+
					"<div class='feedback-success'>"+
						"<div class='feedback-head'>"+
							"<h6>提示</h6>"+
							"<a href='javascript:;' onclick='$(\"#blog-confirm\").remove()' class='feedback-close feedback-close-small'>X</a>"+
						"</div>"+
						"<div class='feedback-success-con'>"+
							"<p>请选择操作！</p>"+
						"</div>"+
						"<div class='feedback-submit-wrap'>"+
							"<input type='submit' value='确定' class='feedback-submit feedback-submit-small'>"+
							"<input type='submit' value='取消' onclick='$(\"#blog-confirm\").remove()' class='feedback-cancel feedback-submit-small'>"+
						"</div>"+
					"</div>"+
				    "<div class='pay-way-wrap' style='height: 2578px;'></div>"+
				 "</div>";

var messageTip = messageTip || {};
messageTip.confirm = function(options,backFun){
	$("body").append(_confirmDiv);
	if(options.title != undefined ){
		$("#blog-confirm .feedback-head h6").text(options.title);
	}
	if(options.content != undefined ){
		$("#blog-confirm .feedback-success-con p").text(options.content);
	}
	$("#blog-confirm .feedback-submit-wrap .feedback-submit").click(function(){
		if (typeof fn === 'function') {
			var b = backFun();
			if(b){
				$("#blog-confirm").remove();
			}
		}else{
			$("#blog-confirm").remove();
		}
	});
}
