package org.gvsig.framework.web.ogc;

import java.util.List;

privileged aspect ServiceMetadata_Roo_JavaBean {

    public String ServiceMetadata.getName() {
        return this.name;
    }

    public void ServiceMetadata.setName(String name) {
        this.name = name;
    }

    public String ServiceMetadata.getUrl() {
        return this.url;
    }

    public void ServiceMetadata.setUrl(String url) {
        this.url = url;
    }

    public String ServiceMetadata.getTitle() {
        return this.title;
    }

    public void ServiceMetadata.setTitle(String title) {
        this.title = title;
    }

    public String ServiceMetadata.getAbstractStr() {
        return this.abstractStr;
    }

    public void ServiceMetadata.setAbstractStr(String abstractStr) {
        this.abstractStr = abstractStr;
    }

    public String ServiceMetadata.getVersion() {
        return this.version;
    }

    public void ServiceMetadata.setVersion(String version) {
        this.version = version;
    }

    public String ServiceMetadata.getKeywords() {
        return this.keywords;
    }

    public void ServiceMetadata.setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public String ServiceMetadata.getFees() {
        return this.fees;
    }

    public void ServiceMetadata.setFees(String fees) {
        this.fees = fees;
    }

    public String ServiceMetadata.getAccessConstraints() {
        return this.accessConstraints;
    }

    public void ServiceMetadata.setAccessConstraints(String accessConstraints) {
        this.accessConstraints = accessConstraints;
    }

    public ContactMetadata ServiceMetadata.getContact() {
        return this.contact;
    }

    public void ServiceMetadata.setContact(ContactMetadata contact) {
        this.contact = contact;
    }

    public List<Layer> ServiceMetadata.getLayers() {
        return this.layers;
    }

    public void ServiceMetadata.setLayers(List<Layer> layers) {
        this.layers = layers;
    }

    public List<OperationsMetadata> ServiceMetadata.getOperations() {
        return this.operations;
    }

    public void ServiceMetadata.setOperations(List<OperationsMetadata> operations) {
        this.operations = operations;
    }

}
