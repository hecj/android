package com.blog.front.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.blog.front.controller.base.BaseController;
import com.blog.user.core.entity.User;
import com.blog.user.service.UserService;

@Controller
@RequestMapping("user")
public class UserController extends BaseController{
	
	@Resource
	public UserService userService; 
	
	@RequestMapping(value="/list")
	@ResponseBody
	public String userList(HttpServletRequest request,HttpServletResponse response){
		List<User> userList = userService.findAll();
		return userList.toString();
	}
	
}
