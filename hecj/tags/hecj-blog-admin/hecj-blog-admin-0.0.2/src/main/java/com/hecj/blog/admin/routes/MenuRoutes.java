package com.hecj.blog.admin.routes;

import com.hecj.blog.admin.controller.MenuController;
import com.jfinal.config.Routes;

public class MenuRoutes extends Routes {

	@Override
	public void config() {
		add("/menu", MenuController.class);
	}

}
