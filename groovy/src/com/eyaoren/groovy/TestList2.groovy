package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import java.lang.String;

	def url = "http://app1.sfda.gov.cn/datasearch/face3/content.jsp?tableId=33&tableName=TABLE33&tableView=%E4%BA%92%E8%81%94%E7%BD%91%E8%8D%AF%E5%93%81%E4%BA%A4%E6%98%93%E6%9C%8D%E5%8A?&Id=@Id";
	def urlList = [];
	def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/test2"),"utf-8");
	Document doc = Jsoup.parse((String)html);
	doc.select("#content table tr td p a").each {
		def matcher = it.attr("href")=~/&Id=[0-9]+/; 
		def id =  matcher[0].replaceAll("&Id=", "");
		urlList.add(url.replaceAll("@Id", id))
	};

println urlList;
	return urlList;
