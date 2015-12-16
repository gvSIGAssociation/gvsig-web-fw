package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSInfo;
import java.io.Serializable;

privileged aspect WMTSInfo_Roo_Serializable {

    declare parents: WMTSInfo implements Serializable;

    private static final long WMTSInfo.serialVersionUID = 1L;

}
