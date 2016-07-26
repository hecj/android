package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;

	def dataList = [];
	def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/detail"),"utf-8");
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

	println dataList;
	return dataList;
