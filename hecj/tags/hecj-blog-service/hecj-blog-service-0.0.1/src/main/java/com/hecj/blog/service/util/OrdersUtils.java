package com.hecj.blog.service.util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import java.util.UUID;

/**
 * 订单号生成规则
 * @author hechaojie
 */
public class OrdersUtils {

	private static final SimpleDateFormat format=new SimpleDateFormat("yyyyMMddHHmmssSSS");
	
	/**
	 * 充值订单号生成规则
	 * user_id+时间戳+C+6位随机数
	 */
	public static String orderRecharge(Long user_id){
		String dateStr = format.format(new Date());
		String random = getRandom(5);
		return user_id+"C"+dateStr+random;
	}
	
	/**
	 * 随机生成几位数
	 */
	public static String getRandom(int n) {
		int baseNum = 1;
		for (int i = 0; i < n; i++) {
			baseNum *= 10;
		}
		Random rad = new Random();
		String orders = String.valueOf(rad.nextInt(baseNum));
		int len = orders.length();
		for (int i = 0; i < n - len; i++) {
			orders = "0"+orders;
		}
		return orders;
	}
	
	public static String getRandomPictureName(){
		String str = UUID.randomUUID().toString().substring(0, 18);
		String dateStr = format.format(new Date());
		return dateStr+"-"+str;
	}
	
}
