package org.somken.util;

import java.util.HashMap;
import java.util.Map;

public class ResultSupport implements Result {

    private static final long serialVersionUID = 3976733653567025460L;
    private boolean           success          = true;

    private Map               models           = new HashMap(4);
    private String            defaultModelKey;

    /**
     * 创建一个result。
     */
    public ResultSupport(){
    }

    /**
     * 创建一个result。
     * 
     * @param success 是否成功
     */
    public ResultSupport(boolean success){
        this.success = success;
    }

    /**
     * 请求是否成功。
     * 
     * @return 如果成功，则返回<code>true</code>
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * 设置请求成功标志。
     * 
     * @param success 成功标志
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }

    /**
     * 取得默认model对象的key。
     * 
     * @return 默认model对象的key
     */
    /*public String getDefaultModelKey() {
        return StringUtil.defaultIfEmpty(defaultModelKey, DEFAULT_MODEL_KEY);
    }*/

    /**
     * 取得model对象。
     * <p>
     * 此调用相当于<code>getModels().get(DEFAULT_MODEL_KEY)</code>。
     * </p>
     * 
     * @return model对象
     */
    /*public Object getDefaultModel() {
        return models.get(getDefaultModelKey());
    }*/

    /**
     * 设置model对象。
     * <p>
     * 此调用相当于<code>getModels().put(DEFAULT_MODEL_KEY, model)</code>。
     * </p>
     * 
     * @param model model对象
     */
    public void setDefaultModel(Object model) {
        setDefaultModel(DEFAULT_MODEL_KEY, model);
    }

    /**
     * 设置model对象。
     * <p>
     * 此调用相当于<code>getModels().put(key, model)</code>。
     * </p>
     * 
     * @param key 字符串key
     * @param model model对象
     */
    public void setDefaultModel(String key, Object model) {
        //defaultModelKey = StringUtil.defaultIfEmpty(key, DEFAULT_MODEL_KEY);
        models.put(key, model);
    }

    /**
     * 取得所有model对象。
     * 
     * @return model对象表
     */
    public Map getModels() {
        return models;
    }

}
