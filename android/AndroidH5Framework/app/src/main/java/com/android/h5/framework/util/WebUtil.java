package com.android.h5.framework.util;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.android.h5.framework.app.AppContext;
import com.android.h5.framework.config.Config;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class WebUtil {

    public static long valid_time=0;//有效时间

    /**
     * 同步一下cookie
     * 隔一段时间同步一下cookie
     */
    public static void synCookies(WebView webView, String url) {

        String oldToken = AppContext.getInstance().getToken();
        TLog.d("synCookies oldToken : "+oldToken);
//        if(!StringUtil.isStrEmpty(oldToken)){
//            return;
//        } else{

            CookieManager cookieManager = CookieManager.getInstance();
            String cookieStr = cookieManager.getCookie(url);
            TLog.d("查询到的cookieStr  " + cookieStr);
            String token = cookie2Map(cookieStr).get("code");
            TLog.d("synCookies token : "+token);
            AppContext.getInstance().setToken(token);

//            CookieSyncManager.createInstance(webView.getContext());
//            cookieManager.setAcceptCookie(true);
//            cookieManager.removeSessionCookie();//移除
////            cookieManager.setCookie(url, CookieStr);//cookies是在HttpClient中获得的cookie
//            CookieSyncManager.getInstance().sync();

//        }

//        CookieSyncManager.createInstance(context);
//        CookieManager cookieManager = CookieManager.getInstance();
//        cookieManager.setAcceptCookie(true);
//        String oldCookie = cookieManager.getCookie(url);
//        String cookies="HOW_TO_NEXT_TOKEN="+token+";domain="+Config.domain+";path=/";
////        Toast.makeText(context,"old:"+oldCookie+"  new:"+cookies,Toast.LENGTH_LONG).show();
//        TLog.i("old:" + oldCookie + "  new:" + cookies);
//        cookieManager.setCookie(url, cookies);//cookies是在HttpClient中获得的cookie
//        CookieSyncManager.getInstance().sync();
    }

    /**
     * cookie转map
     * @param cookieStr
     * @return
     */
    private static Map<String,String> cookie2Map(String cookieStr){
        Map<String,String> map = new HashMap<String,String>();
        if(!StringUtil.isStrEmpty(cookieStr)){
            String[] rows = cookieStr.split("\\;");
            for(String row : rows){
                String[] rowList = row.split("\\=");
                map.put(rowList[0].trim(),rowList[1].toString());
            }
        }
        return map;
    }



    //执行js
    public static void loadJs(WebView w, String url) {
        TLog.i("js_call:"+url);
        w.loadUrl("javascript:" + url);
    }
    /**
     * 跳转路径并同步cookie
     */
    public static void load(WebView webView,String url) {
        TLog.i("url_call:"+url);
        synCookies(webView,url);
        webView.loadUrl(url);
    }

    //参数转换成map
    public static Map<String,String> url2map(String url)   {
        String[] urlSplit = url.split("\\?");
        String  pstr="";
        if(urlSplit.length>1){
            pstr=urlSplit[1];
        }
        String[] params = pstr.split("&");
        Map<String,String> tm=new HashMap<String,String>();
        for (String s:params) {
            String[] sz = s.split("=");
            if(sz.length>1){
                try {
                    tm.put(sz[0], URLDecoder.decode(sz[1], "utf-8"));
                } catch (UnsupportedEncodingException e) {
                    Log.e("parms",e.getMessage());
                    e.printStackTrace();
                }
            }
        }
        return tm;
    }

}
