package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;
/**
	华润昆山医药有限公司
	http://eip.crks.cn/
*/

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test7.html"),"utf-8");


 def data = [];
 def headList = [];
 def bodyList = [];


	 Document doc = Jsoup.parse((String)html);
	 doc.select("table.GridView  tr th[scope=\"col\"]").each {
		 headList.add(it.text());
	 }
	 
	 def row = 0;
	 def elements = doc.select("table.GridView tbody tr");
	 elements.each{
	    if(row !=0 && elements.size()-1 != row){
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
 // =============test end============
 
 return data;

