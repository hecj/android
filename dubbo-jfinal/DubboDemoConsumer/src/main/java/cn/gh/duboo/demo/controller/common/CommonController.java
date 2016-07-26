package cn.gh.duboo.demo.controller.common;

import com.jfinal.core.Controller;

/**
 * CommonController
 */
public class CommonController extends Controller {
	
	public void index() {
		render("/common/index.html");
	}
}
