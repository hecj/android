package com.easemob.server.example.comm.body;

import com.easemob.server.example.comm.constant.MsgType;
import com.fasterxml.jackson.databind.node.ContainerNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;

import java.util.Iterator;
import java.util.Map;

public class TextMessageBody extends MessageBody {
	private Map<String, String> msg;

	public TextMessageBody(String targetType, String[] targets, String from, Map<String, String> ext, Map<String, String> msg) {
		super(targetType, targets, from, ext);
		this.msg = msg;
	}

	public Map<String, String> getMsg() {
		return msg;
	}

    public ContainerNode<?> getBody() {
        if(!isInit()){
            this.getMsgBody().put("type", MsgType.TEXT);
            //this.getMsgBody().put("msg", msg);
            this.setInit(true);
        }

        ObjectNode extNode = this.getMsgBody().putObject("msg");
        Iterator<String> iter = msg.keySet().iterator();
        while(iter.hasNext()){
            String key = iter.next();
            extNode.put(key, msg.get(key));
        }
        return this.getMsgBody();
    }

    public Boolean validate() {
		return super.validate() && msg != null;
	}
}
