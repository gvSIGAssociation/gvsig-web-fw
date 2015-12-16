package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSLayer;
import org.gvsig.framework.web.ogc.WMSStyle;
import java.util.List;

privileged aspect WMSLayer_Roo_JavaBean {

    public List<WMSStyle> WMSLayer.getStyles() {
        return this.styles;
    }

    public void WMSLayer.setStyles(List<WMSStyle> styles) {
        this.styles = styles;
    }

}
