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
package org.gvsig.framework.web.service;

import java.net.URISyntaxException;
import java.util.List;
import java.util.TreeSet;

import org.gvsig.catalog.exceptions.NotSupportedVersionException;
import org.gvsig.framework.web.ogc.CSWCriteria;
import org.gvsig.framework.web.ogc.CSWResult;
import org.gvsig.framework.web.ogc.CSWSingleResult;
import org.gvsig.framework.web.ogc.ServiceMetadata;
import org.gvsig.framework.web.ogc.WMSInfo;
import org.gvsig.framework.web.ogc.WMTSInfo;

public interface OGCInfoService {

    /**
     * Generate WMSInfo object that contains the layers and the information of
     * the server wms indicated by urlServerWMS parameter
     *
     * @param urlServerWMS URL to access to WMS server
     * @param crs CRS that must have the layers to add these to the tree
     * @param format Format of the images used to paint the layers
     * @param isCalledByWizard Indicate if the method is called by wizard to get
     *        layers information
     * @return object with information of server WMS
     */
    public WMSInfo getCapabilitiesFromWMS(String urlServerWMS,
            TreeSet<String> crs, String format, boolean isCalledByWizard);

    /**
     * Generate WMSInfo object that contains the layers and the information of
     * the server wmts indicated by urlServerWMTS parameter
     *
     * @param urlServerWMTS URL to access to WMTS server
     * @param crs CRS that must have the layers to add these to the tree
     * @param useCrsSelected Indicate if crs has been selected from user or has
     *        been set by map.
     * @return object with information of server WMTS
     */
    public WMTSInfo getCapabilitiesFromWMTS(String urlServerWMTS,
            TreeSet<String> crs, boolean useCrsSelected);

    /**
     * Get the four coordinates that represent the bounding box which includes
     * all the layers indicated
     *
     * @param urlServer Url of the server to connect and get the data
     * @param typeLayer Type of the layer (wms / wmts)
     * @param crs CRS of the bounding box
     * @param layers List of layers to include in the bounding box calculated
     * @return A list of coordinates that represents the bounding box calculated
     *        (minX, minY, maxX, maxY). null if haven't valid bounding box
     */
    public List<String> getLayersBoundingBox(String urlServer, String typeLayer,
            String crs, TreeSet<String> layers);

    /**
     * Get url of WMS layer legend
     * @param urlServerWMS Url of the server to connect and get the data
     * @param layerId Layer id
     * @param styleName Layer styles
     * @return the url of the legend or empty if not exists or can't be gotten
     */
    public String getWMSLegendUrl(String urlServerWMS, String layerId,
            String stylesName);

    /**
     * Get url of WMTS layer legend
     * @param urlServerWMTS Url of the server to connect and get the data
     * @param layerId Url of the server to connect and get the data
     * @return the url of the legend or empty if not exists or can't be gotten
     */
    public String getWMTSLegendUrl(String urlServerWMTS, String layerId);

    /**
     * Get supported crs of the server wmts indicated by urlServerWMTS parameter
     *
     * @param urlServerWMTS URL to access to WMTS server
     * @return list of supported crs
     */
    public List<String> getCRSSupportedByWMTS(String urlServerWMTS);

    /**
     * Get layer metadata of service WMS
     * @param urlServer Url of the server wms to connect and get the data
     * @return Metadata info of wms server ({@code ServiceMetadata})
     */
    public ServiceMetadata getMetadataInfoFromWMS(String urlServer);

    /**
     * Get layer metadata of service WMTS
     * @param urlServer Url of the server wms to connect and get the data
     * @return Metadata info of wmts server ({@code ServiceMetadata})
     */
    public ServiceMetadata getMetadataInfoFromWMTS(String urlServer);

    /*****************************
     * CSW (Catalog Service Web) *
     *****************************/

    /**
     * Obtains the results of the search performed in the catalog indicated by
     * "cswUrl", using the filter criteria of "cswCriteria". Only supports 2.0.2
     * version.
     * <p/>
     * Criterias:
     * <p/>
     * * language: language catalog. By default english (param value is "eng").
     * If spanish, param value is "spa". See capabilities.
     * <p/>
     * * startAt: must always > 0. By default 1. Indicates the first element.
     * <p/>
     * * title: sets filtering by title.
     * <p/>
     * * abstract_: sets filtering by abstract.
     * <p/>
     * To filter abstract by exact match, the search must be enclosed in double
     * quotes, otherwise filtered by single words. For example, "with quotes"
     * return all searches in the abstract that contains "with" or "quotes".
     * <p/>
     * * dateFrom: sets filtering by date greater than "dateFrom".
     * <p/>
     * * dateTo: sets filtering by date lower than "dateTo".
     * <p/>
     * Results:
     * <p/>
     * * retrievedRecords: returned records. Maximum 10.
     * <p/>
     * * totalRecords: total found records.
     * <p/>
     * * results: list of the obtained results:
     * <p/>
     * Each result contains the following properties in "CSWSingleResult"
     * object:
     * <p/>
     * * fileIdentifier: identifier of the record .
     * <p/>
     * * title: title of the record.
     * <p/>
     * * abstract_ : abstract of the record.
     * <p/>
     * * image: image of the record.
     * <p/>
     * * wmsUrl: first wms url of the record.
     *
     * @param cswUrl url of csw server.
     * @param cswCriteria criterias of search.
     * @return results in CSWResult object. * @throws
     *         NotSupportedVersionException
     * @throws URISyntaxException
     * @throws NullPointerException
     */
    public CSWResult getCswRecords(String cswUrl, CSWCriteria cswCriteria)
            throws NotSupportedVersionException, URISyntaxException,
            NullPointerException;

    /**
     * Obtains the result of the indicated position.
     *
     * @param cswResults the results.
     * @param position the index.
     * @return the result of the indicated position.
     */
    public CSWSingleResult getCswSingleRecord(CSWResult cswResults, int position);

}
