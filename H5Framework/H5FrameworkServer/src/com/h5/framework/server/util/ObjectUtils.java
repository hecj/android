package com.h5.framework.server.util;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;
/**
 * 对象工具类
 * @author mqin
 *
 */
public class ObjectUtils {

	public static boolean isNullOrEmptyString(Object o) {
		if(o == null)
			return true;
		if(o instanceof String) {
			String str = (String)o;
			if(str.length() == 0)
				return true;
		}
		return false;
	}
	
	/**
	 * 可以用于判断 Map,Collection,String,Array是否为空
	 * @param o
	 * @return
	 */
	@SuppressWarnings("all")
    public static boolean isEmpty(Object o)  {
        if(o == null) return true;

        if(o instanceof String) {
            if(((String)o).length() == 0){
                return true;
            }
        } else if(o instanceof Collection) {
            if(((Collection)o).isEmpty()){
                return true;
            }
        } else if(o.getClass().isArray()) {
            if(Array.getLength(o) == 0){
                return true;
            }
        } else if(o instanceof Map) {
            if(((Map)o).isEmpty()){
                return true;
            }
        }else {
            return false;
        }

        return false;
    }

	/**
	 * 可以用于判断 Map,Collection,String,Array是否不为空
	 * @param c
	 * @return
	 */
	public static boolean isNotEmpty(Object c) throws IllegalArgumentException{
		return !isEmpty(c);
	}
	
	public static String filterString(String str){
		String result = "";
	    if (str != null){
	    	result = str.trim();
	    }
	    return result;
	}
	
	public static String toString(Object obj){
		String result = null;
	    if (obj != null){
	    	result = obj.toString();
	    }
	    return result;
	}
	
	public static String getUUID() {
		return UUID.randomUUID().toString().replace("-", "");
	}
}