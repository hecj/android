<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>  
<%  
response.setHeader("Access-Control-Allow-Origin","*");
response.setHeader("Access-Control-Allow-Credentials", "true");
    // 输出cookies，过滤掉JSESSIONID  
    
    
    String callback = request.getParameter("callback");
    String s = "";
    Cookie[] cookies = request.getCookies();  
    if(cookies != null)  
        for(Cookie cookie : cookies) {  
            if(cookie.getName().equals("JSESSIONID"))    continue; 
            s += cookie.getName() + "-" + cookie.getValue();
            System.out.println("cookie:"+s);
        } 
    
    out.print(callback+"('"+s+"')");
%>  