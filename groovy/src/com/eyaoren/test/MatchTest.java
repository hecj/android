package com.eyaoren.test;

import java.io.IOException;
import java.net.URL;

public class MatchTest {
	
	public static void main(String[] args) throws IOException {
//		String html = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/test3.html"),"utf-8");
//		String script = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/com/eyaoren/test/MacherGroovy.groovy"),"utf-8");
//
////		String totalPage = MacherUtil.matcher("\\d+",MacherUtil.matcher("皖ICP备\\d+号", html));
////		System.out.println(totalPage);
//		
//		Map<String,Object> p = new HashMap<String,Object>();
//		p.put("html", html);
//		GroovyScriptCommon.evaluate(script, p);
		
		String url = "http://www.zjflm.cn:18/productflow/product/queryPH.htm?spbm=&startdate=2016-07-01&enddate=2016-07-09&ksbm=&stockchangemode=2&batchnumber=&tym=&dzbm= ";
		URL url2 = new URL(url);
		
	}

}
