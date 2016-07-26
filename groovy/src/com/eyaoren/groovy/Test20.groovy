package com.eyaoren.groovy
import org.apache.commons.io.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element
import org.jsoup.select.Elements;
import java.lang.String;
def code = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/code.txt"));

def sc =  URLEncoder.encode((String)code);

println sc;