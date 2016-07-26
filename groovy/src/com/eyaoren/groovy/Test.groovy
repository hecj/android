package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test.html"));

  def data = [];
 def headList = [];
 def bodyList = [];

 Document doc = Jsoup.parse((String)html);
 doc.select("#GridView1 tr.Lock_Col th").each{
	 headList.add(it.text());
 }

 def rowIndex = 0;
 doc.select("#GridView1 tr[class!=Lock_Col]").each{
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

