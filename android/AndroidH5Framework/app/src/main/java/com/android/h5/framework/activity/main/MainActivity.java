package com.android.h5.framework.activity.main;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.util.SparseArray;
import android.view.View;
import android.webkit.URLUtil;
import android.webkit.WebView;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.android.h5.framework.R;
import com.android.h5.framework.activity.upload.SelectActivity;
import com.android.h5.framework.app.AppContext;
import com.android.h5.framework.config.Config;
import com.android.h5.framework.emchat.EmchatUtil;
import com.android.h5.framework.page.IPage;
import com.android.h5.framework.page.IPageCreator;
import com.android.h5.framework.page.WebBasePage;
import com.android.h5.framework.util.TLog;
import com.android.h5.framework.util.WebUtil;
import com.android.h5.framework.view.AnimationViewFlipper;

import net.tsz.afinal.FinalHttp;
import net.tsz.afinal.http.AjaxCallBack;
import net.tsz.afinal.http.AjaxParams;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URLDecoder;
import java.util.Map;
import java.util.UUID;

/**
 * 主框架
 */
public class MainActivity extends RootActivity implements AnimationViewFlipper.OnPopToRootListner, AnimationViewFlipper.OnPushViewListner {

    // tab组
    private RadioGroup tabBar;

    private RadioButton main_rb_message; //消息

    private RadioButton main_rb_add; //通讯录

    private RadioButton main_rb_activity; //易药

    private RadioButton main_rb_user; //我

    // 存放页面的栈
    private AnimationViewFlipper viewFlipper;

    private SparseArray<IPage> tabPages = new SparseArray();
    // 当前选中的tag
    private int currentTabCheckId = 0;
    // 当前页面
    private IPage currentPage;

    //设置全局共享变量
    private GlobalHandler commandHandler = new GlobalHandler();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        // tab组件
        tabBar = (RadioGroup) findViewById(R.id.main_rg_tab);
        tabBar.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                tabChangeView(checkedId, false);
            }
        });
        main_rb_message = (RadioButton) findViewById(R.id.main_rb_message); //消息

        main_rb_add = (RadioButton) findViewById(R.id.main_rb_add); //消息
        main_rb_activity = (RadioButton) findViewById(R.id.main_rb_activity); //crm
        main_rb_user = (RadioButton) findViewById(R.id.main_rb_user); //我

        viewFlipper = (AnimationViewFlipper) this.findViewById(R.id.main_viewflipper);
        // 添加监听器
        viewFlipper.setOnPopToRootListner(this);
        viewFlipper.setOnPushViewListner(this);

        //默认选择消息页面
        defaultPage();
    }

    /*
     * 默认选中页面
     */
    private void defaultPage() {

        tabBar.check(R.id.main_rb_message);
    }

    /**
     * 点击tab后切换相应的view
     * @param checkedId
     * @param resolutely 是否重新加载
     */
    private void tabChangeView(int checkedId, boolean resolutely) {
        currentTabCheckId = checkedId;
        currentPage = tabPages.get(checkedId);
        if (currentPage == null) {
            currentPage = IPageCreator.newInstance(checkedId, this, commandHandler);
            viewFlipper.addTab(checkedId, currentPage);
            tabPages.put(checkedId, currentPage);
        } else {

        }
        onPopToRoot();
        viewFlipper.changeTab(checkedId, resolutely);
    }

    /**
     * 返回按钮
     */
    @Override
    public void onBackPressed() {
        if (viewFlipper.getChildCount() > 1) {
            commandHandler.sendEmptyMessage(Config.MESSAGE_TRIGGER_BACK);
        } else {
            if ((System.currentTimeMillis() - mExitTime) > 2000) {
                Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
                mExitTime = System.currentTimeMillis();

            } else {
                // AppContext.getInstance().setIsUpdateToken(false);
                // AppContext.getInstance().setBackRun(true);
                finish();
            }
        }
    }

    /**
     * 监听返回到ROOT页面
     */
    @Override
    public void onPopToRoot() {
        tabBar.setVisibility(View.VISIBLE);
        if(AppContext.getInstance().getcurrentPage()!= null){
            AppContext.getInstance().getcurrentPage().hideBackBtn();
        }
    }

    @Override
    public void onPushView() {
        tabBar.setVisibility(View.GONE);
    }

    /**
     * 系统全局handler
     */
    public class GlobalHandler extends Handler {

        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (Config.IS_DEBUG) {
                Log.i("MainActivity", "{新地址：" + msg.obj + "  }");
                Log.i("MainActivity", "{新消息值：" + msg.what + "  }");
//                Log.i("MainActivity", "{原来地址：" + AppContext.getInstance().getcurrentPage().getUrl() + "}");
            }

            IPage iPage = null;
            Bundle bundle = msg.getData();

            switch (msg.what) {
                case Config.MESSAGE_OPEN_PAGE:
                    // 打开页面
                    final String url_src = (String) msg.obj;
                    final String url  = URLDecoder.decode(url_src);
                    if(Config.IS_DEBUG){
                        Log.i("MainActivity",url);
                    }
                    IPage page = IPageCreator.newInstance(url, MainActivity.this, commandHandler);
                    viewFlipper.pushView(viewFlipper.getCurrentTag(), page, true);
                    break;

                case Config.MESSAGE_TRIGGER_BACK:
                    // 返回页面
                    viewFlipper.popView(viewFlipper.getCurrentTag(), true);
                    break;

                case Config.MESSAGE_UPLOAD_IMAGES:
                    String url2 = (String) msg.obj;
                    Intent intentS = new Intent(MainActivity.this, SelectActivity.class);
                    intentS.putExtra("url",url2);
                    startActivityForResult(intentS, Config.TO_SELECT_PHOTO);
                    break;

                case Config.MESSAGE_GO_LOGIN:
                    // 去登录，清空已有页面，只留登录页面
//                    webPages.clear(); //清空
                    viewFlipper.removeAllViews(); //清空
                    AppContext.getInstance().clearCookie();
                    iPage = IPageCreator.newInstance((String)msg.obj,MainActivity.this,commandHandler);
                    iPage.hideBackBtn();
//                    AppContext.getInstance().logout(null);
                    viewFlipper.pushView(viewFlipper.getCurrentTag(), iPage, true);
                    break;

                case Config.MESSAGE_LOGIN_SUCCESS:
                    // 登录成功，进入默认页面
                    viewFlipper.removeAllViews(); //清空
                    viewFlipper.getControllerStack().clear();
                    tabPages.clear();
                    if((int)viewFlipper.getCurrentTag() == R.id.main_rb_message){
                        tabChangeView((int)viewFlipper.getCurrentTag(),true);
                    } else{
                        defaultPage();
                    }

                    // 登录环信
                    EmchatUtil.login();

                    break;

                case Config.MESSAGE_GO_LOGOUT:
                    // 退出登录
                    viewFlipper.removeAllViews(); //清空
                    viewFlipper.getControllerStack().clear();
                    tabPages.clear();
                    AppContext.getInstance().clearCookie();
                    tabChangeView((int)viewFlipper.getCurrentTag(),true);

                    // 退出环信
                    EmchatUtil.logout();

                    break;
                case Config.MESSAGE_UPDATE_FIlE:
                    WebBasePage basePage = (WebBasePage)(AppContext.getInstance().getcurrentPage());
                    WebUtil.loadJs(basePage.getWebView(),bundle.getString("cb")+"(\""+bundle.getString("image_name")+"\")");
                    break;
            }
        }
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        super.onActivityResult(requestCode, resultCode, data);

        if (resultCode == Activity.RESULT_OK && requestCode == Config.TO_SELECT_PHOTO) {

            String url = data.getStringExtra("url");

            String picPath = data.getStringExtra(SelectActivity.KEY_PHOTO_PATH);

            updatePhoto(url,picPath,AppContext.getInstance().getToken());
        }
    }

    private void updatePhoto(final String url ,String picPath,String token){

        final Map<String, String> data = WebUtil.url2map(url);

        AjaxParams params = new AjaxParams();
        try {
            params.put("file", new File(picPath)); // 上传文件
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        FinalHttp fh = new FinalHttp();
        try{
            fh.post(Config.getUrlHost()+data.get("url")+"?&fileName="+data.get("fileName"), params, new AjaxCallBack<String>() {
                @Override
                public void onLoading(long count, long current) {
                    super.onLoading(count, current);
                }

                @Override
                public void onSuccess(String o) {
                    super.onSuccess(o);
                    try{
                        JSONObject json = JSON.parseObject(String.valueOf(o));
                        String image_name = json.getJSONObject("data").getString("image_name");

                        Message msg = Message.obtain();
                        Bundle bundle = new Bundle();
                        bundle.putString("url",url);
                        bundle.putString("image_name",image_name);
                        bundle.putString("cb",data.get("cb"));
                        msg.setData(bundle);
                        msg.what = Config.MESSAGE_UPDATE_FIlE;
                        commandHandler.sendMessage(msg);

                    } catch(Exception ex){
                        TLog.e("上传文件异常："+ex.getMessage());
                        ex.printStackTrace();
                    }
                }
            });
        } catch(Exception ex){
            ex.printStackTrace();
        }
    }
}
