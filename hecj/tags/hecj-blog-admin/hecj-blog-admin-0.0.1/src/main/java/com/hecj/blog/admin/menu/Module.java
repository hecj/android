package com.hecj.blog.admin.menu;

import java.io.Serializable;
import java.util.List;

/**
 * 一级菜单
 */
public class Module implements Serializable {

	private static final long serialVersionUID = 1L;
	/*
	 * 模块的编号，用于定位模块
	 */
	private String id;
	/*
	 * 模块默认显示的主页，使用页面的id
	 */
	private String homePage;
	/*
	 * 左侧菜单是否默认收缩,默认false
	 */
	private boolean collapse = false;
	/*
	 * 菜单的集合，是一个数组，其中每个对象代表一个二级菜单
	 */
	private List<Menu> menu;

	public Module() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getHomePage() {
		return homePage;
	}

	public void setHomePage(String homePage) {
		this.homePage = homePage;
	}

	public boolean getCollapse() {
		return collapse;
	}

	public void setCollapse(boolean collapse) {
		this.collapse = collapse;
	}

	public List<Menu> getMenu() {
		return menu;
	}

	public void setMenu(List<Menu> menu) {
		this.menu = menu;
	}

}
