package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
国药控股普洱有限公司
http://www.ynyp.cc/Webyn/userLogin.aspx
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test13.html"));


 def data = [];
 def headList = [];
 def bodyList = [];

	  Document doc = Jsoup.parse((String)html);
	 Element els = doc.select("table#gv").get(0);
	 
	 els.select("tr.gvHead td").each {
		 headList.add(it.text());
	 }
	 
	def row = 0;
	Elements rows =  els.select("tbody tr[onclick=\"gv_sr(this);\"]");
	rows.each{
		def rowList = [];
		def col = 0;
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

