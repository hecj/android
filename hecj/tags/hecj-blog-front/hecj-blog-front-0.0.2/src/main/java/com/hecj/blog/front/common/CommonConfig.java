package com.hecj.blog.front.common;

import java.util.Date;

import com.hecj.blog.front.handler.SkipFilterHandler;
import com.hecj.blog.front.interceptor.LogInterceptor;
import com.hecj.blog.front.interceptor.SessionInterceptor;
import com.hecj.blog.front.routes.ArticleRoutes;
import com.hecj.blog.front.routes.IndexRoutes;
import com.hecj.blog.front.routes.UserRoutes;
import com.hecj.blog.service.model.AboutUs;
import com.hecj.blog.service.model.Article;
import com.hecj.blog.service.model.ArticleComment;
import com.hecj.blog.service.model.ArticleContent;
import com.hecj.blog.service.model.ArticleType;
import com.hecj.blog.service.model.AuthToken;
import com.hecj.blog.service.model.NoticeTemplate;
import com.hecj.blog.service.model.SendEmailRecord;
import com.hecj.blog.service.model.User;
import com.hecj.blog.service.model.UserPasswordRecord;
import com.hecj.blog.service.util.Constant;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.render.ViewType;

public class CommonConfig extends JFinalConfig {

	@Override
	public void configConstant(Constants constants) {
		constants.setFreeMarkerTemplateUpdateDelay(1);
		constants.setDevMode(true);
		loadPropertyFile("app.properties");
		constants.setDevMode(true);
		constants.setViewType(ViewType.FREE_MARKER);
		constants.setFreeMarkerViewExtension(".html");

		constants.setError404View("/page/common/404.html");
		constants.setError500View("/page/common/404.html");
		
	}

	@Override
	public void configRoute(Routes me) {
		me.add(new IndexRoutes());
		me.add(new UserRoutes());
		me.add(new ArticleRoutes());
	}

	@Override
	public void configPlugin(Plugins plugins) {

		// 配置C3p0数据库连接池
		C3p0Plugin c3p0Plugin = new C3p0Plugin(getProperty("jdbcUrl"),
				getProperty("user"), getProperty("password").trim());
		c3p0Plugin.setMaxPoolSize(20);
		c3p0Plugin.setMinPoolSize(2);
		plugins.add(c3p0Plugin);

		ActiveRecordPlugin arp = new ActiveRecordPlugin(c3p0Plugin);
		plugins.add(arp);

		arp.setShowSql(true);
		arp.addMapping("user", User.class);
		arp.addMapping("user_password_record", UserPasswordRecord.class);
		arp.addMapping("article", Article.class);
		arp.addMapping("article_content", ArticleContent.class);
		arp.addMapping("article_type", ArticleType.class);
		arp.addMapping("article_comment", ArticleComment.class);
		arp.addMapping("about_us", AboutUs.class);
		arp.addMapping("notice_template", NoticeTemplate.class);
		arp.addMapping("email_send__record", SendEmailRecord.class);
		arp.addMapping("email_auth_token", AuthToken.class);
	}

	@Override
	public void configInterceptor(Interceptors me) {
		me.add(new LogInterceptor());
		me.add(new SessionInterceptor());
	}

	@Override
	public void configHandler(Handlers me) {
		me.add(new SkipFilterHandler());
	}

	@Override
	public void afterJFinalStart() {
		System.out.println(" - 系统已启动 -  初始化常量 - " + new Date());
		Constant.STATIC_URL = getProperty("STATIC_URL");
		Constant.RESOURCE_URL = getProperty("RESOURCE_URL");
		
		// 初始化邮件配置
		Constant.sendcloud_url = getProperty("sendcloud_url");
		Constant.sendcloud_apiUser = getProperty("sendcloud_apiUser");
		Constant.sendcloud_apiKey = getProperty("sendcloud_apiKey");
		Constant.sendcloud_from_mail = getProperty("sendcloud_from_mail");
		
	}

	/**
	 * 启动JFinal Server.
	 * 
	 * @param args
	 */
	public static void main(String[] args) {
		System.out.println("JFinal Server started:" + new Date());
		JFinal.start("src/main/webapp", 81, "/", 5);
	}
}
