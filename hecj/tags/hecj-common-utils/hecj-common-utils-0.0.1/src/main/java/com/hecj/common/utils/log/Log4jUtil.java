package com.hecj.common.utils.log;
import org.apache.log4j.Level;
import org.apache.log4j.Logger;

/**
 * @类功能说明：日志输出类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2014-12-12 上午10:46:29
 * @版本：V1.0
 */
public class Log4jUtil {

	static enum PrintStatus {

		INFO(true), ERROR(true), DEBUG(false), FATAL(true),SHOWSQL(true);
		boolean status;

		PrintStatus(boolean status) {
			this.status = status;
		}
	}

	private static Logger log = Logger.getLogger("Log4jUtil");

	public static Logger getLogger() {
		return log;
	}

	public static void log(String message) {
		if (PrintStatus.INFO.status) {
			log.log(Level.INFO, getStackTraceMessage() + message, null);
		}
	}

	public static void info(String message) {
		if (PrintStatus.INFO.status) {
			log.log(Level.INFO, getStackTraceMessage() + message, null);
		}
	}

	public static void error(String message) {
		if (PrintStatus.ERROR.status) {
			log.error(getStackTraceMessage() + message, null);
		}
	}

	public static void debug(String message) {
		if (PrintStatus.DEBUG.status) {
			log.debug(getStackTraceMessage() + message, null);
		}
	}

	public static void fatal(String message) {
		if (PrintStatus.FATAL.status) {
			log.fatal(getStackTraceMessage() + message, null);
		}
	}
	
	public static void showSQL(String message) {
		if (PrintStatus.SHOWSQL.status) {
			log.log(Level.INFO, getStackTraceMessage() + message, null);
		}
	}

	private static String getStackTraceMessage() {
		String msg = "";
		try {
			String[] strs = new Exception().getStackTrace()[2].getClassName().replace(".", ",").split(",");
			msg += strs[strs.length-1]+".";
			msg += new Exception().getStackTrace()[2].getMethodName() + "()[";
			msg += new Exception().getStackTrace()[2].getLineNumber() + "] ";
		} catch (Exception mException) {
			mException.printStackTrace();
		}
		return msg;
	}
}