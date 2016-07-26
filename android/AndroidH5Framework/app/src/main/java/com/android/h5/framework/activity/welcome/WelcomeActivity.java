package com.android.h5.framework.activity.welcome;

import android.content.Intent;
import android.os.Bundle;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.widget.LinearLayout;
import com.android.h5.framework.R;
import com.android.h5.framework.activity.base.BaseActivity;
import com.android.h5.framework.activity.main.MainActivity;

/*＊
 * 开场欢迎动画
 */
public class WelcomeActivity extends BaseActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_strat);

        LinearLayout welcome_page = (LinearLayout)findViewById(R.id.welcome_page);
        // 渐变展示启动屏
        AlphaAnimation aa = new AlphaAnimation(0.3f, 1.0f);
        aa.setDuration(2500);
        welcome_page.startAnimation(aa);
        aa.setAnimationListener(new Animation.AnimationListener() {

            @Override
            public void onAnimationEnd(Animation arg0) {
                Intent intent = new Intent(WelcomeActivity.this, MainActivity.class);
                startActivity(intent);
                finish();
            }

            @Override
            public void onAnimationRepeat(Animation animation) {
            }

            @Override
            public void onAnimationStart(Animation animation) {
            }
        });
	}

    @Override
    protected void onStart() {
        super.onStart();
    }

}
