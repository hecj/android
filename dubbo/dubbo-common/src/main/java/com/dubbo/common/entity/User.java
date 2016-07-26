package com.dubbo.common.entity;

import java.io.Serializable;
/**
 * @类功能说明：用户实体类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2015年3月22日 上午12:38:49
 * @版本：V1.0
 */
public class User implements Serializable {

	/**
	 * @Fields serialVersionUID : TODO
	 */
	
	private static final long serialVersionUID = 1L;
	
	private String id;
	private String code;
	private String name;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	public User(String code, String name) {
		super();
		this.code = code;
		this.name = name;
	}
	
}
