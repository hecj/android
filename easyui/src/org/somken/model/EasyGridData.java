package org.somken.model;

import java.io.Serializable;
/**
 * 
 * @类功能说明：Jqeruy easyui中数据表格需要的返回参数，total总共多少条，rows返回当页的数据项
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：He Chaojie
 * @创建时间：2013-7-30 下午4:41:27
 * @版本：V1.0
 */
public class EasyGridData implements Serializable {

	/**
	 * @Fields serialVersionUID : TODO
	 */
	private static final long serialVersionUID = 1L;
	private Long total;
	private Object rows;
	
	public EasyGridData(){
		
	}
	
	public EasyGridData(Long total , Object rows){
		this.total = total;
		this.rows = rows;
	}
	
	public Long getTotal() {
		return total;
	}
	public void setTotal(Long total) {
		this.total = total;
	}
	public Object getRows() {
		return rows;
	}
	public void setRows(Object rows) {
		this.rows = rows;
	}
	
}
