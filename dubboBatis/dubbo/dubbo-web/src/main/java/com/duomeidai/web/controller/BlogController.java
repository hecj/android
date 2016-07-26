package com.duomeidai.web.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.condition.ParamsRequestCondition;

import com.duomeidai.service.BlogService;
@RequestMapping("blog")
@Controller
public class BlogController extends BaseController {
	
	@Resource
	private BlogService blogService ;

	@RequestMapping(params="operator=hello")
	@ResponseBody
	public String hello(HttpServletRequest request,HttpServletResponse response){
		return blogService.getBlogName("hello");
	}
	
	@RequestMapping(value="/find/{id}")
	@ResponseBody
	public String find(@PathVariable Long id,HttpServletRequest request,HttpServletResponse response){
		return blogService.findBlogById(id).getName();
	}
	
}
