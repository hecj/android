package org.somken.task;

import java.util.TimerTask;

public class MyTask extends TimerTask {
	
  static int cont =0;
	
  public void run() {
	  //发送邮件
	  
	  System.out.print("-------"+cont++);
	  
		  SendEmail.send();
	  
  }
}