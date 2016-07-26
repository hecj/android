package com.android.h5.framework.page;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.android.h5.framework.R;
import com.android.h5.framework.config.Config;
import com.android.h5.framework.page.webview.BaseWebViewClient;
import com.android.h5.framework.page.webview.ReWebChomeClient;
import com.android.h5.framework.util.DateFormatUtil;
import com.android.h5.framework.util.FileUtil;
import com.android.h5.framework.util.TLog;
import com.android.h5.framework.util.WebUtil;
import com.lee.pullrefresh.ui.PullToRefreshWebView;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Date;
import java.util.Map;

/**
 * 基础webPage
 */
public class WebBasePage extends IPage{

    protected String url;
    protected WebView webView;
    // 标记本页面是否已加载
    public boolean isLoaded = false;
    // 需要重新加载
    protected boolean needReload = false;
    // 返回按钮
    protected RelativeLayout backBtn;
    /**
     * 标题
     */
    protected TextView webpageTxtTitle;
    // 刷新控件
    protected PullToRefreshWebView refreshableView;

    public WebBasePage(Context context, Handler handler){
        super(context,handler);
    }

    /**
     * 初始化
     */
    @Override
    protected void initView() {

    }

    @Override
    public void viewDidLoad() {
        TLog.d(" viewDidLoad isLoaded{} > "+url+" - "+isLoaded);
        if(!isLoaded){
            // 第一次就加载
            WebUtil.load(webView, getCombinedUrl(url));
        } else{
            // 第二次
            if (needReload) {
                // reload
                reload();
            } else {

            }
        }
    }

    /**
     * 补全url不带域名情况
     * @param originUrl
     * @return
     */
    protected String getCombinedUrl(String originUrl) {
        String result = originUrl;
        if(originUrl==null){return null;}
        if (!originUrl.contains("http://")) {
            if (!originUrl.startsWith("/") && !Config.getUrlHost().endsWith("/")) {
                result = "/" + originUrl;
            }
//            String deviceid = SystemUtil.getDeviceId(context);
//            if (originUrl.contains("?")) {
//                result += "&deviceid=" + deviceid;
//            } else {
//                result += "?deviceid=" + deviceid;
//            }
//            SharedPreferences sp = context.getSharedPreferences(Config.TOKEN_FILE, Context.MODE_PRIVATE);
//            String token = sp.getString("token", "");
//            if (!token.equals("")) {
//                result += "&token=" + token;
//            }
            result = Config.getUrlHost() + result;
        }

        return result;
    }

    @Override
    public void viewDidUnload() {

    }

    @Override
    public void showCloseBtn() {

    }

    @Override
    public void hideCloseBtn() {

    }

    @Override
    public void hideBackBtn() {
        backBtn.setVisibility(View.GONE);
    }

    @Override
    public void setNeedReload(boolean needReload) {
        this.needReload = needReload;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    @Override
    public void showCodeBtn() {

    }

    @Override
    public void onDestroy() {

    }

//    @Override
//    public void onRefresh() {
//
//    }

    public WebView getWebView() {
        return this.webView;
    }

    public String  getUrl(){
        return url;
    }

    public void openPage(String url){

    }

    /**
     * 重新加载
     */
    public void reload(){
        if(webView !=null){
            TLog.d("页面重新加载url："+url);
            webView.reload();
        }
    }


    /**
     * 初始化web设置
     */
    protected void initWebViewSetting(){
        // 解决webview闪屏
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
            webView.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
        }
        WebSettings set = webView.getSettings();

        String ua = set.getUserAgentString();
        set.setUserAgentString(ua + ";h5App-android-" + 1.0 + "v/");

        set.setSavePassword(false);
        set.setSaveFormData(false);
        webView.setWebViewClient(new CommandHandleWebViewClient(context, handler));
//        webChromeClient.setmOpenFileChooserCallBack();
        set.setAllowFileAccess(true);
        //如果访问的页面中有Javascript，则webview必须设置支持Javascript
        set.setJavaScriptEnabled(true);
//        myWebView.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
//        myWebView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        set.setCacheMode(WebSettings.LOAD_DEFAULT);
        set.setAllowFileAccess(true);
        set.setAppCacheEnabled(true);
        set.setDomStorageEnabled(true);
        set.setDatabaseEnabled(true);

        set.setSupportZoom(false);
        set.setBuiltInZoomControls(true);

        webView.setWebChromeClient(new ReWebChomeClient() {
            @Override
            public void onReceivedTitle(WebView view, String title) {
                super.onReceivedTitle(view, title);
                webpageTxtTitle.setText(title);
            }
        });
    }

    /**
     * 设置页面最后刷新时间
     */
    protected void setLastUpdateTime() {
        refreshableView.setLastUpdatedLabel(DateFormatUtil.format(new Date(),"MM-dd HH:mm"));
    }

    /**
     * ==================内部类处理WebView相关业务======================
     */
    protected class CommandHandleWebViewClient extends BaseWebViewClient {

        public CommandHandleWebViewClient(Context context, Handler handler) {
            this.handler = handler;
            this.context = context;
        }
        private String loadBridge() {
            InputStream in = context.getResources().openRawResource(R.raw.h5bridge);
            String script = FileUtil.readFileInString(in, "UTF-8");
            return script;
        }

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            if (Config.IS_DEBUG) {
                Log.i("WebPage onPageStarted", "-----------------------------------开始-------------------------------------");
                try {
                    Log.i("WebPage", "新地址：" + URLDecoder.decode(url, "utf-8"));
                    Log.i("WebPage", "地址GetURL：" + view.getUrl());
                    Log.i("WebPage", "原来地址Original：" + view.getOriginalUrl());
                    Log.i("WebPage", "-----------------------------------结束-------------------------------------");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            super.shouldOverrideUrlLoading(view, url);

            if (Config.IS_DEBUG) {
                Log.i("WebPage shouldOverride", "------------------开始------------------------");
                try {
                    Log.i("WebPage", "新地址：" + URLDecoder.decode(url, "utf-8"));
                    Log.i("WebPage", "地址GetURL：" + view.getUrl());
                    Log.i("WebPage", "原来地址Original：" + view.getOriginalUrl());
                    Log.i("WebPage", "-----------------------------------结束-------------------------------------");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }

            if(url.startsWith("h5cmd://")) {
                // 解析命令
                executeCMD(url);
            }else{
                executePage(url);
            }
            return true;
        }

        /**
         * 执行命令
         * @param url
         */
        private void executeCMD(String url){
            // 根据url打开一个页面
            if(url.contains("open_page?")){
                Map<String,String> params = WebUtil.url2map(url);
                Message msg = Message.obtain();
                msg.obj = params.get("url");
                msg.what = Config.MESSAGE_OPEN_PAGE;
                handler.sendMessage(msg);

            } else if (url.contains("upload_image?")) {
                // 上传
                Message msg = new Message();
                msg.obj = url;
                msg.what = Config.MESSAGE_UPLOAD_IMAGES;
                handler.sendMessage(msg);

            } else if (url.contains("logout?")) {
                // 注销
                Message msg = new Message();
                msg.obj = url;
                msg.what = Config.MESSAGE_GO_LOGOUT;
                handler.sendMessage(msg);
            }
        }

        /**
         * 执行页面
         * @param url
         */
        private void executePage(String url) {
            if (url.contains("/login")) {
                /**
                 * 未登录，进入登录页面
                 */
                Message msg = Message.obtain();
                msg.obj = url;
                msg.what = Config.MESSAGE_GO_LOGIN;
                handler.sendMessage(msg);

            } else if (url.contains("/?signed")) {
                /**
                 * 登录成功,进入默认首页
                 */
                Message msg = Message.obtain();
                msg.obj = url;
                msg.what = Config.MESSAGE_LOGIN_SUCCESS;
                handler.sendMessage(msg);
            } else {

                Message msg = Message.obtain();
                msg.obj = url;
                msg.what = Config.MESSAGE_OPEN_PAGE;
                handler.sendMessage(msg);
            }
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            String script = loadBridge();
            WebUtil.loadJs(view, script);
//            String script = loadBridge();
//            WebUtil.loadJs(view, script);
            isLoaded = true;
//            super.onPageFinished(view, url);
//
//            if (LoadingDialog.isDialogShowing()) {
//                handler.sendEmptyMessage(Config.MESSAGE_HIDE_LOADING);
//            }
            refreshableView.onPullDownRefreshComplete();
            setLastUpdateTime();
        }

        @Override
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
//            view.stopLoading();
//            LogUtil.d(failingUrl + "failingUrl");
//            Message msg = handler.obtainMessage();//发送通知，加入线程
//            msg.what = Config.MESSAGE_404_ERROR;//通知加载自定义404页面
//            handler.sendMessage(msg);//通知发送！
        }
    }

}
