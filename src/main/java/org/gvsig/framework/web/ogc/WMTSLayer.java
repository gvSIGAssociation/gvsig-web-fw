package org.gvsig.framework.web.ogc;

import java.util.TreeSet;

public class WMTSLayer extends Layer{

  private TreeSet<String> formatsSupported;

  private String formatSelected;

  private TreeSet<String> tileMatrixSelected;

}
