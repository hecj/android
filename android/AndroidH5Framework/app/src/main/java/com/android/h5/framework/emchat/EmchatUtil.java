package com.android.h5.framework.emchat;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.alibaba.fastjson.util.Base64;
import com.android.h5.framework.R;
import com.android.h5.framework.activity.main.MainActivity;
import com.android.h5.framework.app.AppContext;
import com.android.h5.framework.util.DateFormatUtil;
import com.android.h5.framework.util.StringUtil;
import com.android.h5.framework.util.TLog;
import com.hyphenate.EMCallBack;
import com.hyphenate.EMMessageListener;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMOptions;

import java.net.URLDecoder;
import java.util.Date;
import java.util.List;

/**
 * Created by hecj on 16/7/3.
 */
public class EmchatUtil {

    /**
     * 默认密码
     */
    private static final String passwd = "111111";

    public static void initEmChat(Context context){
         /*------环信配置----begin---*/
        EMOptions options = new EMOptions();
        // 默认添加好友时，是不需要验证的，改成需要验证
        options.setAcceptInvitationAlways(false);
        //初始化
        EMClient.getInstance().init(context, options);
        //在做打包混淆时，关闭debug模式，避免消耗不必要的资源
        EMClient.getInstance().setDebugMode(true);
        /*------环信配置----end---*/

        // 启动应用尝试登录环信
        login();
    }

    /**
     * 登录环信聊天
     */
    public static void login(){

        String token = AppContext.getInstance().getToken();
        Log.d("main","token:"+token);
        String userId = "";
        try{
            String strtoken = URLDecoder.decode(token, "utf-8");
            userId =  new String(Base64.decodeFast(strtoken)).split("&")[1];
            Log.d("main","userId:"+userId);

            if(StringUtil.isStrEmpty(userId)){
                return;
            }

            EMClient.getInstance().login(userId,passwd,new EMCallBack() {//回调
                @Override
                public void onSuccess() {
                    EMClient.getInstance().groupManager().loadAllGroups();
                    EMClient.getInstance().chatManager().loadAllConversations();
                    Log.d("main", "登录聊天服务器成功！");
                    regListener();
                }

                @Override
                public void onProgress(int progress, String status) {

                }

                @Override
                public void onError(int code, String message) {
                    Log.d("main", "登录聊天服务器失败！");
                }
            });

        } catch (Exception ex){
            ex.printStackTrace();
        }
    }

    /**
     * 退出登录
     */
    public static void logout(){
        //此方法为异步方法
        EMClient.getInstance().logout(true, new EMCallBack() {

            @Override
            public void onSuccess() {
                Log.d("main", "退出聊天服务器成功！");
                deployListener();
            }

            @Override
            public void onProgress(int progress, String status) {

            }

            @Override
            public void onError(int code, String message) {
                Log.d("main", "退出聊天服务器失败！");
            }
        });
    }

    /**
     * 环信消息监听器
     */
    static EMMessageListener msgListener = new EMMessageListener() {

        @Override
        public void onMessageReceived(List<EMMessage> messages) {
            try{
                //收到消息
                for (EMMessage m : messages){
                    Log.d("onMessageReceived", "========================");
                    Log.d("onMessageReceived", m.getMsgId());
                    Log.d("onMessageReceived", m.getType()+"");
                    Log.d("onMessageReceived", m.getChatType()+"");
                    Log.d("onMessageReceived", m.getUserName());
                    Log.d("onMessageReceived", m.getFrom());
                    Log.d("onMessageReceived", m.getTo());
                    Log.d("onMessageReceived", m.getMsgTime()+"");
                    Log.d("onMessageReceived", m.getBody().toString());

                    notifation(m.getBody().toString());
                }
            } catch(Exception ex){
                ex.printStackTrace();
            }

        }

        @Override
        public void onCmdMessageReceived(List<EMMessage> messages) {
            //收到透传消息
        }

        @Override
        public void onMessageReadAckReceived(List<EMMessage> messages) {
            //收到已读回执
        }

        @Override
        public void onMessageDeliveryAckReceived(List<EMMessage> message) {
            //收到已送达回执
        }

        @Override
        public void onMessageChanged(EMMessage m, Object change) {
            //消息状态变动
            Log.d("onMessageChanged", "========================");
            Log.d("onMessageChanged", m.getMsgId());
            Log.d("onMessageChanged", m.getType()+"");
            Log.d("onMessageChanged", m.getChatType()+"");
            Log.d("onMessageChanged", m.getUserName());
            Log.d("onMessageChanged", m.getFrom());
            Log.d("onMessageChanged", m.getTo());
            Log.d("onMessageChanged", m.getMsgTime()+"");
            Log.d("onMessageChanged", m.getBody().toString());
        }
    };

    /**
     * 消息监听
     */
    public static void regListener(){
        EMClient.getInstance().chatManager().addMessageListener(msgListener);
    }

    public static void deployListener(){
        EMClient.getInstance().chatManager().removeMessageListener(msgListener);
    }

    public static void notifation(String text){

        Intent notificationIntent = new Intent(AppContext.getContext(), MainActivity.class);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(AppContext.getContext(), 0, notificationIntent, 0);

        //创建Notifcation
        Notification notification = new Notification();
        notification.icon = R.drawable.ic_launcher;
        notification.tickerText = text;
        notification.when = System.currentTimeMillis();
        notification.defaults = Notification.DEFAULT_SOUND;
        notification.defaults = Notification.DEFAULT_ALL;

        notification.setLatestEventInfo(AppContext.getContext(), "点击查看", text, contentIntent);


        NotificationManager manager = (NotificationManager)AppContext.getInstance().getSystemService(AppContext.getInstance().NOTIFICATION_SERVICE);
        manager.notify(Integer.parseInt(DateFormatUtil.format(new Date(),("HHmmssSSS"))),notification);
    }

}
