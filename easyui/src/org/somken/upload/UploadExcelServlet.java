package org.somken.upload;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Vector;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

import org.somken.dao.StudentDAO;
import org.somken.excel.CreateExcel;
import org.somken.excel.SimpleCreateExcel;
import org.somken.excel.SimpleSheet;
import org.somken.model.Student;
import org.somken.util.DateFormatUtil;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
/**
 * @类功能说明：导成Excel文件
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：He Chaojie
 * @创建时间：2013-8-2 下午1:18:15
 * @版本：V1.0
 */
public class UploadExcelServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	private StudentDAO studentDAO;
	
	/**   
     * <p>   
     * 在Servlet中注入对象的步骤:   
     * 1.取得ServletContext   
     * 2.利用Spring的工具类WebApplicationContextUtils得到WebApplicationContext   
     * 3.WebApplicationContext就是一个BeanFactory,其中就有一个getBean方法   
     * </p>   
     */ 
	public UploadExcelServlet(){
		
	}
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		ServletContext servletContext = config.getServletContext();
		WebApplicationContext  wxt = WebApplicationContextUtils.getWebApplicationContext(servletContext);
		studentDAO = (StudentDAO)wxt.getBean("studentDAO");
		
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/xls");
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Charset", "UTF-8");
		response.setCharacterEncoding("UTF-8");
		String excelName =DateFormatUtil.dateToString(new java.util.Date(), "yyyyMMddHHmmss");
		response.setHeader("Content-disposition", "attachment; filename="+ excelName+ ".xls");// 设定输出文件头
		
		String name = request.getParameter("name");
		name = new String(name.getBytes("iso-8859-1"),"utf-8");
		
		List<Student> list = studentDAO.queryBySearch(name);
		
		OutputStream os =response.getOutputStream();
		
		CreateExcel createExcel = new SimpleCreateExcel();
		
		SimpleSheet sheet = new SimpleSheet();
		//表头
		String[] colNames = {"编号","姓名","年龄","地址","邮箱"};
		sheet.setColNames(colNames);
		
		//数据
		Vector<String[]> datas = new Vector<String[]>();
		for(Student stu : list){
			String[] rowData = {
					stu.getId().toString(),
					stu.getName().trim(),
					stu.getAge().toString(),
					stu.getAddress().trim(),
					stu.getEmail().trim()
					};
			datas.add(rowData);
		}
		sheet.setDatas(datas);
		//设置sheel名字
		sheet.setSheetName("我的表格2");
		WritableWorkbook writableWorkbook = createExcel.create(sheet, os);
		//导出
		writableWorkbook.write();
		//关闭
		try {
			writableWorkbook.close();
		} catch (WriteException e) {
			e.printStackTrace();
		}
	}
}
