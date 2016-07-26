package com.eyaoren.flowpicker.util;
import java.util.Map;
import groovy.lang.Binding;
import groovy.lang.GroovyShell;

/**
 * 脚本执行工具类
 */
public class GroovyScriptCommon {

	/**
	 * 执行一段脚本
	 */
	public static Object evaluate(String script,Map<String,Object> p){
		if(script == null || "".equals(script)){
			System.err.println("script is not null");
			return null;
		}
		Binding binding = new Binding();
		for (String k : p.keySet()) {
			binding.setVariable(k, p.get(k));
		}
		GroovyShell shell = new GroovyShell(binding);
		return shell.evaluate(script);
	}
}
