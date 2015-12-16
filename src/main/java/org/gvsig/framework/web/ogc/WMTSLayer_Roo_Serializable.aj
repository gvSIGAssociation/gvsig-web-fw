package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSLayer;
import java.io.Serializable;

privileged aspect WMTSLayer_Roo_Serializable {

    declare parents: WMTSLayer implements Serializable;

    private static final long WMTSLayer.serialVersionUID = 1L;

}
