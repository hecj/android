package com.hecj.blog.admin.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.mail.MessagingException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import com.hecj.blog.service.email.EmailVars;
import com.hecj.blog.service.email.MailSendService;
import com.hecj.blog.service.util.Constant;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.jfinal.core.Controller;
/**
 * 系统通知
 */
public class SystemNoticeController extends Controller{

	private static final Log log = LogFactory.getLog(SystemNoticeController.class);
	
	/**
	 * to send notice
	 */
	public void toSendNotice(){
		
		renderFreeMarker("/page/systemNotice/sendNotice.html");
	}
	
	/**
	 * do send notice
	 */
	public void doSendNotice(){
		String email = getPara("email");
		String title = getPara("title");
		String content = getPara("content");
		if(StringUtil.isObjectEmpty(email)){
			renderJson(new ResultJson(-1l,"email is empty"));
			return ;
		}
		if(StringUtil.isObjectEmpty(title)){
			renderJson(new ResultJson(-2l,"title is empty"));
			return ;
		}
		if(StringUtil.isObjectEmpty(content)){
			renderJson(new ResultJson(-3l,"content is empty"));
			return ;
		}
		try {
//			sendEmail(email,email,"用户注册成功",content);
			
			MailSendService mailSendService = new MailSendService();
			
			EmailVars emailVars = new EmailVars().setEmail(email).putVar("%email%", email);
			
			mailSendService.sendEmail(title, "email_user_reg_success", emailVars);
			renderJson(new ResultJson(200l,"success"));
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			renderJson(new ResultJson(-100000l,e.getMessage()));
			return;
		}
	}
	
	public void sendEmail(String userName,String userEmail, String title, String content)
			throws MessagingException {
		StringBuffer sb = new StringBuffer();
		sb.append("<HTML><BODY style='border-width:0px'>");
		sb.append("<H4 style='font-weight:normal;font-size:14px'>尊敬的<span>");
		sb.append(userName);
		sb.append("</span>:</H4>");
		sb.append("<BR/>");
		sb.append("<DIV>" + content + "</DIV>");
		sb.append("<BR/>");
		sb.append("<DIV style='padding-top:30px;'>随笔乐园团队<BR/>");
		sb.append("<a href='http://www.hecj.top'>http://www.hecj.top</a>");
		sb.append("<DIV style='BORDER-TOP: #cccccc 1px dashed; OVERFLOW: hidden; HEIGHT: 1px ;margin-top:30px;'></DIV>");
		sb.append("<DIV style='padding-top:20px;'>注：此邮件由系统自动发送，请勿回复。</DIV>");
		sb.append("<DIV style='padding-top:10px;'>如果您有任何疑问，请您查看 <a href='http://www.hecj.top'>帮助</a>，或 联系客服QQ："
				+ "275070023" + "。</DIV>");
		sb.append("</BODY></HTML>");
		sendEmailHtml(userEmail, title, content);
	}
	
	public void sendEmailHtml(String email, String title, String html) {
		try {
			log.info("发送邮件信息：to:" + email + ",subject：" + title + ",content:" + html);

			String url = Constant.sendcloud_url;
			HttpClient httpclient = new DefaultHttpClient();
			HttpPost httpost = new HttpPost(url);
			List<BasicNameValuePair> nvps = new ArrayList<BasicNameValuePair>();
			nvps.add(new BasicNameValuePair("api_user",Constant.sendcloud_apiUser));
			nvps.add(new BasicNameValuePair("api_key",Constant.sendcloud_apiKey));
			nvps.add(new BasicNameValuePair("from",Constant.sendcloud_from_mail));
			nvps.add(new BasicNameValuePair("fromname",Constant.sendcloud_from_mail));
			nvps.add(new BasicNameValuePair("template_invoke_name", "email_user_reg_success"));
			nvps.add(new BasicNameValuePair("to", email));
			nvps.add(new BasicNameValuePair("subject", title));
			nvps.add(new BasicNameValuePair("html", html));

			httpost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
			// 请求
			HttpResponse response = httpclient.execute(httpost);
			// 处理响应
			if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) { //
				// 正常返回
				// 读取xml文档
				String result = EntityUtils.toString(response.getEntity());
				log.info("发送邮件返回信息：" + result);
				// Document doc = null;
				// doc = DocumentHelper.parseText(result);
				// Element rootElt = doc.getRootElement(); // 获取根节点
				// Element element = rootElt.element("message");
				// if (element.getText().equals("success")) {
				// 		log.info("邮件发送成功");
				// } else {
				// 		log.info("邮件发送失败");
				// 		log.error("发送邮件返回信息：" + result);
				// }
			} else {
				log.info("发送邮件失败：");
			}
		} catch (Exception e) {
			log.info("发送邮件失败：");
			e.printStackTrace();
		}
	}
}
