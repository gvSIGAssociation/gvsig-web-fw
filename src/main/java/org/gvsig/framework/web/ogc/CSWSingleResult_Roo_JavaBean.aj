package org.gvsig.framework.web.ogc;


privileged aspect CSWSingleResult_Roo_JavaBean {

    public String CSWSingleResult.getFileIdentifier() {
        return this.fileIdentifier;
    }

    public void CSWSingleResult.setFileIdentifier(String fileIdentifier) {
        this.fileIdentifier = fileIdentifier;
    }

    public String CSWSingleResult.getTitle() {
        return this.title;
    }

    public void CSWSingleResult.setTitle(String title) {
        this.title = title;
    }

    public String CSWSingleResult.getAbstract_() {
        return this.abstract_;
    }

    public void CSWSingleResult.setAbstract_(String abstract_) {
        this.abstract_ = abstract_;
    }

    public String CSWSingleResult.getImage() {
        return this.image;
    }

    public void CSWSingleResult.setImage(String image) {
        this.image = image;
    }

    public String CSWSingleResult.getServiceUrl() {
        return this.serviceUrl;
    }

    public void CSWSingleResult.setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String CSWSingleResult.getServiceType() {
        return this.serviceType;
    }

    public void CSWSingleResult.setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

}
