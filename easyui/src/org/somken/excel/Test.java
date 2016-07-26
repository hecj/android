package org.somken.excel;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Vector;

import jxl.write.WritableWorkbook;
import jxl.write.WriteException;

public class Test {

	/**
	 * @throws IOException 
	 * @throws WriteException 
	 * @函数功能说明 
	 * @修改作者名字 He Chaojie  
	 * @修改时间 2013-8-2
	 * @修改内容
	 * @参数： @param args    
	 * @return void   
	 * @throws
	 */

	public static void main(String[] args) throws WriteException, IOException {
		
		CreateExcel createExcel = new SimpleCreateExcel();
		
		SimpleSheet sheet = new SimpleSheet();
		sheet.setColNames(new String[]{"列一","列二"});
		
		Vector<String[]> datas = new Vector<String[]>();
		datas.add(new String[]{"1","2"});
		datas.add(new String[]{"3","4"});
		sheet.setDatas(datas);
		
		sheet.setSheetName("我的表格");
		
		File f = new File("f:/x.xls");
		OutputStream os = null;
		try {
			os = new FileOutputStream(f);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		
		WritableWorkbook w = createExcel.create(sheet,os);
		w.write();
		w.close();
	}
}
