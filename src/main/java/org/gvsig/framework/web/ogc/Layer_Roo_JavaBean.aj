package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.Layer;
import java.util.TreeSet;

privileged aspect Layer_Roo_JavaBean {

    public String Layer.getName() {
        return this.name;
    }

    public void Layer.setName(String name) {
        this.name = name;
    }

    public TreeSet<String> Layer.getCrs() {
        return this.crs;
    }

    public void Layer.setCrs(TreeSet<String> crs) {
        this.crs = crs;
    }

    public String Layer.getTitle() {
        return this.title;
    }

    public void Layer.setTitle(String title) {
        this.title = title;
    }

}
