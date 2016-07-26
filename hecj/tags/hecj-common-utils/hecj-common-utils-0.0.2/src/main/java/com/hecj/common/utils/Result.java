package com.hecj.common.utils;
import java.io.Serializable;
import java.util.List;
import java.util.Map;
/**
 * @类功能说明：数据集
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2014-12-21 上午11:30:08
 * @版本：V1.0
 */
public interface Result extends Serializable {
	
	/**
	 *得到Model对象
	 **/
	public Map<String,Object> getModel();
	/**
	 * 设置model对象
	 * @param map
	 */
	public void setModel(Map<String,Object> map);
	/**
	 * 判断结果是否成功
	 * @return
	 */
	public boolean isSuccess();
	/**
	 * 设置返回结果
	 * @param b
	 */
	public void setResult(boolean b);
	
	/**
	 * 设置数据集
	 */
	public void setData(List<?> data);
	
	/**
	 * 得到数据集
	 */
	public List<?> getData();
	
	/**
	 * 设置分页器
	 */
	public void setPagination(Pagination pagination);
	
	/**
	 * 获取分页器
	 */
	public Pagination getPagination();
}