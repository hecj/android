package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;
/**
	国药控股北京天星普信生物医药有限公司
	http://www.bjtxpx.com.cn/
*/

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test4.html"),"utf-8");


 def data = [];
 def headList = [];
 def bodyList = [];

 Document doc = Jsoup.parse((String)html);
 doc.select("table#gv tbody tr.gvHead td").each{
	 headList.add(it.text());
 }

 doc.select("table#gv tbody tr[onclick=\"gv_sr(this)\"]").each{
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

