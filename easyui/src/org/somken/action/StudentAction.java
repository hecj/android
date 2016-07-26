package org.somken.action;

import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import org.somken.dao.StudentDAO;
import org.somken.model.EasyGridData;
import org.somken.service.ContentService;
import org.somken.service.LuceneService;
import org.somken.util.ObjectToJson;
import org.somken.util.Result;

public class StudentAction extends HttpServletAction{
	
	
	/**
	 * @Fields serialVersionUID : TODO
	 */
	
	private static final long serialVersionUID = 1L;
	private StudentDAO studentDAO;
	private String name;
	private Integer page; //当前页
	private Integer rows;  //每页多少条
	
	private ContentService contentService;
	private LuceneService luceneService;
	 
	public LuceneService getLuceneService() {
		return luceneService;
	}

	public void setLuceneService(LuceneService luceneService) {
		this.luceneService = luceneService;
	}

	public ContentService getContentService() {
		return contentService;
	}

	public void setContentService(ContentService contentService) {
		this.contentService = contentService;
	}

	public Integer getPage() {
		return page;
	}

	public void setPage(Integer page) {
		this.page = page;
	}

	public Integer getRows() {
		return rows;
	}

	public void setRows(Integer rows) {
		this.rows = rows;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public StudentDAO getStudentDAO() {
		return studentDAO;
	}

	public void setStudentDAO(StudentDAO studentDAO) {
		this.studentDAO = studentDAO;
	}
	
	@Override
	public String execute() throws Exception {
		
		response.setContentType("text/html;charset=utf-8");
		
		Map<String, Object> params  = new HashMap<String, Object>();
		params.put("name",name);
		params.put("offset", (page-1)*rows);//多少条开始
		params.put("length", rows);//每页多少条
		
//		Result result = contentService.searchStudent(params);
		Result result = luceneService.searchStudent(params);
		
		PrintWriter out = response.getWriter();
		if(result.isSuccess()){
			//封装返回数据
			EasyGridData easyGridData = new EasyGridData();
			easyGridData.setTotal((Long)(result.getModels().get("total")));
			easyGridData.setRows(result.getModels().get("studentList"));
			out.write(ObjectToJson.object2json(easyGridData));
		}
		
		return NONE;
	}
}
