package com.android.h5.framework.page;

import android.content.Context;
import android.os.Handler;
import android.view.View;
import android.webkit.WebView;

import com.android.h5.framework.app.AppContext;

public abstract class IPage
{
    protected View view;
    protected Context context;
    protected Handler handler;
    /**
     * data用于page之间传值(泛型)
     */
    protected Object data;

    public IPage(Context context, Handler handler) {
        this.context = context;
        this.handler = handler;
        initView();
    }

    public IPage(Context context, Handler handler, Object data) {
        this.context = context;
        this.handler = handler;
        this.data = data;
        initView();
    }

    public void setHandler(Handler handler) {
        this.handler = handler;
    }

    /**
     * 页面视图初始化
     */
    protected abstract void initView();

    public View getView() {
        return view;
    }

    public void PushJs(AppContext app, String message, int type){} ;

    /**
     * 页面初始化方法
     */
    public abstract void viewDidLoad();

    public abstract void viewDidUnload();

    public abstract void showCloseBtn();

    public abstract void hideCloseBtn();

    /**
     * 隐藏返回按钮
     */
    public abstract void hideBackBtn();

    public abstract void setNeedReload(boolean needReload);

    public abstract void showCodeBtn();

    public abstract void onDestroy();

}