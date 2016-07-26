package com.hecj.blog.service.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.common.sql.util.SqlUtil;
import com.hecj.common.utils.StringUtil;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;
/**
 * 后台用户表
 */
public class PUser extends Model<PUser> {

	private static final long serialVersionUID = 1L;
	public static final PUser dao = new PUser();
	private static final Log log = LogFactory.getLog(PUser.class);
	
	public Page<PUser> findAll(Map<String,Object> params) {
		Object pageObj = params.get("page");
		Object sizeObj = params.get("size");
		String username = (String) params.get("username");
		int pageNumber = Integer.parseInt(pageObj.toString());
		int pageSize = Integer.parseInt(sizeObj.toString());

		String querySQL = "SELECT p.*";

		StringBuffer condition = new StringBuffer(" FROM puser p where 1=1");

		List<Object> sqlParams = new ArrayList<Object>();
		
		if(!StringUtil.isObjectEmpty(username)){
			condition.append(" and p.username = ?");
			sqlParams.add(username);
		}
		
		condition.append(" order by p.id desc ");

		try {
			Page<PUser> list = dao.paginate(pageNumber, pageSize, querySQL, condition.toString(), SqlUtil.toObjects(sqlParams));
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public PUser findPUserByUserName(String username) {
		log.info("username {} : " + username);
		String querySQL = "select * from puser p where p.username = ?";
		try {
			List<PUser> list = dao.find(querySQL, new Object[] { username });
			if (list.size() > 0) {
				return list.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
}
