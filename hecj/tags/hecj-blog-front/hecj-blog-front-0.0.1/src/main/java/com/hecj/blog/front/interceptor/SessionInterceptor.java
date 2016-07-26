package com.hecj.blog.front.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.front.util.UserUtil;
import com.hecj.blog.service.model.User;
import com.hecj.blog.service.util.Constant;
import com.jfinal.aop.Interceptor;
import com.jfinal.core.ActionInvocation;
/**
 * Session拦截器
 * by HECJ
 */
public class SessionInterceptor implements Interceptor{
	
	public static Log log = LogFactory.getLog(SessionInterceptor.class);
	
	@Override
	public void intercept(ActionInvocation ai) {
		
		String req_url = "";
		try {
			
			HttpSession session = (HttpSession) ai.getController().getSession();
			HttpServletRequest req = ai.getController().getRequest();
			
			String queryString = req.getQueryString();
			String uri = req.getRequestURI();
			req_url = uri;
			if(queryString != null){
				req_url = uri+"?"+queryString;
			}
			
			log.info("rquest url : "+req_url);
			
			User user = UserUtil.getUser(session);
			if(user != null){
				ai.getController().setAttr("user", user);
			}
			
			ai.getController().setAttr("STATIC_URL", Constant.STATIC_URL);
			
		} catch (Exception e) {
			log.error(" request url :" +req_url);
			log.error("Session拦截器出现异常，请查明原因：");
			e.printStackTrace();
		}
		
		ai.invoke();
	}

}
