package com.eyaoren.groovy

import org.apache.commons.io.FileUtils
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.nodes.Element
import org.jsoup.select.Elements


def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/page.html"),"utf-8");

def page = 1;
try {
	Document doc = Jsoup.parse((String)html);
	Element els = doc.select("#DataGrid1").get(0);
	
	Elements rows =  els.select("tr:last-child td font a");
	rows.each {
		def p = it.text();
		if(p.isInteger()){
			if(p>page){
				page = p;
			}
		}
	}
} catch (Exception e) {
	e.printStackTrace()
}
println page;
return page;
