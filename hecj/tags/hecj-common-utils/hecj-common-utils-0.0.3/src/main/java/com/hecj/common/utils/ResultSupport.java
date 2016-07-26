package com.hecj.common.utils;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * @类功能说明：基本实现类 默认map的key为data保存基本数据集合
 * 扩展数据可放入map中
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2014-12-21 上午11:23:04
 * @版本：V1.0
 */
public class ResultSupport implements Result {
	
	private boolean b = false;
	
	private Map<String,Object> map = new HashMap<String,Object>();
	
	public Map<String, Object> getModel() {
		return map;
	}

	public boolean isSuccess() {
		return b;
	}

	public void setResult(boolean b) {
		this.b = b;
	}

	public void setModel(Map<String, Object> map) {
		this.map = map;
	}

	@Override
	public void setData(List<?> data) {
		this.map.put("data", data);
	}

	@Override
	public List<?> getData() {
		return (List<?>) this.map.get("data");
	}

	@Override
	public Pagination getPagination() {
		return (Pagination) this.map.get("pagination");
	}

	@Override
	public void setPagination(Pagination pagination) {
		this.map.put("pagination", pagination);
	}

}