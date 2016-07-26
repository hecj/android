package com.code.product.freemarker;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.StringReader;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import freemarker.template.TemplateExceptionHandler;

public class FreemarkerTest {
	
	/**
	 */
	@Test
	public void test1() throws IOException, TemplateException{
        Template t = new Template(null, new StringReader("user${user};URL${url};name${name}"), null);
        Map map = new HashMap();
        map.put("user", "lavasoft");
        map.put("url", "http://www.baidu.com/");
        map.put("name", "hecj");
        t.process(map, new OutputStreamWriter(System.out)); 
	}
	
	@Test
	public void test2() throws IOException, TemplateException{
		// Create your Configuration instance, and specify if up to what FreeMarker
		// version (here 2.3.22) do you want to apply the fixes that are not 100%
		// backward-compatible. See the Configuration JavaDoc for details.
		Configuration cfg = new Configuration(Configuration.VERSION_2_3_22);
		// Specify the source where the template files come from. Here I set a
		// plain directory for it, but non-file-system sources are possible too:
		cfg.setDirectoryForTemplateLoading(new File("src/test/resources/templates"));
		// Set the preferred charset template files are stored in. UTF-8 is
		// a good choice in most applications:
		cfg.setDefaultEncoding("UTF-8");
		// Sets how errors will appear.
		// During web page *development* TemplateExceptionHandler.HTML_DEBUG_HANDLER is better.
		cfg.setTemplateExceptionHandler(TemplateExceptionHandler.RETHROW_HANDLER);  
		
		// Create the root hash
		Map root = new HashMap();
		// Put string ``user'' into the root
		root.put("user", "Big Joe");
		// Create the hash for ``latestProduct''
		Map latest = new HashMap();
		// and put it into the root
		root.put("latestProduct", latest);
		// put ``url'' and ``name'' into latest
		latest.put("url", "products/greenmouse.html");
		latest.put("name", "green mouse");
		
		Template temp = cfg.getTemplate("test.ftl"); 
//		Writer out = new OutputStreamWriter(System.out);
		Writer out = new OutputStreamWriter(new FileOutputStream(new File("d:/t.txt")));
		temp.process(root, out);  
	}
}
