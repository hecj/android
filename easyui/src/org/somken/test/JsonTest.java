package org.somken.test;

import java.util.HashMap;
import java.util.Map;

import org.somken.model.Student;
import org.somken.util.ObjectToJson;


public class JsonTest {
	
	public static void main(String[] args){
		
		Student s=new Student();
		s.setAddress("地址 ");
		s.setAge(10l);
		
		Student s2=new Student();
		s2.setAddress("地址 ");
		s2.setAge(10l);
		
		Map map=new HashMap();
		map.put("ss", s);
		map.put("ss2", s2);
		
		
		String ss=ObjectToJson.object2json(map);
		
		System.out.print(ss);
	}
}
