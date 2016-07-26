package com.hecj.dao.hibernate4;

import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

/**
 * Configures and provides access to Hibernate sessions, tied to the
 * current thread of execution.  Follows the Thread Local Session
 * pattern, see {@link http://hibernate.org/42.html }.
 */
public class HibernateSessionFactory extends HibernateTransactionManager{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private  SessionFactory sessionFactory;
	
	private  Session session;
	
	public Session getSession() throws HibernateException {

		if (session == null || !session.isOpen()) {
			if (sessionFactory == null) {
				sessionFactory = super.getSessionFactory();
			}
			session = (sessionFactory != null) ? sessionFactory.openSession()
					: null;
		}

        return session;
    }

}