package com.example.hecj.upload;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.File;

/**
 * WebViewUpload
 *
 * @Author KenChung
 */
public class MyActivity extends Activity implements ReWebChomeClient.OpenFileChooserCallBack {

    private static final String TAG = "MyActivity";
    private static final int REQUEST_CODE_PICK_IMAGE = 0;
    private static final int REQUEST_CODE_IMAGE_CAPTURE = 1;
    private WebView mWebView;
    private Intent mSourceIntent;
    private ValueCallback<Uri> mUploadMsg;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        mWebView = (WebView) findViewById(R.id.webview);

//        WebSettings webSettings = mWebView.getSettings();
//        webSettings.setAllowFileAccess(true);// 设置允许访问文件数据
//        webSettings.setJavaScriptEnabled(true);// 设置支持javascript脚本
//        webSettings.setBuiltInZoomControls(true);// 设置支持缩放

        mWebView.setWebChromeClient(new ReWebChomeClient(this,this));
        mWebView.setWebViewClient(new ReWebViewClient());
        fixDirPath();

        mWebView.loadUrl("http://a.hecj.top/upload.html");
        Toast.makeText(getApplicationContext(), "load success",
                Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode != Activity.RESULT_OK) {
            return;
        }
        switch (requestCode) {
            case REQUEST_CODE_IMAGE_CAPTURE:
            case REQUEST_CODE_PICK_IMAGE: {
                try {
                    if (mUploadMsg == null) {
                        return;
                    }
                    String sourcePath = ImageUtil.retrievePath(this, mSourceIntent, data);
                    if (TextUtils.isEmpty(sourcePath) || !new File(sourcePath).exists()) {
                        Log.w(TAG, "sourcePath empty or not exists.");
                        break;
                    }
                    Uri uri = Uri.fromFile(new File(sourcePath));
                    mUploadMsg.onReceiveValue(uri);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                break;
            }
        }
    }

    @Override
    public void openFileChooserCallBack(ValueCallback<Uri> uploadMsg, String acceptType) {
        Log.i("hecj","------------openFileChooserCallBack");
        mUploadMsg = uploadMsg;
        showOptions();

        Toast.makeText(getApplicationContext(), "openFileChooserCallBack",
                Toast.LENGTH_SHORT).show();
    }



    public void showOptions() {
        AlertDialog.Builder alertDialog = new AlertDialog.Builder(this);
        alertDialog.setOnCancelListener(new ReOnCancelListener());
        alertDialog.setTitle("上传图片");
        alertDialog.setItems(new String[]{"相册", "拍照"}, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                Log.i("hecj","------------which："+which);
                if (which == 0) {
                    mSourceIntent = ImageUtil.choosePicture();
                    startActivityForResult(mSourceIntent, REQUEST_CODE_PICK_IMAGE);
                } else {
                    mSourceIntent = ImageUtil.takeBigPicture();
                    startActivityForResult(mSourceIntent, REQUEST_CODE_IMAGE_CAPTURE);
                }
            }
        });
      /*  alertDialog.setItems(R.array.options, new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                       *//* if (which == 0) {
                            mSourceIntent = ImageUtil.choosePicture();
                            startActivityForResult(mSourceIntent, REQUEST_CODE_PICK_IMAGE);
                        } else {
                            mSourceIntent = ImageUtil.takeBigPicture();
                            startActivityForResult(mSourceIntent, REQUEST_CODE_IMAGE_CAPTURE);
                        }*//*
                    }
                }
        );*/
        alertDialog.show();
    }

    private void fixDirPath() {
        String path = ImageUtil.getDirPath();
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    private class ReOnCancelListener implements DialogInterface.OnCancelListener {

        @Override
        public void onCancel(DialogInterface dialogInterface) {
            if (mUploadMsg != null) {
                mUploadMsg.onReceiveValue(null);
                mUploadMsg = null;
            }
        }
    }
}
