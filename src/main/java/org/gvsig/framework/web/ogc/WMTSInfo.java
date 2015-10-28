package org.gvsig.framework.web.ogc;

import java.util.List;
import java.util.Map;
import java.util.TreeSet;

import org.gvnix.util.fancytree.TreeNode;

public class WMTSInfo {

  private List<TreeNode> layersTree;

  private String version;

  private String serviceUrl;

  private String serviceName;

  private String serviceAbstract;

  private String serviceTitle;

  private String serviceType;

  private int id;

  private TreeSet<String> tileMatrixSelectedId;

  private Map<String,WMTSLayer> layers;

  // Map<identifier of tileMatrix, crs supported>
  private Map<String, String> tileMatrixCrsSupported;

  private TreeSet<String> formatsSupported;

  private TreeSet<String> crsSupported;

  private boolean isFormatsSupported;

}
