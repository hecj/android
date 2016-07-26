package com.android.h5.framework.util;

import java.util.HashMap;
import java.util.Map;

public class EycsUtil {
    public static  Map<String,String> getEycsUrl(String url){
        Map<String,String> map = new HashMap<>();
        String temp = url.substring(url.indexOf("?") + 1, url.length());

        String[] values = temp.split("&");
        for (String value : values) {
            String[] kv = value.split("=");
            if (kv.length > 1) {
                map.put(kv[0], kv[1]);
            } else {
                map.put(kv[0], "");
            }

        }
        return map;

    }
}
