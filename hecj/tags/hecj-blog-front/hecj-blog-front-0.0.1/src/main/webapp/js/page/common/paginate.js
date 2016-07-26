 
$(function(){
	
	var $paginate = $("#paginate_id");
	var pageNumber = Number($paginate.attr("pageNumber"));
	var totalPage = Number($paginate.attr("totalPage"));
	var totalRow = Number($paginate.attr("totalRow"));
	var type = $paginate.attr("type");
	var search_content = $paginate.attr("search_content");
	
	var params = "";
	if(type.length > 0){
		if(params.length==0){
			params+="?type="+type;
		}else{
			params+="&type="+type;
		}
	}
	if(search_content.length > 0){
		if(params.length==0){
			params+="?sq="+encodeURIComponent(search_content);
		}else{
			params+="&sq="+encodeURIComponent(search_content);
		}
	}
	
	showPage(pageNumber,totalRow,totalPage,params);
});

var offsetPage = 3;
function showPage(page,total,totalPage,params){
    	
    	var pStr = '';
    	// 上一页
    	if(page <= 1){
    		pStr +='<li><a href="javascript:;">上一页</a></li>';
    	}else{
    		pStr +='<li><a href="/article/'+(page-1)+'"'+params+'>上一页</a></li>';
    	}
    	
    	// 页码前-----------------------
		if(page - offsetPage > 1 ){
			pStr +='<li><a href="/article/1">1</a></li>';
			if(page - offsetPage != 2){
				pStr +='<li><a href="/article/1'+params+'">...</a></li>';
			}
			for(var i=offsetPage ;i>=1 ; i--){
				pStr +='<li><a href="/article/'+(page-i)+''+params+'">'+(page-i)+'</a></li>';
			}
		} else{
			for(var i=1; i< page ;i++){
				pStr +='<li><a href="/article/'+i+''+params+'">'+i+'</a></li>';
			}
		} 	
    	
    	// curr page --------------------------
		pStr +='<li class="cur" ><a href="/article/'+page+''+params+'">'+page+'</a></li>';
		
		// 页码后--------------------------
		if(page + offsetPage < totalPage ){
			for(var i=1 ; i<= offsetPage ; i++){
				pStr +='<li><a href="/article/'+(page+i)+''+params+'">'+(page+i)+'</a></li>';
			}
			if(page + offsetPage != totalPage-1){
				pStr +='<li><a href="/article/'+(totalPage)+''+params+'">...</a></li>';
			}
			pStr +='<li><a href="/article/'+(totalPage)+''+params+'">'+(totalPage)+'</a></li>';
		} else{
			for(var i=page+1; i<= totalPage ;i++){
				pStr +='<li><a  href="/article/'+(i)+''+params+'">'+(i)+'</a></li>';
			}
		} 	
    	
		// 下一页
    	if(page >= totalPage){
    		pStr +='<li><a href="javascript:;">下一页</a></li>';
    	} else{
    		pStr +='<li><a class="cur" href="/article/'+(page+1)+''+params+'">下一页</a></li>';
    	}
         
    	$("#paginate_id").html(pStr);
    	
    }
