package com.test.services.spring;


import java.util.List;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.hecj.dao.dao.StudentDao;


public class SpringTest {
	public static void main(String[] args) {

		// 读取配置文件
		ApplicationContext ctx = new ClassPathXmlApplicationContext("daoBeans.xml");
		// 查找bean

		StudentDao studentDao = (StudentDao) ctx.getBean("studentDao");

		List list = studentDao.queryListStudnet();
		System.out.println(list.size());

	}
}
