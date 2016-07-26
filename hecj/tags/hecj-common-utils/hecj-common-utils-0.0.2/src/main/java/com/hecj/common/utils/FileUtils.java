package com.hecj.common.utils;

import java.io.File;

public class FileUtils {

	public static boolean mkdirs(File file) {
		if (!file.exists()) {
			return file.mkdirs();
		} 
		return false;
	}
}
