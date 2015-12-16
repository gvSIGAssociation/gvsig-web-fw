package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSInfo;
import java.io.Serializable;

privileged aspect WMSInfo_Roo_Serializable {

    declare parents: WMSInfo implements Serializable;

    private static final long WMSInfo.serialVersionUID = 1L;

}
