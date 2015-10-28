package org.gvsig.framework.web.exceptions;

/**
 *
 * Class to identify the exceptions ocurred when try to get information
 * of WMS and WMTS servers
 *
 */
public class ServerGeoException extends RuntimeException {
  public ServerGeoException() { super(); }
  public ServerGeoException(String s) { super(s); }
  public ServerGeoException(String s, Throwable throwable) { super(s, throwable); }
  public ServerGeoException(Throwable throwable) { super(throwable); }

}
