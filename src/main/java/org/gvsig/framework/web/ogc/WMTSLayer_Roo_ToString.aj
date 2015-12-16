package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSLayer;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect WMTSLayer_Roo_ToString {

    public String WMTSLayer.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
