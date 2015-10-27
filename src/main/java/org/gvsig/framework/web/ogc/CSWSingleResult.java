package org.gvsig.framework.web.ogc;

/**
 * Class used to obtain the single results of the searches in the catalog (CSW).
 */
public class CSWSingleResult {

  /*
   * identifier
   */
  private String fileIdentifier;

  private String title;

  private String abstract_;

  private String image;

  private String wmsUrl;

  @Override
  public String toString() {
    return "title=" + title + ", abstract=" + abstract_ + ", image=" + image
        + ", wmsUrl=" + wmsUrl;
  }

}
