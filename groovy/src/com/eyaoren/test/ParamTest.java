package com.eyaoren.test;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.jsoup.Jsoup;

public class ParamTest {
	
	public static boolean cclm(String source) {
		boolean flag = true;
		char ws[] = new char[] { '"', '?', ' ', '\'', '&' };
		for (int i = 0; i < source.length(); i++) {
			char c = source.charAt(i);
			for (int j = 0; j < ws.length; j++) {
				char v = ws[j];
				if (c == v) {
					flag = false;
				}
			}
			if ((int) c == 0xfffd) {
				flag = false;
			}
		}
		return flag;
	}
	public static void main(String[] args) throws IOException {
		
		File file = new File("/Users/hecj/workspace/groovy/groovy/src/param.txt");
		String html = FileUtils.readFileToString(file);
		
		String chara = Jsoup.parse(html).charset().toString();
		
		System.out.println(cclm(chara));
		
		System.out.println(new String(html.getBytes("iso-8859-1"),"gb2312"));
		
		boolean blo = java.nio.charset.Charset.forName("gb2312").newEncoder().canEncode(chara);
		System.out.println(blo);
		System.out.println(cclm("12"));
//		for (String s : lines) {
//			System.out.println(s);
//		}
	}

}
