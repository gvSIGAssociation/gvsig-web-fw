package org.gvsig.framework.web.ogc;


privileged aspect ContactMetadata_Roo_JavaBean {

    public String ContactMetadata.getPerson() {
        return this.person;
    }

    public void ContactMetadata.setPerson(String person) {
        this.person = person;
    }

    public String ContactMetadata.getOrganization() {
        return this.organization;
    }

    public void ContactMetadata.setOrganization(String organization) {
        this.organization = organization;
    }

    public String ContactMetadata.getPosition() {
        return this.position;
    }

    public void ContactMetadata.setPosition(String position) {
        this.position = position;
    }

    public String ContactMetadata.getTelephone() {
        return this.telephone;
    }

    public void ContactMetadata.setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String ContactMetadata.getFax() {
        return this.fax;
    }

    public void ContactMetadata.setFax(String fax) {
        this.fax = fax;
    }

    public String ContactMetadata.getEmail() {
        return this.email;
    }

    public void ContactMetadata.setEmail(String email) {
        this.email = email;
    }

    public ContactAddressMetadata ContactMetadata.getContactAddress() {
        return this.contactAddress;
    }

    public void ContactMetadata.setContactAddress(ContactAddressMetadata contactAddress) {
        this.contactAddress = contactAddress;
    }

}
