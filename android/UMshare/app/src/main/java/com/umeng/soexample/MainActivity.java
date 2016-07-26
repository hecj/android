package com.umeng.soexample;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;

import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.umeng.socialize.Config;
import com.umeng.socialize.utils.Log;
import com.umeng.soexample.share_auth.ShareandAuthActivity;


import static com.umeng.soexample.R.*;

/**
 * Created by umeng on 15/9/14.
 */
public class MainActivity extends Activity{
    private Button shareButton,shakebutton,commentButton;
    private String [] mPermissionList = new String[]{"android.permission.READ_PHONE_STATE","android.permission.ACCESS_WIFI_STATE"};
    private static final int REQUEST_PERM = 150;

    private View.OnClickListener clickListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            if (view.getId() == R.id.umeng_share){
                Intent intent = new Intent(MainActivity.this, ShareandAuthActivity.class);
                startActivity(intent);
            }else if (view.getId() ==  R.id.umeng_shake){
                Toast.makeText(MainActivity.this,"this function will come soon",Toast.LENGTH_LONG).show();
//                Intent intent = new Intent(MainActivity.this, ShakeActivity.class);
//                startActivity(intent);
            }else if (view.getId() ==  R.id.umeng_comment){
                Toast.makeText(MainActivity.this,"this function will come soon",Toast.LENGTH_LONG).show();
//                Intent intent = new Intent(MainActivity.this, NetCenterActivity.class);
//                startActivity(intent);
            }
        }
    };

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView( R.layout.app_main);

        shakebutton = (Button)findViewById( R.id.umeng_shake);
        shareButton = (Button)findViewById( R.id.umeng_share);
        commentButton = (Button)findViewById( R.id.umeng_comment);
        shakebutton.setOnClickListener(clickListener);
        shareButton.setOnClickListener(clickListener);
        commentButton.setOnClickListener(clickListener);

    }


}
