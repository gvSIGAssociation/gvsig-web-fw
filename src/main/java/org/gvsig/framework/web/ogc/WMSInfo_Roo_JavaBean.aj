package org.gvsig.framework.web.ogc;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import org.gvnix.util.fancytree.TreeNode;

privileged aspect WMSInfo_Roo_JavaBean {

    public List<TreeNode> WMSInfo.getLayersTree() {
        return this.layersTree;
    }

    public void WMSInfo.setLayersTree(List<TreeNode> layersTree) {
        this.layersTree = layersTree;
    }

    public TreeSet<String> WMSInfo.getCrsSelected() {
        return this.crsSelected;
    }

    public void WMSInfo.setCrsSelected(TreeSet<String> crsSelected) {
        this.crsSelected = crsSelected;
    }

    public String WMSInfo.getVersion() {
        return this.version;
    }

    public void WMSInfo.setVersion(String version) {
        this.version = version;
    }

    public String WMSInfo.getFormatSelected() {
        return this.formatSelected;
    }

    public void WMSInfo.setFormatSelected(String formatSelected) {
        this.formatSelected = formatSelected;
    }

    public TreeSet<String> WMSInfo.getFormatsSupported() {
        return this.formatsSupported;
    }

    public void WMSInfo.setFormatsSupported(TreeSet<String> formatsSupported) {
        this.formatsSupported = formatsSupported;
    }

    public TreeSet<String> WMSInfo.getCrsSupported() {
        return this.crsSupported;
    }

    public void WMSInfo.setCrsSupported(TreeSet<String> crsSupported) {
        this.crsSupported = crsSupported;
    }

    public String WMSInfo.getServiceUrl() {
        return this.serviceUrl;
    }

    public void WMSInfo.setServiceUrl(String serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    public String WMSInfo.getServiceName() {
        return this.serviceName;
    }

    public void WMSInfo.setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String WMSInfo.getServiceAbstract() {
        return this.serviceAbstract;
    }

    public void WMSInfo.setServiceAbstract(String serviceAbstract) {
        this.serviceAbstract = serviceAbstract;
    }

    public String WMSInfo.getServiceTitle() {
        return this.serviceTitle;
    }

    public void WMSInfo.setServiceTitle(String serviceTitle) {
        this.serviceTitle = serviceTitle;
    }

    public int WMSInfo.getId() {
        return this.id;
    }

    public void WMSInfo.setId(int id) {
        this.id = id;
    }

    public int WMSInfo.getChildrenCount(){
    	return this.childrenCount;
    }

    public void WMSInfo.setChildrenCount(int childrenCount){
    	this.childrenCount = childrenCount;
    }

    public Map<String, WMSLayer> WMSInfo.getLayers() {
        return this.layers;
    }

    public void WMSInfo.setLayers(Map<String, WMSLayer> layers) {
        this.layers = layers;
    }

}
