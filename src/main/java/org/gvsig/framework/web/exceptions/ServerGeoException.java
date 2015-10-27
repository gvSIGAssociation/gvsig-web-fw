package org.gvsig.framework.web.exceptions;

/*
 * Copyright 2015 DiSiD Technologies S.L.L. All rights reserved.
 *
 * Project  : DiSiD gvgeoportal
 * SVN Id   : $Id$
 */

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
