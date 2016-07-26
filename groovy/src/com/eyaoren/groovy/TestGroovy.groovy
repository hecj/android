package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;
/**
	国药控股安徽有限公司	
	http://www.gykgah.com:808/GyWeb/userLogin.aspx
	
	 */

def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test.html"),"utf-8");

//======begin============

 def data = [];
 def headList = [];
 def bodyList = [];

 Document doc = Jsoup.parse((String)html);
 doc.select("#gv tr.gvHead td").each{
	 headList.add(it.text());
 }

 def rowIndex = 0;
 doc.select("#gv tr[onclick=\"gv_sr(this);\"]").each{
	 if(rowIndex != 0){
		 def rowList = [];
		 it.select("td").each{
			 rowList.add(it.text());
		 }
		 bodyList.add(rowList);
	 }
	 rowIndex++;
 }

 data.add(headList);
 data.add(bodyList);
 
 // ============test begin
 headList.each {
	 print it +" , ";
 }
 println "\n---------------------";
 
 bodyList.each {
	it.each {
		print it +" , ";
	}
	println "";
 }

 
 // =============test end
 
 return data;
 
 
 //======end============
		  

