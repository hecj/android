package com.hecj.blog.front.controller;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.service.model.AuthToken;
import com.jfinal.core.Controller;

public class AuthController extends Controller{

	private static final Log log = LogFactory.getLog(AuthController.class);
	
	/**
	 * 注册设置密码
	 */
	public void set_passwd(){
		
		final String token = getPara("token");
		
		AuthToken authToken = AuthToken.dao.findByToken(token);
		if(authToken == null){
			forwardAction("/page_404");
			return;
		}
		
		if(authToken.getInt("is_verify") == 1){
			// token 无效
			forwardAction("/page_404");
			return;
		}
		
		Long create_at = authToken.getLong("create_at");
		Long valid_at = authToken.getLong("valid_at");
		
		if (create_at.longValue() + 24 * 60 * 60 * 1000 > valid_at.longValue()) {
			// token 无效
			forwardAction("/page_404");
			return;
		}
		
		setAttr("token", token);
		renderFreeMarker("/page/index/set_passwd.html");
		
	}
	
}
