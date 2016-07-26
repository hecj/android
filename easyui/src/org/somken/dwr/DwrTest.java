package org.somken.dwr;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DwrTest {

	public String get(String name) {
		return "你好 :" + name;
	}

	public Person doSomethingWithPerson(Person p) {
		//System.out.println(p.toString());
		return p;
	}

	public P map(P p) {
		
		
		
		
		return p;
	}

	public Object[] list() {

		List<Person> list = new ArrayList<Person>();

		Person p = new Person();

		p.setAge(1);
		list.add(p);
		list.add(p);
		list.add(p);

		Object[] str = new Object[list.size()];
		// list到数组转化
		for (int k = 0; k < list.size(); k++) {
			str[k] = list.get(k);
		}
		return str;

	}

}

