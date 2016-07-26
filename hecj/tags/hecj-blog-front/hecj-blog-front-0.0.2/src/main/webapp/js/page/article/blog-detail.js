$(function() {

	$(".wt-row").hover(function() {
		$(this).css({
			'background' : '#f7f7f4'
		});
		$(this).children().children(".hover-hide").css({
			'display' : 'none'
		});
		$(this).children().children(".hover-show").css({
			'display' : 'block'
		});
	}, function() {
		$(this).css({
			'background' : 'none'
		});
		$(this).children().children(".hover-hide").css({
			'display' : 'block'
		});
		$(this).children().children(".hover-show").css({
			'display' : 'none'
		});
	});
	
	/**
	 * 提交
	 */
	$(".btn_submit").click(function(){
		var content = $("textarea.comment-editor").val();
		var article_id = $("input[name=article_id]").val();
		if(content == 0){
			alert("请输入评论后提交");
			return false;
		}
		
		var params = {};
		params.content =content;
		$.ajax({
			type:"POST",
			url:"/comment/saveComment/"+article_id,
			data:params,
			success:function(data){
				if(data.code == 200){
					location.href = window.location.href;
				}else{
					alert(data.message);
				}
			}
		});
		
	});
	
	 //e 事件对象，可以通过该事件对象获取事件的参数 e.pageX - X轴，距浏览器的左边的距离 e.pageY - y轴，距浏览器的顶端的距离 
	 $(".blog-edit-imgs img").mouseover(function(e){
		 //鼠标移上去 向body追加大图元素
		 //大图的路径：当前连接的href属性值为大图的路径
		 var $imgSrc = $(this).attr("src");
	     var $maxImg ="<div id='temp_max_image'><img src='"+$imgSrc+"'></div>";
	     //在body中添加元素
	     $("body").append($maxImg);
	     //设置层的top和left坐标，并动画显示层
	     $("#temp_max_image").css("top", e.pageY+20).css("left",e.pageX+10).show('slow'); 
	  }).mouseout(function(){
		  //鼠标移开删除大图所在的层
		  $("#temp_max_image").remove();
	  }).mousemove(function(e){
		  //鼠标移动时改变大图所在的层的坐标
		  $("#temp_max_image").css("top", e.pageY+20).css("left",e.pageX+10);
	  });

});
