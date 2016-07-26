package com.h5.framework.server.controller;

import java.sql.Timestamp;

import org.apache.log4j.Logger;

import com.h5.framework.server.emchat.EmchatUserAPI;
import com.h5.framework.server.intercept.LoginInterceptor;
import com.h5.framework.server.model.User;
import com.h5.framework.server.model.WxUserRelaton;
import com.h5.framework.server.util.MD5;
import com.h5.framework.server.util.ObjectUtils;
import com.h5.framework.server.util.ResultJson;
import com.h5.framework.server.util.UserUtil;
import com.jfinal.aop.Clear;

/**
 * 一级页面
 * @author hecj
 */
public class IndexController extends BaseController {
	
	
	private Logger log = Logger.getLogger(IndexController.class);
	
	/**
	 * 程序入口
	 */
	public void index(){
		redirect("/article");
	}
	
	public void upload(){

	}
	
	/**
	 * 登录页面
	 */
	@Clear(LoginInterceptor.class)
	public void login(){

	} 
	
	/**
	 * 登录
	 */
	@Clear(LoginInterceptor.class)
	public void doLogin(){
		final User user = User.dao.findByEmail(getPara("user"));
		if(user == null){
			renderJson(new ResultJson(-1l,"fail"));
			return;
		}
		if(user.getPassword().equals(MD5.md5crypt(getPara("passwd")))){
			// 存cookie
			UserUtil.setCookie(getResponse(), user);
			// 关联openId
			String openId = UserUtil.getOpenId(getRequest());
			if(UserUtil.isWeiXin(getRequest())){
				WxUserRelaton relation = WxUserRelaton.dao.findByOpenId(openId);
				if(relation == null){
					relation = new WxUserRelaton();
					relation.set("id", ObjectUtils.getUUID());
					relation.set("user_id", user.get("id"));
					relation.set("open_id", openId);
					relation.set("createtime", new Timestamp(System.currentTimeMillis()));
					relation.save();
				}
			}
			
			// 创建环信账号
			new Thread(){
				public void run() {
					Object rest = EmchatUserAPI.createUser(String.valueOf(user.getId()), "111111", user.getNickname());
					System.out.println("创建环信账号："+rest);
				};
			}.start();;
			renderJson(new ResultJson(200l,"success"));
		} else{
			renderJson(new ResultJson(-1l,"fail"));
		}
	} 
	
	/**
	 * 注销
	 */
	public void logout(){
		UserUtil.removeUser(getRequest(), getResponse());
		renderJson(new ResultJson(200l,"success"));
	}
	
	
}
