package com.duomeidai.service.impl;


import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.duomeidai.entity.Blog;
import com.duomeidai.service.BlogService;
import com.duomeidai.service.dao.BlogDao;

public class BlogServiceImpl implements BlogService {
	
	public static Log log = LogFactory.getLog(BlogServiceImpl.class);
	
	@Resource
	private BlogDao blogDao;

	public String getBlogName(String name) {
		
		log.info("name:"+name);
		return "blog:"+name;
	}

	@Override
	public Blog findBlogById(long id) {
		return blogDao.findBlogById(id);
	}

}
