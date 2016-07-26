package org.somken.dwr;

import java.io.Serializable;
import java.util.Arrays;
import java.util.Date;

public class Person {

	private String name;
	private int age;
	private Date[] appointments;

	public Person(String name, int age, Date[] appointments) {
		super();
		this.name = name;
		this.age = age;
		this.appointments = appointments;
	}

	public Person() {
		super();
	}

	@Override
	public String toString() {
		return "Persion [name=" + name + ", age=" + age + ", appointments="
				+ Arrays.toString(appointments) + "]";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public Date[] getAppointments() {
		return appointments;
	}

	public void setAppointments(Date[] appointments) {
		this.appointments = appointments;
	}

}
