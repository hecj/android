
var tabRelConverts = new Array();

var dwzPlugin = dwzPlugin || {};

/**
 * init
 */
dwzPlugin.init = function(){
	/**
	 * tab转换对象
	 */
	function tabRelConvert(relA,relB){
		this.relA = relA;
		this.relB = relB;
	}
	tabRelConverts.push(new tabRelConvert("/article/detail/","/article/manager"));
	tabRelConverts.push(new tabRelConvert("/article/toEdit/","/article/manager"));
}
/**
 * dwz tab切换插件
 */
dwzPlugin.currentTree = function($tab){
	
	var tabid = $tab.attr("tabid");
	if(tabid){

		// 判断tabid是否需要转换
		for(var i = 0;i<tabRelConverts.length;i++){
			var tb = tabRelConverts[i];
			if(tabid.indexOf(tb.relA) != -1){
				tabid = tb.relB;
			}
		}
		
		$("#sidebar .accordionContent .treeFolder  ul li a").each(function(){
			var rel = $(this).attr("rel");
			if(rel){
				if(tabid == rel){
					$("div." + "selected", $("#sidebar .accordionContent .treeFolder ul li")).removeClass("selected");
					$(this).parent().addClass("selected");
				}
			}
		});
		
	}
}

$(function(){
	dwzPlugin.init();
});