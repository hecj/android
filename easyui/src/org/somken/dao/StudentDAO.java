package org.somken.dao;

import java.util.List;
import java.util.Map;

import org.somken.model.Student;


public interface StudentDAO {
	
	
	public int insert(Student s);
	
	public Student queryById(Integer id);
	
	public List<Student> queryBySearch(int start,int number,String name);
	
	public List<Student> queryBySearch(String name);
	
	public Long queryByCount(String name);
	
	
}
