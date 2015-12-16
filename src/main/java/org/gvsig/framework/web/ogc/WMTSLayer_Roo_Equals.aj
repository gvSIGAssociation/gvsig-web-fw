package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSLayer;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect WMTSLayer_Roo_Equals {

    public boolean WMTSLayer.equals(Object obj) {
        if (!(obj instanceof WMTSLayer)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        WMTSLayer rhs = (WMTSLayer) obj;
        return new EqualsBuilder().append(crs, rhs.crs).append(formatSelected, rhs.formatSelected).append(formatsSupported, rhs.formatsSupported).append(name, rhs.name).append(tileMatrixSelected, rhs.tileMatrixSelected).append(title, rhs.title).isEquals();
    }

    public int WMTSLayer.hashCode() {
        return new HashCodeBuilder().append(crs).append(formatSelected).append(formatsSupported).append(name).append(tileMatrixSelected).append(title).toHashCode();
    }

}
