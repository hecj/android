package org.somken.springtask;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
public class TestApp {
	public static void main(String[] args) {
		System.out.println("start....");
		ApplicationContext context = new ClassPathXmlApplicationContext("bean/springTask.xml");
		System.out.println("end...");
	}
}