package cn.gh.duboo.demo.consumer.config;

import java.util.HashMap;
import java.util.Map;

import cn.gh.duboo.demo.controller.blog.BlogController;
import cn.gh.duboo.demo.controller.common.CommonController;
import cn.gh.duboo.demo.model.Blog;

import com.jfinal.config.Constants;
import com.jfinal.config.Handlers;
import com.jfinal.config.Interceptors;
import com.jfinal.config.JFinalConfig;
import com.jfinal.config.Plugins;
import com.jfinal.config.Routes;
import com.jfinal.plugin.activerecord.TableInitKit;
import com.jfinal.plugin.spring.SpringPlugin;

public class DemoConsumerConfig extends JFinalConfig {

	@Override
	public void configConstant(Constants me) {
		me.setDevMode(true);
	}

	@Override
	public void configHandler(Handlers me) {
	}

	@Override
	public void configInterceptor(Interceptors me) {
	}

	@Override
	public void configPlugin(Plugins me) {
		me.add(new SpringPlugin());
	}

	@Override
	public void configRoute(Routes me) {
		me.add("/", CommonController.class);
		me.add("/blog", BlogController.class);
	}

	@Override
	public void afterJFinalStart() {
		Map<String, Class<?>> blogColumnMap = new HashMap<String, Class<?>>();
		blogColumnMap.put("id", Integer.class);
		blogColumnMap.put("title", String.class);
		blogColumnMap.put("content", String.class);

		TableInitKit.init("blog", Blog.class, blogColumnMap);
		
		System.out.println("Blog表字段模拟完成。");
		
		System.out.println("Demo consumer for Dubbo启动完成。");
	}

}
