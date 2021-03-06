/*
 * gvSIG Web Framework is sponsored by the General Directorate for Information
 * Technologies (DGTI) of the Regional Ministry of Finance and Public
 * Administration of the Generalitat Valenciana (Valencian Community,
 * Spain), managed by gvSIG Association and led by DISID.
 *
 * Copyright (C) 2015 DGTI - Generalitat Valenciana
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see &lt;http://www.gnu.org/licenses /&gt;.
 *
 */
package org.gvsig.framework.web.service.impl;

import java.awt.geom.Rectangle2D;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;
import java.util.Vector;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.io.Charsets;
import org.apache.commons.lang3.StringUtils;
import org.gvnix.util.fancytree.TreeNode;
import org.gvsig.catalog.CatalogClient;
import org.gvsig.catalog.drivers.DiscoveryServiceCapabilities;
import org.gvsig.catalog.drivers.GetRecordsReply;
import org.gvsig.catalog.exceptions.NotSupportedVersionException;
import org.gvsig.catalog.metadataxml.XMLNode;
import org.gvsig.catalog.querys.CatalogQuery;
import org.gvsig.catalog.schemas.Record;
import org.gvsig.compat.net.ICancellable;
import org.gvsig.framework.web.exceptions.ServerGeoException;
import org.gvsig.framework.web.ogc.CSWCriteria;
import org.gvsig.framework.web.ogc.CSWISO19115LangCatalogServiceDriver;
import org.gvsig.framework.web.ogc.CSWResult;
import org.gvsig.framework.web.ogc.CSWSingleResult;
import org.gvsig.framework.web.ogc.ContactAddressMetadata;
import org.gvsig.framework.web.ogc.ContactMetadata;
import org.gvsig.framework.web.ogc.Layer;
import org.gvsig.framework.web.ogc.OperationsMetadata;
import org.gvsig.framework.web.ogc.ServiceMetadata;
import org.gvsig.framework.web.ogc.WMSInfo;
import org.gvsig.framework.web.ogc.WMSStyle;
import org.gvsig.framework.web.ogc.WMTSInfo;
import org.gvsig.framework.web.service.OGCInfoService;
import org.gvsig.raster.wmts.ogc.WMTSClient;
import org.gvsig.raster.wmts.ogc.WMTSOGCLocator;
import org.gvsig.raster.wmts.ogc.WMTSOGCManager;
import org.gvsig.raster.wmts.ogc.struct.WMTSBoundingBox;
import org.gvsig.raster.wmts.ogc.struct.WMTSLayer;
import org.gvsig.raster.wmts.ogc.struct.WMTSLegendURL;
import org.gvsig.raster.wmts.ogc.struct.WMTSServiceIdentification;
import org.gvsig.raster.wmts.ogc.struct.WMTSServiceProvider;
import org.gvsig.raster.wmts.ogc.struct.WMTSStyle;
import org.gvsig.raster.wmts.ogc.struct.WMTSTheme;
import org.gvsig.raster.wmts.ogc.struct.WMTSThemes;
import org.gvsig.raster.wmts.ogc.struct.WMTSTileMatrixSet;
import org.gvsig.raster.wmts.ogc.struct.WMTSTileMatrixSetLink;
import org.gvsig.remoteclient.utils.BoundaryBox;
import org.gvsig.remoteclient.wms.WMSClient;
import org.gvsig.remoteclient.wms.WMSLayer;
import org.gvsig.remoteclient.wms.WMSServiceInformation;
import org.gvsig.remoteclient.wms.WMSStatus;
import org.gvsig.tools.library.LibrariesInitializer;
import org.gvsig.tools.library.impl.DefaultLibrariesInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class OGCInfoServiceImpl implements OGCInfoService {

    private static final Logger logger = LoggerFactory
            .getLogger(OGCInfoServiceImpl.class);

    // Indicate if services gvSIG are initialized
    private boolean librariesInitialized = false;

    public OGCInfoServiceImpl() {
        LibrariesInitializer libs = new DefaultLibrariesInitializer();
        libs.fullInitialize();
    }

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getCapabilitiesFromWMS(String, String, String, boolean)
     */
    public WMSInfo getCapabilitiesFromWMS(String urlServerWMS,
            TreeSet<String> listCrs, String format, boolean isCalledByWizard)
            throws ServerGeoException {
        WMSInfo wmsInfo = new WMSInfo();
        // put url on object WMSInfo
        wmsInfo.setServiceUrl(urlServerWMS);

        // Create hashmap to add the layers getted to the WMSInfo object
        Map<String, org.gvsig.framework.web.ogc.WMSLayer> layersMap = new HashMap<String, org.gvsig.framework.web.ogc.WMSLayer>();

        // Create conexion with server WMS
        try {
            WMSClient wms = new WMSClient(urlServerWMS);
            wms.connect(null);

            // set server information
            WMSServiceInformation serviceInfo = wms.getServiceInformation();
            wmsInfo.setServiceAbstract(serviceInfo.abstr);
            wmsInfo.setServiceName(serviceInfo.name);
            wmsInfo.setServiceTitle(serviceInfo.title);

            // set id of the request wmsinfo (service name + calendar)
            int hashCode = (serviceInfo.name + Calendar.getInstance())
                    .hashCode();
            wmsInfo.setId(hashCode);

            // get and set version
            String version = wms.getVersion();
            wmsInfo.setVersion(version);

            // get and set formats
            Vector formatVector = wms.getFormats();
            TreeSet<String> formatSet = new TreeSet<String>();
            formatSet.addAll(formatVector);
            wmsInfo.setFormatsSupported(formatSet);
            if (StringUtils.isEmpty(format)) {
                format = getFirstFormatSupported(formatSet);
                wmsInfo.setFormatSelected(format);
            }
            // check format
            if (isCalledByWizard
                    || (!isCalledByWizard && formatVector.contains(format))) {
                wmsInfo.setFormatSelected(format);
                // get root layer
                WMSLayer rootLayer = wms.getRootLayer();
                // get crs (srs) (belong to layer)
                Vector crsVector = rootLayer.getAllSrs();
                // get and set all common crs supported
                TreeSet<String> crsTreeSet = new TreeSet<String>();
                crsTreeSet.addAll(crsVector);
                wmsInfo.setCrsSupported(crsTreeSet);

                // Create tree with layer values
                List<TreeNode> tree = new ArrayList<TreeNode>();

                // Create root node
                ArrayList<WMSLayer> children = rootLayer.getChildren();
                TreeNode rootNode = new TreeNode("rootLayer_"
                        + rootLayer.getName());
                rootNode.setTitle(rootLayer.getTitle());
                if (children.isEmpty()) {
                    rootNode.setFolder(false);
                }
                else {
                    rootNode.setFolder(true);
                    rootNode.setExpanded(true);
                    generateWMSChildrenNodes(children, tree, listCrs, rootNode,
                            layersMap, wmsInfo);
                }

                // Set childrenLayers paramrootLayer.getChildren()
                wmsInfo.setChildrenCount(children.size());

                // Only register the tree if it has a layer with crs defined
                if (rootNode.hasChildren()) {
                    tree.add(rootNode);
                    wmsInfo.setLayersTree(tree);
                }

                TreeSet<String> selCrs = new TreeSet<String>();
                if (listCrs.isEmpty()) {
                    selCrs.addAll(wmsInfo.getCrsSupported());
                }
                else {
                    selCrs.addAll(CollectionUtils.intersection(listCrs,
                            wmsInfo.getCrsSupported()));

                }
                wmsInfo.setCrsSelected(selCrs);

                // Add map that contains info of all layers
                wmsInfo.setLayers(layersMap);
            }
        }
        catch (Exception exc) {
            // Show exception in log and create ServerGeoException which is
            // captured on controller and puts message to ajax response
            logger.error("Exception on getCapabilitiesFromWMS", exc);
            throw new ServerGeoException();
        }

        return wmsInfo;
    }

    /**
     * Get first supported format of the list: png, jpeg, png*, jpeg*
     *
     * @param formatVector List of supported formats by the server
     * @return the supported format
     */
    private String getFirstFormatSupported(TreeSet<String> formatsSupported) {
        String format = null;
        // Get the first format supported that is into the formats (png, jpeg,
        // png*, jpeg*)
        List<String> patternList = new ArrayList<String>();
        patternList.add("image/png");
        patternList.add("image/jpeg");
        patternList.add("image/png(.*)");
        patternList.add("image/jpeg(.*)");

        for (String expReg : patternList) {
            for (String formatToMatch : formatsSupported) {
                if (formatToMatch.matches(expReg)) {
                    format = formatToMatch;
                    break;
                }
            }
            if (format != null) {
                break;
            }
        }

        return format;
    }

    /**
     * Recursive method to add list layers get by the WMSServer into tree list
     *
     * @param children Represents child layers of parentNode
     * @param tree Tree of layers
     * @param crs CRS that must have the layers to add these to the tree
     * @param parentNode Represents parent layer
     * @param layersMap Represents the map that contains the layers obtained
     * @param isCalledByWizard Indicate if the method is called by the wizard
     */
    private void generateWMSChildrenNodes(ArrayList<WMSLayer> children,
            List<TreeNode> tree, TreeSet<String> listCrs, TreeNode parentNode,
            Map<String, org.gvsig.framework.web.ogc.WMSLayer> layersMap,
            WMSInfo wmsInfo) {
        for (WMSLayer layerChild : children) {
            // get crs (srs) (belong to layer)
            Vector crsVector = layerChild.getAllSrs();
            // Only get the layers with have crs parameter or if crs is null
            if (listCrs.isEmpty() || !Collections.disjoint(crsVector, listCrs)) {

                ArrayList<WMSLayer> layerChildChildren = layerChild
                        .getChildren();
                TreeNode layerChildNode = new TreeNode(layerChild.getName());
                layerChildNode.setTitle(layerChild.getTitle());

                // Get the children and their information
                if (layerChildChildren.isEmpty()) {
                    layerChildNode.setFolder(false);

                    // Add layer to layer map
                    org.gvsig.framework.web.ogc.WMSLayer wmsLayer = new org.gvsig.framework.web.ogc.WMSLayer();
                    TreeSet<String> crsSet = new TreeSet<String>();
                    crsSet.addAll(layerChild.getAllSrs());
                    wmsLayer.setCrs(crsSet);
                    List<WMSStyle> wmsStyles = createListWMSStyles(layerChild
                            .getStyles());
                    wmsLayer.setStyles(wmsStyles);
                    wmsLayer.setTitle(layerChild.getTitle());
                    wmsLayer.setName(layerChild.getName());
                    layersMap.put(layerChild.getName(), wmsLayer);

                    // add to wmsinfo the layers supported by this layer
                    TreeSet<String> crsSupported = wmsInfo.getCrsSupported();
                    crsSupported.addAll(layerChild.getAllSrs());
                    wmsInfo.setCrsSupported(crsSupported);

                    //create one child for each crs of the layer
                    if(listCrs.isEmpty() || listCrs.size() > 1){
                        for (String crs : crsSet) {
                            if(StringUtils.isNotEmpty(crs) &&
                                    (listCrs.isEmpty() ||
                                            listCrs.contains(crs))){
                                TreeNode crsNode = new TreeNode(crs);
                                crsNode.setHideCheckbox(true);
                                crsNode.setUnselectable(true);
                                crsNode.setIconclass(" ");
                                layerChildNode.addChild(crsNode);
                            }
                        }
                    }
                }
                else {
                    layerChildNode.setFolder(true);
                    layerChildNode.setExpanded(true);
                    generateWMSChildrenNodes(layerChildChildren, tree, listCrs,
                            layerChildNode, layersMap, wmsInfo);
                }
                parentNode.addChild(layerChildNode);
            }
        }

    }

    /**
     * Get the styles of the layer returned by the service and generate a list
     * that contains important information of these styles inside our object
     * WMSStyle
     *
     * @param serviceWMSStyles List of styles id
     * @return List of objects WMSSTyle, one by each style id of the parameter
     *         serviceWMSStyles
     */
    private List<WMSStyle> createListWMSStyles(ArrayList serviceWMSStyles) {
        List<WMSStyle> styles = new ArrayList<WMSStyle>();
        for (int i = 0; i < serviceWMSStyles.size(); i++) {
            org.gvsig.remoteclient.wms.WMSStyle serviceWMSStyle = (org.gvsig.remoteclient.wms.WMSStyle) serviceWMSStyles
                    .get(i);
            WMSStyle sty = new WMSStyle();
            sty.setName(serviceWMSStyle.getName());
            sty.setStyleAbstract(serviceWMSStyle.getAbstract());
            sty.setTitle(serviceWMSStyle.getTitle());
            styles.add(sty);
        }
        return styles;

    }

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getCapabilitiesFromWMTS(String, String, boolean)
     */
    public WMTSInfo getCapabilitiesFromWMTS(String urlServerWMTS,
            TreeSet<String> listCrs, boolean useCrsSelected)
            throws ServerGeoException {

        TreeSet<String> formatsSupported = new TreeSet<String>();
        TreeSet<String> crsSupported = new TreeSet<String>();
        boolean isFormatsSupported = false;

        WMTSInfo wmtsInfo = new WMTSInfo();
        // put url on object WMSInfo
        wmtsInfo.setServiceUrl(urlServerWMTS);

        // Create hashmap to add the layers getted to the WMTSInfo object
        Map<String, org.gvsig.framework.web.ogc.WMTSLayer> layersMap =
                new HashMap<String, org.gvsig.framework.web.ogc.WMTSLayer>();

        // get WMTS manager
        WMTSOGCManager wmtsMan = WMTSOGCLocator.getManager();

        try {
            WMTSClient wmtsClient = wmtsMan.createWMTSClient(urlServerWMTS);
            wmtsClient.connect(true, null);

            WMTSServiceIdentification wmtsServIden = wmtsClient
                    .getServiceIdentification();

            // set server info
            wmtsInfo.setServiceAbstract(wmtsServIden.getAbstract());
            wmtsInfo.setServiceTitle(wmtsServIden.getTitle());
            wmtsInfo.setVersion(wmtsServIden.getServiceTypeVersion());
            wmtsInfo.setServiceType(wmtsServIden.getServiceType());

            // set id of the request wmst (service title + calendar)
            int hashCode = (wmtsServIden.getTitle() + Calendar.getInstance())
                    .hashCode();
            wmtsInfo.setId(hashCode);

            // set tile matrix and check if has support to crs of the map
            List<String> patternList = new ArrayList<String>();
            if (!listCrs.isEmpty()) {
                for (String crs : listCrs) {
                    String[] crsSplit = crs.split(":");
                    String pattern = "(.*)(:?)".concat(crsSplit[0])
                            .concat("((:)(.*)(:)").concat(crsSplit[1])
                            .concat("|(:)").concat(crsSplit[1]).concat(")");
                    patternList.add(pattern);
                }
            }

            // hashmap with: identifier of tile matrix, supported crs
            Map<String, String> tileMatrixCrsSupported = new HashMap<String, String>();
            TreeSet<String> tileMatrixSelectedId = new TreeSet<String>();
            List<WMTSTileMatrixSet> tileMatrixSet = wmtsClient
                    .getTileMatrixSet();
            for (int i = 0; i < tileMatrixSet.size(); i++) {
                WMTSTileMatrixSet tileMatrix = tileMatrixSet.get(i);
                String identifier = tileMatrix.getIdentifier();
                String supportedCRS = tileMatrix.getSupportedCRS();
                crsSupported.add(supportedCRS);
                // add to map the tile matrix with its crs supported
                tileMatrixCrsSupported.put(identifier, supportedCRS);
                if (!listCrs.isEmpty()) {
                    if(listCrs.contains(supportedCRS)){
                        tileMatrixSelectedId.add(identifier);
                    }
                    else {
                        // check supportedCrs with the expReg generated by the
                        // list of crs passed
                        for (String expReg : patternList) {
                            if (supportedCRS.matches(expReg)) {
                                tileMatrixSelectedId.add(identifier);
                            }
                        }
                    }
                }
            }
            // Add map of tile matrix and the tile matrix selected to WMTSInfo
            // object
            wmtsInfo.setTileMatrixCrsSupported(tileMatrixCrsSupported);
            wmtsInfo.setTileMatrixSelectedId(tileMatrixSelectedId);

            // Only set layers if has a tile matrix with crs of the map
            // supported
            // or crs is null
            WMTSThemes layerListAsThemes = wmtsClient.getLayerListAsThemes();
            // Create tree with layer values
            List<TreeNode> tree = new ArrayList<TreeNode>();

            // Create children layers
            for (int i = 0; i < layerListAsThemes.getChildCount(); i++) {
                WMTSTheme wmtsTheme = layerListAsThemes.getChildren(i);
                WMTSLayer layer = wmtsTheme.getLayer();
                TreeSet<String> wmtsLinkSelected = new TreeSet<String>();
                TreeSet<String> wmtsLinkSupported = new TreeSet<String>();
                // check crs
                List<WMTSTileMatrixSetLink> tileMatrixSetLink = layer
                        .getTileMatrixSetLink();
                for (int j = 0; j < tileMatrixSetLink.size(); j++) {
                    WMTSTileMatrixSetLink wmtsLink = tileMatrixSetLink.get(j);
                    wmtsLinkSupported.add(wmtsLink.getTileMatrixSetId());
                    if (!tileMatrixSelectedId.isEmpty()
                            && tileMatrixSelectedId.contains(wmtsLink
                                    .getTileMatrixSetId())) {
                        wmtsLinkSelected.add(wmtsLink.getTileMatrixSetId());
                    }
                }
                // check format
                TreeSet<String> setFormats = new TreeSet<String>();
                setFormats.addAll(layer.getFormat());
                String format = getFirstFormatSupported(setFormats);
                formatsSupported.addAll(setFormats);
                if ((!wmtsLinkSelected.isEmpty() || listCrs.isEmpty())
                        && format != null) {
                    isFormatsSupported = true;
                    TreeNode node = new TreeNode(layer.getIdentifier());
                    node.setTitle(layer.getTitle());
                    node.setFolder(false);
                    tree.add(node);

                    // Add layer to layer map
                    org.gvsig.framework.web.ogc.WMTSLayer wmtsLayer = new org.gvsig.framework.web.ogc.WMTSLayer();
                    TreeSet<String> crsSet = new TreeSet<String>();
                    crsSet.addAll(layer.getSrsList());
                    wmtsLayer.setCrs(crsSet);
                    wmtsLayer.setName(layer.getIdentifier());
                    wmtsLayer.setTitle(layer.getTitle());
                    wmtsLayer.setFormatSelected(format);
                    wmtsLayer.setFormatsSupported(setFormats);
                    if (listCrs.isEmpty()) {
                        wmtsLayer.setTileMatrixSelected(wmtsLinkSupported);
                    }
                    else {
                        wmtsLayer.setTileMatrixSelected(wmtsLinkSelected);
                    }
                    layersMap.put(layer.getIdentifier(), wmtsLayer);
                }
            }
            wmtsInfo.setFormatsSupported(formatsSupported);
            wmtsInfo.setLayersTree(tree);
            wmtsInfo.setLayers(layersMap);
            wmtsInfo.setIsFormatsSupported(isFormatsSupported);
            wmtsInfo.setCrsSupported(crsSupported);
        }
        catch (Exception exc) {
            logger.error("Exception on getCapabilitiesFromWMS", exc);
            throw new ServerGeoException();
        }

        return wmtsInfo;
    }

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getCapabilitiesFromWMTS(String, String)
     */
    public List<String> getCRSSupportedByWMTS(String urlServerWMTS)
            throws ServerGeoException {

        // Check if services gvSIG are initialized
        if (!librariesInitialized) {
            LibrariesInitializer libs = new DefaultLibrariesInitializer();
            libs.fullInitialize();
            librariesInitialized = true;
        }

        // get WMTS manager
        WMTSOGCManager wmtsMan = WMTSOGCLocator.getManager();

        try {
            WMTSClient wmtsClient = wmtsMan.createWMTSClient(urlServerWMTS);
            wmtsClient.connect(true, null);

            List<String> crsSupported = new ArrayList<String>();
            List<WMTSTileMatrixSet> tileMatrixSet = wmtsClient
                    .getTileMatrixSet();
            for (int i = 0; i < tileMatrixSet.size(); i++) {
                WMTSTileMatrixSet tileMatrix = tileMatrixSet.get(i);
                crsSupported.add(tileMatrix.getSupportedCRS());
            }
            return crsSupported;
        }
        catch (Exception exc) {
            logger.error("Exception on getCRSSupportedByWMTS", exc);
            throw new ServerGeoException();
        }
    }

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getLayersBoundingBox(String, String, TreeSet<String>)
     */
    public List<String> getLayersBoundingBox(String urlServer, String typeLayer,
            String crs, TreeSet<String> layers) {
        List<String> boundingBox = null;
        if("wms".equalsIgnoreCase(typeLayer)){
            boundingBox = getWMSLayersBoundingBox(urlServer, crs, layers);
        }else{
            if("wmts".equalsIgnoreCase(typeLayer)){
                // in wmts only have one layer
                boundingBox = getWMTSLayersBoundingBox(urlServer, crs, layers.first());
            }
        }
        return boundingBox;
    }


    /**
     * Get the four coordinates that represent the bounding box
     * which includes all the layers indicated for a WMS Server
     *
     * @param urlServer Url of the WMS server to connect and get the data
     * @param crs CRS of the bounding box
     * @param layers List of layers to include in the bounding box calculated
     * @return A list of coordinates that represents the bounding box calculated
     *         (minX, minY, maxX, maxY). null if haven't valid bounding box
     */
    private List<String> getWMSLayersBoundingBox(String urlServer,
            String crs, TreeSet<String> layers) {
        List<String> boundingBox = new ArrayList<String>();
        double xMax = 0;
        double xMin = 0;
        double yMin = 0;
        double yMax = 0;
        BoundaryBox bbox = null;
        try {
            WMSClient wms = new WMSClient(urlServer);
            wms.connect(null);
            if(layers != null){
                Iterator<String> iterLayers = layers.iterator();
                // get the first element
                WMSLayer layer = wms.getLayer(iterLayers.next());
                if(layer != null){
                    bbox = layer.getBbox(crs);
                    if(bbox != null){
                        xMax = bbox.getXmax();
                        yMax = bbox.getYmax();
                        xMin = bbox.getXmin();
                        yMin = bbox.getYmin();
                    }
                }
                while(iterLayers.hasNext()){
                    layer = wms.getLayer(iterLayers.next());
                    bbox = layer.getBbox(crs);
                    if(bbox != null){
                        // if getXmax is greater than xMax
                        if (Double.compare(xMax, bbox.getXmax()) < 0){
                            xMax = bbox.getXmax();
                        }
                        // if getYmax is greater than yMax
                        if (Double.compare(yMax, bbox.getYmax()) < 0){
                            yMax = bbox.getYmax();
                        }
                        // if getXmin is less than xMin
                        if (Double.compare(xMin, bbox.getXmin()) > 0){
                            xMin = bbox.getXmin();
                        }
                        // if getYmin is less than yMin
                        if (Double.compare(yMin, bbox.getYmin()) > 0){
                            yMin = bbox.getYmin();
                        }
                    }
                }
                if(bbox != null){
                    boundingBox.add(String.valueOf(xMin));
                    boundingBox.add(String.valueOf(yMin));
                    boundingBox.add(String.valueOf(xMax));
                    boundingBox.add(String.valueOf(yMax));
                }
            }
        }
        catch (Exception exc) {
            // Show exception in log and create ServerGeoException which is
            // captured on controller and puts message to ajax response
            logger.error("Exception on getWMSLayersBoundingBox", exc);
            throw new ServerGeoException();
        }
        return boundingBox;
    }

    /**
     * {@inheritDoc}}
     */
    @Override
    public String getFeatureInfoFromWMS(String urlServer, String crs,
          Vector<String> layers, Vector<String> styles, int x, int y,
          int height, int width, List<String> bounds) {
      String featureInfo = null;

      Float xmin = new Float(Float.parseFloat(bounds.get(0)));
      Float ymin = new Float(Float.parseFloat(bounds.get(1)));
      Float xmax = new Float(Float.parseFloat(bounds.get(2)));
      Float ymax = new Float(Float.parseFloat(bounds.get(3)));

      Rectangle2D.Float extent = new Rectangle2D.Float();
      extent.setFrameFromDiagonal(xmin, ymin, xmax, ymax);

      WMSStatus status = new WMSStatus();
      status.setSrs(crs);
      status.setStyles(styles);
      status.setLayerNames(layers);
      status.setOnlineResource(urlServer);
      status.setExtent(extent);
      status.setHeight(height);
      status.setWidth(width);
      status.setInfoFormat("text/html");
      status.setExceptionFormat("text/plain");

      try {
        WMSClient wms = new WMSClient(urlServer);
        wms.connect(null);

        featureInfo = wms.getFeatureInfo(status, x, y, 0, null);

      }catch (Exception exc) {
          // Show exception in log
          logger.error("Exception on getFeatureInfoFromWMS", exc);
          throw new ServerGeoException();
      }
      return featureInfo;
    }

    /**
     * Get the four coordinates that represent the bounding box
     * which includes all the layers indicated for a WMTS Server
     *
     * @param urlServer Url of the WMTS server to connect and get the data
     * @param crs CRS of the bounding box
     * @param layers List of layers to include in the bounding box calculated
     * @return A list of coordinates that represents the bounding box calculated
     *         (minX, minY, maxX, maxY). null if haven't valid bounding box
     */
    private List<String> getWMTSLayersBoundingBox(String urlServer,
            String crs, String layerId) {
        List<String> boundingBox = new ArrayList<String>();
        WMTSBoundingBox bBox = null;
        String[] crsSplit = crs.split(":");
        String regExpCrs = "(.*)(:?)".concat(crsSplit[0])
                .concat("((:)(.*)(:)").concat(crsSplit[1])
                .concat("|(:)").concat(crsSplit[1]).concat(")");
        try {
            // get WMTS manager
            WMTSOGCManager wmtsMan = WMTSOGCLocator.getManager();
            WMTSClient wmtsClient = wmtsMan.createWMTSClient(urlServer);
            wmtsClient.connect(true, null);
            if(StringUtils.isNotEmpty(layerId)){
                WMTSLayer layer = getLayerWMTSById(wmtsClient, layerId);
                if(layer != null){
                    // TODO
                    // Need a list of bounding box of the layer
                    // to calculate which is the most appropiate
                    // WMTSBoundingBox bBox = layer.getBBox();
                    List<WMTSTileMatrixSetLink> tileMatrixSetLink =
                            layer.getTileMatrixSetLink();
                    Iterator<WMTSTileMatrixSetLink> itTileMatrix =
                            tileMatrixSetLink.iterator();
                    while(itTileMatrix.hasNext()){
                        WMTSTileMatrixSetLink wmtsTileMatrixSetLink =
                                itTileMatrix.next();
                        WMTSTileMatrixSet tileMatrixSet =
                                wmtsTileMatrixSetLink.getTileMatrixSet();
                        String supportedCRS = tileMatrixSet.getSupportedCRS();
                        if(supportedCRS.equals(crs) ||
                                supportedCRS.matches(regExpCrs)){
                            bBox = tileMatrixSet.getBoundingBox();
                            break;
                        }

                    }
                    if(bBox != null){
                        double[] lowerCorner = bBox.getLowerCorner();
                        double[] upperCorner = bBox.getUpperCorner();

                        boundingBox.add(String.valueOf(lowerCorner[0]));
                        boundingBox.add(String.valueOf(lowerCorner[1]));
                        boundingBox.add(String.valueOf(upperCorner[0]));
                        boundingBox.add(String.valueOf(upperCorner[1]));
                    }
                }
            }
        }
        catch (Exception exc) {
            logger.error("Exception on getWMTSLayersBoundingBox", exc);
            throw new ServerGeoException();
        }
        return boundingBox;

    }

    /**
     * Get WMTSLayer by id
     *
     * @param wmtsClient Client that represents the server to search the layer
     * @param layerId Id of the layer
     * @return Object WMTSLayer that represents the layer with the id of the
     *         parameter layerId. null if doesn't find the layer.
     */
    private WMTSLayer getLayerWMTSById(WMTSClient wmtsClient, String layerId){
        // Get list of layers and check them by identifier
        WMTSThemes layerListAsThemes = wmtsClient.getLayerListAsThemes();
        for (int i = 0; i < layerListAsThemes.getChildCount(); i++) {
            WMTSTheme wmtsTheme = layerListAsThemes.getChildren(i);
            WMTSLayer layerAux = wmtsTheme.getLayer();
            if(layerAux.getIdentifier().equals(layerId)){
                return layerAux;
            }
        }
        return null;
    }

    public String getWMSLegendUrl(String urlServerWMS, String layerId,
            String stylesName){
        String legendUrl = "";
        org.gvsig.remoteclient.wms.WMSStyle layerStyle = null;
        org.gvsig.remoteclient.wms.WMSStyle layerStyleDefault = null;
        // Create conexion with server WMS
        try {
            WMSClient wms = new WMSClient(urlServerWMS);
            wms.connect(null);
            WMSLayer layer = wms.getLayer(layerId);
            if(layer != null){
                List<org.gvsig.remoteclient.wms.WMSStyle> lstStyles =
                        layer.getStyles();
                if(StringUtils.isNotEmpty(stylesName)){
                    List<String> styList = Arrays.asList(stylesName.split(","));
                    for(org.gvsig.remoteclient.wms.WMSStyle wmsStyle : lstStyles){
                        // default not
                        if(styList.contains(wmsStyle.getName()) &&
                                wmsStyle.getName().toLowerCase() != "default"){
                                layerStyle = wmsStyle;
                                break;
                        }else{
                            if(wmsStyle.getName().toLowerCase() == "default"){
                                layerStyleDefault = wmsStyle;
                            }
                        }
                    }
                    // if layer style isn't defined on parameter, set default style
                    // or the first
                    if(layerStyle == null){
                        if(layerStyleDefault == null && !lstStyles.isEmpty()){
                            layerStyle = lstStyles.get(0);
                        }else{
                            layerStyle = layerStyleDefault;
                        }
                    }
                }else{
                    // if haven't styles, get the first
                    if(!lstStyles.isEmpty()){
                        layerStyle = lstStyles.get(0);
                    }
                }
                if(layerStyle != null){
                    legendUrl = layerStyle.getLegendURLOnlineResourceHRef();
                }
            }
        }catch (Exception exc) {
            // Show exception in log
            logger.error("Exception on getWMSLegendUrl", exc);
        }
        return legendUrl;
    }


    public String getWMTSLegendUrl(String urlServerWMTS, String layerId){
        String legendUrl = "";
        // Create conexion with server WMS
        try {
            // get WMTS manager
            WMTSOGCManager wmtsMan = WMTSOGCLocator.getManager();
            WMTSClient wmtsClient = wmtsMan.createWMTSClient(urlServerWMTS);
            wmtsClient.connect(true, null);

            WMTSLayer layer = getLayerWMTSById(wmtsClient, layerId);
            if(layer != null){
                List<WMTSStyle> lstStyles = layer.getStyle();
                for(WMTSStyle wmtsStyle : lstStyles){
                    if(wmtsStyle.isDefault()){
                        WMTSLegendURL wmtsLegendURL = wmtsStyle.getLegendURL();
                        legendUrl = wmtsLegendURL.getHref();
                    }
                }
                if(StringUtils.isEmpty(legendUrl) && !lstStyles.isEmpty()){
                    WMTSLegendURL wmtsLegendURL = lstStyles.get(0).getLegendURL();
                    legendUrl = wmtsLegendURL.getHref();
                }
            }
        }catch (Exception exc) {
            // Show exception in log
            logger.error("Exception on getWMTSLegendUrl", exc);
        }
        return legendUrl;
    }

    public ServiceMetadata getMetadataInfoFromWMS(String urlServer){

        ServiceMetadata servMetadata = new ServiceMetadata();

        try {
            WMSClient wms = new WMSClient(urlServer);
            wms.connect(null);

            // set server information
            WMSServiceInformation serviceInfo = wms.getServiceInformation();

            servMetadata.setAbstractStr(serviceInfo.abstr);
            servMetadata.setFees(serviceInfo.fees);
            servMetadata.setKeywords(serviceInfo.keywords);
            servMetadata.setName(serviceInfo.name);
            servMetadata.setTitle(serviceInfo.title);
            servMetadata.setUrl(urlServer);
            servMetadata.setVersion(serviceInfo.version);
            // I can't get from service the accessConstraints value
            //servMetadata.setAccessConstraints(accessConstraints);

            // get layers
            TreeMap layers = wms.getLayers();
            if(layers != null){
                List<Layer> lstLayers = new ArrayList<Layer>();
                Set<String> keys = layers.keySet();
                for(String key: keys){
                    WMSLayer wmsLayer = (WMSLayer)layers.get(key);
                    Layer layer = new Layer();
                    layer.setName(wmsLayer.getName());
                    layer.setTitle(wmsLayer.getTitle());
                    lstLayers.add(layer);
                }
                servMetadata.setLayers(lstLayers);
            }

            // get operations
            Hashtable supportedOperations = serviceInfo.getSupportedOperationsByName();
            if(supportedOperations != null){
                List<OperationsMetadata> lstOperations = new ArrayList<OperationsMetadata>();
                Set<String> keys = supportedOperations.keySet();
                for(String key: keys){
                    OperationsMetadata opMetadata = new OperationsMetadata();
                    opMetadata.setName(key);
                    opMetadata.setUrl((String) supportedOperations.get(key));
                    lstOperations.add(opMetadata);
                }
                servMetadata.setOperations(lstOperations);
            }
            // get contact address
            ContactAddressMetadata contactAddress = null;
            if(StringUtils.isNotEmpty(serviceInfo.address) ||
                    StringUtils.isNotEmpty(serviceInfo.addresstype) ||
                    StringUtils.isNotEmpty(serviceInfo.place) ||
                    StringUtils.isNotEmpty(serviceInfo.country) ||
                    StringUtils.isNotEmpty(serviceInfo.postcode) ||
                    StringUtils.isNotEmpty(serviceInfo.province)
                    ){
                contactAddress = new ContactAddressMetadata();
                contactAddress.setAddress(serviceInfo.address);
                contactAddress.setAddressType(serviceInfo.addresstype);
                contactAddress.setCity(serviceInfo.place);
                contactAddress.setCountry(serviceInfo.country);
                contactAddress.setPostCode(serviceInfo.postcode);
                contactAddress.setStateProvince(serviceInfo.province);
            }

            // get contact info
            ContactMetadata contactMetadata = null;
            if(contactAddress != null ||
                    StringUtils.isNotEmpty(serviceInfo.email) ||
                    StringUtils.isNotEmpty(serviceInfo.fax) ||
                    StringUtils.isNotEmpty(serviceInfo.organization) ||
                    StringUtils.isNotEmpty(serviceInfo.personname) ||
                    StringUtils.isNotEmpty(serviceInfo.function) ||
                    StringUtils.isNotEmpty(serviceInfo.phone)
                    ){
                contactMetadata = new ContactMetadata();
                contactMetadata.setContactAddress(contactAddress);
                contactMetadata.setEmail(serviceInfo.email);
                contactMetadata.setFax(serviceInfo.fax);
                contactMetadata.setOrganization(serviceInfo.organization);
                contactMetadata.setPerson(serviceInfo.personname);
                contactMetadata.setPosition(serviceInfo.function);
                contactMetadata.setTelephone(serviceInfo.phone);
            }
            servMetadata.setContact(contactMetadata);

        }
        catch (Exception exc) {
            // Show exception in log
            logger.error("Exception on getMetadataInfoFromWMS", exc);
            throw new ServerGeoException();
        }

        return servMetadata;
    }


    public ServiceMetadata getMetadataInfoFromWMTS(String urlServer){

        ServiceMetadata servMetadata = new ServiceMetadata();

        try {
            // get WMTS manager
            WMTSOGCManager wmtsMan = WMTSOGCLocator.getManager();

            WMTSClient wmtsClient = wmtsMan.createWMTSClient(urlServer);
            wmtsClient.connect(true, null);

            WMTSServiceIdentification wmtsServIden = wmtsClient
                    .getServiceIdentification();

            servMetadata.setUrl(urlServer);
            servMetadata.setName(wmtsServIden.getServiceType());
            servMetadata.setAbstractStr(wmtsServIden.getAbstract());
            servMetadata.setAccessConstraints(wmtsServIden.getAccessConstraints());
            servMetadata.setFees(wmtsServIden.getFees());
            servMetadata.setKeywords(StringUtils.join(wmtsServIden.getKeywords(), ','));
            servMetadata.setVersion(wmtsServIden.getServiceTypeVersion());
            servMetadata.setTitle(wmtsServIden.getTitle());


            // get contact info
            WMTSServiceProvider serviceProvider = wmtsClient.getServiceProvider();

            ContactMetadata contact = null;
            // TODO I can't get all the info of contact and contact address
            if(StringUtils.isNotEmpty(serviceProvider.getServiceContact()) ||
                    StringUtils.isNotEmpty(serviceProvider.getProviderName())
                    ){
                contact = new ContactMetadata();
                contact.setPerson(serviceProvider.getServiceContact());
                contact.setOrganization(serviceProvider.getProviderName());
            }
            servMetadata.setContact(contact);

            // get layers
            List<Layer> lstLayers = null;
            WMTSThemes layerListAsThemes = wmtsClient.getLayerListAsThemes();
            if(layerListAsThemes  != null &&
                    layerListAsThemes.getChildCount() > 0){
                lstLayers = new ArrayList<Layer>();
                for (int i = 0; i < layerListAsThemes.getChildCount(); i++) {
                    WMTSTheme wmtsTheme = layerListAsThemes.getChildren(i);
                    WMTSLayer wmtsLayer = wmtsTheme.getLayer();
                    Layer layer = new Layer();
                    layer.setName(wmtsLayer.getIdentifier());
                    layer.setTitle(wmtsLayer.getTitle());
                    lstLayers.add(layer);
                }
            }
            servMetadata.setLayers(lstLayers);

        }
        catch (Exception exc) {
            // Show exception in log
            logger.error("Exception on getMetadataInfoFromWMTS", exc);
            throw new ServerGeoException();
        }

        return servMetadata;
    }

    /*******
     * CSW *
     *******/

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getCswSingleRecord(CSWResult, int)
     */
    public CSWSingleResult getCswSingleRecord(CSWResult cswResults, int position) {

        List<CSWSingleResult> results = cswResults.getResults();
        results.get(position);

        return results.get(position);
    }

    /*
     * (non-Javadoc)
     * @see es.gva.dgti.gvgeoportal.service.ogc.OGCInfoService
     * #getCswRecords(String, CSWCriteria)
     */
    public CSWResult getCswRecords(String cswUrl, CSWCriteria cswCriteria)
            throws NotSupportedVersionException, URISyntaxException,
            NullPointerException {
        // Check if services gvSIG are initialized
        if (!librariesInitialized) {
            LibrariesInitializer libs = new DefaultLibrariesInitializer();
            libs.fullInitialize();
            librariesInitialized = true;
        }

        URI uri = null;
        CSWResult cswResults = new CSWResult();
        uri = new URI(cswUrl);
        // Creates driver "CSW/ISO 19115"
        CSWISO19115LangCatalogServiceDriver iCatalogServiceDriver = new CSWISO19115LangCatalogServiceDriver();
        @SuppressWarnings("unused")
        DiscoveryServiceCapabilities getCapabilities = iCatalogServiceDriver
                .getCapabilities(uri, "spa");

        CatalogClient catalogClient = new CatalogClient(cswUrl, null,
                iCatalogServiceDriver);

        // Query
        CatalogQuery query = catalogClient.createNewQuery();
        String title = cswCriteria.getTitle();
        if (title != null && !title.isEmpty()) {
            query.setTitle(title);
        }
        String abstract_ = cswCriteria.getAbstract_();
        if (abstract_ != null && !abstract_.isEmpty()) {
            query.setAbstract(abstract_);
        }
        // The dates must have the following format: "yyyy-MM-dd"
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        Calendar dateFrom = cswCriteria.getDateFrom();
        if (dateFrom != null) {
            String dateFromString = sdf.format(dateFrom.getTime());
            query.setDateFrom(dateFromString);
        }
        Calendar dateTo = cswCriteria.getDateTo();
        if (dateTo != null) {
            String dateToString = sdf.format(dateTo.getTime());
            query.setDateTo(dateToString);
        }

        // Executed query
        int startAt;
        if (cswCriteria.getStartAt() <= 0) {
            startAt = 1;
        }
        else {
            startAt = cswCriteria.getStartAt();
        }
        GetRecordsReply records = iCatalogServiceDriver.getRecords(uri, query,
                startAt);

        // Returned results.
        // Returned records. Maximum 10.
        int retrievedRecords = records.getRetrievedRecordsNumber();
        cswResults.setRetrievedRecords(retrievedRecords);
        // Total found records.
        cswResults.setTotalRecords(records.getRecordsNumber());
        logger.debug(cswResults.toString());

        // For every result returns title, abstract, image and first wms url in
        // UTF-8.
        int index = 0;
        if (retrievedRecords != 0) {
            List<CSWSingleResult> cswSingleRecordList = cswResults.getResults();
            while (index < retrievedRecords) {
                Record record = records.getRecordAt(index);
                CSWSingleResult cswSingleResult = new CSWSingleResult();

                // Returned title
                String returnedTitle = record.getTitle();
                if (returnedTitle != null) {
                    String titleUtf8 = new String(
                            returnedTitle.getBytes(Charsets.ISO_8859_1),
                            Charsets.UTF_8);
                    cswSingleResult.setTitle(titleUtf8);
                }

                // Returned abstract
                String returnedAbstract = record.getAbstract_();
                if (returnedAbstract != null) {
                    String abstract_Utf8 = new String(
                            returnedAbstract.getBytes(Charsets.ISO_8859_1),
                            Charsets.UTF_8);
                    cswSingleResult.setAbstract_(abstract_Utf8);
                }

                XMLNode node = record.getNode();

                // Returned file identifier
                XMLNode fileIdentifierNode = node
                        .searchNode("fileIdentifier->CharacterString");
                if (fileIdentifierNode != null
                        && fileIdentifierNode.getText() != null) {
                    String fileIdentifierUtf8 = new String(fileIdentifierNode
                            .getText().getBytes(Charsets.ISO_8859_1),
                            Charsets.UTF_8);
                    cswSingleResult.setFileIdentifier(fileIdentifierUtf8);
                }

                // Returned image
                XMLNode imageNode = node
                        .searchNode("identificationInfo->SV_ServiceIdentification->graphicOverview->MD_BrowseGraphic->fileName->CharacterString");
                if (imageNode != null && imageNode.getText() != null) {
                    String imageUtf8 = new String(imageNode.getText().getBytes(
                            Charsets.ISO_8859_1), Charsets.UTF_8);
                    cswSingleResult.setImage(imageUtf8);
                }
                else {
                    imageNode = node
                            .searchNode("identificationInfo->MD_DataIdentification->graphicOverview->MD_BrowseGraphic->fileName->CharacterString");
                    if (imageNode != null && imageNode.getText() != null) {
                        String imageUtf8 = new String(imageNode.getText()
                                .getBytes(Charsets.ISO_8859_1), Charsets.UTF_8);
                        cswSingleResult.setImage(imageUtf8);
                    }
                }

                // Returned first wms or wmts url
                XMLNode[] urlNodes = node
                        .searchMultipleNode("distributionInfo->MD_Distribution->transferOptions->MD_DigitalTransferOptions->onLine->CI_OnlineResource");
                boolean containsServiceUrl = false;
                int i = 0;
                while (i < urlNodes.length && !containsServiceUrl) {
                    XMLNode xmlNode = urlNodes[i];
                    i = i + 1;
                    XMLNode protocolNode = xmlNode
                            .searchNode("protocol->CharacterString");
                    XMLNode urlNode = xmlNode.searchNode("linkage->URL");
                    String urlUtf8 = null;
                    if (urlNode != null && urlNode.getText() != null) {
                        urlUtf8 = new String(urlNode.getText().getBytes(
                                Charsets.ISO_8859_1), Charsets.UTF_8);
                    }
                    if (protocolNode != null && protocolNode.getText() != null) {
                        String protocolUtf8 = new String(protocolNode.getText()
                                .getBytes(Charsets.ISO_8859_1), Charsets.UTF_8);
                        if ((protocolUtf8.toLowerCase()).contains("ogc:wms")) {
                            containsServiceUrl = true;
                            cswSingleResult.setServiceUrl(urlUtf8);
                            cswSingleResult.setServiceType("wms");
                        }
                    }
                    else if (urlUtf8 != null
                            && (urlUtf8.toLowerCase()).contains("service=wms")) {
                        containsServiceUrl = true;
                        String[] parts = urlUtf8.split("\\?");
                        String part1 = parts[0];
                        if (part1 != null && !part1.isEmpty()) {
                            cswSingleResult.setServiceUrl(part1);
                        }
                        else {
                            cswSingleResult.setServiceUrl(urlUtf8);
                        }
                        cswSingleResult.setServiceType("wms");
                    }
                    else if (urlUtf8 != null
                            && (urlUtf8.toLowerCase()).contains("service=wmts")) {
                        containsServiceUrl = true;
                        String[] parts = urlUtf8.split("\\?");
                        String part1 = parts[0];
                        if (part1 != null && !part1.isEmpty()) {
                            cswSingleResult.setServiceUrl(part1);
                        }
                        else {
                            cswSingleResult.setServiceUrl(urlUtf8);
                        }
                        cswSingleResult.setServiceType("wmts");
                    }
                }

                cswSingleRecordList.add(cswSingleResult);
                logger.debug("Data " + index + ":: "
                        + cswSingleResult.toString());

                index = index + 1;
            }
        }
        return cswResults;
    }
}
