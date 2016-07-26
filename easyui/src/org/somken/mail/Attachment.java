package org.somken.mail;

import java.io.Serializable;
/**
 * 附件
 * @author he ChaoJie
 */
public class Attachment implements Serializable {
	
	private String filePath;
	private String fileName;
	
	public Attachment(){
		
	}
	
	public Attachment(String filePath){
		this.filePath = filePath;
	}
	
	public Attachment(String filePath,String fileName){
		this.filePath = filePath;
		this.fileName = fileName;
	}
	
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
}
