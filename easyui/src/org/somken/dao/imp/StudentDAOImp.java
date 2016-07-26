package org.somken.dao.imp;

import java.util.List;
import java.util.Set;
import java.util.Map;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.somken.dao.StudentDAO;
import org.somken.model.Student;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class StudentDAOImp extends Hibernate4Session implements StudentDAO{
	
	public int insert(Student s) {
		
		Session session = getSession();
		
		Transaction transaction=session.beginTransaction();
		try{
			session.save(s);
			transaction.commit();
		}catch(Exception ex){
			ex.printStackTrace();
		}
		session.close();
		return 0;
	}

	public Student queryById(Integer id) {
		
		Student user=(Student)getSession().get(Student.class, id);
		return user;
	}

	public List<Student> queryBySearch(int start,int number,String  name) {
		
		Session session = getSession();
		
		//Integer offset=(Integer)map.get("offset");
		//Integer length=(Integer)map.get("length");
		//String name=(String)map.get("name");
		
		Query query = session.createQuery("from Student s where s.name like ?");
		query.setString(0, "%"+name+"%");
		query.setFirstResult(start);
		query.setMaxResults(number);
		
		
		//query.setString("name", "%"+name+"%");
		//query.setFirstResult(offset);
		//query.setMaxResults(length);
		
		List<Student> list=query.list();
		
		session.close();
		
		return list;
	}

	public Long queryByCount(String name) {
		
		Session session = getSession();
		Query query = session.createQuery("select count(*) from Student s where s.name like ?");
		query.setString(0, "%"+name+"%");
		
		Long rowCount=Long.parseLong(query.iterate().next().toString());
		
		session.close();
	
		return rowCount;
	}

	@Override
	public List<Student> queryBySearch(String name) {
		
		Session session = getSession();
		Query query = session.createQuery("from Student s where s.name like ?");
		query.setString(0, "%"+name+"%");
		List<Student> list=query.list();
		session.close();
		return list;
	}

}
