package com.h5.framework.server.util;


import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.util.Base64;
import com.h5.framework.server.model.User;
import com.h5.framework.server.model.WxUserRelaton;


public class UserUtil {

    //SessionKey
    public static final String USER_SESSION_KEY = "USER_SESSION_KEY";
    // cookie
    public static final String COOKIE_CODE = "code";
    
    private static final ThreadLocal<HttpServletRequest> localRequest = new ThreadLocal<HttpServletRequest>();
    
    /**
	 * 初始化
	 * 
	 * @param request
	 */
	public static void bind(HttpServletRequest request) {
		localRequest.set(request);
	}  

	/**
	 * 清除方法
	 */
	public static void unbind() {
		localRequest.set(null);
	}  

	
	public static HttpServletRequest getHttpServletRequest() {
		return localRequest.get();
	}
    /**
     * 检测是否登录
     *
     * @param httpSession
     * @return
     */
    public static boolean isLogin(HttpSession httpSession) {
        User user = getUser(httpSession);
        if (null == user) {
            return false;
        }
        return true;
    }

    /**
     * 从Session中获取用户
     *
     * @param httpSession
     * @return
     */
     public static User getUser(HttpSession httpSession) {
         return (User) httpSession.getAttribute(USER_SESSION_KEY);
    }

    /**
     * 登录后设置User至session中.
     *
     * @param u
     * @param httpSession
     */
    public static void setUser(User u, HttpSession httpSession) {
        httpSession.setAttribute(USER_SESSION_KEY, u);
    }

    /**
     * 用户登出.
     * @param httpSession
     */
    public static void removeUser(HttpServletRequest request, HttpServletResponse response) {
    	clearCookie(request,response,"/");
    }
    
	/**
	 * 清空cookie
	 */
	private static void clearCookie(HttpServletRequest request, HttpServletResponse response, String path) {
		Cookie[] cookies = request.getCookies();
		try {
			for (int i = 0; i < cookies.length; i++) {
				// System.out.println(cookies[i].getName() + ":" +
				// cookies[i].getValue());
				Cookie cookie = new Cookie(cookies[i].getName(), null);
				cookie.setMaxAge(0);
				cookie.setPath(path);// 根据你创建cookie的路径进行填写
				response.addCookie(cookie);
			}
		} catch (Exception ex) {
			System.out.println("清空Cookies发生异常！");
		}

	} 
    
	/**
	 * 用户登录信息存入cookie
	 */
	public static void setCookie(HttpServletResponse response, User user) {

		String sid = ObjectUtils.getUUID();
		// 会话ID&用户code
		String cookieString = sid + "&" + user.getId();
		cookieString = org.apache.commons.codec.binary.Base64.encodeBase64String(cookieString.getBytes());
		try {
			cookieString = URLEncoder.encode(cookieString, "utf-8");
		} catch (UnsupportedEncodingException e) {
		}
		Cookie cookie = new Cookie(COOKIE_CODE, cookieString);
		cookie.setPath("/");
		cookie.setMaxAge(31104000);// 这种将存在客户端当中...有效时间1年
		response.addCookie(cookie);
	}
	
	/**
	 * 获取当前登陆用户
	 * @return
	 */
	public static User getUser(HttpServletRequest request) {
		
		// 如果是微信，则用openid关联，不用cookie
		if(isWeiXin(request)){
			String _openid = getOpenId(request);
			if(!StringUtil.isStrEmpty(_openid)){
				// 查询关联用户
				WxUserRelaton wxUserRelaton = WxUserRelaton.dao.findByOpenId(_openid);
				if(wxUserRelaton != null){
					return User.dao.findById(wxUserRelaton.get("user_id"));
				}
			}
			return null;
		}
		
		Cookie cookies[] = request.getCookies();
		Cookie sCookie = null;
		String cookieStr = "";
		if (cookies != null && cookies.length > 0) {
			for (int i = 0; i < cookies.length; i++) {
				sCookie = cookies[i];
				if (sCookie.getName().equals(COOKIE_CODE)) {
					cookieStr = sCookie.getValue();
					if (ObjectUtils.isNotEmpty(cookieStr)){
						try {
							cookieStr = URLDecoder.decode(cookieStr, "utf-8");
							cookieStr =  new String(Base64.decodeFast(cookieStr));
						} catch (UnsupportedEncodingException e) {
						}
					}
				}
			}
		}
		if (ObjectUtils.isNotEmpty(cookieStr)){
			String str[] = cookieStr.split("&");
			return User.dao.findById(str[1]);
		}
		
		return null;
	}
	
	private static final String _openId = "_openId";
	
	public static String getOpenId(HttpServletRequest request){
		return (String) request.getSession().getAttribute(_openId);
	}
	
	public static void setOpenId(HttpServletRequest request, String openId){
		request.getSession().setAttribute(_openId,openId);
	}

	/**获取浏览器特征
	 * @param c
	 * @return
	 */
	public static String getUserAgent(HttpServletRequest request) {
		return request.getHeader("User-Agent");
	}
	
	/**是否是微信浏览器请求
	 * @return
	 */
	public static boolean isWeiXin(HttpServletRequest request) {
		String userAgent = getUserAgent(request);
		if (userAgent==null) {
			userAgent="";
		}
		userAgent=userAgent.toLowerCase();
		return userAgent.indexOf("micromessenger")!=-1;
	}
	
	public static String getDomain(HttpServletRequest request){
		StringBuffer url = request.getRequestURL();
		return url.delete(url.length() - request.getRequestURI().length(), url.length()).append("/").toString();
	}

}