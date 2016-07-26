package com.android.h5.framework.activity.welcome;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.view.ViewPager;
import android.support.v4.view.ViewPager.OnPageChangeListener;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;

import com.android.h5.framework.R;
import com.android.h5.framework.activity.base.BaseActivity;

import java.util.ArrayList;
import java.util.List;

/**
 * 引导页
 */
public class PageGuideActivity extends BaseActivity implements OnPageChangeListener, OnClickListener {

    private ViewPager viewPager;
    private GuideAdapter adapter;
    private List<View> views;
    private int lastView = 2 ;
    private ImageButton button;
    //	Button btn ;
    public static final int[] pics = {R.drawable.whatsnew_00, R.drawable.whatsnew_01,
            R.drawable.whatsnew_02};
    //底部小点
    private ImageView[] dots;
    //记住当前位置
    private int current;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_guide);
        setStatusBgColor(R.color.white);

        views = new ArrayList<View>();

        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT);
//        params.setMargins(0, 200, 20, 20);
        for(int i = 0 ;i<pics.length;i++) {
            ImageView iv = new ImageView(this);
            //设置随机显示位置
            iv.setLayoutParams(params);
            iv.setImageResource(pics[i]);
            views.add(iv);
        }

        viewPager = (ViewPager) findViewById(R.id.view_pager);
        Log.i("life", ""+viewPager);
        adapter = new GuideAdapter(views);
        viewPager.setAdapter(adapter);
        //绑定回调
        viewPager.addOnPageChangeListener(this);
        init();
    }
    private void init(){
        button = (ImageButton) findViewById(R.id.button);
        button.setOnClickListener(new OnClickListener() {

            @Override
            public void onClick(View v) {
                Intent intent =new Intent(PageGuideActivity.this , WelcomeActivity.class);
                startActivity(intent);
                finish();
            }
        });
        LinearLayout ll = (LinearLayout) findViewById(R.id.ll);
        dots = new ImageView[pics.length];
        for(int i = 0 ;i<pics.length ; i++){
            dots[i] =(ImageView) ll.getChildAt(i);//索引
            dots[i].setEnabled(true);  //都设置灰色
            dots[i].setOnClickListener(this);
            dots[i].setTag(i); //设置标签
        }
        current = 0;
        dots[current].setEnabled(false);//设置白色，选中状态
        dots[current].setImageResource(R.drawable.iconfont_dian);
    }
    //设置当前的引导页
    private void setViews(int position){
        if(position < 0 || position >= pics.length){
            return;
        }
        viewPager.setCurrentItem(position);
    }
    //设置当前小点
    private void setDots(int position){
        if(position < 0 || position > pics.length-1 || current == position){
            return;
        }
        dots[position].setEnabled(false);
        dots[current].setEnabled(true);
        dots[current].setImageResource(R.drawable.iconfont_dian_nomal);
        current = position;

        dots[current].setImageResource(R.drawable.iconfont_dian);
    }
    //当页面滑动状态改变调用
    @Override
    public void onPageScrollStateChanged(int arg0) {


    }
    //当页面滑动的时候调用
    @Override
    public void onPageScrolled(int arg0, float arg1, int arg2) {
        if(arg0 == pics.length-1){
            button.setEnabled(true);
            button.setVisibility(View.VISIBLE);
        }
    }
    //当页面选中的时候调用
    @Override
    public void onPageSelected(int arg0) {
        setDots(arg0);

    }
    @Override
    public void onClick(View v) {
        int position = (Integer) v.getTag();
        setViews(position);
        setDots(position);
    }
}