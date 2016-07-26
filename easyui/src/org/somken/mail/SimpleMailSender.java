package org.somken.mail;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.Address;
import javax.mail.AuthenticationFailedException;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.SendFailedException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.mail.internet.MimeUtility;

import org.somken.util.DateFormatUtil;

import com.sun.mail.smtp.SMTPSendFailedException;
  
/**  
* 简单邮件（不带附件的邮件）发送器  
*/   
public class SimpleMailSender  {   
	
  private static final org.apache.commons.logging.Log logger = org.apache.commons.logging.LogFactory.getLog(DateFormatUtil.class);
  /**  
   * 以文本格式发送邮件  
   * @param mailInfo 待发送的邮件的信息  
   */   
    public boolean sendTextMail(MailSenderInfo mailInfo) {   
      // 判断是否需要身份认证   
      MyAuthenticator authenticator = null;   
      Properties pro = mailInfo.getProperties();  
      if (mailInfo.isValidate()) {   
      // 如果需要身份认证，则创建一个密码验证器   
        authenticator = new MyAuthenticator(mailInfo.getUserName(), mailInfo.getPassword());   
      }  
      // 根据邮件会话属性和密码验证器构造一个发送邮件的session   
      Session sendMailSession = Session.getDefaultInstance(pro,authenticator);   
      try {   
	      // 根据session创建一个邮件消息   
	      Message mailMessage = new MimeMessage(sendMailSession);   
	      // 创建邮件发送者地址   
	      Address from = new InternetAddress(mailInfo.getFromAddress());   
	      // 设置邮件消息的发送者   
	      mailMessage.setFrom(from);   
	      // 创建邮件的接收者地址，并设置到邮件消息中   
	      if(mailInfo.getToMoreAddress()!=null&&!mailInfo.getToMoreAddress().equals("")){
	    	  InternetAddress[] toMore= new InternetAddress().parse(mailInfo.getToMoreAddress());
	    	  mailMessage.setRecipients(Message.RecipientType.TO,toMore); //多个收件人  
	      }else{
	    	  Address to = new InternetAddress(mailInfo.getToAddress());   
	    	  mailMessage.setRecipient(Message.RecipientType.TO,to);  //单个收件人
	      }
	      // 设置邮件消息的主题   
	      mailMessage.setSubject(mailInfo.getSubject());   
	      // 设置邮件消息发送的时间   
	      mailMessage.setSentDate(new Date());   
	      // 设置邮件消息的主要内容   
	      String mailContent = mailInfo.getContent();   
	      mailMessage.setText(mailContent);   
	      // 发送邮件   
	      Transport.send(mailMessage);  
	      return true;   
      } catch (MessagingException ex) {   
          ex.printStackTrace();   
      }   
      return false;   
    }   
      
    /**  
      * 以HTML格式发送邮件  
      * @param mailInfo 待发送的邮件信息  
      */   
    public static boolean sendHtmlMail(MailSenderInfo mailInfo) {   
      // 判断是否需要身份认证   
      MyAuthenticator authenticator = null;  
      Properties pro = mailInfo.getProperties();  
      //如果需要身份认证，则创建一个密码验证器    
      if (mailInfo.isValidate()) {   
        authenticator = new MyAuthenticator(mailInfo.getUserName(), mailInfo.getPassword());  
      }   
      // 根据邮件会话属性和密码验证器构造一个发送邮件的session   
      Session sendMailSession = Session.getDefaultInstance(pro,authenticator);   
      try {   
	      // 根据session创建一个邮件消息   
	      Message mailMessage = new MimeMessage(sendMailSession);   
	      // 创建邮件发送者地址   
	      Address from = new InternetAddress(mailInfo.getFromAddress());  
	      // 设置邮件消息的发送者   
	      mailMessage.setFrom(from);   
	      // 创建邮件的接收者地址，并设置到邮件消息中   
	      if(mailInfo.getToMoreAddress()!=null&&!mailInfo.getToMoreAddress().equals("")){
	    	  InternetAddress[] toMore= new InternetAddress().parse(mailInfo.getToMoreAddress());
	    	  mailMessage.setRecipients(Message.RecipientType.TO,toMore); //多个收件人  
	      }else{
	    	  Address to = new InternetAddress(mailInfo.getToAddress());   
	    	  mailMessage.setRecipient(Message.RecipientType.TO,to);  //单个收件人
	      } 
	      // 设置邮件消息的主题   
	      mailMessage.setSubject(mailInfo.getSubject());   
	      // 设置邮件消息发送的时间   
	      if(mailInfo.getDate() == null){
	    	mailMessage.setSentDate(new Date()); 
	      }else{
	    	mailMessage.setSentDate(mailInfo.getDate()); 
	      }
	      // MiniMultipart类是一个容器类，包含MimeBodyPart类型的对象   
	      Multipart mainPart = new MimeMultipart();   
	      // 创建一个包含HTML内容的MimeBodyPart   
	      BodyPart html = new MimeBodyPart();   
	      // 设置HTML内容   
	      html.setContent(mailInfo.getContent(), "text/html; charset=utf-8");   
	      mainPart.addBodyPart(html); 
	      
	      //向Multipart添加附件
	     /* Enumeration efile = mailInfo.getAttachmentVector().elements();
	      while(efile.hasMoreElements()){
	    	  Attachment attachment = (Attachment) efile.nextElement();
	    	  if(new File(attachment.getFilePath()).isFile()){
	    		  MimeBodyPart bodyFile = new MimeBodyPart();
		    	  FileDataSource fds = new FileDataSource(attachment.getFilePath());
		    	  bodyFile.setDataHandler(new DataHandler(fds));
		    	  try{
		    		  bodyFile.setFileName(MimeUtility.encodeText(attachment.getFileName()));
		    	  }catch(Exception ex){
		    		  bodyFile.setFileName(attachment.getFilePath());
		    	  }
		    	  mainPart.addBodyPart(bodyFile);
	    	  }else{
	    		  logger.error("---error-->附件文件目录错误,请检查!(#--"+attachment.getFilePath()+"--#)<------");
	    	  }
	      }
	      //移除所有附件
	      mailInfo.getAttachmentVector().removeAllElements();
	      */
	      /*附件*/
	      /*for(Attachment a :mailInfo.getAttachmentList()){
	    	  MimeBodyPart bodyFile = new MimeBodyPart();
	    	  FileDataSource fds = new FileDataSource(a.getFilePath());
	    	  bodyFile.setDataHandler(new DataHandler(fds));
	    	  try{
	    		  bodyFile.setFileName(MimeUtility.encodeText(a.getFileName()));
	    	  }catch(Exception ex){
	    		  bodyFile.setFileName(a.getFilePath());
	    	  }
	    	  mainPart.addBodyPart(bodyFile);
	      }
	      mailInfo.getAttachmentList().clear();
	      */
	      
	      // 将MiniMultipart对象设置为邮件内容   
	      mailMessage.setContent(mainPart);   
	      // 发送邮件   
	      Transport.send(mailMessage);   
	      return true;   
      } catch (AuthenticationFailedException ex) {   
    	  logger.error("---error-->邮件发送失败，请检查发件人用户名/密码！<------");
      } catch(SMTPSendFailedException ex){
    	  logger.error("---error-->邮件发送失败，请检查发件人地址和用户名是否一致！<------");
      } catch(SendFailedException ex){
    	  logger.error("---error-->邮件发送失败，请检查收件人地址是否正确！<------");
      } catch(MessagingException ex){
    	  logger.error("---error-->邮件发送失败，请检查邮件服务器是否正确！<------");
      }
      return false;   
    }   
    
    /**
     * 发送现有的eml文件
     * @param mailInfo
     * @return
     */
    public static boolean sendMail(MailSenderInfo mailInfo) {   
        // 判断是否需要身份认证   
        MyAuthenticator authenticator = null;  
        Properties pro = mailInfo.getProperties();  
        //如果需要身份认证，则创建一个密码验证器    
        if (mailInfo.isValidate()) {   
          authenticator = new MyAuthenticator(mailInfo.getUserName(), mailInfo.getPassword());  
        }   
        // 根据邮件会话属性和密码验证器构造一个发送邮件的session   
        Session sendMailSession = Session.getDefaultInstance(pro,authenticator);   
        try {   
  	      // 根据session创建一个邮件消息   
  	      Message mailMessage = new MimeMessage(sendMailSession,new FileInputStream(mailInfo.getEmilPath()));   
  	      // 创建邮件发送者地址   
  	      Address from = new InternetAddress(mailInfo.getFromAddress());  
  	      // 设置邮件消息的发送者   
  	      mailMessage.setFrom(from);  
  	      
  	      /**
  	       * Message.RecipientType.CC
  	       */
  	      
  	      /**
  	       * 群发单显
  	       */
  	      InternetAddress[] internetAddressList=new InternetAddress[]{};
  	      
  	      // 创建邮件的接收者地址，并设置到邮件消息中   
  	      if(mailInfo.getToMoreAddress()!=null&&!mailInfo.getToMoreAddress().equals("")){
  	    	  InternetAddress[] toMore= new InternetAddress().parse(mailInfo.getToMoreAddress());
  	    	  mailMessage.setRecipients(Message.RecipientType.TO,toMore); //多个收件人  
  	    	  /**
  	    	   * 群发单显
  	    	   */
  	    	internetAddressList=toMore;
  	      }else{
  	    	  Address to = new InternetAddress(mailInfo.getToAddress());   
  	    	  mailMessage.setRecipient(Message.RecipientType.TO,to);  //单个收件人
  	      } 
  	      // 设置邮件消息的主题   
  	      mailMessage.setSubject(mailInfo.getSubject());   
  	      // 设置邮件消息发送的时间   
  	      if(mailInfo.getDate() == null){
  	    	mailMessage.setSentDate(new Date()); 
  	      }else{
  	    	mailMessage.setSentDate(mailInfo.getDate()); 
  	      }
  	    
  	      /**
  	       * 群发单显
  	       */
  	      if(internetAddressList.length>0&&mailInfo.isOneShow()){
  	    	  for(InternetAddress internetAddress:internetAddressList){
  	    		  mailMessage.setRecipient(Message.RecipientType.TO,internetAddress);  //单个收件人
    	    	  
  	    		  try{
  	    			  // 发送邮件   
  	    	  	      Transport.send(mailMessage);  
  	    		  }catch(SendFailedException ex){
  	    	      	  logger.error("---error-->邮件发送失败，请检查收件人地址是否正确！<------");
  	    		  }
  	    	  }
  	      }else{
  	    	  // 发送邮件   
  	  	      Transport.send(mailMessage);   
  	      }
  	      
  	      return true;   
        } catch (AuthenticationFailedException ex) {   
      	  logger.error("---error-->邮件发送失败，请检查发件人用户名/密码！<------");
        } catch(SMTPSendFailedException ex){
      	  logger.error("---error-->邮件发送失败，请检查发件人地址和用户名是否一致！<------");
        }  catch(MessagingException ex){
      	  logger.error("---error-->邮件发送失败，请检查邮件服务器是否正确！<------");
        } catch(FileNotFoundException ex){
          logger.error("---error-->邮件发送失败， 模板文件未找到！<------");
        }
        return false;   
      }   
}   