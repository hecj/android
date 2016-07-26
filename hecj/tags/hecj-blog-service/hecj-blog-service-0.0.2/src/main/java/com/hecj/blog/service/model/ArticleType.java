package com.hecj.blog.service.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
/**
 * 文章类型model
 */
public class ArticleType extends Model<ArticleType> {

	private static final long serialVersionUID = 1L;

	public static final ArticleType dao = new ArticleType();
	
	public static final Log log = LogFactory.getLog(ArticleType.class);
	
	public List<ArticleType> findAll(){
		List<ArticleType> list = new ArrayList<ArticleType>();
		try {
			list = dao.find("select * from article_type t where t.is_delete = 0 order by t.sort asc");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	
	/**
	 * 文章类型分页
	 */
	public Page<ArticleType> findAllByCondition(Map<String,Object> params){
		
		int pageNumber = (Integer)params.get("pageNumber");
		int pageSize = (Integer)params.get("pageSize");
		
		String querySQL = "select * ";
		StringBuffer condition = new StringBuffer("from article_type at where 1=1");
		condition.append(" order by at.sort asc");
		
		try {
			return dao.paginate(pageNumber, pageSize, querySQL, condition.toString());
		} catch (Exception ex) {
			log.error(ex.getMessage());
			ex.printStackTrace();
		}
		return null;
	}
	
	
}
