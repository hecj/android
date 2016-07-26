import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Scanner;

public class TestFile1 {
	public static String readFile(File file, String encode)
			throws FileNotFoundException, IOException {
		if (!file.exists()) {
			System.out.println("file not found");
			return "";
		}
		if (!file.isFile()) {
			System.out.println("file not found");
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
	public static void main(String[] args) {
		try{
			System.out.println("note : file.xml -> dir ");
			Scanner scanner = new Scanner(System.in);
			System.out.println("input file config : ");
			String configfile = scanner.nextLine();
			System.out.println("input file dir : ");
			String dir = scanner.nextLine();
			String content =readFile(new File(configfile),"gbk");
			if(content.length() == 0){
				return;
			}
			File[] fileList = new File(dir).listFiles();
			if(fileList.length == 0){
				System.out.println(dir+" file not found");
				return;
			}
			System.out.println(" ========== this files ===============");
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
		} catch(Exception ex){
			ex.printStackTrace();
		}
	}
}
