package com.hecj.blog.service.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;
/**
 * 邮件发送记录
 */
public class SendEmailRecord  extends Model<SendEmailRecord> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(SendEmailRecord.class);
	public static final SendEmailRecord dao = new SendEmailRecord();

}
