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

public class WMSInfo {

    private List<TreeNode> layersTree;

    private TreeSet<String> crsSelected;

    private String version;

    private String formatSelected;

    private TreeSet<String> formatsSupported;

    private TreeSet<String> crsSupported;

    private String serviceUrl;

    private String serviceName;

    private String serviceAbstract;

    private String serviceTitle;

    private int id;

    private Map<String, WMSLayer> layers;

}
