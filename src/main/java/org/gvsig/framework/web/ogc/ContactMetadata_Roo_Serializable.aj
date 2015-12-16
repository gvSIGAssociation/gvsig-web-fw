package org.gvsig.framework.web.ogc;

import java.io.Serializable;

privileged aspect ContactMetadata_Roo_Serializable {

    declare parents: ContactMetadata implements Serializable;

    private static final long ContactMetadata.serialVersionUID = 1L;

}
