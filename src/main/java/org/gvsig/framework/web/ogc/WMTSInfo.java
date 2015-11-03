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

import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import org.gvnix.util.fancytree.TreeNode;
import org.gvsig.raster.wmts.ogc.struct.WMTSTileMatrixSet;

/**
 * Class with information of WMTS service
 */
public class WMTSInfo {

    /**
     * Tree that represent the layers of WMTS service
     */
    private List<TreeNode> layersTree;
    /**
     * Service version
     */
    private String version;

    /**
     * Service url
     */
    private String serviceUrl;

    /**
     * Service name
     */
    private String serviceName;

    /**
     * Service abstract
     */
    private String serviceAbstract;

    /**
     * Service title
     */
    private String serviceTitle;

    /**
     * Service type
     */
    private String serviceType;

    /**
     * Id used for set id to pattern layer selected
     */
    private int id;

    /**
     * List of {@link WMTSTileMatrixSet} id that supports the crs selected
     */
    private TreeSet<String> tileMatrixSelectedId;

    /**
     * Map of the layers where the key represents the identifier of each layer
     * and the value is {@link WMTSLayer} object
     */
    private Map<String, WMTSLayer> layers;

    /**
     * Map of the tileMatrix supported where the key represents each
     * {@link WMTSTileMatrixSet} id, and the value, the crs supported by it
     */
    private Map<String, String> tileMatrixCrsSupported;

    /**
     * List of supported formats
     */
    private TreeSet<String> formatsSupported;

    /**
     * List of supported crs
     */
    private TreeSet<String> crsSupported;

    /**
     * Indicate if any format established by user is supported
     */
    private boolean isFormatsSupported;

}
