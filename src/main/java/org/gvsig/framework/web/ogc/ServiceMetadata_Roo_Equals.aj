package org.gvsig.framework.web.ogc;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect ServiceMetadata_Roo_Equals {

    public boolean ServiceMetadata.equals(Object obj) {
        if (!(obj instanceof ServiceMetadata)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        ServiceMetadata rhs = (ServiceMetadata) obj;
        return new EqualsBuilder().append(abstractStr, rhs.abstractStr).append(accessConstraints, rhs.accessConstraints).append(contact, rhs.contact).append(fees, rhs.fees).append(keywords, rhs.keywords).append(name, rhs.name).append(title, rhs.title).append(url, rhs.url).append(version, rhs.version).isEquals();
    }

    public int ServiceMetadata.hashCode() {
        return new HashCodeBuilder().append(abstractStr).append(accessConstraints).append(contact).append(fees).append(keywords).append(name).append(title).append(url).append(version).toHashCode();
    }

}
