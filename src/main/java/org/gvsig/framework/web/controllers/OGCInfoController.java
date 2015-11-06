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
package org.gvsig.framework.web.controllers;

import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.gvsig.framework.web.exceptions.ServerGeoException;
import org.gvsig.framework.web.ogc.WMSInfo;
import org.gvsig.framework.web.ogc.WMTSInfo;
import org.gvsig.framework.web.service.OGCInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.WebRequest;

@RequestMapping("/ogcinfo")
@Controller
public class OGCInfoController {

    @Autowired
    OGCInfoService ogcInfoServ;

    @Autowired
    private ReloadableResourceBundleMessageSource messageSource;

    private static final String SERVER_ERROR_CODE = "error_get_layers_from_server";

    /**
     * Get information and layers of WMS server indicated by url parameter
     *
     * @param request the {@code HttpServletRequest}.
     * @return ResponseEntity with wmsInfo
     */
    @RequestMapping(params = "findWmsCapabilities",
            headers = "Accept=application/json",
            produces = { "application/json; charset=UTF-8" })
    @ResponseBody
    public ResponseEntity<WMSInfo> findWmsCapabilitiesByAjax(WebRequest request) {
        String urlServer = request.getParameter("url");
        String format = request.getParameter("format");
        boolean isCalledByWizard = Boolean.parseBoolean(request
                .getParameter("wizard"));
        WMSInfo wmsInfo = null;
        String crsParam = request.getParameter("crs");

        TreeSet<String> listCrs = new TreeSet<String>();
        if (StringUtils.isNotEmpty(crsParam)) {
            Collections.addAll(listCrs, crsParam.split(","));
        }
        if (StringUtils.isNotEmpty(urlServer)) {
            wmsInfo = ogcInfoServ.getCapabilitiesFromWMS(urlServer, listCrs,
                    format, isCalledByWizard);
        }
        return new ResponseEntity<WMSInfo>(wmsInfo, HttpStatus.OK);
    }

    /**
     * Get information and layers of WMTS server indicated by url parameter
     *
     * @param request the {@code HttpServletRequest}.
     * @return ResponseEntity with wmtsInfo
     */
    @RequestMapping(params = "findWmtsCapabilities",
            headers = "Accept=application/json",
            produces = { "application/json; charset=UTF-8" })
    @ResponseBody
    public ResponseEntity<WMTSInfo> findWmtsCapabilitiesByAjax(
            WebRequest request) {
        String urlServer = request.getParameter("url");
        boolean useCrsSelected = Boolean.parseBoolean(request
                .getParameter("useCrsSelected"));

        String crsParam = request.getParameter("crs");

        TreeSet<String> listCrs = new TreeSet<String>();
        if (StringUtils.isNotEmpty(crsParam)) {
            Collections.addAll(listCrs, crsParam.split(","));
        }

        WMTSInfo wmtsInfo = null;
        if (StringUtils.isNotEmpty(urlServer)) {
            wmtsInfo = ogcInfoServ.getCapabilitiesFromWMTS(urlServer, listCrs,
                    useCrsSelected);
        }
        return new ResponseEntity<WMTSInfo>(wmtsInfo, HttpStatus.OK);
    }

    /**
     * Get supported crs of WMTS server indicated by url parameter
     *
     * @param request the {@code HttpServletRequest}.
     * @return List of crs supported
     */
    @RequestMapping(params = "findSupportedCrsWmts",
            headers = "Accept=application/json",
            produces = { "application/json; charset=UTF-8" })
    @ResponseBody
    public ResponseEntity<List<String>> findSupportedCrsWmtsByAjax(
            WebRequest request) {
        String urlServer = request.getParameter("url");

        List<String> listCrs = null;
        if (StringUtils.isNotEmpty(urlServer)) {
            listCrs = ogcInfoServ.getCRSSupportedByWMTS(urlServer);
        }
        return new ResponseEntity<List<String>>(listCrs, HttpStatus.OK);
    }


    /**
     * Get bounding box for a layers specified.
     * The result can be null if the service haven't defined the values
     * of bounding box.
     *
     * @param request the {@code HttpServletRequest}.
     * @return ResponseEntity with wmtsInfo
     */
    @RequestMapping(value = "/getLayerBoundingBox",
            headers = "Accept=application/json",
            produces = { "application/json; charset=UTF-8" })
    @ResponseBody
    public ResponseEntity<List<String>> getLayersBoundingBoxByAjax(
            WebRequest request) {

        List<String> boundingBox = null;

        String urlServer = request.getParameter("url");
        String typeLayer = request.getParameter("type");
        String crs = request.getParameter("crs");
        String layers = request.getParameter("layers");

        if (StringUtils.isNotEmpty(crs) && StringUtils.isNotEmpty(urlServer)
                && StringUtils.isNotEmpty(typeLayer)
                && StringUtils.isNotEmpty(layers)) {

            TreeSet<String> listLayers = new TreeSet<String>();
            Collections.addAll(listLayers, layers.split(","));
            boundingBox = ogcInfoServ.getLayersBoundingBox(urlServer,
                    typeLayer, crs, listLayers);
        }

        return new ResponseEntity<List<String>>(boundingBox, HttpStatus.OK);
    }

    /**
     * Catch ServerGeoException and set error message into response
     *
     * @param ex the {@ServerGeoException}
     * @param response the {@code HttpServletResponse}.
     * @return the message error.
     */
    @ExceptionHandler(ServerGeoException.class)
    @ResponseBody
    public String handleServerGeoException(ServerGeoException ex,
            HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        return messageSource.getMessage(SERVER_ERROR_CODE, null,
                LocaleContextHolder.getLocale());
    }

    /**
     * Get a redirection to the image that represents the WMS layer legend
     * @param urlServerWMS Url of the server to connect and get the data
     * @param layerId Layer id
     * @param styleName Layer styles
     * @return redirect to get the image that represents the layer legend
     */
    @RequestMapping(value = "/getWmsLegend")
    public String getWmsLegend(
            @RequestParam(value = "urlServer", required = true) String urlServerWMS,
            @RequestParam(value = "layerId", required = true) String layerId,
            @RequestParam(value = "styleName", required = false) String styleName){
        String legendUrl = ogcInfoServ.getWMSLegendUrl(urlServerWMS, layerId, styleName);
        return "redirect:".concat(legendUrl);
    }

    /**
     * Get a redirection to the image that represents the WMTS layer legend
     * @param urlServerWMTS Url of the server to connect and get the data
     * @param layerId Url of the server to connect and get the data
     * @return redirect to get the image that represents the layer legend
     */
    @RequestMapping(value = "/getWmtsLegend")
    public String getWmtsLegend(
            @RequestParam(value = "urlServer", required = true) String urlServerWMTS,
            @RequestParam(value = "layerId", required = true) String layerId){
        String legendUrl = ogcInfoServ.getWMTSLegendUrl(urlServerWMTS, layerId);
        return "redirect:".concat(legendUrl);
    }

}
