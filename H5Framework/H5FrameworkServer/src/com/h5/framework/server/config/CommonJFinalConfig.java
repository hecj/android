package com.h5.framework.server.config;

import org.apache.log4j.Logger;

import com.h5.framework.server.controller.ActivityController;
import com.h5.framework.server.controller.AddressController;
import com.h5.framework.server.controller.ArticleController;
import com.h5.framework.server.controller.IndexController;
import com.h5.framework.server.controller.MessageController;
import com.h5.framework.server.controller.UploadController;
import com.h5.framework.server.controller.UserController;
import com.h5.framework.server.controller.WeiXinController;
import com.h5.framework.server.intercept.LoginInterceptor;
import com.h5.framework.server.intercept.WenXinInterceptor;
import com.h5.framework.server.model._MappingKit;
import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.core.JFinal;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.ActiveRecordPlugin;
import com.jfinal.plugin.activerecord.CaseInsensitiveContainerFactory;
import com.jfinal.plugin.activerecord.SqlReporter;
import com.jfinal.plugin.activerecord.dialect.AnsiSqlDialect;
import com.jfinal.plugin.c3p0.C3p0Plugin;
import com.jfinal.render.ViewType;
import com.jfinal.weixin.sdk.api.ApiConfig;
import com.jfinal.weixin.sdk.api.ApiConfigKit;
/**
* @ClassName: CommonJFinalConfig
* @Description: JFinal基础配置
 */
public class CommonJFinalConfig extends JFinalConfig {
	
	private Logger log = Logger.getLogger(CommonJFinalConfig.class);
	
	private boolean DEV_MODE = false;
	
	@Override
	public void configConstant(Constants me) {
		log.info("---------系统常量配置----------");
		
		me.setFreeMarkerTemplateUpdateDelay(5);
		
		me.setViewType(ViewType.FREE_MARKER);
		me.setError404View("/WEB-INF/view/common/404.html");
		me.setError500View("/WEB-INF/view/common/500.html");
		me.setBaseViewPath("/WEB-INF/view");
		
		PropKit.use("local.properties");
		DEV_MODE = PropKit.getBoolean("devMode", false);
		me.setDevMode(DEV_MODE);
		
		ApiConfigKit.setThreadLocalApiConfig(getApiConfig() );
	}

	@Override
	public void configRoute(Routes me) {
		log.info("---------加载路由----------");
		me.add("/", IndexController.class);
		me.add("/message", MessageController.class);
		me.add("/address", AddressController.class);
		me.add("/activity", ActivityController.class);
		me.add("/user", UserController.class);
		me.add("/article", ArticleController.class);
		me.add("/upload", UploadController.class);
		me.add("/weixin", WeiXinController.class);
	}

	@Override
	public void configPlugin(Plugins me) {
		// 配置C3p0数据库连接池插件
		C3p0Plugin cp = createC3p0Plugin();
		me.add(cp);

		// 配置ActiveRecord插件
		ActiveRecordPlugin arp = new ActiveRecordPlugin(cp);
		me.add(arp);

		arp.setDialect(new AnsiSqlDialect());// 使用AnsiSqlDialect
		arp.setContainerFactory(new CaseInsensitiveContainerFactory());

		// 开发环境才打印sql
		SqlReporter.setLog(DEV_MODE);
		arp.setShowSql(DEV_MODE);

		// 所有配置在 MappingKit 中搞定
		_MappingKit.mapping(arp);
	}
	
	public static C3p0Plugin createC3p0Plugin() {
		PropKit.use("local.properties");
		C3p0Plugin cp = new C3p0Plugin(PropKit.get("jdbc.url"),
				PropKit.get("jdbc.username"), PropKit.get("jdbc.password"),
				PropKit.get("jdbc.driverClassName")); // 使用C3P0
		return cp;
	}

	@Override
	public void configInterceptor(Interceptors me) {
		me.add(new WenXinInterceptor());
		me.add(new LoginInterceptor());
	}

	@Override
	public void configHandler(Handlers me) {
//		 me.add(new ContextPathHandler());
	}

	@Override
	public void afterJFinalStart() {
		super.afterJFinalStart();
		log.info("---------初始化常量----BEGIN------");
//		Const.appID = getProperty("appID");
//		Const.appsecret = getProperty("appsecret");
//		Const.oauth2Back = getProperty("oauth2Back");
		log.info("---------初始化常量----END------");
	}
	
	public ApiConfig getApiConfig() {
		ApiConfig ac = new ApiConfig();
		
		// 配置微信 API 相关常量
		ac.setToken(PropKit.get("weixin_token"));
		ac.setAppId(PropKit.get("weixin_appId"));
		ac.setAppSecret(PropKit.get("weixin_appSecret"));
		
		/**
		 *  是否对消息进行加密，对应于微信平台的消息加解密方式：
		 *  1：true进行加密且必须配置 encodingAesKey
		 *  2：false采用明文模式，同时也支持混合模式
		 */
		ac.setEncryptMessage(PropKit.getBoolean("encryptMessage", false));
		ac.setEncodingAesKey(PropKit.get("encodingAesKey", "setting it in config file"));
		
		return ac;
	}
	
	/**
	 * 启动程序
	 */
	public static void main(String[] args) {
		JFinal.start("WebRoot",8888,"/",5);
	}
}
