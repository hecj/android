package com.android.h5.framework.page;

import android.content.Context;
import android.os.Handler;

import com.android.h5.framework.R;
import com.android.h5.framework.config.Config;

/**
 */
public class IPageCreator {

    /**
     * 创建一个二级三级页面
     * @param url
     * @param context
     * @param handler
     * @return
     */
    public static IPage newInstance(String url, Context context, Handler handler) {
        WebBasePage instance = new WebSimplePage(context, handler);
        instance.setUrl(url);
        return instance;
    }

    /**
     * 创建一个一级页面
     * @param id
     * @param context
     * @param handler
     * @return
     */
    public static IPage newInstance(int id, Context context, Handler handler) {
        WebBasePage instance = new WebSimplePage(context, handler);
        instance.hideBackBtn();

        switch (id) {
            case R.id.main_rb_message:
//                instance = new MessagePage(context, handler);
                instance.setUrl(Config.getUrlHost() + "/article");
//                instance.showCodeBtn();
                break;
            case R.id.main_rb_add:
                instance.setUrl(Config.getUrlHost() + "/address");
//                instance.showCodeBtn();
                break;
            case R.id.main_rb_activity:
                instance.setUrl(Config.getUrlHost() + "/activity");
//                instance.showCodeBtn();
                break;
            case R.id.main_rb_user:
                instance.setUrl(Config.getUrlHost() + "/user");
//                instance.showCodeBtn();
                break;
            default:
                break;
        }
        return instance;
    }
}
