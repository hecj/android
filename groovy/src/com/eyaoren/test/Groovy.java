package com.eyaoren.test;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.FileUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.eyaoren.flowpicker.util.GroovyScriptCommon;

public class Groovy {
	

	public static void main(String[] args) throws IOException {
		
		String html = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/json1.json"),"utf-8");
		String script = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/com/eyaoren/groovy/Json1.groovy"),"utf-8");
		System.out.println(html);
		
		JSONObject json = JSON.parseObject(html);
		
		JSONArray arr = json.getJSONArray("rows");
		System.out.println(arr.size());
		
		System.out.println(script);
		
		Map<String,Object > p = new HashMap<String,Object >();
		p.put("html", html);
		GroovyScriptCommon.evaluate(script, p);
	}

}
