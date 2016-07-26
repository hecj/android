package com.hecj.common.utils;
import java.util.regex.Pattern;

/**
 * 数字类型的工具类 
 * @author he ChaoJie
 * @version 2013-7-12 上午10:47:41 he ChaoJie
 */
public class NumberUtil {
	
	
	public NumberUtil(){
		
	}
	
	/**
	 * 判断对象是否Integer类型<br>
	 * 22---->true<br>
	 * -22---->true<br>
	 * 22l--->false<br>
	 * 22.22-->false<br>
	 * null--->false<br>
	 * ""----->false<br>
	 * @param object
	 * @return
	 */
	public static boolean isInteger(Object obj){
		boolean b = false;
		try{
			if(obj == null){
				b = false;
			}else if(obj instanceof Integer){
				b = true;
			}else{
				Integer.parseInt(String.valueOf(obj));
				b = true;
			}
		}catch(Exception ex){
			b = false;
		}
		return b;
	}
	
	/**
	 * 判断对象是否Long类型<br>
	 * @param object
	 * @return
	 */
	public static boolean isLong(Object obj){
		
		boolean b = false;
		try{
			if(obj == null){
				b = false;
			}else if(obj instanceof Long){
				System.out.println(2d);
				b = true;
			}else if(Pattern.matches("[-]?(([0]?[1-9]+)|([0-7]+)|([0-3]+))(l|L)?", String.valueOf(obj))){
				b = true;
			}
		}catch(Exception ex){
			b = false;
		}
		return b;
	}
	
	/**
	 * to Long转换<br>
	 * @param obj
	 * @return
	 */
	public static Long objToLong(Object obj){
		
		String longStr = "";
		Long num = 0l;
		String objStr = String.valueOf(obj);
		try{
			int length = objStr.length();
			String endStr = "";
			if(length > 0){
				endStr=objStr.substring(length-1, length);
			}
			if(length>0&&(endStr.equals("l")||endStr.equals("L"))){
				longStr = objStr.substring(0, length-1);
				num= Long.parseLong(longStr);
			}
		} catch (NumberFormatException ex){
		}
		return num;
	}
	
	/**
	 * 判断是否是Double类型<br>
	 * @param obj
	 * @return
	 */
	public static boolean isDouble(Object obj){
		
		boolean b = false;
		try{
			if(obj == null){
				b = false;
			}else if(obj instanceof Double){
				b = true;
			}else if(Pattern.matches("[0-9]+[.]?[0-9]*[d|D]?",String.valueOf(obj))){
				b = true;
			}
		}catch(NumberFormatException ex){
			b = false ;
		}
		return b;
	}
	
	/**
	 * to Double转换<br>
	 * @param obj
	 * @return
	 */
	public static Double objToDouble(Object obj){
		
		Double num = 0d;
		String doubleStr = String.valueOf(obj);
		try{
			num = Double.parseDouble(doubleStr);
			
		} catch (NumberFormatException ex){
		}
		return num;
	}
	
	/**
	 * is FLoat
	 * @param obj
	 * @return
	 */
	public static boolean isFloat(Object obj){
		
		boolean b = false;
		try{
			if(obj == null){
				b = false;
			}else if(obj instanceof Double){
				b = true;
			}else if(Pattern.matches("[0-9]+[.]?[0-9]*[f|F]?",String.valueOf(obj))){
				b = true;
			}
		}catch(NumberFormatException ex){
			b = false ;
		}
		return b;
	}
	
	/**
	 * to Float转换<br>
	 * @param obj
	 * @return
	 */
	public static Float objToFloat(Object obj){
		
		Float num = 0f;
		String floatStr = String.valueOf(obj);
		try{
			num = Float.parseFloat(floatStr);
			
		} catch (NumberFormatException ex){
		}
		return num;
	}
	
}