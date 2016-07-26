<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>  
<%  
    Cookie cookie = new Cookie("test_key", "test_value");  
    cookie.setPath("/");  
//  cookie.setDomain(".ghsau.com");  
    response.addCookie(cookie);  
    
  /*  cookie = new Cookie("test_key2", "test_value2");  
    cookie.setPath("/");  
	cookie.setDomain("m.com");  
    response.addCookie(cookie); 
    
    cookie = new Cookie("test_key3", "test_value2");  
    cookie.setPath("/");  
	cookie.setDomain("a.m.com");  
    response.addCookie(cookie); 
    
    cookie = new Cookie("test_key4", "test_value2");  
    cookie.setPath("/");  
	cookie.setDomain("b.m.com");  
    response.addCookie(cookie);  */
%>  