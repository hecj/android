package com.code.product.freemarker.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FreemarkerController{
	
	@RequestMapping(value="/freemarker/index")
	public String getFree(HttpServletRequest request,HttpServletResponse response,Model model){
		
		
		
		return null;
	}
}
