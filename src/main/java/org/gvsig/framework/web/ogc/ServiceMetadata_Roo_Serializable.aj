package org.gvsig.framework.web.ogc;

import java.io.Serializable;

privileged aspect ServiceMetadata_Roo_Serializable {

    declare parents: ServiceMetadata implements Serializable;

    private static final long ServiceMetadata.serialVersionUID = 1L;

}
