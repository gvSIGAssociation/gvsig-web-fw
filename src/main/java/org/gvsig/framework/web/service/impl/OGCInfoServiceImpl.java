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

import java.net.URI;
import java.net.URISyntaxException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.gvsig.framework.web.exceptions.ServerGeoException;
import org.gvsig.framework.web.ogc.CSWCriteria;
import org.gvsig.framework.web.ogc.CSWISO19115LangCatalogServiceDriver;
import org.gvsig.framework.web.ogc.CSWResult;
import org.gvsig.framework.web.ogc.CSWSingleResult;
import org.gvsig.framework.web.ogc.WMSInfo;
import org.gvsig.framework.web.ogc.WMSStyle;
import org.gvsig.framework.web.ogc.WMTSInfo;
import org.gvsig.framework.web.service.OGCInfoService;
import org.gvsig.raster.wmts.ogc.WMTSClient;
import org.gvsig.raster.wmts.ogc.WMTSOGCLocator;
import org.gvsig.raster.wmts.ogc.WMTSOGCManager;
import org.gvsig.raster.wmts.ogc.struct.WMTSLayer;
import org.gvsig.raster.wmts.ogc.struct.WMTSServiceIdentification;
import org.gvsig.raster.wmts.ogc.struct.WMTSTheme;
import org.gvsig.raster.wmts.ogc.struct.WMTSThemes;
import org.gvsig.raster.wmts.ogc.struct.WMTSTileMatrixSet;
import org.gvsig.raster.wmts.ogc.struct.WMTSTileMatrixSetLink;
import org.gvsig.remoteclient.wms.WMSClient;
import org.gvsig.remoteclient.wms.WMSLayer;
import org.gvsig.remoteclient.wms.WMSServiceInformation;
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
     * @param serviceWMSStyles
     * @return
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
        Map<String, org.gvsig.framework.web.ogc.WMTSLayer> layersMap = new HashMap<String, org.gvsig.framework.web.ogc.WMTSLayer>();

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
                    if (useCrsSelected) {
                        if (listCrs.contains(supportedCRS)) {
                            tileMatrixSelectedId.add(identifier);
                        }
                    }
                    else {
                        // check supportedCrs with the expReg generated by the
                        // list of
                        // crs passed
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
