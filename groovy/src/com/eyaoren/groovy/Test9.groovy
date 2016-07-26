package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
国药控股天津有限公司	
http://www.sinopharmtj.cn/biz/default/login.jsp?id=2
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test8.html"));

 def data = [];
 def headList = [];
 def bodyList = [];

	 Document doc = Jsoup.parse((String)html);
	 Element els = doc.select("table").get(2);
	 
	 els.select("tbody tr[align=\"center\"] td").each {
		 headList.add(it.text());
	 }
	 
	 def elements =  els.select("tbody tr[align!=\"center\"]");
	 elements.each{
		def rowList = [];
	    it.select("td").each{
			rowList.add(it.text());
	    }
		bodyList.add(rowList);
	 }

 data.add(headList);
 data.add(bodyList);
 
 // ============test begin===========
 println "==========表头=============";
 headList.each {
	 print it +" , ";
 }
 println "\n==========列表=============";
 bodyList.each {
	it.each {
		print it +" , ";
	}
	println "";
 }
 // =============test end============
 
 return data;

