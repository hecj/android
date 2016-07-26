package com.duomeidai.entity;

import java.io.Serializable;

public class Blog implements Serializable {

	private static final long serialVersionUID = 1L;
	public long id;
	public String name;

	public Blog() {
		super();
	}

	public Blog(long id, String name) {
		super();
		this.id = id;
		this.name = name;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
