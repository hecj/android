package com.dubbo.web.controller;


import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.dubbo.common.entity.User;
import com.dubbo.facade.services.UserFacade;
import com.dubbo.web.controller.base.BaseController;

@Controller
@RequestMapping("user.htm")
public class UserController extends BaseController {
	
	@Resource
	private UserFacade userFacade ;
	
	public void setUserFacade(UserFacade userFacade) {
		this.userFacade = userFacade;
	}

	@RequestMapping(params="operator=login")
	@ResponseBody
	public String login(HttpServletRequest request,HttpServletResponse response){
		return new Date().toString();
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest arg0,
			HttpServletResponse arg1) throws Exception {
		return null;
	}
	
	@RequestMapping(params="m=json")
	@ResponseBody
	public User json(HttpServletRequest request,HttpServletResponse response){
		System.out.println("我进来了...");
		String id = request.getParameter("id");
		User u = userFacade.getUserById(id);
		return u;
	}

}
