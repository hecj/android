package test.hecj.blog.front.email;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.Test;

public class EmailTest {

	
	/**
	 * 
	 * 
	 * sendcloud_url = https://sendcloud.sohu.com/webapi/mail.send_template.json
sendcloud_apiUser = hechaojie_test_E0NKpD
sendcloud_apiKey = 4TG9thn1TepSTAZV
sendcloud_from_mail = 275070023@qq.com
	 * 
	 */
	@Test
	public void send_common() throws IOException {

	    final String url = "http://sendcloud.sohu.com/webapi/mail.send.json";

	    final String apiUser = "hechaojie_test_E0NKpD";
	    final String apiKey = "4TG9thn1TepSTAZV";
	    final String rcpt_to = "275070023@qq.com";

	    HttpPost httpost = new HttpPost(url);
	    HttpClient httpclient = new DefaultHttpClient();

	    List<NameValuePair> params = new ArrayList<NameValuePair>();
	    params.add(new BasicNameValuePair("api_user", apiUser));
	    params.add(new BasicNameValuePair("api_key", apiKey));
	    params.add(new BasicNameValuePair("to", rcpt_to));
	    params.add(new BasicNameValuePair("from", "mail@hecj.top"));
	    params.add(new BasicNameValuePair("fromname", "随笔乐园"));
	    params.add(new BasicNameValuePair("subject", "恭喜您注册成功"));
	    params.add(new BasicNameValuePair("html", "恭喜您注册成功，账户：何超杰 -- 随笔乐园"));
	    params.add(new BasicNameValuePair("resp_email_id", "true"));

	    httpost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));

	    HttpResponse response = httpclient.execute(httpost);

	    // response
	    if (response.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
	        System.out.println(EntityUtils.toString(response.getEntity()));
	    } else {
	        System.err.println("error");
	    }
	    httpost.releaseConnection();
	}
}
