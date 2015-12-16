package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSLayer;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect WMSLayer_Roo_Equals {

    public boolean WMSLayer.equals(Object obj) {
        if (!(obj instanceof WMSLayer)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        WMSLayer rhs = (WMSLayer) obj;
        return new EqualsBuilder().append(crs, rhs.crs).append(name, rhs.name).append(title, rhs.title).isEquals();
    }

    public int WMSLayer.hashCode() {
        return new HashCodeBuilder().append(crs).append(name).append(title).toHashCode();
    }

}
