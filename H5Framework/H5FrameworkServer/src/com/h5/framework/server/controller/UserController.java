package com.h5.framework.server.controller;

import org.apache.log4j.Logger;

import com.h5.framework.server.util.UserUtil;

/**
 * 用户
 */
public class UserController extends BaseController {
	
	private static final Logger log = Logger.getLogger(UserController.class);
	
	public void index(){
		
		setAttr("user", UserUtil.getUser(getRequest()));
	}
	
}





