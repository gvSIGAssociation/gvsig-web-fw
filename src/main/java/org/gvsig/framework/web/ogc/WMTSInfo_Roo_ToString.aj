package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSInfo;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect WMTSInfo_Roo_ToString {

    public String WMTSInfo.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
