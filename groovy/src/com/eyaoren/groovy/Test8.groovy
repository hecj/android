package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
江西上饶医药股份有限公司
http://218.64.173.5:8081
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test8.html"));

 def data = [];
 def headList = [];
 def bodyList = [];

	 Document doc = Jsoup.parse((String)html);
	 
	 Elements els = doc.select("table.GridView tbody");
	 els.select("tr th").each {
		 headList.add(it.text());
	 }
	 
	 def row = 0;
	 els.select("tr").each{
		 if(row != 0 && row != els.select("tr").size()-1){
				 def rowList = [];
		    it.select("td").each{
				rowList.add(it.text());
		    }
			bodyList.add(rowList);
		 }
		row++;
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
 
 def page = 1;
 try {
	 String totalStr = doc.select("#ctl00_ContentPlaceHolder3_WA2_ZBGridTotal").text();
	 int total = Integer.parseInt(totalStr);
	 if(total%100==0){
		 page = total/100;
	 }else{
		  page = (int)(total/100)+1;
	 }
} catch (Exception e) {
	e.printStackTrace()
}
 println page;
 
 
 
 // =============test end============
 
 return data;

