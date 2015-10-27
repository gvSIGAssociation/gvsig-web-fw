package org.gvsig.framework.web.ogc;

import java.util.Calendar;

/**
 * Class to indicate the search criteria for CSW.
 */
public class CSWCriteria {

  /*
   * spanish: "spa", english: "eng"
   */
  private String language;

  /*
   * Must always > 0. By default 1. Indicates the first element.
   */
  private int startAt = 1;

  private String title;

  private String abstract_;

  private Calendar dateFrom;

  private Calendar dateTo;

  @Override
  public String toString() {
    return "language=" + language + ", startAt=" + startAt + ", title=" + title
        + ", abstract_=" + abstract_ + ", dateFrom=" + dateFrom + ", dateTo="
        + dateTo;
  }

}
