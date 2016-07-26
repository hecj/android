package com.hecj.web.action;

import com.hecj.services.services.StudentServices;
import com.opensymphony.xwork2.ActionSupport;

public class TestAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private StudentServices studentServices ;

	public StudentServices getStudentServices() {
		return studentServices;
	}

	public void setStudentServices(StudentServices studentServices) {
		this.studentServices = studentServices;
	}

	public String test() {
		
		System.out.println("进来了...");
		
		System.out.println(studentServices);
		System.out.println(studentServices.findStudentList().size());
		
		return "success" ;
	}

}
