/*
 * gvSIG Web Framework is sponsored by the General Directorate for Information
 * Technologies (DGTI) of the Regional Ministry of Finance and Public
 * Administration of the Generalitat Valenciana (Valencian Community,
 * Spain), managed by gvSIG Association and led by DISID.
 *
 * Copyright (C) ${year} DGTI - Generalitat Valenciana
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
package org.gvsig.framework.web.ogc;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URL;
import java.util.Collection;

import org.apache.commons.httpclient.NameValuePair;
import org.gvsig.catalog.csw.drivers.CSWException;
import org.gvsig.catalog.csw.drivers.CSWISO19115CatalogServiceDriver;
import org.gvsig.catalog.csw.messages.CSWAbstractMessages;
import org.gvsig.catalog.csw.parsers.CSWCapabilitiesParser;
import org.gvsig.catalog.csw.parsers.CSWConstants;
import org.gvsig.catalog.csw.parsers.CSWDescribeRecordParser;
import org.gvsig.catalog.drivers.DiscoveryServiceCapabilities;
import org.gvsig.catalog.exceptions.NotSupportedVersionException;
import org.gvsig.catalog.metadataxml.XMLNode;
import org.gvsig.catalog.protocols.HTTPGetProtocol;
import org.gvsig.utils.swing.jcomboServer.ServerData;

/**
 * Add: obtain the capabilities by language.
 */
public class CSWISO19115LangCatalogServiceDriver extends
        CSWISO19115CatalogServiceDriver {

    /**
     * It try to discover the server capabilities.
     *
     * @param uri Server URI
     * @param language. Can be null. By default english.
     * @return Node with the server answer.
     * @throws NotSupportedVersionException only supports 2.0.2 version.
     */
    public DiscoveryServiceCapabilities getCapabilities(URI uri, String language)
            throws NotSupportedVersionException {
        URL url = null;
        try {
            url = uri.toURL();
        }
        catch (MalformedURLException e) {
            setServerAnswerReady("errorServerNotFound");
            return null;
        }
        @SuppressWarnings("rawtypes")
        Collection nodes = new java.util.ArrayList();

        NameValuePair nvp1 = new NameValuePair("request",
                CSWConstants.OPERATION_GETCAPABILITIES);
        NameValuePair nvp2 = new NameValuePair("service",
                ServerData.SERVER_SUBTYPE_CATALOG_CSW);
        NameValuePair nvp3 = new NameValuePair("acceptFormats", "text/xml");
        NameValuePair[] parameters;
        if (language != null) {
            NameValuePair nvp4 = new NameValuePair("language", language);
            parameters = new NameValuePair[] { nvp1, nvp2, nvp3, nvp4 };
        }
        else {
            parameters = new NameValuePair[] { nvp1, nvp2, nvp3 };
        }

        nodes = new HTTPGetProtocol().doQuery(url, parameters, 0);
        CSWCapabilitiesParser parser = new CSWCapabilitiesParser(url, this);
        capabilities = parser.parse((XMLNode) nodes.toArray()[0]);
        // There are servers that need the getCapabilities operation (instead of
        // GetCapabilities)
        if (!(capabilities.isAvailable())
                && (capabilities.getException() != null)) {
            CSWException exception = capabilities.getException();
            if ((exception.getCode().equals(CSWException.CODE_ERROR))
                    && (exception.getSubcode()
                            .equals(CSWException.SUBCODE_ERROR))) {
                nodes = new HTTPGetProtocol().doQuery(url,
                        CSWAbstractMessages.getHTTPGETCapabilitiesLower(), 0);
                capabilities = parser.parse((XMLNode) nodes.toArray()[0]);
            }
        }
        String version = capabilities.getVersion();
        if (version != null && !version.equalsIgnoreCase("2.0.2")) {
            throw new NotSupportedVersionException();
        }
        // If the version can be retrieved the CSWAbstractMessages object
        // cant be created
        setMessages(uri, url);
        return capabilities;
    }

    /**
     * Create and sets the Messages object if it is possible
     *
     * @param uri Server URI
     * @param url Server url
     * @throws NotSupportedVersionException
     */
    private void setMessages(URI uri, URL url)
            throws NotSupportedVersionException {
        @SuppressWarnings("rawtypes")
        Collection nodes = new java.util.ArrayList();
        nodes = new HTTPGetProtocol().doQuery(url, CSWAbstractMessages
                .getHTTPGETDescribeRecord(capabilities.getVersion()), 0);
        CSWDescribeRecordParser parser = new CSWDescribeRecordParser(url, this);
        parser.parse((XMLNode) nodes.toArray()[0]);
    }

}
