package com.h5.framework.server.controller;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.h5.framework.server.model.Article;
import com.h5.framework.server.model.ArticleComment;
import com.h5.framework.server.model.ArticleContent;
import com.h5.framework.server.model.ArticleType;
import com.h5.framework.server.model.User;
import com.h5.framework.server.util.ResultJson;
import com.h5.framework.server.util.StringUtil;
import com.h5.framework.server.util.UserUtil;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;

public class ArticleController extends Controller{
	
	private static final Log log = LogFactory.getLog(ArticleController.class);
	
	public void index(){
		System.out.println("查询文章列表...");
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("pageNumber", 1);
		params.put("pageSize", 10);
		
		Page<Article> articlePage = Article.dao.queryArticleByPage(params);
		setAttr("page", articlePage);
	}
	
	/**
	 * 文章列表
	 */
	public void articleList(){
		
		String typeStr = getPara("type");
		// search question 查询的问题
		String search_content = getPara("sq");
		log.info("search_content{}:"+search_content);
		try {
			if(!StringUtil.isStrEmpty(search_content)){
				search_content = new String(search_content.getBytes("ISO-8859-1"),"UTF-8");
			}
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		log.info("log{}:"+typeStr);
		log.info("search_content{}:"+search_content);
		long type = -1l;
		if(!StringUtil.isStrEmpty(typeStr)){
			type = Long.parseLong(typeStr);
			setAttr("type", type);
		}
		
		int pageNumber = getParaToInt("pageNum", 1);
		log.info("pageNumber:"+pageNumber);
		try {
			
			List<ArticleType> articleTypeList = ArticleType.dao.findAll();
			setAttr("articleTypeList", articleTypeList);
			
			Map<String,Object> params = new HashMap<String,Object>();
			if(type != -1){
				params.put("type", type);
			}
			params.put("pageNumber", pageNumber);
			params.put("pageSize", 10);
			params.put("search_content", search_content);
			
			Page<Article> articlePage = Article.dao.queryArticleByPage(params);
			
			renderJson(new ResultJson(200l,articlePage,"success"));
			
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l,"fail"));
		}
	}
	
	/**
	 * 发布帖子
	 */
	public void publish(){
		try {
			
			List<ArticleType> articleTypeList = ArticleType.dao.findAll();
			setAttr("articleTypeList", articleTypeList);
			
		} catch (Exception e) {
			e.printStackTrace();
			renderError(500);
		}
		renderFreeMarker("/page/article/posting.html");
	}
	
	/**
	 * 文章详情
	 */
	public void detail(){
		
		long article_id = getParaToLong(0);
		log.info("article_id{}:"+article_id);
		try {
			Article article = Article.dao.findById(article_id);
			if(article == null){
				renderError(404);
				return ;
			}
			setAttr("article", article);
			
			User author = User.dao.findById(article.get("user_id"));
			setAttr("author", author);
			
			List<ArticleType> articleTypeList = ArticleType.dao.findAll();
			setAttr("articleTypeList", articleTypeList);
			
			List<ArticleContent> articleContentList = ArticleContent.dao.findByArticleId(article_id);
			setAttr("articleContentList", articleContentList);
			
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("article_id", article_id);
			params.put("pageNumber", 1);
			params.put("pageSize", 10);
			Page<ArticleComment> articleCommentPage = ArticleComment.dao.queryArticleCommentByPage(params);
			setAttr("articleCommentPage", articleCommentPage);
			
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			throw e;
		}
	}
	
	/**
	 * 个人中心-我的随笔
	 */
	public void user(){
		
		User user = UserUtil.getUser(getSession());
		try {
			int pageNumber = getParaToInt(0,1);
			log.info("pageNumber:"+pageNumber);
			Map<String,Object> params = new HashMap<String,Object>();
			params.put("pageNumber", pageNumber);
			params.put("pageSize", 10);
			params.put("user_id", user.getLong("id"));
			Page<Article> articlePage = Article.dao.queryArticleByPage(params);
			setAttr("articlePage", articlePage);
			
			renderFreeMarker("/page/user/index.html");
		} catch (Exception e) {
			renderError(400);
		}
	}
	
	/**
	 * 个人中心-我的随笔-编辑
	 */
	public void edit(){
		
		User user = UserUtil.getUser(getSession());
		try {
			long article_id = getParaToLong(0);
			log.info("article_id{}:"+article_id);
			Article article = Article.dao.findById(article_id);
			if(article == null){
				renderError(404);
				return ;
			}
			
			if(article.getLong("user_id").compareTo(user.getLong("id"))!=0){
				renderError(404);
				return ;
			}
			
			setAttr("article", article);
			setAttr("author", user);
			
			List<ArticleType> articleTypeList = ArticleType.dao.findAll();
			setAttr("articleTypeList", articleTypeList);
			
			List<ArticleContent> articleContentList = ArticleContent.dao.findByArticleId(article_id);
			setAttr("articleContentList", articleContentList);
			
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			renderError(500);
		}
		renderFreeMarker("/page/article/blog-edit.html");
	}
	
}
