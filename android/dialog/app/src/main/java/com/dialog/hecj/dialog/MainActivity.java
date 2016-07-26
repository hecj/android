package com.dialog.hecj.dialog;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.SimpleAdapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        this.findViewById(R.id.btn).setOnClickListener(new View.OnClickListener(){

            @Override
            public void onClick(View v) {
                CustomDialog dialog = new CustomDialog(MainActivity.this,new String[]{"拜访列表","推广活动","哈哈"});
                dialog.setOnDialogItemClickListener(new CustomDialog.OnDialogItemClickListener() {
                    @Override
                    public void onItemClick(View view, int position, long id) {
                        Log.d("hecj","p"+position);
                    }
                });
                dialog.show();

            }
        });




    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}


/**
 * 自定义dialog
 */
class CustomDialog extends Dialog {

    private String[] nameList;
    private Activity context;

    private OnDialogItemClickListener onDialogItemClickListener;

    public CustomDialog(Activity context, String[] nameList) {
        super(context);
        this.context = context;
        this.nameList = nameList;
        initView();
    }

    public void initView(){

        // 设置无标题
        this.requestWindowFeature(Window.FEATURE_NO_TITLE);
        // 宽度全屏
        Window win = this.getWindow();
        win.getDecorView().setPadding(0, 0, 0, 0);
        WindowManager.LayoutParams lp = win.getAttributes();
        lp.width = WindowManager.LayoutParams.FILL_PARENT;
        lp.height = WindowManager.LayoutParams.WRAP_CONTENT;
        win.setAttributes(lp);
        // 底部显示
        win.setGravity(Gravity.BOTTOM);
        // 动画效果

        List<Map<String,String>> data = new ArrayList<Map<String,String>>();
        for(String name : nameList){
            Map<String,String> map = new HashMap<String,String>();
            map.put("name",name);
            data.add(map);
        }

        SimpleAdapter simpleAdapter = new SimpleAdapter(context,data,R.layout.layout_custom_dialog_item,
                new String[]{"name"},new int[]{R.id.layout_custom_dialog_item_name});

        View view = LayoutInflater.from(context).inflate(R.layout.layout_custom_dialog, null);
        setContentView(view);
        ListView listView = (ListView)view.findViewById(R.id.layout_custom_dialog_listview);
        listView.setAdapter(simpleAdapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                onDialogItemClickListener.onItemClick(view, position, id);
                dismiss();
            }
        });

        // exit
        view.findViewById(R.id.layout_custom_dialog_exit).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
    }

    /**
     * 设置监听器
     * @param onDialogItemClickListener
     */
    public void setOnDialogItemClickListener(OnDialogItemClickListener onDialogItemClickListener){
        this.onDialogItemClickListener = onDialogItemClickListener;
    }

    /**
     * 自定义监听器
     */
    interface OnDialogItemClickListener{
        public void onItemClick(View view, int position, long id);
    }

}
