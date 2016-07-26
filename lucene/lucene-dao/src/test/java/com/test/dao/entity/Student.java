package com.test.dao.entity;

import java.io.Serializable;

//@Table(name = "student")
public class Student implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private int id;
	private String name;
	private int age;

	public Student() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Student(int id, String name, int age) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
	}

//	@Id
//	@Column(name = "id", unique = true, nullable = false)
//	@GeneratedValue
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

//	@Column(name = "name", length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

//	@Column(name = "age", length = 3)
	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

}
