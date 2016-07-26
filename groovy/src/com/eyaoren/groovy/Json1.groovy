package com.eyaoren.groovy
/**
 * 广州医药有限公司
 * http://www.gzmpc.com/gzmpcscm3/lxlogin.jsp
 */
import org.apache.commons.io.*

import com.alibaba.fastjson.JSON
import com.alibaba.fastjson.JSONArray
import com.alibaba.fastjson.JSONObject;
 
 def data = [];
 def headList = [];
 def bodyList = [];
 data.add(headList);
 data.add(bodyList);
 	 	 	 	 	 	 	 	 
 headList.add("销售日期");
 headList.add("货品操作码");
 headList.add("货品名称");
 headList.add("货品规格");
 headList.add("产地");
 headList.add("客户名称");
 headList.add("单位");
 headList.add("数量");
 headList.add("批号");
 headList.add("单价");
 headList.add("客户操作码");
 headList.add("客户区域");
 headList.add("地级市区域");
 headList.add("客户性质");
 headList.add("来源类型");
 headList.add("单据类型");
 headList.add("处方来源");
 headList.add("欠款金额");
 headList.add("流水ID");
 
 	def html = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/json1.json"),"utf-8");
	JSONObject json = JSON.parseObject(html);
	JSONArray array = json.getJSONArray("rows");
	def row = 0;
	array.each {
		if(row == array.size()-1){
			return data;
		}
		def rowList = [];
		
		rowList.add(it.getString("invdate"));
		rowList.add(it.getString("opcode"));
		rowList.add(it.getString("goodsname"));
		rowList.add(it.getString("goodstype"));
		rowList.add(it.getString("prodarea"));
		rowList.add(it.getString("customname"));
		rowList.add(it.getString("goodsunit"));
		rowList.add(it.getString("goodsqty"));
		rowList.add(it.getString("lotno"));
		rowList.add(it.getString(""));
		rowList.add(it.getString("customopcode"));
		rowList.add(it.getString("areano"));
		rowList.add(it.getString("cityno"));
		rowList.add(it.getString("customkind"));
		rowList.add(it.getString("comefrom"));
		rowList.add(it.getString("flowtype"));
		rowList.add(it.getString(""));
		rowList.add(it.getString(""));
		rowList.add(it.getString("lsid"));
		bodyList.add(rowList);
		row ++;
	};

 // ============test begin===========
 println "==========表头=============";
 headList.each {
	 print it +" , ";
 }
 println "\n==========列表=============";
 bodyList.each {
	it.each {
		print it +" , ";
	}
	println "";
 }
 // =============test end============
 try {
	 JSONObject json2 = JSON.parseObject(html);
	 println json2.getInteger("totalpage");
} catch (Exception e) {
	e.printStackTrace()
}
 

return data;
