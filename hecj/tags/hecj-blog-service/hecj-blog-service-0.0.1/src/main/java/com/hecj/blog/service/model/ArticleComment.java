package com.hecj.blog.service.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.service.util.SqlUtil;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

public class ArticleComment extends Model<ArticleComment> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(ArticleComment.class);
	public static final ArticleComment dao = new ArticleComment();
	
	
	/**
	 * 博客列表
	 */
	public Page<ArticleComment> queryArticleCommentByPage(Map<String,Object> params){
		
		long article_id = (Long)params.get("article_id");
		int pageNumber = (Integer)params.get("pageNumber");
		int pageSize = (Integer)params.get("pageSize");
		log.info(params);
		log.info("pageNumber:"+pageNumber);
		String selectSQL = "select ac.*,u.username,u.nickname ";

		StringBuffer condition = new StringBuffer(" from article_comment ac left join user u on (u.id = ac.user_id) where 1=1");
		List<Object> sqlParams = new ArrayList<Object>();
		try {
			condition.append(" and ac.article_id = ?");
			sqlParams.add(article_id);
			condition.append(" order by ac.id asc");
			Page<ArticleComment> page = dao.paginate(pageNumber, pageSize, selectSQL, condition.toString(),SqlUtil.toObjects(sqlParams));
			return page;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}		
}
