package org.somken.service.imp;


import java.util.List;
import java.util.Map;

import org.somken.dao.StudentDAO;
import org.somken.model.Student;
import org.somken.service.ContentService;
import org.somken.util.Result;
import org.somken.util.ResultSupport;

public class ContentServiceImp implements ContentService{
	
	private StudentDAO studentDAO;

	public StudentDAO getStudentDAO() {
		return studentDAO;
	}

	public void setStudentDAO(StudentDAO studentDAO) {
		this.studentDAO = studentDAO;
	}

	public Student getStudentById(Integer id) {
		Student student = studentDAO.queryById(id);
		return student;
	}

	@Override
	public Result searchStudent(Map<String, Object> params) {

		Result result = new ResultSupport(false);
		
		String name = (String)params.get("name");
		name = name == null ?"":name;
		Integer offset = (Integer)params.get("offset");
		Integer length = (Integer)params.get("length");
		
		Long total = studentDAO.queryByCount(name);
		
		
		List<Student> studentList = studentDAO.queryBySearch(offset, length, name);
		
		result.setDefaultModel("total", total);
		result.setDefaultModel("studentList", studentList);
		
		result.setSuccess(true);
		
		return result;
	}

}
