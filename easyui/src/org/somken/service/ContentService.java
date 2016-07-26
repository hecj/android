package org.somken.service;
import java.util.Map;
import org.somken.util.Result;
/**
 * @类功能说明：业务接口
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：He Chaojie
 * @创建时间：2013-8-4 下午2:52:47
 * @版本：V1.0
 */
public interface ContentService {
	
	/**
	 * @函数功能说明 查询分页
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
