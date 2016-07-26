package com.duomeidai.service.dao;

import com.duomeidai.entity.Blog;

public interface BlogDao {

	public boolean addBlog(String name);
	
	public Blog findBlogById(long id);
}
