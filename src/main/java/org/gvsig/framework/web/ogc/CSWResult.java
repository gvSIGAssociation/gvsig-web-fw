package org.gvsig.framework.web.ogc;

import java.util.LinkedList;
import java.util.List;

/**
 * Class used to obtain the results of the searches in the catalog (CSW).
 */
public class CSWResult {

  /*
   * Returned records. Maximum 10.
   */
  private int retrievedRecords;

  /*
   * Total found records.
   */
  private int totalRecords;

  private List<CSWSingleResult> results = new LinkedList<CSWSingleResult>();

  @Override
  public String toString() {
    return "Retrieved records=" + retrievedRecords + ", Total records="
        + totalRecords;
  }

}
