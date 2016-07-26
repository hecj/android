package com.hecj.blog.service.model;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.jfinal.plugin.activerecord.Model;
/**
 * 提醒模板
 */
public class NoticeTemplate extends Model<NoticeTemplate> {

	private static final long serialVersionUID = 1L;
	private static final Log log = LogFactory.getLog(NoticeTemplate.class);
	public static final NoticeTemplate dao = new NoticeTemplate();
	
	/**
	 * 根据模板名称查询模板
	 */
	public NoticeTemplate findByTempName(String temp_name){
		log.info("temp_name:"+temp_name);
		String querySQL = "select * from notice_template nt where nt.status = 1 and nt.temp_name = ?";
		try {
			List<NoticeTemplate> list = dao.find(querySQL, new Object[]{temp_name});
			if(list != null && list.size() >0){
				return list.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

}
