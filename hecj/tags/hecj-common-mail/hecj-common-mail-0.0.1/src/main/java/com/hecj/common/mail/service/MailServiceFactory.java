package com.hecj.common.mail.service;


/**
 * 邮件工厂类
 */
public class MailServiceFactory {
	
	private static MailService mailService = new MailService();
	
	public static MailService getInstance(){
		return mailService ;
	}
}
