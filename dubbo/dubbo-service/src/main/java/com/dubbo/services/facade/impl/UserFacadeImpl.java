package com.dubbo.services.facade.impl;
import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.dubbo.common.entity.User;
import com.dubbo.facade.services.UserFacade;
import com.dubbo.services.UserService;

@Service("userFacade")
public class UserFacadeImpl implements UserFacade {
	
	@Resource
	private UserService userService;
	
	public User getUserById(String id) {
		
		User u = userService.findUserById(id);
		return u;
	}

}
