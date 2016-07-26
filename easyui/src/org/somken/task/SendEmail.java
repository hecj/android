package org.somken.task;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import org.somken.mail.MailSenderInfo;
import org.somken.mail.SimpleMailSender;
import org.somken.util.DateFormatUtil;

public class SendEmail {
	
	public static void send() {
		
		Properties p = new Properties();
		InputStream in = SendEmail.class.getResourceAsStream("property.properties");
		try {
			p.load(in);
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		//这个类主要是设置邮件  
	     MailSenderInfo mailInfo = new MailSenderInfo();   
	     mailInfo.setMailServerHost(p.getProperty("mail.server.host"));   
	     mailInfo.setMailServerPort(p.getProperty("mail.server.port"));   
	     mailInfo.setValidate(Boolean.parseBoolean(p.getProperty("mail.validate")));  
	     mailInfo.setDate(DateFormatUtil.stringToDate("1991-03-08 00:00:00", "yyyy-MM-dd HH:mm:ss"));
	     mailInfo.setUserName(p.getProperty("mail.username"));   
	     mailInfo.setPassword(p.getProperty("mail.password"));//您的邮箱密码   
	     mailInfo.setFromAddress(p.getProperty("mail.from.address")); 
	     //mailInfo.setOneShow(true);
//	     mailInfo.setToAddress(p.getProperty("mail.to.address"));   
	     mailInfo.setToMoreAddress("389112236@qq.com");
//	     mailInfo.setToMoreAddress(new String[]{"2750700213@qq.com","275070023@qq.com","15221616832@163.com"});
	     mailInfo.setSubject("测试一下");   
	     mailInfo.setContent("<font style='color:red,font-size:200px'>搞你没</font><a href='http://www.baidu.com'>链接</a>");   
	     //mailInfo.attachfile("/home/ding/table.sql");
	     //添加附件
	     //mailInfo.addAttachment(new Attachment("/home/dinsg/table.sql","附件"));
	     //mailInfo.addAttachment(new Attachment("/home/ding/table2.sql","我是附件"));
	     //mailInfo.addAttachment(new Attachment("/home/ding/table.sql","的的附件"));
	     
	   //  mailInfo.setEmilPath("//home//ding//messagebyhechaojie//Java视频教程//JavaMail//16_传智播客张孝祥java邮件开发_Java邮件开发源代码//javamail2//resource/demo3.eml");
	     
	     //这个类主要来发送邮件  
	     SimpleMailSender sms = new SimpleMailSender();  
	     //sms.sendTextMail(mailInfo);//发送文体格式   
	     //sms.sendHtmlMail(mailInfo);//发送html格式  
	     boolean b=SimpleMailSender.sendHtmlMail(mailInfo);
	     
	     System.out.println("邮件发送："+b);
	}
	
	public static void main(String[] args) {
		send();
	}
	
}
