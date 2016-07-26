package com.android.h5.framework.view;

import android.content.Context;
import android.os.Message;
import android.util.AttributeSet;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ViewFlipper;

import com.android.h5.framework.page.IPage;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 支持多个AnimationViewFlipper切换
 */
public class GroupAnimationViewFlipper extends LinearLayout {

    // 存放tab组
    private HashMap<Object,TabPage> tabPages = new HashMap<>();

    Context context;
    /**
     * 页面队列集合
     */
    private Hashtable<Object, List<IPage>> controllerStack = new Hashtable<Object, List<IPage>>();
    /**
     * 当前选中的tab
     */
    private Object currentTag;
    /**
     * 返回到一级页面监听器
     */
    private OnPopToRootListner onPopToRootListner;
    /**
     * 打开新页面监听器
     */
    private OnPushViewListner onPushViewListner;

    public Hashtable<Object, List<IPage>> getControllerStack() {
        return controllerStack;
    }

    public OnPushViewListner getOnPushViewListner() {
        return onPushViewListner;
    }

    public void setOnPushViewListner(OnPushViewListner onPushViewListner) {
        this.onPushViewListner = onPushViewListner;
    }

    public OnPopToRootListner getOnPopToRootListner() {
        return onPopToRootListner;
    }

    public void setOnPopToRootListner(OnPopToRootListner onPopToRootListner) {
        this.onPopToRootListner = onPopToRootListner;
    }

    public Object getCurrentTag() {
        return currentTag;
    }

    public void setCurrentTag(Object currentTag) {
        this.currentTag = currentTag;
    }


    public GroupAnimationViewFlipper(Context context) {
        super(context);
        this.context = context;
    }

    public GroupAnimationViewFlipper(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.context = context;
    }

    /**
     * add 一级页面
     * @param tag
     * @param page
     */
    public void addTab(Object tag, IPage page) {
//        controllerStack.remove(tag);
//        List<IPage> controllers = new LinkedList<IPage>();
//        controllers.add(page);
//        controllerStack.put(tag, controllers);
        TabPage tabPage;
        if(tabPages.containsKey(tag)){
            tabPage = tabPages.get(tag);
            tabPage.getControllerStack().clear();
            tabPage.getControllerStack().add(page);
            tabPage.getViewFlipper().removeAllViews();
            tabPage.getViewFlipper().addView(page.getView());
        } else {
            // new tab
            tabPage = new TabPage();
            tabPage.setTagId(tag);
            List<IPage> controllerStack = new ArrayList<IPage>();
            controllerStack.add(page);
            page.viewDidLoad();
            tabPage.setControllerStack(controllerStack);
            ViewFlipper viewFlipper = new ViewFlipper(context);
            viewFlipper.addView(page.getView());
            tabPage.setViewFlipper(viewFlipper);
            tabPages.put(tag,tabPage);
        }
    }

    /**
     * remove 一级页面
     * @param tag
     */
    public void removeTab(Object tag) {
        controllerStack.remove(tag);
    }

    public IPage getCurrentWebPage(Object tag){
        if (controllerStack.containsKey(tag)) {
            List<IPage> controllers = controllerStack.get(tag);
            return  controllers.get(controllers.size()-1);
        }
        return null;
    }

    public void pushView(Object tag, IPage webPage, boolean needAnimation) {
//        if (controllerStack.containsKey(tag)) {
//            PORTRAIT();
//
//            webPage.viewDidLoad();
//            if (needAnimation) {
//                this.setAnimateFirstView(true);
//               //this.setInAnimation(context, R.anim.push_left_in);
//               // this.setOutAnimation(context, R.anim.push_left_out);
//            } else {
//                this.setAnimateFirstView(true);
//                this.setInAnimation(null);
//                this.setOutAnimation(null);
//            }
//
//            onPushViewListner.onPushView();
//            webPage.showCloseBtn();
//            this.addView(webPage.getView());
//            this.showNext();
//            List<IPage> controllers = controllerStack.get(tag);
//            controllers.add(webPage);
//        }
    }

    public void popView(Object tag, boolean needAnimation) {

//        if (controllerStack.containsKey(tag)) {
//            PORTRAIT();
//
//            List<IPage> checkControllerObject = controllerStack.get(tag);
//            if (checkControllerObject.size() > 1) {
//
//                List<IPage> controllers = controllerStack.get(tag);
//                IPage page = controllers.get(controllers.size()-1);
//                page.onDestroy();
//                controllers.remove(controllers.size() - 1);
//
//                if (needAnimation) {
//                    this.setAnimateFirstView(true);
//                    this.setInAnimation(context, android.R.anim.slide_in_left);
//                    this.setOutAnimation(context,
//                            android.R.anim.slide_out_right);
//                } else {
//                    this.setAnimateFirstView(true);
//                    this.setInAnimation(null);
//                    this.setOutAnimation(null);
//                }
//
//                IPage prev = controllers.get(controllers.size() - 1);
//               // AppContext.getInstance().setcurrentWebPage(prev);
//                if (checkControllerObject.size() == 1) {
//                    onPopToRootListner.onPopToRoot();
//                    prev.hideCloseBtn();
//                }
//                else
//                {
//                    prev.showCloseBtn();
//                }
//                prev.viewDidLoad();
//                this.showPrevious();
//                this.removeViewAt(this.getChildCount() - 1);
//            }
//        }
    }


    public void popView(Object tag, boolean needAnimation,boolean isrload) {
//        if (controllerStack.containsKey(tag)) {
//            PORTRAIT();
//
//            List<IPage> checkControllerObject = controllerStack.get(tag);
//            if (checkControllerObject.size() > 1) {
//
//                List<IPage> controllers = controllerStack.get(tag);
//                IPage page = controllers.get(controllers.size()-1);
//                page.onDestroy();
//                controllers.remove(controllers.size() - 1);
//
//                if (needAnimation) {
//                    this.setAnimateFirstView(true);
////                    this.setInAnimation(context, android.R.anim.slide_in_left);
////                    this.setOutAnimation(context,
////                            android.R.anim.slide_out_right);
//                } else {
//                    this.setAnimateFirstView(true);
//                    this.setInAnimation(null);
//                    this.setOutAnimation(null);
//                }
//
//                IPage prev = controllers.get(controllers.size() - 1);
//               // AppContext.getInstance().setcurrentWebPage(prev);
//                if (checkControllerObject.size() == 1) {
//                    onPopToRootListner.onPopToRoot();
//                    prev.hideCloseBtn();
//                }
//                else
//                {
//                    prev.showCloseBtn();
//                }
//                prev.setNeedReload(isrload);
//                prev.viewDidLoad();
//                this.showPrevious();
//                this.removeViewAt(this.getChildCount() - 1);
//            }
//
//
//
//        }
    }

    public void popToRootView(Object tag, boolean needAnimation) {
//        if (controllerStack.containsKey(tag)) {
//            PORTRAIT();
//
//            List<IPage> controllers = controllerStack.get(tag);
//            if (controllers.size() > 1) {
//                for (int i = controllers.size() - 1; i > 0; i--) {
//                    controllers.remove(i);
//                }
//            }
//            IPage root = controllers.get(0);
//            root.viewDidLoad();
//            if (needAnimation) {
//                this.setAnimateFirstView(true);
//                this.setInAnimation(context, android.R.anim.slide_in_left);
//                this.setOutAnimation(context, android.R.anim.slide_out_right);
//            } else {
//                this.setAnimateFirstView(true);
//                this.setInAnimation(null);
//                this.setOutAnimation(null);
//            }
//            onPopToRootListner.onPopToRoot();
//            this.removeAllViews();
//            this.addView(root.getView());
//            this.showNext();
//
//
//
//        }
    }

    /**
     * tab切换
     * @param tag 一级标签名
     * @param resolutely 是否重新加载
     */
    public void changeTab(Object tag, boolean resolutely) {

        if ((tabPages.containsKey(tag) && !tag.equals(currentTag)) || resolutely) {
            PORTRAIT();

            ViewFlipper viewFlipper = tabPages.get(tag).getViewFlipper();
//            viewFlipper.setAnimateFirstView(true);
//            viewFlipper.setInAnimation(null);
//            viewFlipper.setOutAnimation(null);
            viewFlipper.setDisplayedChild(1);
            currentTag = tag;
//            onPopToRootListner.onPopToRoot();

            this.removeAllViews();
            this.addView(viewFlipper);
        }


//        if ((controllerStack.containsKey(tag) && !tag.equals(currentTag)) || resolutely) {
//            PORTRAIT();
//
//            this.removeAllViews();
//            List<IPage> pageList = controllerStack.get(tag);
//            for (int a = 0; a < pageList.size(); a++) {
//                IPage iPage = pageList.get(a);
//                this.addView(iPage.getView());
//                if (a == pageList.size() - 1) {
//                    iPage.viewDidLoad();
//                }
//            }
//
//            this.setAnimateFirstView(true);
//            this.setInAnimation(null);
//            this.setOutAnimation(null);
//            this.setDisplayedChild(1);
//            currentTag = tag;
//
//            onPopToRootListner.onPopToRoot();
//        }
    }


    //横屏
    private void PORTRAIT() {
        Map<String, String> tm = new HashMap<>();

        Message msg = Message.obtain();
 /*       msg.obj = tm;
        msg.what = Config.PORTRAIT;
        if(MainActivity.commandHandler!=null){
            MainActivity.commandHandler.sendMessage(msg);
        }*/
    }

    /**
     * 清除WebPage
     *
     * @param depth 深度
     * @param isall 是否全部清除
     */
    public void viewDidUnload(Integer depth, boolean isall) {
        List<IPage> pageList = this.getControllerStack().get(Integer.parseInt(String.valueOf(currentTag)));

        if (pageList.size() > 1) {
            Integer size = depth;
            if (isall) {
                size = pageList.size();
            }

            for (int a = 0; a < size; a++) {
                IPage iPage = pageList.get(a);
                iPage.viewDidUnload();

//                 TLog.i(iPage.getUrl());

            }
            pageList.clear();   //可能有bug要仔细测试！！！！！！！！！！！！！！！！1
        }
    }

    public interface OnPopToRootListner {
        void onPopToRoot();
    }

    public interface OnPushViewListner {
        void onPushView();
    }
}
