package com.hecj.blog.service.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;


import com.hecj.blog.service.util.SqlUtil;
import com.hecj.common.utils.StringUtil;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

public class Article extends Model<Article> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(Article.class);
	public static final Article dao = new Article();
	
	/**
	 * 博客列表
	 */
	public Page<Article> queryArticleByPage(Map<String,Object> params){
		
		Object typeStr = params.get("type");
		String search_content = (String) params.get("search_content");
		String email = (String) params.get("email");
		Long article_type = (Long) params.get("article_type");
		Long create_at_begin = (Long) params.get("create_at_begin");
		Long create_at_end = (Long) params.get("create_at_end");
		int pageNumber = (Integer)params.get("pageNumber");
		int pageSize = (Integer)params.get("pageSize");
		Object user_id = params.get("user_id");
		log.info(params);
		log.info("pageNumber:"+pageNumber);
		String selectSQL = "select a.*,u.username,u.email,u.nickname,at.name as type_name ";

		StringBuffer condition = new StringBuffer(" from article a left join user u on (a.user_id = u.id) left join article_type at on (at.id = a.type) where 1=1");
		List<Object> sqlParams = new ArrayList<Object>();
		try {
			
			if (!StringUtil.isObjectNull(typeStr) && !StringUtil.isObjectEmpty(typeStr.toString()) ) {
				condition.append(" and a.type = ?");
				sqlParams.add(Long.parseLong(typeStr.toString()));
			}
			if (!StringUtil.isStrEmpty(search_content)){
				condition.append(" and a.title like ?");
				sqlParams.add("%"+search_content+"%");
			}
			if (!StringUtil.isObjectEmpty(email)){
				condition.append(" and u.email = ?");
				sqlParams.add(email);
			}
			if(!StringUtil.isObjectNull(user_id)){
				condition.append(" and u.id = ?");
				sqlParams.add(user_id);
			}
			if(!StringUtil.isObjectNull(article_type)){
				condition.append(" and a.type = ?");
				sqlParams.add(article_type);
			}
			if(!StringUtil.isObjectNull(create_at_begin)){
				condition.append(" and a.create_at >= ?");
				sqlParams.add(create_at_begin);
			}
			if(!StringUtil.isObjectNull(create_at_end)){
				condition.append(" and a.create_at <= ?");
				sqlParams.add(create_at_end);
			}
			if(!StringUtil.isObjectNull(article_type)){
				condition.append(" and a.type = ?");
				sqlParams.add(article_type);
			}
			condition.append(" order by a.recommend desc,a.id desc");
			Page<Article> page = dao.paginate(pageNumber, pageSize, selectSQL, condition.toString(),SqlUtil.toObjects(sqlParams));
			return page;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 增加评论次数
	 */
	public int addCommentCount(long article_id,int num){
		return Db.update("update article set comment_count = comment_count+? where id = ?",new Object[]{num,article_id});
	}
	
	/**
	 * 帖子名称
	 */
	public String getTypeName(){
		try {
			return ArticleType.dao.findById(this.get("type")).get("name");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "";
	}
			
}
