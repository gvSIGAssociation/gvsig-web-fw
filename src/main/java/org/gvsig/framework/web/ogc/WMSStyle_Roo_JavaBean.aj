package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMSStyle;

privileged aspect WMSStyle_Roo_JavaBean {

    public String WMSStyle.getName() {
        return this.name;
    }

    public void WMSStyle.setName(String name) {
        this.name = name;
    }

    public String WMSStyle.getTitle() {
        return this.title;
    }

    public void WMSStyle.setTitle(String title) {
        this.title = title;
    }

    public String WMSStyle.getStyleAbstract() {
        return this.styleAbstract;
    }

    public void WMSStyle.setStyleAbstract(String styleAbstract) {
        this.styleAbstract = styleAbstract;
    }

}
