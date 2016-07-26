package com.hecj.dao.dao.imp;

import java.util.List;

import org.hibernate.Query;

import com.hecj.dao.dao.StudentDao;
import com.hecj.dao.entity.Student;
import com.hecj.dao.hibernate4.HibernateSessionFactory;

public class StudentDaoImp extends HibernateSessionFactory implements StudentDao {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@SuppressWarnings("unchecked")
	public List<Student> queryListStudnet() {

		try {
			Query query = getSession().createQuery("from Student");
			return query.list();
		} catch (RuntimeException ex) {
			ex.printStackTrace();
		} finally {

		}

		return null;
	}

}
