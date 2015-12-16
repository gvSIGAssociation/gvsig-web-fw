package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.WMTSInfo;
import org.gvsig.framework.web.ogc.WMTSLayer;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import org.gvnix.util.fancytree.TreeNode;

privileged aspect WMTSInfo_Roo_JavaBean {

    public List<TreeNode> WMTSInfo.getLayersTree() {
        return this.layersTree;
    }

    public void WMTSInfo.setLayersTree(List<TreeNode> layersTree) {
        this.layersTree = layersTree;
    }

    public String WMTSInfo.getVersion() {
        return this.version;
    }

    public void WMTSInfo.setVersion(String version) {
        this.version = version;
    }

    public String WMTSInfo.getServiceUrl() {
        return this.serviceUrl;
    }

    public void WMTSInfo.setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String WMTSInfo.getServiceName() {
        return this.serviceName;
    }

    public void WMTSInfo.setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String WMTSInfo.getServiceAbstract() {
        return this.serviceAbstract;
    }

    public void WMTSInfo.setServiceAbstract(String serviceAbstract) {
        this.serviceAbstract = serviceAbstract;
    }

    public String WMTSInfo.getServiceTitle() {
        return this.serviceTitle;
    }

    public void WMTSInfo.setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public String WMTSInfo.getServiceType() {
        return this.serviceType;
    }

    public void WMTSInfo.setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public int WMTSInfo.getId() {
        return this.id;
    }

    public void WMTSInfo.setId(int id) {
        this.id = id;
    }

    public TreeSet<String> WMTSInfo.getTileMatrixSelectedId() {
        return this.tileMatrixSelectedId;
    }

    public void WMTSInfo.setTileMatrixSelectedId(TreeSet<String> tileMatrixSelectedId) {
        this.tileMatrixSelectedId = tileMatrixSelectedId;
    }

    public Map<String, WMTSLayer> WMTSInfo.getLayers() {
        return this.layers;
    }

    public void WMTSInfo.setLayers(Map<String, WMTSLayer> layers) {
        this.layers = layers;
    }

    public Map<String, String> WMTSInfo.getTileMatrixCrsSupported() {
        return this.tileMatrixCrsSupported;
    }

    public void WMTSInfo.setTileMatrixCrsSupported(Map<String, String> tileMatrixCrsSupported) {
        this.tileMatrixCrsSupported = tileMatrixCrsSupported;
    }

    public TreeSet<String> WMTSInfo.getFormatsSupported() {
        return this.formatsSupported;
    }

    public void WMTSInfo.setFormatsSupported(TreeSet<String> formatsSupported) {
        this.formatsSupported = formatsSupported;
    }

    public TreeSet<String> WMTSInfo.getCrsSupported() {
        return this.crsSupported;
    }

    public void WMTSInfo.setCrsSupported(TreeSet<String> crsSupported) {
        this.crsSupported = crsSupported;
    }

    public boolean WMTSInfo.isIsFormatsSupported() {
        return this.isFormatsSupported;
    }

    public void WMTSInfo.setIsFormatsSupported(boolean isFormatsSupported) {
        this.isFormatsSupported = isFormatsSupported;
    }

}
