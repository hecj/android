package com.hecj.blog.service.email;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import com.hecj.blog.service.util.Constant;
/**
 * 发送邮件业务类
 */
public class MailSendService {
	
	private static final Log log = LogFactory.getLog(MailSendService.class);
	
	/**
	 * 一次发送一个邮件
	 */
	public void sendEmail(String title, String template, EmailVars email) {
		List<EmailVars> emailList = new ArrayList<EmailVars>();
		emailList.add(email);
		sendEmail(title, template, emailList);
	}
	
	/**
	 * 一次发送多个邮件
	 */
	public void sendEmail(String title, String template, List<EmailVars> emailList) {
		
	    String vars = convert(emailList);
	    log.info("邮件参数："+vars);
	    HttpClient httpclient = new DefaultHttpClient();
	    HttpPost httpost = new HttpPost(Constant.sendcloud_url);

	    List<NameValuePair> params = new ArrayList<NameValuePair>();
	    params.add(new BasicNameValuePair("api_user", Constant.sendcloud_apiUser));
	    params.add(new BasicNameValuePair("api_key", Constant.sendcloud_apiKey));
	    params.add(new BasicNameValuePair("substitution_vars", vars));
	    params.add(new BasicNameValuePair("template_invoke_name", template));
	    params.add(new BasicNameValuePair("from", Constant.sendcloud_from_mail));
	    params.add(new BasicNameValuePair("fromname", Constant.sendcloud_fromname));
	    params.add(new BasicNameValuePair("subject", title));
	    // 模板发送不用传
//	    params.add(new BasicNameValuePair("html", content));
	    params.add(new BasicNameValuePair("resp_email_id", "true"));
	    try {

	    	httpost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
	    	HttpResponse response = httpclient.execute(httpost);

		    if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) { // 正常返回
		        log.info(EntityUtils.toString(response.getEntity()));
		    } else {
		        System.err.println("error");
		    }
		} catch (Exception e) {
			e.printStackTrace();
		} finally{
			httpost.releaseConnection();
		}
	}
	
	private static String convert(List<EmailVars> emailList) {

	    JSONObject ret = new JSONObject();
	    // 参数keys
	    Set<String> keys = emailList.get(0).getVars().keySet();
	    // keys data
	    Map<String, List<Object>> keyDataMap = new HashMap<String, List<Object>>();
	    
	    for(String key : keys){
	    	keyDataMap.put(key, new ArrayList<Object>());
	    }
	    
	    JSONArray to = new JSONArray();
	    for (EmailVars ev : emailList) {
	    	 // 手机人邮件列表
	    	to.put(ev.getEmail());
	    	// 数据集
	    	Map<String,String> vars = ev.getVars();
	    	Set<String> tempKeys = ev.getVars().keySet();
	    	for(String tempKey : tempKeys){
	    		List<Object> datas = keyDataMap.get(tempKey);
	    		datas.add(vars.get(tempKey));
	    	}
	    }

	    ret.put("to", to);
	    ret.put("sub", keyDataMap);

	    return ret.toString();
	}
}
