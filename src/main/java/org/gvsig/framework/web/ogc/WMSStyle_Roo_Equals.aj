package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSStyle;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

privileged aspect WMSStyle_Roo_Equals {

    public boolean WMSStyle.equals(Object obj) {
        if (!(obj instanceof WMSStyle)) {
            return false;
        }
        if (this == obj) {
            return true;
        }
        WMSStyle rhs = (WMSStyle) obj;
        return new EqualsBuilder().append(name, rhs.name).append(styleAbstract, rhs.styleAbstract).append(title, rhs.title).isEquals();
    }

    public int WMSStyle.hashCode() {
        return new HashCodeBuilder().append(name).append(styleAbstract).append(title).toHashCode();
    }

}
