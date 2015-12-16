package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.CSWResult;
import org.gvsig.framework.web.ogc.CSWSingleResult;
import java.util.List;

privileged aspect CSWResult_Roo_JavaBean {

    public int CSWResult.getRetrievedRecords() {
        return this.retrievedRecords;
    }

    public void CSWResult.setRetrievedRecords(int retrievedRecords) {
        this.retrievedRecords = retrievedRecords;
    }

    public int CSWResult.getTotalRecords() {
        return this.totalRecords;
    }

    public void CSWResult.setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public List<CSWSingleResult> CSWResult.getResults() {
        return this.results;
    }

    public void CSWResult.setResults(List<CSWSingleResult> results) {
        this.results = results;
    }

}
