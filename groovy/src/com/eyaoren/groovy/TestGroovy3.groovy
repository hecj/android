package com.eyaoren.groovy
import org.apache.commons.io.*

import com.alibaba.fastjson.JSON
import com.alibaba.fastjson.JSONArray
import com.alibaba.fastjson.*;
 
 def data = [];
 def headList = [];
 def bodyList = [];
	
 headList.add("字段1");
 headList.add("字段2");
 headList.add("字段3");
 headList.add("字段4");
 headList.add("字段5");
 headList.add("字段6");
 headList.add("字段7");
 headList.add("字段8");
 headList.add("字段9");
 headList.add("字段10");
 
 	//def html = FileUtils.readLines(new File("/Users/hecj/workspace/groovy/groovy/src/json.json"),"utf-8");
	JSONObject json = JSON.parseObject(html);
	json.getJSONArray("rows").each {
		def rowList = [];
		
		rowList.add(it.getString("goodsunit"));
		rowList.add(it.getString("goodsno"));
		rowList.add(it.getString("inputdate"));
		rowList.add(it.getString("goodsinfo"));
		rowList.add(it.getString("goodsname"));
		rowList.add(it.getString("factoryname"));
		rowList.add(it.getString("companyinfo"));
		rowList.add(it.getString("customname"));
		rowList.add(it.getString("commonname"));
		rowList.add(it.getString("toaddr"));
		
		bodyList.add(rowList);
	};
	
data.add(headList);
data.add(bodyList);

println data;
return data;
