package com.example.hecj.upload;

import android.graphics.Bitmap;
import android.util.Log;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 *
 * @Author KenChung
 */
public class ReWebViewClient extends WebViewClient {

    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        Log.i("hecj","------------onPageStarted");
        super.onPageStarted(view, url, favicon);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        Log.i("hecj","------------onPageFinished");
        super.onPageFinished(view, url);
    }
}
