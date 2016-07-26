package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
广东上药济源堂药业有限公司
www.jmjyt.com
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test15.html"));


def data = [];
def headList = [];
def bodyList = [];
data.add(headList);
data.add(bodyList);

Document doc = Jsoup.parse((String)html);
Element els = doc.select("table").get(1);

els.select("tr").get(1).select("td").each {
	headList.add(it.text());
}
	
def row = 0;
Elements rows =  els.select("tr");
rows.each{
	if(row>1&&row!=rows.size()-1){
		def rowList = [];
		def col = 0;
		it.select("td").each{
			rowList.add(it.text());
			col++;
		}
		bodyList.add(rowList);
	}
	row++;
}


// ============test begin===========
println "==========表头=============";
headList.each { print it +" , "; }
println "\n==========列表=============";
bodyList.each {
	it.each { print it +" , "; }
	println "";
}
// =============test end============

return data;

