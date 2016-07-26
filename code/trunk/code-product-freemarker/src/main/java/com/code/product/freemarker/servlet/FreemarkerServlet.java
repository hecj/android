package com.code.product.freemarker.servlet;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.code.product.freemarker.vo.Student;

public class FreemarkerServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		doPost(req, resp);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		
		req.setAttribute("user", "何超杰");
		
		List<Student> students = new ArrayList<Student>();
		students.add(new Student(1,"张三",15));
		students.add(new Student(2,"李四",18));
		students.add(new Student(3,"王二",22));
		req.setAttribute("students", students);
		
		
		req.getRequestDispatcher("/WEB-INF/templates/test1.ftl").forward(req, resp);
	}
	
}
