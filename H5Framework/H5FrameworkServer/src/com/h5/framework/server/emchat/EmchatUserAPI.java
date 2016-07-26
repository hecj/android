package com.h5.framework.server.emchat;

import com.easemob.server.example.api.IMUserAPI;
import com.easemob.server.example.comm.EasemobRestAPIFactory;
import com.easemob.server.example.comm.body.IMUserBody;
import com.easemob.server.example.comm.wrapper.BodyWrapper;

public class EmchatUserAPI extends EmchatAPI{
	
	static IMUserAPI user = (IMUserAPI)factory.newInstance(EasemobRestAPIFactory.USER_CLASS);
	
	public static Object createUser(String userName, String password, String nickName){
		BodyWrapper userBody = new IMUserBody(userName, password, nickName);
		return user.createNewIMUserSingle(userBody);
	}
	
	public static void main(String[] args) {
		Object obj = createUser("admin","111111","admin");
		System.out.println(obj);
		System.out.println(user.getIMUserStatus("test1"));
		System.out.println(user.getIMUsersByUserName("test1"));
		
	}
}
