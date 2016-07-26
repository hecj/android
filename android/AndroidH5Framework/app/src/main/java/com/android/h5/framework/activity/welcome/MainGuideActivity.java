package com.android.h5.framework.activity.welcome;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import com.android.h5.framework.R;
import com.android.h5.framework.activity.base.BaseActivity;
import com.android.h5.framework.config.Config;

/**
 * 程序从这里启动
 */
public class MainGuideActivity extends BaseActivity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		firstStart();
	}

	/*
	 * 判断程序是不是第一次启动
	 */
	private void firstStart(){

		Intent intent = new Intent();
		SharedPreferences spn = getSharedPreferences(Config.PREFS_NAME, 0);
    	boolean first = spn.getBoolean(Config.PREFS_FIRST_START, true);
    	SharedPreferences.Editor editor = spn.edit();
    	if(first){
			// 第一次启动进入引导页
    		intent.setClass(MainGuideActivity.this, PageGuideActivity.class);
    		startActivity(intent);
    		editor.putBoolean(Config.PREFS_FIRST_START, false);
    		editor.commit();
    		finish();
    	}else{
			// 之后进入欢迎页
    		intent.setClass(MainGuideActivity.this, WelcomeActivity.class);
    		startActivity(intent);
    		finish();
    	}
    }
}
