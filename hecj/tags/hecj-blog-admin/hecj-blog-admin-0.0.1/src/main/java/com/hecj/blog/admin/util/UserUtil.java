package com.hecj.blog.admin.util;

import javax.servlet.http.HttpSession;

import com.hecj.blog.service.model.PUser;

public class UserUtil {

    //SessionKey
    public static final String USER_SESSION_KEY = "BLOG_USER_SESSION_KEY";

    /**
     * 检测是否登录
     *
     * @param httpSession
     * @return
     */
    public static boolean isLogin(HttpSession httpSession) {
    	PUser user = getPUser(httpSession);
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
     public static PUser getPUser(HttpSession httpSession) {
         return (PUser) httpSession.getAttribute(USER_SESSION_KEY);
    }

    /**
     * 登录后设置User至session中.
     *
     * @param u
     * @param httpSession
     */
    public static void setPUser(PUser u, HttpSession httpSession) {
        httpSession.setAttribute(USER_SESSION_KEY, u);
    }

    /**
     * 用户登出.
     * @param httpSession
     */
    public static void removePUser(HttpSession httpSession) {
        httpSession.removeAttribute(USER_SESSION_KEY);
        httpSession.invalidate();
    }

}