package com.android.h5.framework.activity.upload;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.Toast;

import com.android.h5.framework.R;
import com.android.h5.framework.config.Config;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Calendar;

public class SelectActivity extends Activity implements View.OnClickListener {
    /**
     * 使用照相机拍照获取图片
     */
    public static final int SELECT_PIC_BY_TACK_PHOTO = 1;
    /**
     * 使用相册中的图片
     */
    public static final int SELECT_PIC_BY_PICK_PHOTO = 2;

    /**
     * 剪切图像命令
     */
    public static final int SELECT_PIC_BY_GET_PHOTO = 3;



    /**
     * 从Intent获取图片路径的KEY
     */
    public static final String KEY_PHOTO_PATH = "photo_path";

    private LinearLayout dialogLayout;

    private Button takePhotoBtn, pickPhotoBtn, cancelBtn;
    private File  tempFile;

    /* 头像名称 */
    private static final String IMAGE_FILE_NAME = "eyaoface.jpg";


//    private static final int RESULT_REQUEST_CODE = 1;

    /**
     * 获取到的图片路径
     */

    private Intent lastIntent;

    private Uri photoUri;

    private String url;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_select);
        getWindow().setLayout(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);//需要添加的语句
        Intent intent = getIntent();

        lastIntent = getIntent();
        lastIntent.putExtra("url", intent.getStringExtra("url"));
        initView();
    }

    /**
     * 初始化加载View
     */
    private void initView() {
        dialogLayout = (LinearLayout) findViewById(R.id.dialog_layout);
        dialogLayout.setOnClickListener(this);
        takePhotoBtn = (Button) findViewById(R.id.btn_take_photo);
        takePhotoBtn.setOnClickListener(this);
        pickPhotoBtn = (Button) findViewById(R.id.btn_pick_photo);
        pickPhotoBtn.setOnClickListener(this);
        cancelBtn = (Button) findViewById(R.id.btn_cancel);
        cancelBtn.setOnClickListener(this);

    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.dialog_layout:
                finish();
                break;
            case R.id.btn_take_photo:
                takePhoto();
                break;
            case R.id.btn_pick_photo:
                pickPhoto();
                break;
            default:
                finish();
                break;
        }
    }

    /**
     * 拍照获取图片
     */
    private void takePhoto() {
        //执行拍照前，应该先判断SD卡是否存在
        String SDState = Environment.getExternalStorageState();
        if (SDState.equals(Environment.MEDIA_MOUNTED)) {

            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);//"android.media.action.IMAGE_CAPTURE"
            /***
             * 需要说明一下，以下操作使用照相机拍照，拍照后的图片会存放在相册中的
             * 这里使用的这种方式有一个好处就是获取的图片是拍照后的原图
             * 如果不实用ContentValues存放照片路径的话，拍照后获取的图片为缩略图不清晰
             */
            ContentValues values = new ContentValues();
            photoUri = this.getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, photoUri);
            /**-----------------*/
            startActivityForResult(intent, SELECT_PIC_BY_TACK_PHOTO);
        } else {
            Toast.makeText(this, "内存卡不存在", Toast.LENGTH_LONG).show();
        }
    }

    /**
     * 从相册中取图片
     */
    private void pickPhoto() {
        Intent intent = new Intent();
        intent.setType("image/*");
        intent.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(intent, SELECT_PIC_BY_PICK_PHOTO);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        finish();
        return super.onTouchEvent(event);
    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        //结果码不等于取消时候
        if (resultCode != RESULT_CANCELED) {
            switch (requestCode) {
                case SELECT_PIC_BY_TACK_PHOTO:
                    startPhotoZoom(photoUri);
                    break;
                case SELECT_PIC_BY_PICK_PHOTO:
                    startPhotoZoom(data.getData());
                    break;
                case SELECT_PIC_BY_GET_PHOTO:
                    Bundle extras = data.getExtras();
                    if(extras != null ) {
                        Bitmap photo = extras.getParcelable("data");
                        try {
                            FileOutputStream outStreamz = new FileOutputStream(tempFile);
                            photo.compress(Bitmap.CompressFormat.PNG, 50, outStreamz);
                            outStreamz.close();
                            getImageToView();
                        } catch (FileNotFoundException e) {
                            e.printStackTrace();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }

                    break;
            }

        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    /**
     * 保存裁剪之后的图片数据
     *
     * @param
     */
    private void getImageToView() {

            if (tempFile != null) {
                lastIntent.putExtra(KEY_PHOTO_PATH, tempFile.getAbsolutePath());
                setResult(Activity.RESULT_OK, lastIntent);
                finish();
            }
            else {
                Toast.makeText(this, "选择图片文件不正确", Toast.LENGTH_LONG).show();
            }
    }


    /**
     * 裁剪图片方法实现
     *
     * @param uri
     */
    public void startPhotoZoom(Uri uri) {

        Intent intent = new Intent("com.android.camera.action.CROP");
        intent.setDataAndType(uri, "image/*");
        intent.setData( uri);
        // 设置裁剪
        intent.putExtra("crop", "true");
        // aspectX aspectY 是宽高的比例
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        // outputX outputY 是裁剪图片宽高
        intent.putExtra("outputX", 320);
        intent.putExtra("outputY", 320);
        String root =  Environment.getExternalStorageDirectory().getAbsolutePath() + Config.APP_DIR_NAME+"/head/";
        File temp = new File(root);
        if (!temp.exists()) {
            temp.mkdirs();
        }
        tempFile=new File(root,Calendar.getInstance().getTimeInMillis()+IMAGE_FILE_NAME);


        intent.putExtra(KEY_PHOTO_PATH, Uri.fromFile(tempFile));  // 专入目标文件
        intent.putExtra("outputFormat", "JPEG"); //输入文件格式
        intent.putExtra("return-data", true);
        startActivityForResult(intent, SELECT_PIC_BY_GET_PHOTO);

    }
}
