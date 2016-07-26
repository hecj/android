package org.somken.upload;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Reader;
import java.net.URLEncoder;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;

import sun.misc.BASE64Encoder;
/**
 * @类功能说明：下载服务器txt文件
 * @类修改者：
 * @修改日期：
 * @修改说明：
 * @作者：He Chaojie
 * @创建时间：2013-8-2 下午4:16:29
 * @版本：V1.0
 */
public class UploadTxtServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	
	public UploadTxtServlet(){
		
	}
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}
	
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		doPost(request, response);
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		
		//String filePath = request.getParameter("filePath");
		
		request.setCharacterEncoding("utf-8");
		response.setContentType("text/plain;charset=utf-8");// 一下两行关键的设置  
		response.setCharacterEncoding("utf-8");
		
		String fileName = "文件名字";
		String finalFileName = null;
		/**
		 * 解决导出文件乱码
		 */
		final String userAgent = request.getHeader("USER-AGENT");
        try {
            if(StringUtils.contains(userAgent, "MSIE")){//IE浏览器
                finalFileName = URLEncoder.encode(fileName,"UTF8");
            }else if(StringUtils.contains(userAgent, "Mozilla")){//google,火狐浏览器
                finalFileName = new String(fileName.getBytes(), "ISO8859-1");
            }else{
                finalFileName = URLEncoder.encode(fileName,"UTF8");//其他浏览器
            }
        }catch(Exception ex){
        }
		
		response.addHeader("Content-Disposition","attachment;filename="+finalFileName+"");// filename指定默认的名字  
		response.setHeader("Cache-Control", "no-cache");
		response.setHeader("Charset", "UTF-8");
		response.setCharacterEncoding("UTF-8");
		
		//得到输出流
		OutputStream outputStream = response.getOutputStream();
		BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(outputStream);
		
		//输入流
		Reader reader = new FileReader(new File("f:/t.txt"));
		BufferedReader bufferedReader = new BufferedReader(reader);
		
		//拼接字符串
		StringBuffer stringBuffer = new StringBuffer();
		String str = "";
		while((str = bufferedReader.readLine())!=null){
			stringBuffer.append(str+"\n");
		}
		
		bufferedOutputStream.write(stringBuffer.toString().getBytes("utf-8"));
		
		//关闭流
		bufferedOutputStream.flush();
		bufferedOutputStream.close();
		outputStream.close();
		bufferedReader.close();
		
	}
}
