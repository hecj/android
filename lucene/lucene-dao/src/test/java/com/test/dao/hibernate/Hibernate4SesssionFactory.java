package com.test.dao.hibernate;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.service.ServiceRegistry;

//hibernate 4.3
final public class Hibernate4SesssionFactory {

	private static ServiceRegistry serviceRegistry = null;
	private static Configuration cfg = null;
	private static SessionFactory sessionFactory = null;

	static {
		cfg = new Configuration().configure();
		serviceRegistry = new StandardServiceRegistryBuilder().applySettings(
				cfg.getProperties()).build();
		sessionFactory = cfg.buildSessionFactory(serviceRegistry);
	}

	public static SessionFactory getSessionFactory() {
		return sessionFactory;
	}
}