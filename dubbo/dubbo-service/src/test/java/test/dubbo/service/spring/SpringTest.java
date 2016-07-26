package test.dubbo.service.spring;

import java.io.IOException;

import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.dubbo.services.UserService;

public class SpringTest {
	
	//private ApplicationContext ctx = null ;
	private ClassPathXmlApplicationContext ctx = null ;
	
	@Before
	public void before(){
		
		ctx = new ClassPathXmlApplicationContext("spring/dubbo-service.xml");
	}
	
	@Test
	public void test() throws IOException{
		ctx.start();
		System.out.println("按任意键退出");
		System.in.read();
	}
	
	
}

