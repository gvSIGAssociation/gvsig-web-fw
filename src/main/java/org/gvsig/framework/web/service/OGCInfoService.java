package org.gvsig.framework.web.service;

import java.util.List;
import java.util.TreeSet;

import org.gvsig.framework.web.ogc.CSWCriteria;
import org.gvsig.framework.web.ogc.CSWResult;
import org.gvsig.framework.web.ogc.CSWSingleResult;
import org.gvsig.framework.web.ogc.WMSInfo;
import org.gvsig.framework.web.ogc.WMTSInfo;

public interface OGCInfoService {

  /**
   * Generate WMSInfo object that contains the layers and the information of the
   * server wms indicated by urlServerWMS parameter
   *
   * @param urlServerWMS URL to access to WMS server
   * @param crs CRS that must have the layers to add these to the tree
   * @param format Format of the images used to paint the layers
   * @param isCalledByWizard Indicate if the method is called by wizard to get
   *          layers information
   * @return object with information of server WMS
   */
  public WMSInfo getCapabilitiesFromWMS(String urlServerWMS, TreeSet<String> crs,
                                        String format, boolean isCalledByWizard);

  /**
   * Generate WMSInfo object that contains the layers and the information of the
   * server wmts indicated by urlServerWMTS parameter
   *
   * @param urlServerWMTS URL to access to WMTS server
   * @param crs CRS that must have the layers to add these to the tree
   * @param useCrsSelected Indicate if crs has been selected from user or
   *          has been set by map.
   * @return object with information of server WMTS
   */
  public WMTSInfo getCapabilitiesFromWMTS(String urlServerWMTS, List<String> crs,
                                          boolean useCrsSelected);


  /**
   * Get supported crs of the server wmts indicated by urlServerWMTS parameter
   * @param urlServerWMTS URL to access to WMTS server
   * @return list of supported crs
   */
  public List<String> getCRSSupportedByWMTS(String urlServerWMTS);

  /*****************************
   * CSW (Catalog Service Web) *
   *****************************/

  /**
   * Obtains the results of the search performed in the catalog indicated by
   * "cswUrl", using the filter criteria of "cswCriteria".
   * <p/>
   * Criterias:
   * <p/>
   * * language: language catalog. By default english (param value is "eng"). If
   * spanish, param value is "spa". See capabilities.
   * <p/>
   * * startAt: must always > 0. By default 1. Indicates the first element.
   * <p/>
   * * title: sets filtering by title.
   * <p/>
   * * abstract_: sets filtering by abstract.
   * <p/>
   * To filter abstract by exact match, the search must be enclosed in double
   * quotes, otherwise filtered by single words. For example, "with quotes"
   * return all searches in the abstract that contains "with" or "quotes".
   * <p/>
   * * dateFrom: sets filtering by date greater than "dateFrom".
   * <p/>
   * * dateTo: sets filtering by date lower than "dateTo".
   * <p/>
   * Results:
   * <p/>
   * * retrievedRecords: returned records. Maximum 10.
   * <p/>
   * * totalRecords: total found records.
   * <p/>
   * * results: list of the obtained results:
   * <p/>
   * Each result contains the following properties in "CSWSingleResult" object:
   * <p/>
   * * fileIdentifier: identifier of the record .
   * <p/>
   * * title: title of the record.
   * <p/>
   * * abstract_ : abstract of the record.
   * <p/>
   * * image: image of the record.
   * <p/>
   * * wmsUrl: first wms url of the record.
   *
   * @param cswUrl url of csw server.
   * @param cswCriteria criterias of search.
   * @return results in CSWResult object.
   */
  public CSWResult getCswRecords(String cswUrl, CSWCriteria cswCriteria);

  /**
   * Obtains the result of the indicated positionO
   *
   * @param cswResults the results.
   * @param position the index.
   * @return the result of the indicated position.
   */
  public CSWSingleResult getCswSingleRecord(CSWResult cswResults, int position);

}
