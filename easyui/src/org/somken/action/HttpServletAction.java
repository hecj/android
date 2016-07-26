package org.somken.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import com.opensymphony.xwork2.ActionSupport;

public class HttpServletAction extends ActionSupport implements
		ServletResponseAware, ServletRequestAware {

	protected HttpServletResponse response;

	protected HttpServletRequest request;
	
	public HttpServletAction(){
		
	}
	

	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

}
