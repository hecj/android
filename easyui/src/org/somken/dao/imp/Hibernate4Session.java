package org.somken.dao.imp;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Session;
import org.springframework.orm.hibernate4.HibernateTransactionManager;

public class Hibernate4Session extends HibernateTransactionManager{
	
	public static final Log  logger = LogFactory.getLog(Hibernate4Session.class);
	
	public Session session;
	
	public Hibernate4Session(){
		
	}

	public Session getSession() {
		if(session == null){
			return getSessionFactory().openSession();
		}else{
			return getSessionFactory().getCurrentSession();
		}
	}

	public void setSession(Session session) {
		this.session = session;
	}
	
	public void close(){
		if(session!=null&&session.isConnected()){
			session.close();
			getSessionFactory().close();
		}
	}	
}
