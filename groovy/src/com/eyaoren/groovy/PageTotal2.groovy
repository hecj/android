package com.eyaoren.groovy

import org.apache.commons.io.FileUtils
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.nodes.Element
import org.jsoup.select.Elements

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/pageTotal2.html"),"utf-8");

def page = 1;
try {
	Document doc = Jsoup.parse((String)html);
	Element els = doc.select("#DataGrid1").get(0);
	Elements rows =  els.select("tr:last-child td a,tr:last-child td span");
	rows.each {
		def p = it.text();
		if(p.isInteger()){
			if(Integer.parseInt(p.trim())>=page){
				println p+","+page;
				page = Integer.parseInt(p.trim());
			}
		}
	}
} catch (Exception e) {
	e.printStackTrace()
}

println page;

return page;

      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	
      	