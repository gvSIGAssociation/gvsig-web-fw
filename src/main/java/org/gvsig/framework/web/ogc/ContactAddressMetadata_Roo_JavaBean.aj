package org.gvsig.framework.web.ogc;


privileged aspect ContactAddressMetadata_Roo_JavaBean {

    public String ContactAddressMetadata.getAddressType() {
        return this.addressType;
    }

    public void ContactAddressMetadata.setAddressType(String addressType) {
        this.addressType = addressType;
    }

    public String ContactAddressMetadata.getAddress() {
        return this.address;
    }

    public void ContactAddressMetadata.setAddress(String address) {
        this.address = address;
    }

    public String ContactAddressMetadata.getCity() {
        return this.city;
    }

    public void ContactAddressMetadata.setCity(String city) {
        this.city = city;
    }

    public String ContactAddressMetadata.getStateProvince() {
        return this.stateProvince;
    }

    public void ContactAddressMetadata.setStateProvince(String stateProvince) {
        this.stateProvince = stateProvince;
    }

    public String ContactAddressMetadata.getPostCode() {
        return this.postCode;
    }

    public void ContactAddressMetadata.setPostCode(String postCode) {
        this.postCode = postCode;
    }

    public String ContactAddressMetadata.getCountry() {
        return this.country;
    }

    public void ContactAddressMetadata.setCountry(String country) {
        this.country = country;
    }

}
