package com.hecj.blog.service.model;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.hecj.common.sql.util.SqlUtil;
import com.hecj.common.utils.StringUtil;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.Page;

public class User extends Model<User> {

	private static final long serialVersionUID = 1L;

	public static final User dao = new User();
	
	public User findByUserName(String username){
		List<User> userList =  dao.find("select * from user where username = ?", new Object[]{username});
		if(userList.size() > 0){
			return userList.get(0);
		}else{
			return null;
		}
	}
	public User findByEmail(String email){
		List<User> userList =  dao.find("select * from user where email = ?", new Object[]{email});
		if(userList.size() > 0){
			return userList.get(0);
		}else{
			return null;
		}
	}
	
	/**
	 * user list
	 */
	public Page<User> findUserByCondition(Map<String, Object> params) {

		Object pageObj = params.get("page");
		Object sizeObj = params.get("size");
		String email = (String) params.get("email");
		int pageNumber = Integer.parseInt(pageObj.toString());
		int pageSize = Integer.parseInt(sizeObj.toString());

		String querySQL = "SELECT u.*";

		StringBuffer condition = new StringBuffer(" FROM user u where 1=1");

		List<Object> sqlParams = new ArrayList<Object>();
		
		if(!StringUtil.isStrEmpty(email)){
			condition.append(" and u.email = ?");
			sqlParams.add(email);
		}

		condition.append(" order by u.id desc ");

		try {
			Page<User> list = dao.paginate(pageNumber, pageSize, querySQL, condition.toString(), SqlUtil.toObjects(sqlParams));
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
