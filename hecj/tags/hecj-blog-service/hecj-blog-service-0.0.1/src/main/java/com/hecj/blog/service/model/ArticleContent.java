package com.hecj.blog.service.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Model;

public class ArticleContent extends Model<ArticleContent> {

	private static final long serialVersionUID = 1L;

	public static final ArticleContent dao = new ArticleContent();
	
	/**
	 * 根据文章id查询文章内容
	 */
	public List<ArticleContent> findByArticleId(long article_id){
		
		List<ArticleContent> list = dao.find("select * from article_content ac where ac.article_id = ? order by ac.sort asc", new Object[]{article_id});
		return list;
	}
	
}
