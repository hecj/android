package com.blog.user.service.impl;

import java.util.List;

import javax.annotation.Resource;

import com.blog.user.core.entity.User;
import com.blog.user.dao.UserDao;
import com.blog.user.service.UserService;

public class UserServiceImpl implements UserService {

	@Resource
	private UserDao userDao;
	
	@Override
	public List<User> findAll() {
		return userDao.findAll();
	}

}
