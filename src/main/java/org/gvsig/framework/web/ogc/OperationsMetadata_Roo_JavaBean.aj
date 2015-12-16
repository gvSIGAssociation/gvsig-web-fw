package org.gvsig.framework.web.ogc;

privileged aspect OperationsMetadata_Roo_JavaBean {

    public String OperationsMetadata.getName() {
        return this.name;
    }

    public void OperationsMetadata.setName(String name) {
        this.name = name;
    }

    public String OperationsMetadata.getUrl() {
        return this.url;
    }

    public void OperationsMetadata.setUrl(String url) {
        this.url = url;
    }

}
