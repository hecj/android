package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
/**
国家食品药品监督管理局-国产药品
http://app1.sfda.gov.cn/datasearch/face3/base.jsp?tableId=25&tableName=TABLE25&title=%B9%FA%B2%FA%D2%A9%C6%B7&bcId=124356560303886909015737447882
 */
def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test18.html"));


def dataList = [];

Document doc = Jsoup.parse((String)html);

def eles = doc.select("table tbody tr");

dataList.add(eles.get(1).select("td").get(1).text());
dataList.add(eles.get(2).select("td").get(1).text());
dataList.add(eles.get(3).select("td").get(1).text());
dataList.add(eles.get(4).select("td").get(1).text());
dataList.add(eles.get(5).select("td").get(1).text());
dataList.add(eles.get(6).select("td").get(1).text());
dataList.add(eles.get(7).select("td").get(1).text());
dataList.add(eles.get(8).select("td").get(1).text());
dataList.add(eles.get(9).select("td").get(1).text());
dataList.add(eles.get(10).select("td").get(1).text());
dataList.add(eles.get(11).select("td").get(1).text());
dataList.add(eles.get(12).select("td").get(1).text());
dataList.add(eles.get(13).select("td").get(1).text());
dataList.add(eles.get(14).select("td").get(1).text());
dataList.add(eles.get(16).select("td").get(1).text());
 
def row = 0;
 dataList.each {
	 println row+'---'+it;
	 row++;
 }

return dataList;
