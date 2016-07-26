package org.somken.task;

import java.util.Timer;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class MyListener implements ServletContextListener {
  
  private Timer timer = null;

  public void contextInitialized(ServletContextEvent event) {
	  
    timer = new Timer(true);
    //设置任务计划，启动和间隔时间
    timer.schedule(new MyTask(), 0, 500);
  }

  public void contextDestroyed(ServletContextEvent event) {
    timer.cancel();
  }
  
  
}