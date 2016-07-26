package com.hecj.blog.admin.menu;

import java.io.Serializable;

/**
 * 三级菜单
 */
public class Item implements Serializable {

	private static final long serialVersionUID = 1L;
	/*
	 * 页面id,用于避免重复打开页面
	 */
	private String id;
	/*
	 * 标题，同时是打开tab的标题
	 */
	private String text;
	/*
	 * 页面URL
	 */
	private String href;

	public Item() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getHref() {
		return href;
	}

	public void setHref(String href) {
		this.href = href;
	}

}
