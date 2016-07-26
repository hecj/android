package com.android.h5.framework.activity.main;

import android.app.Activity;
import android.widget.Toast;

import com.android.h5.framework.activity.base.BaseActivity;
import com.android.h5.framework.app.AppContext;

/**
 * 退出应用
 */
public class RootActivity extends BaseActivity {

    protected long mExitTime = 0l;

    @Override
    public void onBackPressed() {

        if ((System.currentTimeMillis() - mExitTime) > 2000) {
            Toast.makeText(this, "再按一次退出程序", Toast.LENGTH_SHORT).show();
            mExitTime = System.currentTimeMillis();
        } else {
            // 清除账户信息
            finish();
        }
    }

}
