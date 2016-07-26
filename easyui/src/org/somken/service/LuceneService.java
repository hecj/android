package org.somken.service;

import java.util.Map;

import org.somken.util.Result;

public interface LuceneService {
	
	/**
	 * @函数功能说明 从所用中查询
	 * @修改作者名字 He Chaojie  
	 * @修改时间 2013-8-4
	 * @修改内容
	 * @参数： @param params
	 * @参数： @return    
	 * @return Result   
	 * @throws
	 */
	public Result searchStudent(Map<String,Object> params);
}
