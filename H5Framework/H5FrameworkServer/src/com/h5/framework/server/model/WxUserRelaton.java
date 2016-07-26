package com.h5.framework.server.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;

public class WxUserRelaton extends Model<WxUserRelaton> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(WxUserRelaton.class);
	public static final WxUserRelaton dao = new WxUserRelaton();
	
	public WxUserRelaton findByOpenId(String openId){
		String sql = "select * from wx_user_relation wur where wur.open_id = ?";
		return dao.findFirst(sql, openId);
	}
			
}
