package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.Layer;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

privileged aspect Layer_Roo_ToString {

    public String Layer.toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
    }

}
