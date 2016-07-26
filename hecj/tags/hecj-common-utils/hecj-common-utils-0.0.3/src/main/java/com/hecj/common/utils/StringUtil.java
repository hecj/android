package com.hecj.common.utils;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
/**
 * @类功能说明：字符串处理工具类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2014-12-8 下午04:20:49
 * @版本：V1.0
 */
public class StringUtil {
	/**
	 * 英文编码
	 */
	public final static String ENG_CODE = "ISO8859-1";
	/**
	 * 中文GBK编码
	 */
	public final static String CN_GBK_CODE = "GBK";
	/**
	 * 中文UTF-8编码
	 */
	public final static String CN_UTF_CODE = "UTF-8";
	
	/**
	 * @description: 判断字符串是否为空
	 * @param str字符串
	 * @return boolean true:空 false: 非空
	 */
	public static boolean isStrEmpty(String str){
		return (str == null || str.trim().equals("") || "null".equals(str));
	}
	
	/**
	 * @description: 用分隔符把字符分割转换成字符串数组
	 * @param str
	 * @param delim
	 * @return String[]
	 */
	public static String[] stringToStringArray(String str, String delim){
		if(!isStrEmpty(str) && delim != null){
			return str.split(delim);
		}
		return new String[]{str};
	}
	
	/**
	 * @description: 用分隔符把字符分割转换成字符串ArrayList
	 * @param str
	 * @param delim
	 * @return List<String>
	 */
	public static List<String> stringToArrayList(String str, String delim){
		List<String> list = new ArrayList<String>();
		if(!isStrEmpty(str) && delim != null){
			String[] strs = str.split(delim);
			for(String s : strs){
				list.add(s);
			}
		}
		return list;
	}
	
	/**
	 * @description: 按照格式字符串输出数字字符串
	 * @param des  数字对象,必须为Integer,Long,Double,String的对象
	 * @param parseStyle  要格式化成的样式 样式例子：	"##,###,###" : 23456743---> 23,456,743
	 *            									"##,###,##0.00" 9999.877---> 9,999.98
	 * @return 返回格式化后的字符串
	 */
	public static String parseDec(Object dec, String parseStyle) throws IllegalArgumentException {
		String str = "";
		if(dec == null) {
			return "";
		}
		if(isStrEmpty(parseStyle)) {
			return dec.toString();
		}
		DecimalFormat df = new DecimalFormat(parseStyle);
		str = df.format(dec);
		return str;
	}

	/**
	 * @description: 按照格式字符串输出数字字符串
	 * @param des
	 * @param parseStyle  要格式化成的样式 样式例子：	"##,###,###" : 23456743---> 23,456,743
	 * @return 返回格式化后的字符串
	 */
	public static String parseDec(Integer dec, String parseStyle) throws IllegalArgumentException {
		String str = "";
		if(dec == null) {
			return "";
		}
		if(isStrEmpty(parseStyle)) {
			return dec.toString();
		}
		DecimalFormat df = new DecimalFormat(parseStyle);
		str = df.format(dec);
		return str;
	}

	/**
	 * @description: 按照格式字符串输出数字字符串
	 * @param des
	 * @param parseStyle  要格式化成的样式 样式例子：	"##,###,###" : 23456743---> 23,456,743
	 * @return 返回格式化后的字符串
	 */
	public static String parseDec(Long dec, String parseStyle) throws IllegalArgumentException {
		String str = "";
		if(dec == null) {
			return "";
		}
		if(isStrEmpty(parseStyle)) {
			return dec.toString();
		}
		DecimalFormat df = new DecimalFormat(parseStyle);
		str = df.format(dec);
		return str;
	}

	/**
	 * @description: 按照格式字符串输出数字字符串
	 * @param des
	 * @param parseStyle  要格式化成的样式 样式例子：	"##,###,###" : 23456743---> 23,456,743
	 *            									"##,###,###.00" 9999.873--—> 9,999.87
	 *            									"##,###,##0.00" 9999.877---> 9,999.98
	 * @return 返回格式化后的字符串
	 */
	public static String parseDec(Double dec, String parseStyle) throws IllegalArgumentException {
		String str = "";
		if(dec == null) {
			return "";
		}
		if(isStrEmpty(parseStyle)) {
			return dec.toString();
		}
		DecimalFormat df = new DecimalFormat(parseStyle);
		str = df.format(dec);
		return str;
	}

	/**
	 * @description: 按照格式字符串输出数字字符串
	 * @param des  必须为数字字符串的对象
	 * @param parseStyle  要格式化成的样式 样式例子：	"##,###,###" : 23456743---> 23,456,743
	 *            									"##,###,###.00" 9999.873--—> 9,999.87
	 *            									"##,###,##0.00" 9999.877---> 9,999.98
	 * @return 	返回格式化后的字符串
	 */
	public static String parseDec(String dec, String parseStyle) throws IllegalArgumentException {
		String str = "";
		if(isStrEmpty(dec)) {
			return "";
		}
		if(isStrEmpty(parseStyle)) {
			return dec;
		}
		if(!isNumber(dec)) {
			return dec;
		}
		DecimalFormat df = new DecimalFormat(parseStyle);
		str = df.format(new Double(dec));
		return str;
	}
	
	/**
	 * description: 判断字符串是否为一个数字十进制数
	 * @param dec
	 * @return  true 是一个数字  false 不是一个数字
	 */
	public static boolean isNumber(String dec) {
		String regex = "^(\\d*)(\\.\\d*)?";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(dec);
		return matcher.matches();
	}
	
	/**
	 * description: 判断字符串是否为一个数字组成的字符串，可以有一个小数点切
	 * @param num
	 * @return  true 是一个数字  false 不是一个数字
	 */
	public static boolean isDecimal(String num) {
		String regex = "^(([1-9]\\d*)|([0]))(\\.\\d*)?";
		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(num);
		return matcher.matches();
	}
	/** 
	 *@description: 按照格式化Money为"##0.00" 空为"0.00"
	 * @return 	返回格式化后的字符串
	 */
	public static String parseMoney(String obj){
		String result="0.00";
		if(obj!=null){
			result = StringUtil.parseDec(obj,"##,###,##0.00");
			return result;
		}else{
			return "0.00";
		}
	}
	/**
	 * 数组是否包含改元素
	 * @return boolean
	 */
	public static boolean hasElement(int[] arr,int n){
		for (int i = 0; i < arr.length; i++) {
			if(n==arr[i]){
				return true;
			}
		}
		return false;
	}
	
	/**
	 * @函数功能说明 按字节获取字符串长度 eg: 长度123->7
	 * @修改作者名字 HECJ  
	 * @修改时间 2014-11-26
	 * @修改内容
	 * @参数： @param s
	 * @参数： @return    
	 * @return int   
	 * @throws
	 */
	public static int getByteLength(String s){  
        int length = 0;  
        for(int i = 0; i < s.length(); i++){  
            int ascii = Character.codePointAt(s, i);  
            if(ascii >= 0 && ascii <=255)  
                length++;  
            else  
                length += 2;  
        }  
        return length;  
    }
	
	/**
     * @函数功能说明 按字节截取 支持截取后不乱码
     * @修改作者名字 HECJ  
     * @修改时间 2014-11-26
     * @修改内容
     * @参数： @param str 原字符串
     * @参数： @param len 截取长度
     * @参数： @return    
     * @return String   
     * @throws
     */
	public static String subStringByByte(String str, int len) {
		String result = null;
		try {
			if (str != null) {
				byte[] bytes = str.getBytes(CN_GBK_CODE);
				if (bytes.length <= len) {
					result = str;
				} else if (len > 0) {
					int count = 0;
					for(int i=0;i<len;i++){
						int endByte = Character.codePointAt(new String(bytes,i,1,CN_GBK_CODE), 0); 
						if(!(endByte >=0 && endByte <= 255))
							count++;
					}
					if(count%2==0){
						result = new String(bytes, 0, len, CN_GBK_CODE);
					}else{
						result = new String(bytes, 0, len-1, CN_GBK_CODE);
					}
				}
			}
		} catch (Exception e) {
			result = str;
			e.printStackTrace();
		}
		return result;
	}
	
	public static boolean isObjectEmpty(Object obj){
		if(obj == null || obj.equals("") || String.valueOf(obj).length() == 0){
			return true;
		}else{
			return false;
		}
	}
	
	public static boolean isObjectNull(Object obj){
		if(obj == null ){
			return true;
		}else{
			return false;
		}
	}
}