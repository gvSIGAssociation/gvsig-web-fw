package org.gvsig.framework.web.ogc;

import org.gvsig.framework.web.ogc.CSWCriteria;
import java.util.Calendar;

privileged aspect CSWCriteria_Roo_JavaBean {

    public String CSWCriteria.getLanguage() {
        return this.language;
    }

    public void CSWCriteria.setLanguage(String language) {
        this.language = language;
    }

    public int CSWCriteria.getStartAt() {
        return this.startAt;
    }

    public void CSWCriteria.setStartAt(int startAt) {
        this.startAt = startAt;
    }

    public String CSWCriteria.getTitle() {
        return this.title;
    }

    public void CSWCriteria.setTitle(String title) {
        this.title = title;
    }

    public String CSWCriteria.getAbstract_() {
        return this.abstract_;
    }

    public void CSWCriteria.setAbstract_(String abstract_) {
        this.abstract_ = abstract_;
    }

    public Calendar CSWCriteria.getDateFrom() {
        return this.dateFrom;
    }

    public void CSWCriteria.setDateFrom(Calendar dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Calendar CSWCriteria.getDateTo() {
        return this.dateTo;
    }

    public void CSWCriteria.setDateTo(Calendar dateTo) {
        this.dateTo = dateTo;
    }

}
