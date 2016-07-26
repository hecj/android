package com.android.h5.framework.view;

import android.widget.ViewFlipper;

import com.android.h5.framework.page.IPage;

import java.util.List;

/**
 * Created by hecj on 16/5/2.
 */
public class TabPage {

    private Object tagId;

    private ViewFlipper viewFlipper;

    private List<IPage> controllerStack;

    public Object getTagId() {
        return tagId;
    }

    public ViewFlipper getViewFlipper() {
        return viewFlipper;
    }

    public void setViewFlipper(ViewFlipper viewFlipper) {
        this.viewFlipper = viewFlipper;
    }

    public void setTagId(Object tagId) {
        this.tagId = tagId;
    }

    public List<IPage> getControllerStack() {
        return controllerStack;
    }

    public void setControllerStack(List<IPage> controllerStack) {
        this.controllerStack = controllerStack;
    }
}
