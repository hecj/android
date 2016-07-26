package com.h5.framework.server.emchat;

import java.util.HashMap;
import java.util.Map;

import com.easemob.server.example.api.impl.EasemobSendMessage;
import com.easemob.server.example.comm.EasemobRestAPIFactory;
import com.easemob.server.example.comm.body.TextMessageBody;

public class EasemobSendMessageAPI extends EmchatAPI{

	static EasemobSendMessage send = (EasemobSendMessage)factory.newInstance(EasemobRestAPIFactory.SEND_MESSAGE_CLASS);

	public static void main(String[] args) {
		
		String targetType = "users";
		String[] targets = {"test1"};
		String from = "admin";
		Map<String, String>  msg = new HashMap<String, String>();
		msg.put("type", "txt");
		msg.put("msg", "hello");
		
		TextMessageBody body = new TextMessageBody(targetType, targets, from, null, msg);
		System.out.println(send.sendMessage(body));
	}
}
