package com.hecj.common.mail.prop;

import java.io.IOException;
import java.util.Properties;
/**
 * 读取配置文件
 * @author hechaojie
 */
public class PropertiesUtil {

	public static Properties getProperties(Class<?> cls,String propFileName) throws IOException{
		Properties props = new Properties();
		props.load(cls.getClassLoader().getResourceAsStream(propFileName));
		return props ;
	}

}