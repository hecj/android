package com.hecj.blog.front.interceptor;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.front.util.UserUtil;
import com.hecj.blog.service.model.User;
import com.jfinal.aop.Interceptor;
import com.jfinal.core.ActionInvocation;
/**
 * 登陆拦截器
 * by HECJ
 */
public class LoginInterceptor implements Interceptor{
	
	public static Log log = LogFactory.getLog(LoginInterceptor.class);
	
	public void intercept(ActionInvocation ai) {
		HttpServletRequest req = ai.getController().getRequest();
		HttpServletResponse resp = ai.getController().getResponse();
		User user = UserUtil.getUser(req.getSession());
		try {
			String queryString = req.getQueryString();
			String uri = req.getRequestURI();
			String back_url = uri;
			if(queryString != null){
				back_url = uri+"?"+queryString;
			}
		
			if(user == null){
				log.info(" user no login , back url : " + back_url);
				//AJAX请求
				if(req.getHeader("x-requested-with") !=null && req.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")){
					log.info("ajax访问超时，跳转到登录页面。");
					//给个状态码
					resp.setStatus(999);
					ai.getController().renderNull();
					return;
				}else{
					resp.sendRedirect("/login?b="+URLEncoder.encode(back_url,"UTF-8"));
				}
			} else{
				ai.invoke();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
			try {
				resp.sendRedirect("/");
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
}
