package org.somken.mail;
/**  
* 发送邮件需要使用的基本信息  
* @author he ChaoJie
* @version 2013-7-12 上午10:47:41 he ChaoJie
*/   
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.Vector;
public class MailSenderInfo {   
	
	/**
	 * 发送现有的文件
	 */
	private String emilPath;
    
	/**
     * 发送邮件的服务器的IP和端口   
     */
    private String mailServerHost;   
    /**
     * 默认端口
     */
    private String mailServerPort = "25";   
    /**
     * 邮件发送者的地址   
     */
    private String fromAddress;   
    private boolean isOneShow=false;
	public boolean isOneShow() {
		return isOneShow;
	}
	public void setOneShow(boolean isOneShow) {
		this.isOneShow = isOneShow;
	}
	/**
     * 邮件接收者的地址   
     */
    private String toAddress;  
    /**
     * 发送多个的收件人
     */
    private String toMoreAddress="";
	/**
     * 登陆邮件发送服务器的用户名   
     */
    private String userName;  
    /**
     * 登陆邮件发送服务器的密码   
     */
    private String password;   
    /**
     * 是否需要身份验证   
     */
    private boolean validate = false; 
    /**
     * 发送时间
     */
    private Date date = null;
	/**
     * 邮件主题   
     */
    private String subject;   
    /**
     * 邮件的文本内容   
     */
    private String content;   
    /**
     * 附件文件集合(vector)
     */
    private Vector attachmentVector = new Vector();
	/**
     * 附件集合（list）
     */
    private List<Attachment> attachmentList = new ArrayList<Attachment>();
    /**  
     * 获得邮件会话属性  
     */   
    public Properties getProperties(){   
      Properties p = new Properties();   
      p.put("mail.smtp.host", this.mailServerHost);   
      p.put("mail.smtp.port", this.mailServerPort);   
      p.put("mail.smtp.auth", validate ? "true" : "false");   
      return p;   
    }   
    public List<Attachment> getAttachmentList() {
		return attachmentList;
	}

	public void setAttachmentList(List<Attachment> attachmentList) {
		this.attachmentList = attachmentList;
	}
	/**
	 * 添加附件add
	 * @param attachment
	 */
	public void addAttachment(Attachment attachment){
		//this.attachmentList.add(attachment);
		this.attachmentVector.addElement(attachment);
	}
	
	/**
	 * 添加附件
	 * @param filePath
	 */
	public void addAttachment(String filePath){
		//this.attachmentList.add(new Attachment(filePath));
		this.attachmentVector.addElement(new Attachment(filePath));
	}
	
	/**
	 * 添加附件
	 * @param filePath
	 * @param fileName
	 */
	public void addAttachment(String filePath,String fileName){
		//this.attachmentList.add(new Attachment(filePath,fileName));
		this.attachmentVector.addElement(new Attachment(filePath,fileName));
	}
	public String getEmilPath() {
		return emilPath;
	}
	public void setEmilPath(String emilPath) {
		this.emilPath = emilPath;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public Vector getAttachmentVector() {
		return attachmentVector;
	}
	public void setAttachmentVector(Vector attachmentVector) {
		this.attachmentVector = attachmentVector;
	}
	public String getToMoreAddress() {
		return toMoreAddress;
	}
	public void setToMoreAddress(String toMoreAddress) {
		this.toMoreAddress = toMoreAddress;
	}
	public void setToMoreAddress(String[] toMoreAddress) {
		for(String filePath : toMoreAddress){
			this.toMoreAddress+=filePath+",";
		}
		if(toMoreAddress.length>0){
			this.toMoreAddress=this.toMoreAddress.substring(0, this.toMoreAddress.length()-1);
		}
		//this.toMoreAddress = toMoreAddress;
	}
    public String getMailServerHost() {   
      return mailServerHost;   
    }   
    public void setMailServerHost(String mailServerHost) {   
      this.mailServerHost = mailServerHost;   
    }  
    public String getMailServerPort() {   
      return mailServerPort;   
    }  
    public void setMailServerPort(String mailServerPort) {   
      this.mailServerPort = mailServerPort;   
    }  
    public boolean isValidate() {   
      return validate;   
    }  
    public void setValidate(boolean validate) {   
      this.validate = validate;   
    }  
    public String getFromAddress() {   
      return fromAddress;   
    }   
    public void setFromAddress(String fromAddress) {   
      this.fromAddress = fromAddress;   
    }  
    public String getPassword() {   
      return password;   
    }  
    public void setPassword(String password) {   
      this.password = password;   
    }  
    public String getToAddress() {   
      return toAddress;   
    }   
    public void setToAddress(String toAddress) {   
      this.toAddress = toAddress;   
    }   
    public String getUserName() {   
      return userName;   
    }  
    public void setUserName(String userName) {   
      this.userName = userName;   
    }  
    public String getSubject() {   
      return subject;   
    }  
    public void setSubject(String subject) {   
      this.subject = subject;   
    }  
    public String getContent() {   
      return content;   
    }  
    public void setContent(String textContent) {   
      this.content = textContent;   
    }   
}   