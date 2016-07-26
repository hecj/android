package com.android.h5.framework.app;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;

import com.android.h5.framework.config.Config;
import com.android.h5.framework.emchat.EmchatUtil;
import com.android.h5.framework.page.IPage;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMOptions;

public class AppContext extends Application {

    /**
     * 获取当前应用程序实例
     */
    private static AppContext _instance;
    /**
     * 上下文
     */
    private static Context _context;
    /**
     * 资源
     */
    private static Resources _resource;

    private IPage _currentPage;

    @Override
    public void onCreate() {
        super.onCreate();
        _instance = this;
        _context = getApplicationContext();
        _resource = _context.getResources();

        // 初始化环信
        EmchatUtil.initEmChat(_context);

    }

    /**
     * 获取当前应用程序实例
     */
    public static synchronized AppContext getInstance() {
        return _instance;
    }
    public static synchronized Context getContext() {
        return (Context) _context;
    }

    public static synchronized Resources getResource() {
        return (Resources) _resource;
    }

    /**
     * 获取访问key
     * @return
     */
    public String getToken() {
        SharedPreferences sharedPreferences = getContext().getApplicationContext().getSharedPreferences(Config.TOKEN_FILE, AppContext.MODE_PRIVATE);
        String token = sharedPreferences.getString("token", "");
        return token;
    }

    /**
     * 设置访问key
     * @param token
     */
    public void setToken(String token) {

        SharedPreferences sharedPreferences = getSharedPreferences(Config.TOKEN_FILE, MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        editor.putString("token", token);

        editor.putBoolean("isUpdateContacts", false);
        editor.commit();
    }

    //清除所有cookie
    public void clearCookie()
    {
        CookieSyncManager cookieSyncManager = CookieSyncManager.createInstance(AppContext.getContext());
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.removeSessionCookie();
        cookieManager.removeAllCookie();
        cookieSyncManager.sync();

        setToken(null);
    }

    public IPage getcurrentPage() {
        return _currentPage;
    }

    public void setcurrentPage(IPage currentPage) {
        this._currentPage = currentPage;
//        if (currentWebPage != null)
//            currentWebPage.webView.addJavascriptInterface(LocationSupportApplication.getInstance(), "eyaoren");
    }

}
