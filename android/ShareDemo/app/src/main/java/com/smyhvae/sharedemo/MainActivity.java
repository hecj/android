package com.smyhvae.sharedemo;

import android.app.Activity;
import android.app.Dialog;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.Toast;

import java.util.HashMap;

import cn.sharesdk.framework.Platform;
import cn.sharesdk.framework.Platform.ShareParams;
import cn.sharesdk.framework.PlatformActionListener;
import cn.sharesdk.framework.ShareSDK;
import cn.sharesdk.sina.weibo.SinaWeibo;
import cn.sharesdk.tencent.qq.QQ;
import cn.sharesdk.wechat.friends.Wechat;
import cn.sharesdk.wechat.moments.WechatMoments;


public class MainActivity extends Activity implements View.OnClickListener,
        PlatformActionListener {

    private Button shareButton;
    private Button shareButton2;
    ShareDialog shareDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();
        //1、分享的初始化
        ShareSDK.initSDK(this);
    }

    private void initView() {
        shareButton = (Button) findViewById(R.id.shareButton);
        shareButton.setOnClickListener(this);
        shareButton2 = (Button) findViewById(R.id.shareButton2);
        shareButton2.setOnClickListener(this);
    }



    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.shareButton:
                shareDialog = new ShareDialog(this);
                shareDialog.setCancelButtonOnClickListener(new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        shareDialog.dismiss();

                    }
                });
                shareDialog.setOnItemClickListener(new AdapterView.OnItemClickListener() {

                    @Override
                    public void onItemClick(AdapterView<?> arg0, View arg1,
                                            int arg2, long arg3) {
                        HashMap<String, Object> item = (HashMap<String, Object>) arg0.getItemAtPosition(arg2);
                        if (item.get("ItemText").equals("微博")) {

                            //2、设置分享内容
                            ShareParams sp = new ShareParams();
                            sp.setText("我是分享文本，啦啦啦~http://uestcbmi.com/"); //分享文本
                            sp.setImageUrl("http://7sby7r.com1.z0.glb.clouddn.com/CYSJ_02.jpg");//网络图片rul

                            //3、非常重要：获取平台对象
                            Platform sinaWeibo = ShareSDK.getPlatform(SinaWeibo.NAME);
                            sinaWeibo.setPlatformActionListener(MainActivity.this); // 设置分享事件回调
                            // 执行分享
                            sinaWeibo.share(sp);

                        } else if (item.get("ItemText").equals("微信好友")) {
                            Toast.makeText(MainActivity.this, "您点中了" + item.get("ItemText"), Toast.LENGTH_LONG).show();

                            //2、设置分享内容
                            ShareParams sp = new ShareParams();
                            sp.setShareType(Platform.SHARE_WEBPAGE);//非常重要：一定要设置分享属性
                            sp.setTitle("我是分享标题");  //分享标题
                            sp.setText("我是分享文本，啦啦啦~http://uestcbmi.com/");   //分享文本
                            sp.setImageUrl("http://7sby7r.com1.z0.glb.clouddn.com/CYSJ_02.jpg");//网络图片rul
                            sp.setUrl("http://sharesdk.cn");   //网友点进链接后，可以看到分享的详情

                            //3、非常重要：获取平台对象
                            Platform wechat = ShareSDK.getPlatform(Wechat.NAME);
                            wechat.setPlatformActionListener(MainActivity.this); // 设置分享事件回调
                            // 执行分享
                            wechat.share(sp);


                        } else if (item.get("ItemText").equals("朋友圈")) {
                            //2、设置分享内容
                            ShareParams sp = new ShareParams();
                            sp.setShareType(Platform.SHARE_WEBPAGE); //非常重要：一定要设置分享属性
                            sp.setTitle("我是分享标题");  //分享标题
                            sp.setText("我是分享文本，啦啦啦~http://uestcbmi.com/");   //分享文本
                            sp.setImageUrl("http://7sby7r.com1.z0.glb.clouddn.com/CYSJ_02.jpg");//网络图片rul
                            sp.setUrl("http://sharesdk.cn");   //网友点进链接后，可以看到分享的详情

                            //3、非常重要：获取平台对象
                            Platform wechatMoments = ShareSDK.getPlatform(WechatMoments.NAME);
                            wechatMoments.setPlatformActionListener(MainActivity.this); // 设置分享事件回调
                            // 执行分享
                            wechatMoments.share(sp);

                        } else if (item.get("ItemText").equals("QQ")) {
                            //2、设置分享内容
                            ShareParams sp = new ShareParams();
                            sp.setTitle("我是分享标题");
                            sp.setText("我是分享文本，啦啦啦~http://uestcbmi.com/");
                            sp.setImageUrl("http://7sby7r.com1.z0.glb.clouddn.com/CYSJ_02.jpg");//网络图片rul
                            sp.setTitleUrl("http://www.baidu.com");  //网友点进链接后，可以看到分享的详情
                            //3、非常重要：获取平台对象
                            Platform qq = ShareSDK.getPlatform(QQ.NAME);
                            qq.setPlatformActionListener(MainActivity.this); // 设置分享事件回调
                            // 执行分享
                            qq.share(sp);

                        }


                        shareDialog.dismiss();

                    }
                });

                break;
            case R.id.shareButton2:

                LayoutInflater inflater = LayoutInflater.from(this);
                View layout = inflater.inflate(R.layout.layout_share_dialog, null);
                final Dialog alertDialog = new Dialog(this,R.style.Dialog);//去白框dialog里面具体设置样式
                alertDialog.setContentView(layout);
                Window window = alertDialog.getWindow();
                WindowManager wm =this.getWindowManager();
                window.setGravity(Gravity.BOTTOM);//居下显示
                Display d = wm.getDefaultDisplay(); // 获取屏幕宽、高度
                WindowManager.LayoutParams lp = alertDialog.getWindow().getAttributes();
                lp.width = d.getWidth() ; // 宽度
                window.setWindowAnimations(R.style.eyaosharemove);  //添加动画
                alertDialog.getWindow().setAttributes(lp);
                alertDialog.show();

                break;
            default:
                break;
        }

    }

    @Override
    public void onCancel(Platform arg0, int arg1) {//回调的地方是子线程，进行UI操作要用handle处理
        handler.sendEmptyMessage(5);

    }

    @Override
    public void onComplete(Platform arg0, int arg1, HashMap<String, Object> arg2) {//回调的地方是子线程，进行UI操作要用handle处理
        if (arg0.getName().equals(SinaWeibo.NAME)) {// 判断成功的平台是不是新浪微博
            handler.sendEmptyMessage(1);
        } else if (arg0.getName().equals(Wechat.NAME)) {
            handler.sendEmptyMessage(1);
        } else if (arg0.getName().equals(WechatMoments.NAME)) {
            handler.sendEmptyMessage(3);
        } else if (arg0.getName().equals(QQ.NAME)) {
            handler.sendEmptyMessage(4);
        }

    }

    @Override
    public void onError(Platform arg0, int arg1, Throwable arg2) {//回调的地方是子线程，进行UI操作要用handle处理
        arg2.printStackTrace();
        Message msg = new Message();
        msg.what = 6;
        msg.obj = arg2.getMessage();
        handler.sendMessage(msg);
    }

    Handler handler = new Handler() {

        @Override
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case 1:
                    Toast.makeText(getApplicationContext(), "微博分享成功", Toast.LENGTH_LONG).show();
                    break;

                case 2:
                    Toast.makeText(getApplicationContext(), "微信分享成功", Toast.LENGTH_LONG).show();
                    break;
                case 3:
                    Toast.makeText(getApplicationContext(), "朋友圈分享成功", Toast.LENGTH_LONG).show();
                    break;
                case 4:
                    Toast.makeText(getApplicationContext(), "QQ分享成功", Toast.LENGTH_LONG).show();
                    break;

                case 5:
                    Toast.makeText(getApplicationContext(), "取消分享", Toast.LENGTH_LONG).show();
                    break;
                case 6:
                    Toast.makeText(getApplicationContext(), "分享失败啊" + msg.obj, Toast.LENGTH_LONG).show();
                    break;

                default:
                    break;
            }
        }

    };

}
