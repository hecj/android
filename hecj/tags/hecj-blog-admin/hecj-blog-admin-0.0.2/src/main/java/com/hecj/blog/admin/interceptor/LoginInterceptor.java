package com.hecj.blog.admin.interceptor;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.admin.util.UserUtil;
import com.hecj.blog.service.model.PUser;
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
		PUser user = UserUtil.getPUser(req.getSession());
		try {
			String queryString = req.getQueryString();
			String uri = req.getRequestURI();
			String back_url = uri;
			if(queryString != null){
				back_url = uri+"?"+queryString;
			}
			log.info("back_url:"+back_url);
			if(user == null){
				log.info("用户未登录或登录超时，跳转到登录页面。");
				log.info("uri{},queryString{}:"+uri+","+queryString);

				//AJAX请求
				if(req.getHeader("x-requested-with") !=null && req.getHeader("x-requested-with").equalsIgnoreCase("XMLHttpRequest")){
					log.info("ajax访问超时，跳转到登录页面。");
					//给个状态码
					resp.setStatus(999);
					ai.getController().renderNull();
					return;
				}else{
					ai.getController().renderHtml("<script>top.location.href='/login'</script>");
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
