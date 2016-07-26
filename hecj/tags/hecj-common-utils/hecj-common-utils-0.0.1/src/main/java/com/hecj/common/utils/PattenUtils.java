package com.hecj.common.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PattenUtils {
	
	/**
	 * 匹配元素
	 * 只匹配一个元素
	 */
	public static String pattenUniqueContent(String content,String regex){
		if(content==null||content.equals("")){
			return "";
		}
		String group="";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher(content);
		while(m.find()){
			group=m.group();
		}
		return group;
	}
}