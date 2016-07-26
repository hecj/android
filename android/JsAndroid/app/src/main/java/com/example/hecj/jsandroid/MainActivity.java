package com.example.hecj.jsandroid;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.Toast;


public class MainActivity extends Activity {

    private WebView webView;
    private Button btn;
    private WebSettings webSettings;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = (WebView)this.findViewById(R.id.webView);
        btn = (Button)this.findViewById(R.id.btn);
        webView.loadUrl("http://a.hecj.top/js.html");
        webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setSavePassword(false);

        // 处理页面调用的js
        webView.setWebChromeClient(new WebChromeClient(){

        });

        webView.setWebViewClient(new WebViewClient(){

        });

        // 添加js接口
        webView.addJavascriptInterface(new JSInferface(),"app");

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 调用页面js方法
                webView.loadUrl("javascript:showHello(\"我是参数\")");
            }
        });

    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    /**
     * 一定要加SuppressLint 不然android高版本调不了
     */
    @SuppressLint("SetJavaScriptEnabled")
    class JSInferface {

        // 暴露js方法
        @JavascriptInterface
        public void appShowHello(String p){
            Toast.makeText(MainActivity.this,"app show hello:"+p,Toast.LENGTH_LONG).show();
        }
    }
}
