package com.eyaoren.groovy

import org.jsoup.Jsoup
import org.jsoup.nodes.Document


def html='<input type="text" name="pageno" value="" size="3" onkeydown="if(event.keyCode==13){event.returnValue=false;mastercomp.gotopage(pageform.pageno.value);}">';

try {
	
	Document doc = Jsoup.parse((String)html);
	def page = doc.select("input[name=pageno]").val();
	if(page == null || "".equals(page.trim())){
		page = 1;
	}
	return page;
} catch (Exception e) {
	e.printStackTrace();
	return 1;
}

