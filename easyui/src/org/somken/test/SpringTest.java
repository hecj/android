package org.somken.test;

import org.somken.dao.StudentDAO;
import org.somken.lucene.IndexUtil;
import org.somken.model.Student;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;


public class SpringTest {
	public static void main(String[] args) {
		
		//org.hibernate.dialect.OracleDialect
		
		// 读取配置文件
		ApplicationContext ctx = new ClassPathXmlApplicationContext("bean/applicationContent.xml");
		// 查找bean
		
		StudentDAO studentDAO=(StudentDAO)ctx.getBean("studentDAO");
		
		new IndexUtil(studentDAO.queryBySearch(""));
		
		
		// HibernateSession
		// hibernateSession=(HibernateSession)ctx.getBean("hibernateSession");

		//Student student = studentDAO.queryById(1);

		// System.out.println(hibernateSession);

		//System.out.println(student.getAge());
		//System.out.println(student.getId());
		
		//ContentService contentService = (ContentService) ctx.getBean("contentService");
		
		//Student student=contentService.getStudentById(6);
		
		//System.out.println(student.getAge());
		//分页
		//StudentDAO sdao = (StudentDAO) ctx.getBean("studentDAO");
		
		//System.out.println(sdao.deleteById(1));
		
		/*Student s=new Student();
		s.setId(10);
		s.setAge(99l);
		s.setName("hechaojie");
		
		sdao.updateStudent(s);
		*/
		
		//System.out.println(sdao.queryByCount(null));
//		List<Student> list=sdao.queryBySearch(null);
//		for(Student s:list){
//			System.out.println(s.getId()+","+s.getEmail());
//		}
		
	}
}
