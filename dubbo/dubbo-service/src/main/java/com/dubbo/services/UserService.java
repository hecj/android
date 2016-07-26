package com.dubbo.services;

import com.dubbo.common.entity.User;
/**
 * @类功能说明：用户业务类
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：HECJ
 * @创建时间：2015年3月22日 上午12:40:24
 * @版本：V1.0
 */
public interface UserService {

	public User findUserById(String id); 
}
