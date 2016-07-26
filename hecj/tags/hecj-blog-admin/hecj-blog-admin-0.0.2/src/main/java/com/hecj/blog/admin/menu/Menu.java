package com.hecj.blog.admin.menu;

import java.io.Serializable;
import java.util.List;

/**
 * 二级菜单
 */
public class Menu implements Serializable {

	private static final long serialVersionUID = 1L;
	/*
	 * 文本
	 */
	private String text;
	/*
	 * 是否收缩，默认false
	 */
	private boolean collapsed = false;
	/*
	 * 是否可以关闭标签，默认true，如果设置成首页，可以将此属性设为false
	 */
	private boolean closeable = true;
	/*
	 * 三级菜单集合
	 */
	private List<Item> items;

	public Menu() {
		
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public boolean getCollapsed() {
		return collapsed;
	}

	public void setCollapsed(boolean collapsed) {
		this.collapsed = collapsed;
	}

	public boolean getCloseable() {
		return closeable;
	}

	public void setCloseable(boolean closeable) {
		this.closeable = closeable;
	}

	public List<Item> getItems() {
		return items;
	}

	public void setItems(List<Item> items) {
		this.items = items;
	}

}
