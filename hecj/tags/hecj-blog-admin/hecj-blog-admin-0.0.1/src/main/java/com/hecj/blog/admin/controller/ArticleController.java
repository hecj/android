package com.hecj.blog.admin.controller;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;

import com.hecj.blog.admin.util.UserUtil;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.ArticleContent;
import com.hecj.blog.service.model.ArticleType;
import com.hecj.blog.service.model.PUser;
import com.hecj.blog.service.model.User;
import com.hecj.common.utils.DateFormatUtil;
import com.hecj.common.utils.ResultJson;
import com.hecj.common.utils.StringUtil;
import com.jfinal.core.Controller;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.IAtom;
import com.jfinal.plugin.activerecord.Page;

public class ArticleController extends Controller{

	private static final Log log = LogFactory.getLog(ArticleController.class);
	
	public void manager(){
		
		long article_type = getParaToLong("article_type",-1l);
		String email = getPara("email");
		String title = getPara("title");
		String create_at_begin = getPara("create_at_begin");
		String create_at_end = getPara("create_at_end");
		Integer page = getParaToInt("pageNumber",1);
		Integer pageSize = getParaToInt("pageSize",20);
		
		Map<String,Object> params = new HashMap<String,Object>();
		if(article_type != -1){
			params.put("article_type", article_type);
		}
		if(!StringUtil.isObjectEmpty(email)){
			params.put("email", email);
		}
		if(!StringUtil.isObjectEmpty(create_at_begin)){
			params.put("create_at_begin", DateFormatUtil.parse(create_at_begin, "yyyy-MM-dd HH:mm:ss").getTime());
		}
		if(!StringUtil.isObjectEmpty(create_at_end)){
			params.put("create_at_end", DateFormatUtil.parse(create_at_end, "yyyy-MM-dd HH:mm:ss").getTime());
		}
		if(!StringUtil.isObjectEmpty(email)){
			params.put("email", email);
		}
		if(!StringUtil.isObjectEmpty(title)){
			params.put("search_content", title);
		}
		params.put("pageNumber", page);
		params.put("pageSize", pageSize);
		
		Page<Article> articlePage = Article.dao.queryArticleByPage(params);
		
		setAttr("articlePage", articlePage);
		setAttr("email", email);
		setAttr("title", title);
		setAttr("create_at_begin", create_at_begin);
		setAttr("create_at_end", create_at_end);
		
		renderFreeMarker("/page/article/manager.html");
	}
	
	/**
	 * article detail
	 */
	public void detail(){
		Long article_id = getParaToLong(0);
		log.info("article_id{}:"+article_id);
		try {
			Article article = Article.dao.findById(article_id);
			List<ArticleContent> articleContentList = ArticleContent.dao.findByArticleId(article_id);
			User user = User.dao.findById(article.getLong("user_id"));
			setAttr("article", article);
			setAttr("articleContentList", articleContentList);
			setAttr("user", user);
		} catch (Exception e) {
			e.printStackTrace();
		}
		renderFreeMarker("/page/article/detail.html");
		
	}
	
	/**
	 * article toEdit
	 */
	public void toEdit(){
		Long article_id = getParaToLong(0);
		log.info("article_id{}:"+article_id);
		try {
			Article article = Article.dao.findById(article_id);
			List<ArticleContent> articleContentList = ArticleContent.dao.findByArticleId(article_id);
			User user = User.dao.findById(article.getLong("user_id"));
			List<ArticleType> articleTypeList = ArticleType.dao.findAll();
			
			setAttr("article", article);
			setAttr("articleContentList", articleContentList);
			setAttr("user", user);
			setAttr("articleTypeList", articleTypeList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		renderFreeMarker("/page/article/edit.html");
		
	}
	
	/**
	 * 编辑帖子
	 * 分两种情况：
	 *       1.编辑
	 *       	a.内容为空时，删除
	 *       2.插入
	 */
	public void editActicle(){
		
		try {
			
			final PUser user = UserUtil.getPUser(getSession());
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
	
	/**
	 * 文章类型管理
	 */
	public void articleTypeManager(){
		
		Integer page = getParaToInt("pageNumber",1);
		Integer pageSize = getParaToInt("pageSize",20);
		
		Map<String,Object> params = new HashMap<String,Object>();
		params.put("pageNumber", page);
		params.put("pageSize", pageSize);
		try {
			
			Page<ArticleType> articleTypePage = ArticleType.dao.findAllByCondition(params);
			
			setAttr("articleTypePage", articleTypePage);
			renderFreeMarker("/page/article/article_type.html");
		} catch (Exception e) {
			log.error(e.getMessage());
			e.printStackTrace();
			renderError(403);
		}
	}
	
	/**
	 * to编辑文章类型
	 */
	public void toEditArticleType(){
		Long article_type_id = getParaToLong(0);
		
		try {
			ArticleType articleType = ArticleType.dao.findById(article_type_id);
			setAttr("articleType", articleType);
			renderFreeMarker("/page/article/article_type_edit.html");
		} catch (Exception ex) {
			log.error(ex.getMessage());
			ex.printStackTrace();
			renderError(403);
		}
	}
	
	/**
	 * do编辑文章类型
	 */
	public void doEditArticleType(){
		Long article_type_id = getParaToLong(0);
		try {
			String name = getPara("name");
			int sort = getParaToInt("sort");
			int is_delete = getParaToInt("is_delete");
			
			ArticleType articleType = ArticleType.dao.findById(article_type_id);
			
			articleType.set("name", name);
			articleType.set("sort", sort);
			articleType.set("is_delete", is_delete == 0 ? 0 : 1);
			articleType.update();
			
			renderJson(new ResultJson(200l, "success"));
		} catch (Exception ex) {
			log.error(ex.getMessage());
			ex.printStackTrace();
			renderJson(new ResultJson(-100000l, ex.getMessage()));
		}
	}
	
	/**
	 * to添加文章类型
	 */
	public void toAddArticleType(){
		try {
			
			Long max_id = Db.queryLong("select max(id) from article_type");
			if(max_id == null){
				max_id = 10000l;
			} else{
				max_id = max_id + 1;
			}
			setAttr("max_id", max_id);
			renderFreeMarker("/page/article/article_type_add.html");
		} catch (Exception ex) {
			log.error(ex.getMessage());
			ex.printStackTrace();
			renderError(403);
		}
	}
	
	/**
	 * do添加文章类型
	 */
	public void doAddArticleType(){
		Long article_type_id = getParaToLong("id");
		try {
			String name = getPara("name");
			int sort = getParaToInt("sort");
			int is_delete = getParaToInt("is_delete");
			
			ArticleType articleType = new ArticleType();
			
			articleType.put("id", article_type_id);
			articleType.put("name", name);
			articleType.put("sort", sort);
			articleType.put("is_delete", is_delete == 0 ? 0 : 1);
			articleType.put("create_at", System.currentTimeMillis());
			articleType.save();
			
			renderJson(new ResultJson(200l, "success"));
		} catch (Exception ex) {
			log.error(ex.getMessage());
			ex.printStackTrace();
			renderJson(new ResultJson(-100000l, ex.getMessage()));
		}
	}
}
