package com.blog.user.service;

import java.util.List;

import com.blog.user.core.entity.User;
/**
 * 用户接口类
 */
public interface UserService {
	
	/**
	 * 查询所有用户
	 * @return
	 */
	public List<User> findAll();
}
