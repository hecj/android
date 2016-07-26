package org.somken.springtask;

import org.apache.log4j.*;

public class TaskJob{
	
	public static Logger log = Logger.getLogger(TaskJob.class);

	public void sayHello1() {
		log.error("-----任务一------");
	}
	
	public void sayHello2(){
		log.error("-----任务二------");
	}
}