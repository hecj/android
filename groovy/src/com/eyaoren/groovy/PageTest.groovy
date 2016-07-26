package com.eyaoren.groovy

import com.eyaoren.flowpicker.util.MacherUtil;


def html="共401条";


try {
	def total = Integer.parseInt(MacherUtil.matcher("\\d+",MacherUtil.matcher("共\\d+条",(String)html)));
	int page = 1;
	if(total%50==0){
		page = total / 50;
	} else{
		page = total / 50+1;
	}
	
	return page;
} catch (Exception e) {
	e.printStackTrace();
	return 1;
}

