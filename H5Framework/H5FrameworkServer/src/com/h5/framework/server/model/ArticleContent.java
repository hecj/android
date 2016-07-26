package com.h5.framework.server.model;

import java.util.List;

import com.h5.framework.server.model.base.BaseArticleCommentReply;
import com.h5.framework.server.model.base.BaseArticleContent;
import com.jfinal.plugin.activerecord.Model;

public class ArticleContent extends BaseArticleContent<ArticleContent> {

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
