package com.hecj.common.mail.prop;

import java.io.IOException;
import java.util.Properties;

public class MailProperties {
	
	static Properties prop = null;
	
	static String prop_file_name = "mail.properties";
	
	public static String get(String key) {
		if(prop == null){
			try {
				prop = PropertiesUtil.getProperties(MailProperties.class, prop_file_name);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return prop.getProperty(key);
	}
}
