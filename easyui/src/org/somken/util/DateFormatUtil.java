package org.somken.util;
/**
 * 日期类型的工具类 
 * @author he ChaoJie
 * @version 2013-7-12 上午10:47:41 he ChaoJie
 */
public class DateFormatUtil {

	private static java.text.SimpleDateFormat format = new java.text.SimpleDateFormat();
	private static String DEFAULT_PATTERN	= "yyyy-MM-dd HH:mm:ss";
	private static String CURR_TIME = "yyyyMMddHHmmssSS";
	private static final org.apache.commons.logging.Log logger = org.apache.commons.logging.LogFactory.getLog(DateFormatUtil.class);
	
	public DateFormatUtil (){
		
	}
	
	/**
	 * Date转换成String类型 	<br/>
	 * yyyy-MM-dd HH:mm:ss  ----->  2013-07-12 09:03:28	默认格式(异常时)	<br/> 
	 * yyyyMMddHHmmss       ----->  20130712090646	<br/>
	 * yyyyMMddHHmmssSS		----->	20130712092209783 年-月-日-小时-分-钟-秒-毫秒<br/>
	 * yyyy-MM-dd		    ----->  2013-07-12	<br/>
	 * yyyyMMdd			    ----->  20130712	<br/>
	 * HH:mm:ss				----->  09:14:47 <br/>
	 * HHmmss				----->  091542	<br/>
	 * D					----->	193		年中的天数<br/> 
	 * w					-----> 	28	年中的周数<br/>
	 * S					----->	925 毫秒数<br/>
	 * @param date
	 * @param format
	 * @return
	 */
	public static String dateToString(java.util.Date date,String pattern){
		
		String str = "";
		try{
			format.applyPattern(pattern);

		}catch(IllegalArgumentException e){
			format.applyPattern(DEFAULT_PATTERN);
			logger.error("----->日期转换字符串异常,已使用默认格式(yyyy-MM-dd HH:mm:ss)<-----");
		}finally{
			str=format.format(date);
		}
		return str;
	}
	
	/**
	 * String转换成Date类型<br/>
	 * @param pattern
	 * @param date
	 * @return
	 */
	public static java.util.Date stringToDate(String str,String pattern){
		
		java.util.Date toDate = null ;
		try {
			format.applyPattern(pattern);
		} catch (Exception e) {
			toDate = new java.util.Date();
			logger.error("---error-->日期格式匹配错误,已使用系统当前时间<--# "+pattern+" #---");
		}finally{
			try {
				toDate = format.parse(str);
			} catch (java.text.ParseException e) {
				toDate = new java.util.Date();
				logger.error("---error-->日期格式转换错误,已使用系统当前时间<--# "+str+" #---");
			}
		}
		return toDate;
	}
	
	/**
	 * 得到当前的时间戳(Long类型)<br/>
	 * count表示：在时间戳后加几位随机数字<br/>
	 * @param count
	 * @return
	 */
	public static String getCurrDateLong(int count){

		int number=1;
		//得到最大数值
		for(int i=0;i<count;i++){
			number*=10;
		}
		//得到最大数值以内的随机数
		java.util.Random random = new java.util.Random();
		Integer randomNum=random.nextInt(number);
		
		//判断在随机数前需要补多少个0
		String count0="";
		for(int i=0;i<count-String.valueOf(randomNum).length();i++){
			count0+="0";
		}
		Long time = new java.util.Date().getTime();
		return time+count0+randomNum;
	}
	
	/**
	 * 得到当前的时间戳(时间类型)<br/>
	 * count表示：在时间戳后加几位随机数字<br/>
	 * @param count
	 * @return
	 */
	public static String getCurrDateTime(int count){

		int number=1;
		//得到最大数值
		for(int i=0;i<count;i++){
			number*=10;
		}
		//得到最大数值以内的随机数
		java.util.Random random = new java.util.Random();
		Integer randomNum=random.nextInt(number);
		//判断在随机数前需要补多少个0
		String count0="";
		for(int i=0;i<count-String.valueOf(randomNum).length();i++){
			count0+="0";
		}
		format.applyPattern(CURR_TIME);
		String timeStr=format.format(new java.util.Date());
		return timeStr+count0+randomNum;
	} 
	
	/**
	 * 得到昨天的当前时间<br/>
	 * eg : 2013-07-12 11:54:05 ----> 2013-07-11 11:54:05<br/>
	 * @param date
	 * @return
	 */
	public static java.util.Date getYesterdayTime(java.util.Date date){
		
		/* 两种实现方式
		 *java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.setTime(date);
        cal.set(java.util.Calendar.HOUR_OF_DAY, java.util.Calendar.HOUR_OF_DAY-24);
		return cal.getTime(); 
		*/
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setTime(date);
		cal.add(java.util.Calendar.DATE, -1);
		return cal.getTime();
	}
	
	/**
	 * 得到上周的当前时间<br/>
	 * eg : 2013-07-12 11:36:06 ----> 2013-07-05 11:36:06<br/>
	 * @param date
	 * @return
	 */
	public static java.util.Date getYesWeekTime(java.util.Date date){
		
        /*
         * 两中实现方式
        Long time = date.getTime();
		time = time-7*24*60*60*1000;
		return new java.util.Date(time); 
		*/
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setTime(date);
		cal.add(java.util.Calendar.WEDNESDAY, -1);
		return cal.getTime();
	}
	
	/**
	 * 得到上月的当前时间<br/>
	 * eg : 2013-07-31 11:36:06 ----> 2013-06-30 11:36:06<br/>
	 * @param date
	 * @return
	 */
	public static java.util.Date getYesMonthTime(java.util.Date date){
		
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setTime(date);
		cal.add(java.util.Calendar.MONTH, -1);
		return cal.getTime(); 
	}
	
	/**
	 * 得到去年的当前时间<br/>
	 * eg : 2013-07-31 11:36:06 ----> 2013-06-30 11:36:06<br/>
	 * @param date
	 * @return
	 */
	public static java.util.Date getYesYearTime(java.util.Date date){
		
		java.util.Calendar cal = java.util.Calendar.getInstance();
		cal.setTime(date);
		cal.add(java.util.Calendar.YEAR, -1);
		return cal.getTime(); 
	}
	
}
