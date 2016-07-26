package demo.image.com.imageview;

import android.app.Activity;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.widget.ImageView;

/**
 * Created by hecj on 2016/3/8 0008.
 */
public class Main2Activity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        MyView view = new MyView(this,BitmapFactory.decodeResource(getResources(), R.drawable.item));
        view.setScaleType(ImageView.ScaleType.MATRIX);
        setContentView(view);
    }
}
