package com.hecj.blog.admin.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.admin.util.UserUtil;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.PUser;
import com.hecj.common.utils.DateFormatUtil;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.hecj.common.utils.encryp.MD5;
import com.jfinal.aop.Before;
import com.jfinal.aop.ClearInterceptor;
import com.jfinal.aop.ClearLayer;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Page;

public class IndexController extends Controller{

	private static final Log log = LogFactory.getLog(IndexController.class);
	
	public void index(){
		renderFreeMarker("/index.html");
	}

	/**
	 * to login
	 */
	@ClearInterceptor(ClearLayer.ALL)
	public void login(){
		renderFreeMarker("/page/login/login.html");
	}
	
	/**
	 * do login by ajax
	 */
	@Before(POST.class)
	@ClearInterceptor(ClearLayer.ALL)
	public void doLogin(){
		String username = getPara("username");
		String password = getPara("password");
		String imageCode = getPara("imageCode");
		log.info("doLogin username {} password {} : " + username + "," + password);
		if (StringUtil.isStrEmpty(username)) {
			log.info("username is empty");
			renderJson(new ResultJson(-1l, "username is empty"));
			return;
		}
		if (StringUtil.isStrEmpty(password)) {
			log.info("password is empty");
			renderJson(new ResultJson(-2l, "password is empty"));
			return;
		}
		String session_random_code = getSessionAttr("session_random_code");
		if (!session_random_code.equalsIgnoreCase(imageCode)){
			log.info("checkcode is error");
			renderJson(new ResultJson(-6l, "checkcode is error"));
			return;
		}
		try {
			PUser puser = PUser.dao.findPUserByUserName(username);
			if (puser == null){
				log.info("user not exist");
				renderJson(new ResultJson(-3l, "user not exist"));
				return;
			}
			if (!MD5.md5crypt(password).equals(puser.getStr("password"))) {
				log.info("password is wrong");
				renderJson(new ResultJson(-4l, "password is wrong"));
				return;
			}
			if (puser.getInt("is_delete") != 0){
				log.info("user is lock");
				renderJson(new ResultJson(-5l, "user is lock"));
				return;
			}
			UserUtil.setPUser(puser, getSession());
			renderJson(new ResultJson(200l,"login success"));
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, " server exception"));
		}
	}
	
	/**
	 * logout
	 */
	public void logout(){
		UserUtil.removePUser(getSession());
		redirect("/login");
	}
	
	/**
	 * to 404
	 */
	public void page_404(){
		renderFreeMarker("/page/common/404.ftl");
	}
	
}
