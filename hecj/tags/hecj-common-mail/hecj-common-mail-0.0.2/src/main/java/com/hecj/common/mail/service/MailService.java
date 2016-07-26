package com.hecj.common.mail.service;

import com.hecj.common.mail.Mail;
import com.hecj.common.mail.MailUtil;
import com.hecj.common.mail.factory.MailHostConvert;
import com.hecj.common.mail.prop.MailProperties;

/**
 * 发送邮件业务类
 */
public class MailService {
	
	protected MailService(){
		
	}
	/**
	 * 发送HTML邮件
	 */
	public boolean sendHtml(String email,String title,String content){
		Mail mail = new Mail();
		// 设置邮件服务器
		mail.setHost(MailHostConvert.toHost(email)); 
		mail.setSender(MailProperties.get("sender"));
		// 登录账号
		mail.setUsername(MailProperties.get("username")); 
		// 发件人邮箱的登录密码
		mail.setPassword(MailProperties.get("password")); 
		// 接收人
		mail.setReceiver(email.trim()); 
		mail.setSubject(title);
		mail.setMessage(content);
		return new MailUtil().send(mail);
	}
}
