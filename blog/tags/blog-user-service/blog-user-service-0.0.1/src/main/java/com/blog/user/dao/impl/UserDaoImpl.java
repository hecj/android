package com.blog.user.dao.impl;

import java.util.List;

import org.mybatis.spring.support.SqlSessionDaoSupport;

import com.blog.user.core.entity.User;
import com.blog.user.dao.UserDao;

public class UserDaoImpl extends SqlSessionDaoSupport implements UserDao {
	
	@Override
	public List<User> findAll() {
		return this.getSqlSession().selectList("findAll");
	}

}
