package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSStyle;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect WMSStyle_Roo_ToString {

    public String WMSStyle.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
