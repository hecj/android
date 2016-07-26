package test.blog.user.service.server;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.blog.user.service.UserService;

/**
 * Server
 */
public class Server {

	public static final Log log = LogFactory.getLog(Server.class);

	public static void main(String[] args) {
		String[] configs = new String[] { "spring/spring-*.xml" };
		ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext(configs);
		try {

			UserService ud = (UserService)context.getBean("userService");
			System.out.println(ud.findAll().size());
		} catch (Exception e) {
			log.error("server start error : " + e.getMessage());
			e.printStackTrace();
		}
	}
}
