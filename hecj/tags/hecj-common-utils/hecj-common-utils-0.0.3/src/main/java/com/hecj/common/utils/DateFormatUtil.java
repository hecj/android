package com.hecj.common.utils;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @类功能说明：格式化工具类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2014-12-4 下午02:59:54
 * @版本：V1.0
 */
public final class DateFormatUtil {
	
	private static final SimpleDateFormat format=new SimpleDateFormat("yyyyMMddHHmmssSS");

	/**
	 * @函数功能说明 当前系统时间
	 * @修改作者名字 HECJ  
	 * @修改时间 2014-12-4
	 * @修改内容
	 * @参数： @return    
	 * @return Date   
	 * @throws
	 */
	public static Date getCurrDate(){
		return new Date();
	}
	
	/**
	 * @格式化时间
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static String format(Date date, String pattern){
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		try {
			return format.format(date);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return "";
	}
	
	/**
	 * @格式化转换
	 * @param date
	 * @param pattern
	 * @return
	 */
	public static Date parse(String dateStr, String pattern){
		SimpleDateFormat format = new SimpleDateFormat(pattern);
		try {
			return format.parse(dateStr);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 当前时间字符串
	 */
	public static String getCurrTimeStr(){
		return format.format(new Date());
	}
}