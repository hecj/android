package com.hecj.blog.front.controller;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.service.model.AboutUs;
import com.jfinal.core.Controller;

public class IndexController extends Controller{

	private static final Log log = LogFactory.getLog(IndexController.class);
	
	public void index(){
		forwardAction("/article");
	}
	
	/**
	 * to注册
	 */
	public void register(){
		renderFreeMarker("/page/index/register.html");
	}
	
	/**
	 * to登录
	 */
	public void login(){
		setAttr("back_url",getPara("b"));
		renderFreeMarker("/page/index/login.html");
	}
	
	/**
	 * to忘记密码
	 */
	public void forget_password(){
		renderFreeMarker("/page/index/forget_password.html");
	}
	
	/**
	 * to 404
	 */
	public void page_404(){
		renderFreeMarker("/page/common/404.html");
	}
	
	/**
	 * 关于我们
	 */
	public void us(){
		List<AboutUs> aboutUsList = AboutUs.dao.findAll();
		setAttr("aboutUsList", aboutUsList);
		renderFreeMarker("/page/system/aboutUs.html");
	}
	
}
