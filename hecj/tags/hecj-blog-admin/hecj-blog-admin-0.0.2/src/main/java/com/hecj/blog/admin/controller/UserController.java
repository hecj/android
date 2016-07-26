package com.hecj.blog.admin.controller;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.service.model.User;
import com.hecj.common.utils.StringUtil;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Page;

public class UserController extends Controller{

	private static final Log log = LogFactory.getLog(UserController.class);
	
	/**
	 * user list
	 */
	public void manager(){
		
		Map<String,Object> params = new HashMap<String,Object>();
		
		Integer pageNumber = getParaToInt("pageNumber",1);
		Integer pageSize = getParaToInt("pageSize",20);
		String email = getPara("email");
		
		params.put("page", pageNumber);
		params.put("size", pageSize);
		
		if(!StringUtil.isStrEmpty(email)){
			params.put("email", email);
		}
		
		try {
			Page<User> userPage = User.dao.findUserByCondition(params);
			setAttr("userPage", userPage);
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			throw e;
		}
		setAttr("email", email);
		
		renderFreeMarker("/page/user/manager.html");
	}
	
}
