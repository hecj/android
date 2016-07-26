package com.hecj.services.services.imp;

import java.util.List;

import com.hecj.dao.dao.StudentDao;
import com.hecj.dao.entity.Student;
import com.hecj.services.services.StudentServices;

public class StudentServicesImp implements StudentServices {

	
	private StudentDao StudentDao;
	
	public StudentDao getStudentDao() {
		return StudentDao;
	}

	public void setStudentDao(StudentDao studentDao) {
		StudentDao = studentDao;
	}

	public List<Student> findStudentList() {
		return StudentDao.queryListStudnet();
	}

}
