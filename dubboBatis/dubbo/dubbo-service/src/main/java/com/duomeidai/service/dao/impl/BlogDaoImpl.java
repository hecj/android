package com.duomeidai.service.dao.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.support.SqlSessionDaoSupport;

import com.duomeidai.entity.Blog;
import com.duomeidai.service.dao.BlogDao;

public class BlogDaoImpl extends SqlSessionDaoSupport implements BlogDao {
	
	public static final Log log = LogFactory.getLog(BlogDaoImpl.class);
	
	@Override
	public boolean addBlog(String name) {
		return true;
	}

	@Override
	public Blog findBlogById(long id) {
		log.info(" findBlogById : "+id);
		SqlSession session = this.getSqlSession();
		try {
			Blog blog = session.selectOne("findBlogById", id);
			return blog;
		} catch (Exception e) {
			
			e.printStackTrace();
		}
		return null;
	}
}
