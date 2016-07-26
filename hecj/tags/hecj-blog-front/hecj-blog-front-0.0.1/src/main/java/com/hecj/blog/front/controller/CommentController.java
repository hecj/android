package com.hecj.blog.front.controller;

import java.sql.SQLException;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.front.interceptor.LoginInterceptor;
import com.hecj.blog.front.util.UserUtil;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.ArticleComment;
import com.hecj.blog.service.model.User;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.hecj.common.utils.encryp.MD5;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;

public class CommentController extends Controller{

	private static final Log log = LogFactory.getLog(CommentController.class);
	
	/**
	 * 提交评论
	 */
	@Before({POST.class,LoginInterceptor.class})
	public void saveComment(){
		
		final User user = UserUtil.getUser(getSession());
		/**
		 * 文章id
		 */
		final Long article_id = getParaToLong(0);
		final String content = getPara("content");

		if(StringUtil.isStrEmpty(content)){
			renderJson(new ResultJson(-1l, "评论不可为空"));
			return;
		}
		try {
			
			Db.tx(new IAtom() {
				@Override
				public boolean run() throws SQLException {
					/*
					 * 添加评论
					 */
					ArticleComment articleComment = new ArticleComment();
					articleComment.put("user_id", user.getLong("id"));
					articleComment.put("article_id", article_id);
					articleComment.put("content", content);
					articleComment.put("create_at", System.currentTimeMillis());
					articleComment.save();
					
					Article.dao.addCommentCount(article_id, 1);
					
					return true;
				}
			});
			
			
			renderJson(new ResultJson(200l, "success"));
			
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}
	}
	
}
