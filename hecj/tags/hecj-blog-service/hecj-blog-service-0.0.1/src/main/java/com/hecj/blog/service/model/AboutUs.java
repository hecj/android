package com.hecj.blog.service.model;

import java.util.List;

import com.jfinal.plugin.activerecord.Model;

public class AboutUs extends Model<AboutUs> {

	private static final long serialVersionUID = 1L;

	public static final AboutUs dao = new AboutUs();
	
	public List<AboutUs> findAll(){
		
		try {
			List<AboutUs> list = dao.find("select * from about_us t where t.is_delete = 0 order by t.create_at desc");
			return list;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
}
