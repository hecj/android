package com.eyaoren.flowpicker.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MacherUtil {

	public static String matcher(String reg,String text){
		Pattern pattern = Pattern.compile(reg);
		Matcher matcher = pattern.matcher(text);
		if(matcher.find()){
			return matcher.group();
		}
		return "";
	}
}
