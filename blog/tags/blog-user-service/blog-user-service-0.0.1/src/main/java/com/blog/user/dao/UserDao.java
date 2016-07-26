package com.blog.user.dao;

import java.util.List;

import com.blog.user.core.entity.User;

public interface UserDao {
	
	public List<User> findAll();
}
