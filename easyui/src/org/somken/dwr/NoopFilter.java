package org.somken.dwr;

import java.lang.reflect.Method;

import org.directwebremoting.AjaxFilterChain;
/**
 * @类功能说明：dwr过滤器类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：He Chaojie
 * @创建时间：2013-8-1 上午9:18:42
 * @版本：V1.0
 */
public class NoopFilter implements org.directwebremoting.AjaxFilter {
	
	private String name;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Object doFilter(Object obj, Method method, Object[] params,
			AjaxFilterChain chain) throws Exception {
		
		return chain.doFilter(obj, method, params);
	}

}