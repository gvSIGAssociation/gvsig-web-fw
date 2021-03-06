package org.gvsig.framework.web.ogc;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect ContactMetadata_Roo_Equals {

    public boolean ContactMetadata.equals(Object obj) {
        if (!(obj instanceof ContactMetadata)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        ContactMetadata rhs = (ContactMetadata) obj;
        return new EqualsBuilder().append(contactAddress, rhs.contactAddress).append(email, rhs.email).append(fax, rhs.fax).append(organization, rhs.organization).append(person, rhs.person).append(position, rhs.position).append(telephone, rhs.telephone).isEquals();
    }

    public int ContactMetadata.hashCode() {
        return new HashCodeBuilder().append(contactAddress).append(email).append(fax).append(organization).append(person).append(position).append(telephone).toHashCode();
    }

}
