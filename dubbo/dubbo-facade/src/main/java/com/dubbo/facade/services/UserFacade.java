package com.dubbo.facade.services;

import com.dubbo.common.entity.User;
/**
 * @类功能说明：提供远程调用的用户业务类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2015年3月22日 上午12:39:19
 * @版本：V1.0
 */
public interface UserFacade {
	
	public User getUserById(String id);
}
