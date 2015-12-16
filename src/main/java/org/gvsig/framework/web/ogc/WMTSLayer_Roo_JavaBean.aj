package org.gvsig.framework.web.ogc;

import java.util.TreeSet;

privileged aspect WMTSLayer_Roo_JavaBean {

    public TreeSet<String> WMTSLayer.getFormatsSupported() {
        return this.formatsSupported;
    }

    public void WMTSLayer.setFormatsSupported(TreeSet<String> formatsSupported) {
        this.formatsSupported = formatsSupported;
    }

    public String WMTSLayer.getFormatSelected() {
        return this.formatSelected;
    }

    public void WMTSLayer.setFormatSelected(String formatSelected) {
        this.formatSelected = formatSelected;
    }

    public TreeSet<String> WMTSLayer.getTileMatrixSelected() {
        return this.tileMatrixSelected;
    }

    public void WMTSLayer.setTileMatrixSelected(TreeSet<String> tileMatrixSelected) {
        this.tileMatrixSelected = tileMatrixSelected;
    }

}
