package org.gvsig.framework.web.ogc;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect OperationsMetadata_Roo_Equals {

    public boolean OperationsMetadata.equals(Object obj) {
        if (!(obj instanceof OperationsMetadata)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        OperationsMetadata rhs = (OperationsMetadata) obj;
        return new EqualsBuilder().append(name, rhs.name).append(url, rhs.url).isEquals();
    }

    public int OperationsMetadata.hashCode() {
        return new HashCodeBuilder().append(name).append(url).toHashCode();
    }

}
