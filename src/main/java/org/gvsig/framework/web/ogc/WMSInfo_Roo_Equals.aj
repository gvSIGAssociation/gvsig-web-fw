package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSInfo;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect WMSInfo_Roo_Equals {

    public boolean WMSInfo.equals(Object obj) {
        if (!(obj instanceof WMSInfo)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        WMSInfo rhs = (WMSInfo) obj;
        return new EqualsBuilder().append(crsSelected, rhs.crsSelected).append(crsSupported, rhs.crsSupported).append(formatSelected, rhs.formatSelected).append(formatsSupported, rhs.formatsSupported).append(id, rhs.id).append(serviceAbstract, rhs.serviceAbstract).append(serviceName, rhs.serviceName).append(serviceTitle, rhs.serviceTitle).append(serviceUrl, rhs.serviceUrl).append(version, rhs.version).isEquals();
    }

    public int WMSInfo.hashCode() {
        return new HashCodeBuilder().append(crsSelected).append(crsSupported).append(formatSelected).append(formatsSupported).append(id).append(serviceAbstract).append(serviceName).append(serviceTitle).append(serviceUrl).append(version).toHashCode();
    }

}
