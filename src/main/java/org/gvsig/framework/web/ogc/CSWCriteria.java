/*
 * gvSIG Web Framework is sponsored by the General Directorate for Information
 * Technologies (DGTI) of the Regional Ministry of Finance and Public
 * Administration of the Generalitat Valenciana (Valencian Community,
 * Spain), managed by gvSIG Association and led by DISID.
 *
 * Copyright (C) ${year} DGTI - Generalitat Valenciana
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see &lt;http://www.gnu.org/licenses /&gt;.
 *
 */
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
        return "language=" + language + ", startAt=" + startAt + ", title="
                + title + ", abstract_=" + abstract_ + ", dateFrom=" + dateFrom
                + ", dateTo=" + dateTo;
    }

}
