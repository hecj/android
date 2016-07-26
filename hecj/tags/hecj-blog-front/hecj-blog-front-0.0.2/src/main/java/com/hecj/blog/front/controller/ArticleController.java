package com.hecj.blog.front.controller;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;

import com.hecj.blog.front.interceptor.LoginInterceptor;
import com.hecj.blog.front.util.UserUtil;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.ArticleComment;
import com.hecj.blog.service.model.ArticleContent;
import com.hecj.blog.service.model.ArticleType;
import com.hecj.blog.service.model.User;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.ext.interceptor.POST;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;

public class ArticleController extends Controller{
	
	private static final Log log = LogFactory.getLog(ArticleController.class);
	
	public void index(){
		
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
		if(!StringUtils.isBlank(typeStr)){
			type = Long.parseLong(typeStr);
			setAttr("type", type);
		}
		
		int pageNumber = getParaToInt(0,1);
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
			setAttr("articlePage", articlePage);
			setAttr("search_content", search_content);
			
		} catch (Exception e) {
			e.printStackTrace();
			renderError(404);
		}
		renderFreeMarker("/page/index/index.html");
	}
	
	/**
	 * 发布帖子
	 */
	@Before(LoginInterceptor.class)
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
	 * 发帖子提交
	 */
	@Before({POST.class,LoginInterceptor.class})
	public void saveActicle(){
		
		try {
			
			final User user = UserUtil.getUser(getSession());
			log.info(" user_id : " + user.getLong("id"));
			final String title = getPara("title");
			final String articleList = getPara("articleList");
			final String type = getPara("type");
			
			if(StringUtil.isStrEmpty(title)){
				renderJson(new ResultJson(-1l, "请输入标题"));
				return ;
			}
			
			if(StringUtil.isStrEmpty(articleList)){
				renderJson(new ResultJson(-1l, "请输入内容"));
				return ;
			}
			
			if(StringUtil.isStrEmpty(type)){
				renderJson(new ResultJson(-3l, "请选择类型"));
				return ;
			}
			
			Db.tx(new IAtom() {
				@Override
				public boolean run() throws SQLException {
					
					Article article = new Article();
					article.put("user_id", user.getLong("id"));
					article.put("title", title);
					article.put("type", type);
					article.put("create_at", System.currentTimeMillis());
					article.put("update_at", System.currentTimeMillis());
					article.save();
					log.info(" insert article id : " + article.getLong("id"));
					JSONArray arr = new JSONArray(articleList);
					for(int i = 0 ; i<arr.length() ; i++){
						JSONObject json = arr.getJSONObject(i);
						if(StringUtil.isObjectEmpty(json.getString("content"))){
							continue;
						}
						ArticleContent articleContent = new ArticleContent();
						articleContent.put("article_id", article.getLong("id"));
						if(json.getInt("type") == 2){
							String images = "";
							String[] imageList = json.getString("content").split(",");
							for(String image : imageList){
								images += image+",";
							}
							articleContent.put("content", images.substring(0, images.length()-1));
						} else{
							articleContent.put("content", json.getString("content"));
						}
						articleContent.put("content_type", json.getInt("type"));
						articleContent.put("create_at", System.currentTimeMillis());
						articleContent.put("update_at", System.currentTimeMillis());
						articleContent.put("sort", i);
						articleContent.save();
						log.info(" insert articleContent id : " + articleContent.getLong("id"));
					}
					return true;
				}
			});
			renderJson(new ResultJson(200l, "success"));
		} catch (Exception e) {
			e.printStackTrace();
			renderJson(new ResultJson(-100000l, e.getMessage()));
		}
		
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
		renderFreeMarker("/page/article/blog-detail.html");
	}
	
	/**
	 * 个人中心-我的随笔
	 */
	@Before(LoginInterceptor.class)
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
	@Before(LoginInterceptor.class)
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
	
	/**
	 * 编辑帖子
	 * 分两种情况：
	 *       1.编辑
	 *       	a.内容为空时，删除
	 *       2.插入
	 */
	@Before({POST.class,LoginInterceptor.class})
	public void editActicle(){
		
		try {
			
			final User user = UserUtil.getUser(getSession());
			log.info(" user_id : " + user.getLong("id"));
			final long article_id = getParaToLong("id");
			final String title = getPara("title");
			final String articleList = getPara("articleList");
			final String type = getPara("type");
			
			if(StringUtil.isStrEmpty(title)){
				renderJson(new ResultJson(-1l, "请输入标题"));
				return ;
			}
			if(StringUtil.isStrEmpty(articleList)){
				renderJson(new ResultJson(-1l, "请输入内容"));
				return ;
			}
			if(StringUtil.isStrEmpty(type)){
				renderJson(new ResultJson(-3l, "请选择类型"));
				return ;
			}
			
			Db.tx(new IAtom() {
				@Override
				public boolean run() throws SQLException {
					
					Article article = Article.dao.findById(article_id);
					article.set("title", title);
					article.set("type", type);
					article.set("update_at", System.currentTimeMillis());
					article.update();
					log.info(" update article id : " + article.getLong("id"));
					
					// 删除已有内容
					Db.update("delete from article_content where article_id = ?",new Object[]{article_id});
					
					JSONArray arr = new JSONArray(articleList);
					for(int i = 0 ; i<arr.length() ; i++){
						JSONObject json = arr.getJSONObject(i);
						
						// 内容为空时，不插入数据库
						if(StringUtil.isObjectEmpty(json.getString("content"))){
							continue;
						}
						
						// insert
						ArticleContent articleContent = new ArticleContent();
						articleContent.put("article_id", article.getLong("id"));
						if(json.getInt("type") == 2){
							String images = "";
							String[] imageList = json.getString("content").split(",");
							for(String image : imageList){
								images += image+",";
							}
							articleContent.put("content", images.substring(0, images.length()-1));
						} else{
							articleContent.put("content", json.getString("content"));
						}
						articleContent.put("content_type", json.getInt("type"));
						articleContent.put("create_at", System.currentTimeMillis());
						articleContent.put("update_at", System.currentTimeMillis());
						articleContent.put("sort", i);
						articleContent.save();
						log.info(" insert articleContent id : " + articleContent.getLong("id"));	
						
					}
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
