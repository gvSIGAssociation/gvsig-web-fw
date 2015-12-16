package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSStyle;
import java.io.Serializable;

privileged aspect WMSStyle_Roo_Serializable {

    declare parents: WMSStyle implements Serializable;

    private static final long WMSStyle.serialVersionUID = 1L;

}
