package com.hecj.blog.front.routes;

import com.hecj.blog.front.controller.AuthController;
import com.hecj.blog.front.controller.UserController;
import com.jfinal.config.Routes;

public class UserRoutes extends Routes {

	@Override
	public void config() {
		
		add("/user", UserController.class);
		add("/auth", AuthController.class);
	}

}
