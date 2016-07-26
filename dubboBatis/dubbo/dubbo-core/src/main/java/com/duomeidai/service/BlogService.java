package com.duomeidai.service;

import com.duomeidai.entity.Blog;

public interface BlogService {
	
	public String getBlogName(String name);
	
	public Blog findBlogById(long id);
}
