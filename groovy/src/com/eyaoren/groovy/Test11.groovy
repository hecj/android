package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
 华东医药温州有限公司
http://www.zjhuiren.com/login.asp
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test11.html"));

 def data = [];
 def headList = [];
 def bodyList = [];

	  Document doc = Jsoup.parse((String)html);
	 Element els = doc.select("table").get(6);
	 
	 els.select("tr:first-child td").each {
		 headList.add(it.text());
	 }
	 
	 def row = 0;
	Elements rows =  els.select("tr");
	 rows.select("tr").each{
                if(row != 0&&rows.size()-1!=row){
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

