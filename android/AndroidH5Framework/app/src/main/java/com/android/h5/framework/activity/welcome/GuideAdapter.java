package com.android.h5.framework.activity.welcome;

import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.View;

import java.util.List;

public class GuideAdapter extends PagerAdapter {
	private List<View>  views;
	public GuideAdapter(List<View> views){
		this.views = views;
	}
	//销毁position位置
	@Override
	public void destroyItem(View container, int position, Object object) {
		((ViewPager)container).removeView(views.get(position));
	}
	//初始化position位置的界面
	@Override
	public Object instantiateItem(View container, int position) {
		((ViewPager)container).addView(views.get(position), 0);
		return views.get(position);
	}
	//获取界面数
	@Override
	public int getCount() {
		if(views != null){
			return views.size();
		}
		return 0;
	}
	//判断是否由对象生成界面
	@Override
	public boolean isViewFromObject(View arg0, Object arg1) {
		// TODO Auto-generated method stub
		return (arg0 == arg1);
	}
	
}
