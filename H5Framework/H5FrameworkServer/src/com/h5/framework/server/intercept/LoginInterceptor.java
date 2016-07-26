package com.h5.framework.server.intercept;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.h5.framework.server.model.User;
import com.h5.framework.server.util.UserUtil;
import com.jfinal.aop.Interceptor;
import com.jfinal.aop.Invocation;
/**
 * 登陆拦截器
 * by hecj
 */
public class LoginInterceptor implements Interceptor{
	
	public static Log log = LogFactory.getLog(LoginInterceptor.class);
	
	public void intercept(Invocation ai) {
		HttpServletRequest req = ai.getController().getRequest();
		HttpServletResponse resp = ai.getController().getResponse();
		User user = UserUtil.getUser(req);
		try {
			System.out.println("登录拦截器...");
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
					resp.sendRedirect("/login");
					ai.getController().renderNull();
					return;
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
