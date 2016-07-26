package com.eyaoren.test

import com.eyaoren.flowpicker.util.MacherUtil;
try {
	String totalPage = MacherUtil.matcher("\\d+",MacherUtil.matcher("皖ICP备\\d+号", html));
	return totalPage;
} catch (Exception e) {
	e.printStackTrace();
	return 1;
}
