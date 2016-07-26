package test.hecj.blog.md5;

import org.junit.Test;

import com.hecj.common.utils.encryp.MD5;

public class MD5Test {

	@Test
	public void test01(){
		System.out.println(MD5.md5crypt("123456"));
	}
}
