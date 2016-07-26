package com.hecj.blog.front.routes;

import com.hecj.blog.front.controller.IndexController;
import com.jfinal.config.Routes;

public class IndexRoutes extends Routes {

	@Override
	public void config() {
		add("/", IndexController.class);
	}

}
