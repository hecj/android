package com.eyaoren.groovy
/**
 * 东莞市泰安医药有限公司
 * http://121.12.155.170:6868/ecs/login.jsp
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
 
 headList.add("制单日期");
 headList.add("客户名");
 headList.add("通用名称");
 headList.add("商品名称");
 headList.add("数量");
 headList.add("单位助记码信息");
 headList.add("送货地址");
 headList.add("商品规格");
 headList.add("单位标识");
 headList.add("商品标识");
 headList.add("批号");
 headList.add("失效期");
 headList.add("销售单编号");
 headList.add("商品编码");
 headList.add("订单类型");
 headList.add("商品价格");
 headList.add("销售金额");
 headList.add("记帐时间");
 
 	def html = FileUtils.readFileToString(new File("/Users/hecj/workspace/groovy/groovy/src/json1.json"),"utf-8");
	JSONObject json = JSON.parseObject(html);
	JSONArray array = json.getJSONArray("rows");
	def index = 0;
	array.each {
		
		if(index == array.size()-1){
			return data;
		}
		
		def rowList = [];
		
		rowList.add(it.getString("certdate"));
		rowList.add(it.getString("customname"));
		rowList.add(it.getString("commonname"));
		rowList.add(it.getString("goodsname"));
		rowList.add(it.getString("goodsqty"));
		rowList.add(it.getString("companyinfo"));
		rowList.add(it.getString("toaddr"));
		rowList.add(it.getString("goodstype"));
		rowList.add(it.getString("companyid"));
		rowList.add(it.getString("goodsid"));
		rowList.add(it.getString("lotno"));
		rowList.add(it.getString("invaliddate"));
		rowList.add(it.getString("salno"));
		rowList.add(it.getString("goodsno"));
		if("1".equals(it.getString("saltype"))){
			rowList.add("销售");
		}else{
			rowList.add("");
		}
		rowList.add(it.getString("price"));
		rowList.add(it.getString("salmoney"));
		rowList.add(it.getString("inputdate"));
		bodyList.add(rowList);
		
		index++;
	};
	
println data;

return data;
