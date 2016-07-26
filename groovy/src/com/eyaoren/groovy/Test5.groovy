package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;
/**
	南平鹭燕医药有限公司
	http://www.luyan.com.cn/index.php
*/

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test5.html"),"utf-8");


 def data = [];
 def headList = [];
 def bodyList = [];

 Document doc = Jsoup.parse((String)html);
 doc.select("table.gridBody thead tr th").each{
	 headList.add(it.text());
 }

 doc.select("table.gridBody tbody tr.odd").each{
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

