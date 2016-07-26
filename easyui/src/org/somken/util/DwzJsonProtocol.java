package org.somken.util;

public class DwzJsonProtocol {

    private Long   statusCode;

    private String message;

    private String navTabId = "";

    private String rel  = "";

    private String callbackType  = "";

    private String forwardUrl  = "";

    private String confirmMsg  = "";
    
    public DwzJsonProtocol(){

    }

    public DwzJsonProtocol(Long statusCode, String message){
        this.statusCode = statusCode;
        this.message = message;
    }

    public DwzJsonProtocol(Long statusCode, String message,String navTabId){
        this.statusCode = statusCode;
        this.message = message;
        this.navTabId = navTabId;
    }
    
    
    public Long getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(Long statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getNavTabId() {
        return navTabId;
    }

    public void setNavTabId(String navTabId) {
        this.navTabId = navTabId;
    }

    public String getRel() {
        return rel;
    }

    public void setRel(String rel) {
        this.rel = rel;
    }

    public String getCallbackType() {
        return callbackType;
    }

    public void setCallbackType(String callbackType) {
        this.callbackType = callbackType;
    }

    public String getForwardUrl() {
        return forwardUrl;
    }

    public void setForwardUrl(String forwardUrl) {
        this.forwardUrl = forwardUrl;
    }

    public String getConfirmMsg() {
        return confirmMsg;
    }

    public void setConfirmMsg(String confirmMsg) {
        this.confirmMsg = confirmMsg;
    }
    
}
