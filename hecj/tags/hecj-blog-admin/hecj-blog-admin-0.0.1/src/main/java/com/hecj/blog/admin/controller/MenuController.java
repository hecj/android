package com.hecj.blog.admin.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.hecj.blog.admin.menu.Item;
import com.hecj.blog.admin.menu.Menu;
import com.hecj.blog.admin.menu.Module;
import com.jfinal.core.Controller;

public class MenuController extends Controller{

	private static final Log log = LogFactory.getLog(MenuController.class);
	
	/**
	 * puser menu tree
	 */
	public void menuTree(){
		
		List<Module> modules = new ArrayList<Module>();
		
		Module module1 = new Module();
		modules.add(module1);
		
		List<Menu> menus = new ArrayList<Menu>();
		module1.setMenu(menus);
		module1.setId("1");
		module1.setHomePage("11");
		
		Menu menu = new Menu();
		menu.setText("用户管理");
		menus.add(menu);
		List<Item> items = new ArrayList<Item>();
		menu.setItems(items);
		
		Item item = new Item();
		item.setId("11");
		item.setText("用户管理");
		item.setHref("/user/manager");
		items.add(item);
		Item item3 = new Item();
		item3.setId("22");
		item3.setText("文章管理");
		item3.setHref("/article/manager");
		items.add(item3);
		Item item4 = new Item();
		item4.setId("22");
		item4.setText("文章类型");
		item4.setHref("/article/toType");
		items.add(item4);
		
		
		Module module2 = new Module();
		modules.add(module2);
		
		List<Menu> menus2 = new ArrayList<Menu>();
		module2.setMenu(menus2);
		module2.setId("2");
		
		Menu menu2 = new Menu();
		menu2.setText("用户管理");
		menus2.add(menu2);
		List<Item> items2 = new ArrayList<Item>();
		menu2.setItems(items2);
		
		Item item2 = new Item();
		item2.setId("22");
		item2.setText("用户管理");
		item2.setHref("/");
		items2.add(item2);
		
		renderJson(modules);
	}
	
	
	
}
