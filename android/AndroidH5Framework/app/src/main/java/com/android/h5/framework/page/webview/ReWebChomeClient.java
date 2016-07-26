package com.android.h5.framework.page.webview;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.util.Log;
import android.view.KeyEvent;
import android.webkit.JsPromptResult;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.EditText;

/**
 * ReWebChomeClient
 *
 * @Author KenChung
 */
public abstract class ReWebChomeClient extends WebChromeClient {

    public ReWebChomeClient() {

    }

    @Override
    public void onReceivedTitle(WebView view, String title) {

    }

    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        super.onProgressChanged(view, newProgress);

    }

//    private OpenFileChooserCallBack mOpenFileChooserCallBack;
//
//    public void setmOpenFileChooserCallBack(OpenFileChooserCallBack mOpenFileChooserCallBack) {
//        this.mOpenFileChooserCallBack = mOpenFileChooserCallBack;
//    }
//
//    public ReWebChomeClient(OpenFileChooserCallBack openFileChooserCallBack) {
//        mOpenFileChooserCallBack = openFileChooserCallBack;
//    }

//    //For Android 3.0+
//    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType) {
//        mOpenFileChooserCallBack.openFileChooserCallBack(uploadMsg, acceptType);
//    }
//
//    // For Android < 3.0
//    public void openFileChooser(ValueCallback<Uri> uploadMsg) {
//        openFileChooser(uploadMsg, "");
//    }
//
//    // For Android  > 4.1.1
//    public void openFileChooser(ValueCallback<Uri> uploadMsg, String acceptType, String capture) {
//        openFileChooser(uploadMsg, acceptType);
//    }
//
//    public interface OpenFileChooserCallBack {
//        void openFileChooserCallBack(ValueCallback<Uri> uploadMsg, String acceptType);
//    }


    /**
     * 覆盖默认的window.alert展示界面，避免title里显示为“：来自file:////”
     */
    @Override
    public boolean onJsAlert(WebView view, String url, String message,
                             JsResult result) {

        try {
            final AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());

            builder.setTitle("消息")
                    .setMessage(message)
                    .setPositiveButton("确定", null);

            // 不需要绑定按键事件
            // 屏蔽keycode等于84之类的按键
            builder.setOnKeyListener(new DialogInterface.OnKeyListener() {
                public boolean onKey(DialogInterface dialog, int keyCode, KeyEvent event) {
                    Log.v("onJsAlert", "keyCode==" + keyCode + "event=" + event);
                    return true;
                }
            });
            // 禁止响应按back键的事件
            builder.setCancelable(false);
            AlertDialog dialog = builder.create();
            dialog.show();
            result.confirm();// 因为没有绑定事件，需要强行confirm,否则页面会变黑显示不了内容。
        }catch (Exception e){
            e.printStackTrace();
        }
        return true;
        // return super.onJsAlert(view, url, message, result);
    }


    @Override
    public boolean onJsConfirm(WebView view, String url, String message,final JsResult result) {
        //对confirm的简单封装
        final AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());
        builder.setTitle("消息")
                .setMessage(message)
                .setPositiveButton("确定",new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog,int which) {
                        result.confirm();
                    }
                })
                .setNeutralButton("取消", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.cancel();
                    }
                });
        builder.setOnCancelListener(new DialogInterface.OnCancelListener() {
            @Override
            public void onCancel(DialogInterface dialog) {
                result.cancel();
            }
        });

        // 屏蔽keycode等于84之类的按键，避免按键后导致对话框消息而页面无法再弹出对话框的问题
        builder.setOnKeyListener(new DialogInterface.OnKeyListener() {
            @Override
            public boolean onKey(DialogInterface dialog, int keyCode,KeyEvent event) {
                Log.v("onJsConfirm", "keyCode==" + keyCode + "event="+ event);
                return true;
            }
        });
        // 禁止响应按back键的事件
        // builder.setCancelable(false);
        AlertDialog dialog = builder.create();
        dialog.show();
        return true;
    }

    /**
     * 覆盖默认的window.prompt展示界面，避免title里显示为“：来自file:////”
     * window.prompt('请输入您的域名地址', '618119.com');
     */
    public boolean onJsPrompt(WebView view, String url, String message,
                              String defaultValue, final JsPromptResult result) {
        final AlertDialog.Builder builder = new AlertDialog.Builder(view.getContext());

        builder.setTitle("消息").setMessage(message);

        final EditText et = new EditText(view.getContext());
        et.setSingleLine();
        et.setText(defaultValue);
        builder.setView(et)
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.confirm(et.getText().toString());
                    }

                })
                .setNeutralButton("取消", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        result.cancel();
                    }
                });

        // 屏蔽keycode等于84之类的按键，避免按键后导致对话框消息而页面无法再弹出对话框的问题
        builder.setOnKeyListener(new DialogInterface.OnKeyListener() {
            public boolean onKey(DialogInterface dialog, int keyCode,KeyEvent event) {
                Log.v("onJsPrompt", "keyCode==" + keyCode + "event="+ event);
                return true;
            }
        });

        // 禁止响应按back键的事件
        // builder.setCancelable(false);
        AlertDialog dialog = builder.create();
        dialog.show();
        return true;
        // return super.onJsPrompt(view, url, message, defaultValue,
        // result);
    }

}



