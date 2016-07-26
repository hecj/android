package com.hecj.common.utils;

import java.io.File;

/**
 * 文件工具类类
 */
public class FileUtils {

	/**
	 * 创建文件夹
	 */
	public static boolean mkdirs(File file) {
		if (!file.exists()) {
			return file.mkdirs();
		} 
		return false;
	}
	
	/**
	 * 获取文件名后缀
	 */
	public static String getExt(String filename) {
		String[] s = filename.split("\\.");
		String ext = "";
		if (s.length > 1) {
			ext = s[s.length - 1];
		}
		return ext;
	}
}
