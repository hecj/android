package com.hecj.blog.admin.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.service.model.PUser;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.hecj.common.utils.encryp.MD5;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;

public class PUserController extends Controller{

	private static final Log log = LogFactory.getLog(PUserController.class);
	
	/**
	 * puser list
	 */
	public void manager(){
		
		Map<String,Object> params = new HashMap<String,Object>();
		
		Integer pageNumber = getParaToInt("pageNumber",1);
		Integer pageSize = getParaToInt("pageSize",20);
		String username = getPara("username");
		
		params.put("page", pageNumber);
		params.put("size", pageSize);
		
		if(!StringUtil.isStrEmpty(username)){
			params.put("username", username);
		}
		
		try {
			Page<PUser> puserPage = PUser.dao.findAll(params);
			setAttr("puserPage", puserPage);
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			throw e;
		}
		setAttr("username", username);
		
		renderFreeMarker("/page/puser/manager.html");
	}
	
	/**
	 * toAdd puser
	 */
	public void toAdd(){
		
		renderFreeMarker("/page/puser/add.html");
	}
	
	/**
	 * doAdd puser
	 */
	public void doAdd(){

		try {
			
			String username = getPara("username");
			String nickname = getPara("nickname");
			String password = getPara("password");
			String repassword = getPara("repassword");
			
			if(StringUtil.isObjectEmpty(username)){
				renderJson(new ResultJson(-5l, "请输入用户名"));
				return;
			}
			PUser puser = PUser.dao.findPUserByUserName(username);
			if(puser != null){
				renderJson(new ResultJson(-1l, "用户已注册"));
				return;
			}
			
			if(StringUtil.isObjectEmpty(password)){
				renderJson(new ResultJson(-2l, "请输入密码"));
				return;
			}
			
			if(!password.equals(repassword)){
				renderJson(new ResultJson(-3l, "密码不一致"));
				return;
			}
			
			PUser p = new PUser();
			p.put("username", username);
			p.put("nickname", nickname);
			p.put("password", MD5.md5crypt(password));
			p.put("is_delete", 0);
			p.put("create_at", System.currentTimeMillis());
			p.put("update_at", System.currentTimeMillis());
			p.save();
			renderJson(new ResultJson(200l, "success"));
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}

	
	}
	
}
