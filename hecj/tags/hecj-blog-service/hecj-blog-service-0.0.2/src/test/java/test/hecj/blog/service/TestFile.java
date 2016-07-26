package test.hecj.blog.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Scanner;

public class TestFile {

	public static void main(String[] args) throws IOException {
		
		Scanner scanner = new Scanner(System.in);
		System.out.println("请输入配置文件路径：");
		String configfile = scanner.nextLine();
		System.out.println("请输入筛选文件路径：");
		String dir = scanner.nextLine();
		String content =readFile(new File(configfile),"gbk");
		if(content.length() == 0){
			return;
		}
		File[] fileList = new File(dir).listFiles();
		if(fileList.length == 0){
			System.out.println(dir+"路径下无文件");
			return;
		}
		System.out.println("以下文件不在配置文件中：");
		for(File f : fileList){
			String filename = f.getName();
			String ext = getExt(filename);
			if("shp".equals(ext.toLowerCase())){
				String filenametemp = filename.replace(ext, "");
				if(!content.contains(filenametemp)){
					System.out.println(filename);
				}
			}
		}
	}
	
	public static String readFile(File file, String encode)
			throws FileNotFoundException, IOException {
		if (!file.exists()) {
			System.out.println("文件不存在");
			return "";
		}
		if (!file.isFile()) {
			System.out.println("文件不存在");
			return "";
		}
		FileInputStream input = new FileInputStream(file);
		StringBuffer context = getContext(input, encode);
		return context.toString();
	}
	
	public static StringBuffer getContext(InputStream input, String encode)
			throws IOException {
		InputStreamReader reader = new InputStreamReader(input, encode);

		String inputString;
		StringBuffer sb = new StringBuffer("");

		BufferedReader br = new BufferedReader(reader);
		while ((inputString = br.readLine()) != null) {
			sb.append(inputString + "\r\n");
		}
		br.close();
		reader.close();
		input.close();
		return sb;
	}

	public static String getExt(String filename) {
		String[] s = filename.split("\\.");
		String ext = "";
		if (s.length > 1) {
			ext = s[s.length - 1];
		}
		return ext;
	}
}
