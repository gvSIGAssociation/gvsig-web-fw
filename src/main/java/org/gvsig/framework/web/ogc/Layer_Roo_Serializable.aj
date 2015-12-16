package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.Layer;
import java.io.Serializable;

privileged aspect Layer_Roo_Serializable {

    declare parents: Layer implements Serializable;

    private static final long Layer.serialVersionUID = 1L;

}
