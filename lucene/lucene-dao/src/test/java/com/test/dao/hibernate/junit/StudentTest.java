package com.test.dao.hibernate.junit;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.test.dao.hibernate.Hibernate4SesssionFactory;

public class StudentTest {

	public static void main(String[] args) {

		SessionFactory sessionFactory = Hibernate4SesssionFactory
				.getSessionFactory();
		Session session = null;
		try {
			System.out.println(sessionFactory);
			session = sessionFactory.openSession();
			System.out.println(session);
			Query query = session.createSQLQuery("select * from student s");
			System.out.println(query.list().size());

			Query query2 = session.createQuery("from Student");
			System.out.println(query2.list().size());

			// Transaction tx = session.beginTransaction();
			// session.createSQLQuery("create table a(id int)").executeUpdate();
			// tx.commit();

		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			session.close();
			sessionFactory.close();
		}
	}

}
