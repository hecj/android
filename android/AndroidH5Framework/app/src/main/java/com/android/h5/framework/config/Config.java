package com.android.h5.framework.config;

import com.android.h5.framework.R;
import com.android.h5.framework.app.AppContext;


public class Config {

    public static final boolean IS_DEBUG =true;

    /**
     * 首选项
     */
    // 名称
    public static final String PREFS_NAME ="prefs";
    // 是否第一次启动应用
    public static final String PREFS_FIRST_START = "first";

    public static final String TOKEN_FILE="token_file";

    public static final String domain = "";

    private static final String URL_HOST = AppContext.getInstance().getString(R.string.URL_HOST);

    public static String getUrlHost(){
        return URL_HOST;
    }

    // 打开新页面
    public static final int MESSAGE_OPEN_PAGE = 10000;

    public static final int MESSAGE_TRIGGER_CLOSE = 10001;

    public static final int MESSAGE_TRIGGER_BACK = 10002;

    public static final int MESSAGE_UPLOAD_IMAGES = 10003;

    public static final int TO_SELECT_PHOTO = 10004;

    public static final int MESSAGE_GO_LOGIN = 10005;

    public static final int MESSAGE_LOGIN_SUCCESS= 10006;

    public static final int MESSAGE_GO_LOGOUT= 10007;

    public static final int MESSAGE_UPDATE_FIlE= 10008;


    public static final String APP_DIR_NAME =  "/Android/data/com.eyaotech.eyaoren";



}