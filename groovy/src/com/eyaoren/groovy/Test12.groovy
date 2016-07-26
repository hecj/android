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
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test12.html"));


def data = [];
def headList = [];
def bodyList = [];

Document doc = Jsoup.parse((String)html);
Element els = doc.select("table#gv_DXMainTable").get(0);

els.select("tr#gv_DXHeadersRow td table td").each {
	headList.add(it.text());
}

def row = 0;
Elements rows =  els.select("tbody tr.dxgvDataRow_Office2003_Blue");
rows.each{
	def rowList = [];
	def col = 0;
	it.select("td").each{
		if(col!=0){
			rowList.add(it.text());
		}
		col++;
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

