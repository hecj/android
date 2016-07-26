package com.hecj.common.mail.factory;

/**
 * mail邮件host转换
 */
public class MailHostConvert {
	
	public static String toHost(String mail){
		if(mail.endsWith("@qq.com")){
			return "smtp.qq.com";
		}
		return null;
	}
}
