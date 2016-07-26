package com.blog.user.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * server
 */
public class Server {

	public static final Log log = LogFactory.getLog(Server.class);

	public static void main(String[] args) {
		String[] configs = new String[] { "spring/spring-*.xml" };
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(configs);
		try {
			log.info("load spring config");
			context.start();
			log.info("server start success");
			while (true) {
				Thread.sleep(50000);
			}
		} catch (Exception e) {
			log.error("server start error : " + e.getMessage());
			e.printStackTrace();
		}
	}
}
