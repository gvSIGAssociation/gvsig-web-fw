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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import org.gvnix.util.fancytree.TreeNode;

/**
 * Class with information of WMS service
 */
public class WMSInfo {

    /**
     * Tree that represent the layers of WMS service
     */
    private List<TreeNode> layersTree;

    /**
     * List with selected crs
     */
    private TreeSet<String> crsSelected;

    /**
     * Version of the service WMS
     */
    private String version;

    /**
     * Represents the image format selected
     */
    private String formatSelected;

    /**
     * List of supported formats
     */
    private TreeSet<String> formatsSupported;

    /**
     * List of supported crs
     */
    private TreeSet<String> crsSupported;

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
     * Id used for set id to pattern layer selected
     */
    private int id;

    /**
     * Service root layer names
     */
    private int childrenCount;

    /**
     * Map of the layers where the key represents the identifier of each layer
     * and the value is {@link WMSLayer} object
     */
    private Map<String, WMSLayer> layers;
}
