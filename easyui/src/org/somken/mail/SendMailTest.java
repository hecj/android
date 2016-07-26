package org.somken.mail;

import org.somken.util.DateFormatUtil;

public class SendMailTest {
	
    public static void main(String[] args){ 
    	
	     //这个类主要是设置邮件  
	     MailSenderInfo mailInfo = new MailSenderInfo();   
	     mailInfo.setMailServerHost("smtp.qq.com");   
	     mailInfo.setMailServerPort("25");   
	     mailInfo.setValidate(true);  
	     mailInfo.setDate(DateFormatUtil.stringToDate("2013-1-1 1:1:1", "yyyy-MM-dd HH:mm:ss"));
	     mailInfo.setUserName("275070023@qq.com");   
	     mailInfo.setPassword("wydycgyes");//您的邮箱密码   
	     mailInfo.setFromAddress("275070023@qq.com"); 
	     //mailInfo.setOneShow(true);
	     //mailInfo.setToAddress("275070023@qq.com");   
	     //mailInfo.setToMoreAddress("275070023@qq.com,15221616832@163.com");
	     mailInfo.setToMoreAddress(new String[]{"2750700213@qq.com","275070023@qq.com","15221616832@163.com"});
	     mailInfo.setSubject("邮件标题");   
	     //mailInfo.setContent("<b>测试</b><a href='http://www.baidu.com'>链接</a>");   
	     //mailInfo.attachfile("/home/ding/table.sql");
	     //添加附件
	     //mailInfo.addAttachment(new Attachment("/home/dinsg/table.sql","附件"));
	     //mailInfo.addAttachment(new Attachment("/home/ding/table2.sql","我是附件"));
	     //mailInfo.addAttachment(new Attachment("/home/ding/table.sql","的的附件"));
	     
	     mailInfo.setEmilPath("//home//ding//messagebyhechaojie//Java视频教程//JavaMail//16_传智播客张孝祥java邮件开发_Java邮件开发源代码//javamail2//resource/demo3.eml");
	     
	     //这个类主要来发送邮件  
	     SimpleMailSender sms = new SimpleMailSender();  
	     //sms.sendTextMail(mailInfo);//发送文体格式   
	     //sms.sendHtmlMail(mailInfo);//发送html格式  
	     sms.sendMail(mailInfo);
	     
   }  
}
