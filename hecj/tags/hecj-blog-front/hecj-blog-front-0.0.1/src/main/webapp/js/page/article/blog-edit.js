$(function(){
	
	// 提交
	$(".sub_p button.btn_submit").click(function(){
		
		var $title = $("input[name=title]");
		var title = $title.val();
		if(title.length == 0){
			$title.focus();
			return false;
		}
		var article_type = $("select[name=article_type]").val();
		var params = {};
		params.title = title;
		params.type = article_type;
		params.id = $("input[name=title_id]").val();
		
		var articleList = new Array();
		var nextDeal = true;
		$(".blog-editor div").each(function(){
			var type = $(this).attr("type");
			var id = $(this).attr("id");
			var content = "";
			if(type == 1){
				// 文本
				content = $(this).find("textarea[name=content]").val();
				if($.trim(content).length == 0){
					$(this).find("textarea[name=content]").focus();
					nextDeal = false;
					return false;
				}
			} else if(type == 2){
				// 图片
				$(this).find(".blog-edit-imgs-row-img").each(function(){
					content += $(this).find("img").attr("src")+",";
				});
			} else if(type == 3){
				// 代码
				content = $(this).find("textarea[name=code]").val();
				if($.trim(content).length == 0){
					$(this).find("textarea[name=code]").focus();
					nextDeal = false;
					return false;
				}
			}
			articleList.push(new articleContent(id,type,content));
		});
		
		if(!nextDeal){
			return false;
		}
		params.articleList = JSON.stringify(articleList);
		
		$.ajax({
			type : "POST",
			url : "/article/editActicle",
			data : params,
			success : function(data) {
				if (data.code == 200) {
					location.href = "/article/detail/"+params.id;
				} else {
					alert(data.message);
				}
			}
		});
		return false;
	});
	
	/**
	 * 添加文本域
	 */
	$(".btn-add-textarea").click(function(){
		$(".blog-editor").append("<div class=\"blog-editor-textarea\" type=\"1\">" +
									"<textarea cols=\"100\" rows=\"20\" name=\"content\"  placeholder=\"请输入文字\"></textarea>" +
									"<span onclick=\"deleteText(this)\"><a>X</a></span>"+
								"</div>");
	});

	/**
	 * 添加代码
	 */
	$(".btn-add-code").click(function(){
		$(".blog-editor").append("<div class=\"blog-editor-textarea\" type=\"3\">" +
				"<textarea cols=\"100\" rows=\"20\" name=\"code\"  placeholder=\"请输入代码\"></textarea>" +
				"<span onclick=\"deleteText(this)\"><a>X</a></span>"+
			"</div>");	});
	
	/**
	 * 添加图片栏
	 */
	$(".btn-add-picture").click(function(){
		var images = "<div class=\"blog-edit-imgs\" type=\"2\">"+
				        "<div class=\"blog-edit-imgs-row\">"+
						"</div>"+
						"<div class=\"clear\"></div>"+
						"<div class=\"blog-edit-upload-image-btn\">"+
							"<button class=\"btn_submit\">上传图片</button>"+
							"<input type=\"file\" id=\""+new Date().getTime()+"\" name=\"uploadFile\" class=\"blog-edit-hidden-file\" onchange=\"uploadFileFun(this)\"/>"+
							"<span onclick=\"deleteImageColumn(this)\"><a>删除本栏</a></span>"+
						"</div>"+
					 "</div>";
		$(".blog-editor").append(images);
	});
	
	/**
	 * 删除文章
	 */
	$(".blog-editor-textarea span").click(function(){
		deleteText(this);
	});

	/**
	 * 删除图片
	 */
	$(".blog-edit-imgs-row-img span").click(function(){
		deleteImage(this);
	});
	
	/**
	 * 删除图片栏
	 */
	$(".blog-edit-upload-image-btn span").click(function(){
		deleteImageColumn(this);
	});
});


/**
 * 上传图片
 */
function uploadFileFun(obj){
	var fileId = $(obj).attr("id");
	$.ajaxFileUpload({
	     url: '/upload/uploadFile', 
	     secureuri: false, 
	     fileElementId: fileId,
	     dataType: 'json', 
	     success: function (data) {
	    	 if(data.code == 200){
	    		 $("#"+fileId).parent().parent()
	    		 	.find(".blog-edit-imgs-row")
	    		 	.append("<div class=\"blog-edit-imgs-row-img\">" +
	    		 				"<img src='"+data.url+"'/>" +
	    		 				"<span onclick=\"deleteImage(this)\"><a>X</a></span>" +
	    		 			"</div>");
	    	 } else{
	    		 alert(data.message);
	    	 }
	     }
	});
}

/**
 * 文章
 * @param id Id
 * @param type 类型
 * @param content 内容
 * @returns
 */
function articleContent(id,type,content){
	this.id = id;
	this.type = type;
	this.content = content;
}


/**
 * 删除text
 */
function deleteText(obj){
	$(obj).parent().remove();
}

/**
 * 删除图片
 */
function deleteImage(obj){
	$(obj).parent().remove();
}

/**
 * 删除图片栏
 */
function deleteImageColumn(obj){
	$(obj).parent().parent().remove();
}
