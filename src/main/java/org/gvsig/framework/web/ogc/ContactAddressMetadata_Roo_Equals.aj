package org.gvsig.framework.web.ogc;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect ContactAddressMetadata_Roo_Equals {

    public boolean ContactAddressMetadata.equals(Object obj) {
        if (!(obj instanceof ContactAddressMetadata)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        ContactAddressMetadata rhs = (ContactAddressMetadata) obj;
        return new EqualsBuilder().append(address, rhs.address).append(addressType, rhs.addressType).append(city, rhs.city).append(country, rhs.country).append(postCode, rhs.postCode).append(stateProvince, rhs.stateProvince).isEquals();
    }

    public int ContactAddressMetadata.hashCode() {
        return new HashCodeBuilder().append(address).append(addressType).append(city).append(country).append(postCode).append(stateProvince).toHashCode();
    }

}
