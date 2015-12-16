package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSLayer;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect WMSLayer_Roo_ToString {

    public String WMSLayer.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
