package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSLayer;
import java.io.Serializable;

privileged aspect WMSLayer_Roo_Serializable {

    declare parents: WMSLayer implements Serializable;

    private static final long WMSLayer.serialVersionUID = 1L;

}
