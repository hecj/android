package com.hecj.blog.front.routes;

import com.hecj.blog.front.controller.ArticleController;
import com.hecj.blog.front.controller.CommentController;
import com.hecj.blog.front.upload.UploadController;
import com.jfinal.config.Routes;

public class ArticleRoutes extends Routes {

	@Override
	public void config() {
		
		add("/article", ArticleController.class);
		add("/upload", UploadController.class);
		add("/comment", CommentController.class);
	}

}
