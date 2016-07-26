package com.hecj.blog.admin.routes;

import com.hecj.blog.admin.controller.ArticleController;
import com.hecj.blog.admin.controller.IndexController;
import com.hecj.blog.admin.controller.PUserController;
import com.hecj.blog.admin.controller.SystemNoticeController;
import com.hecj.blog.admin.controller.UserController;
import com.hecj.blog.admin.controller.ValidateCodeController;
import com.hecj.blog.admin.upload.UploadController;
import com.jfinal.config.Routes;

public class IndexRoutes extends Routes {

	@Override
	public void config() {
		add("/", IndexController.class);
		add("/user", UserController.class);
		add("/puser", PUserController.class);
		add("/article", ArticleController.class);
		add("/validateCode", ValidateCodeController.class);
		add("/systemNotice", SystemNoticeController.class);
		add("/upload", UploadController.class);
	}

}
