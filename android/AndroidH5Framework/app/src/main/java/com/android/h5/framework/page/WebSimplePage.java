package com.android.h5.framework.page;

import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.android.h5.framework.R;
import com.android.h5.framework.config.Config;
import com.android.h5.framework.page.webview.ReWebChomeClient;
import com.android.h5.framework.util.WebUtil;
import com.lee.pullrefresh.ui.PullToRefreshBase;
import com.lee.pullrefresh.ui.PullToRefreshWebView;

/**
 * 简单实现类
 */
public class WebSimplePage extends WebBasePage {

    public WebSimplePage(Context context, Handler handler) {
        super(context, handler);
    }

    @Override
    protected void initView() {
        super.initView();

        view = LayoutInflater.from(context).inflate(R.layout.view_webpage, null);

        webpageTxtTitle = (TextView) view.findViewById(R.id.webpage_txt_title);

        // 返回事件
        backBtn = (RelativeLayout) view.findViewById(R.id.webpage_layout_back);
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //根据URL 控制事件
                handler.sendEmptyMessage(Config.MESSAGE_TRIGGER_BACK);
            }
        });

        // 刷新页面控件
        refreshableView = (PullToRefreshWebView) view.findViewById(R.id.refreshable_view);
        refreshableView.setOnRefreshListener(new PullToRefreshBase.OnRefreshListener<WebView>() {
            @Override
            public void onPullDownToRefresh(PullToRefreshBase<WebView> refreshView) {
                //loadUrl();
               // mWebView.reload();
                reload();
            }
            @Override
            public void onPullUpToRefresh(PullToRefreshBase<WebView> refreshView) {

            }
        });

        webView = refreshableView.getRefreshableView();

        // 初始化webview设置
        initWebViewSetting();
        // 最后刷新时间
        setLastUpdateTime();
    }

}
