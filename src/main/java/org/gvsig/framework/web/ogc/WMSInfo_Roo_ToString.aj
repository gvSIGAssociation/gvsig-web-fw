package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSInfo;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect WMSInfo_Roo_ToString {

    public String WMSInfo.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
