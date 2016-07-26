/*

package com.eyaoren.groovy
import com.eyaoren.flowpicker.util.DateFormatUtil;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.HtmlPage;


def startDateStr = DateFormatUtil.format(DateFormatUtil.parse(startDate, "yyyy-MM-dd"),"yyyy-MM-dd")
def endDateStr = DateFormatUtil.format(DateFormatUtil.parse(endDate, "yyyy-MM-dd"),"yyyy-MM-dd")

HtmlInput startInput =  htmlPage.getHtmlElementById("ctl00_ContentPlaceHolder1_tbdatebegin");
startInput.setValueAttribute(startDateStr);

HtmlInput endInput =  htmlPage.getHtmlElementById("ctl00_ContentPlaceHolder1_tbdateend");
endInput.setValueAttribute(endDateStr);

HtmlInput pageSize =  htmlPage.getHtmlElementById("ctl00_ContentPlaceHolder1_txtpage");
pageSize.setValueAttribute("1000");

HtmlInput check1 =  htmlPage.getHtmlElementById("ctl00_ContentPlaceHolder1_GridView2_ctl01_CheckBox1");
check1.setChecked(true);

HtmlInput check2 =  htmlPage.getHtmlElementById("ctl00_ContentPlaceHolder1_GridView2_ctl02_CheckName");
check2.setChecked(true);

HtmlElement submit =  (HtmlElement)(htmlPage.getElementById("ctl00_ContentPlaceHolder1_BtSelect"));
HtmlPage htmlPage2 = submit.click();

return htmlPage2;


import com.eyaoren.flowpicker.util.DateFormatUtil;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.*;


def startDateStr = DateFormatUtil.format(DateFormatUtil.parse(startDate, "yyyy-MM-dd"),"yyyy-MM-dd");
def endDateStr = DateFormatUtil.format(DateFormatUtil.parse(endDate, "yyyy-MM-dd"),"yyyy-MM-dd");

HtmlPage htmlPage2 =((HtmlElement)htmlPage.querySelectorAll("a:first-child").get(0)).click();

htmlPage2.getElementById("Bdate").setAttribute("value", startDateStr);

htmlPage2.getElementById("Edate").setAttribute("value", endDateStr);


HtmlPage htmlPage3 =  ((HtmlElement)(htmlPage2.getElementById("Button2"))).click();

return htmlPage3;

      	
      	
      	
import com.eyaoren.flowpicker.util.DateFormatUtil;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.*;


def startDateStr = DateFormatUtil.format(DateFormatUtil.parse(startDate, "yyyy-MM-dd"),"yyyy-MM-dd");
def endDateStr = DateFormatUtil.format(DateFormatUtil.parse(endDate, "yyyy-MM-dd"),"yyyy-MM-dd");

htmlPage.getElementById("Bdate").setAttribute("value", startDateStr);
htmlPage.getElementById("Edate").setAttribute("value", endDateStr);

 htmlPage =  ((HtmlElement)(htmlPage.getElementById("Button2"))).click();

return htmlPage;
      	
      	
      	
      	
      	
 import com.eyaoren.flowpicker.util.DateFormatUtil;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.*;


def startDateStr = DateFormatUtil.format(DateFormatUtil.parse(startDate, "yyyy-MM-dd"),"yyyy-MM-dd");
def endDateStr = DateFormatUtil.format(DateFormatUtil.parse(endDate, "yyyy-MM-dd"),"yyyy-MM-dd");

htmlPage.getElementById("ctl00_VMIContent_StartDate").setAttribute("value", startDateStr);

htmlPage.getElementById("ctl00_VMIContent_ExpiryDate").setAttribute("value", endDateStr);

 htmlPage =  ((HtmlElement)(htmlPage.getElementById("ctl00_VMIContent_ImgBtnDemand"))).click();

return htmlPage;

      	     	
      	
      	      		      		      		      		      		      		      		      		      		      		      		      		      		      		      		      		      		      		      		

import com.eyaoren.flowpicker.util.DateFormatUtil;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.WebRequest;
import com.gargoylesoftware.htmlunit.html.HtmlElement;
import com.gargoylesoftware.htmlunit.html.HtmlInput;
import com.gargoylesoftware.htmlunit.html.DomNode;
import com.gargoylesoftware.htmlunit.html.DomNodeList;
import com.gargoylesoftware.htmlunit.html.*;


def startDateStr = DateFormatUtil.format(DateFormatUtil.parse(startDate, "yyyy-MM-dd"),"yyyy-MM-dd");
def endDateStr = DateFormatUtil.format(DateFormatUtil.parse(endDate, "yyyy-MM-dd"),"yyyy-MM-dd");

if(pageNumber==1){
   htmlPage.getElementById("MainContent_TextBox1").setAttribute("value", startDateStr);
htmlPage.getElementById("MainContent_TextBox2").setAttribute("value", endDateStr);

 htmlPage =  ((HtmlElement)(htmlPage.getElementById("MainContent_Button1"))).click();
} else{
DomNodeList<DomNode> list = htmlPage.getElementById("MainContent_GridView1").querySelectorAll("tr");
			htmlPage = ((HtmlElement)(list.get(list.size()-1).querySelectorAll("table tr td a").get((int)pageNumber-2))).click();
}


return htmlPage;
      	
      	
      	
      	

*/
