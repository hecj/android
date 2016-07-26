package com.dubbo.services.impl;

import org.springframework.stereotype.Service;

import com.dubbo.common.entity.User;
import com.dubbo.services.UserService;

@Service("userService")
public class UserServiceImpl implements UserService {

	public User findUserById(String id) {

		User u = new User();
		u.setId(id);
		u.setCode("code");
		u.setName("张三");
		return u;
	}

}
