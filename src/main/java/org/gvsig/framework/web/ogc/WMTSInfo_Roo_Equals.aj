package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSInfo;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect WMTSInfo_Roo_Equals {

    public boolean WMTSInfo.equals(Object obj) {
        if (!(obj instanceof WMTSInfo)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        WMTSInfo rhs = (WMTSInfo) obj;
        return new EqualsBuilder().append(crsSupported, rhs.crsSupported).append(formatsSupported, rhs.formatsSupported).append(id, rhs.id).append(isFormatsSupported, rhs.isFormatsSupported).append(serviceAbstract, rhs.serviceAbstract).append(serviceName, rhs.serviceName).append(serviceTitle, rhs.serviceTitle).append(serviceType, rhs.serviceType).append(serviceUrl, rhs.serviceUrl).append(tileMatrixSelectedId, rhs.tileMatrixSelectedId).append(version, rhs.version).isEquals();
    }

    public int WMTSInfo.hashCode() {
        return new HashCodeBuilder().append(crsSupported).append(formatsSupported).append(id).append(isFormatsSupported).append(serviceAbstract).append(serviceName).append(serviceTitle).append(serviceType).append(serviceUrl).append(tileMatrixSelectedId).append(version).toHashCode();
    }

}
