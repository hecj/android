package com.h5.framework.server.model;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;

public class WxUser extends Model<WxUser> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(WxUser.class);
	public static final WxUser dao = new WxUser();
			
}
