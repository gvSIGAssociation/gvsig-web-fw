package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.Layer;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect Layer_Roo_Equals {

    public boolean Layer.equals(Object obj) {
        if (!(obj instanceof Layer)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        Layer rhs = (Layer) obj;
        return new EqualsBuilder().append(crs, rhs.crs).append(name, rhs.name).append(title, rhs.title).isEquals();
    }

    public int Layer.hashCode() {
        return new HashCodeBuilder().append(crs).append(name).append(title).toHashCode();
    }

}
