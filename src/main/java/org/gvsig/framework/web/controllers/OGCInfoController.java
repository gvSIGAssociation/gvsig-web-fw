package org.gvsig.framework.web.controllers;

import java.util.Collections;
import java.util.List;
import java.util.TreeSet;

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
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
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
        if(StringUtils.isNotEmpty(crsParam)){
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
        if(StringUtils.isNotEmpty(crsParam)){
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
     * @return ResponseEntity with wmtsInfo
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
}
