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

  private Map<String,WMSLayer> layers;

}
