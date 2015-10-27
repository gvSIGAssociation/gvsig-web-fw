# gvSIG Web Framework
Geospatial web framework that includes many geographical tools for Spring MVC based applications.

## features

- OGC capability requests info for:
  - WMS
  - WMTS
  - CWS

- gvNIX Geo add-on tools to include:

  - Predefined layers
  - User defined layers
    - WMS
    - WMTS
    - Tiles
    - Shp


## Requirements

- Spring web project generated by gvNIX 1.5.x and `web mvc geo` applied

## Include on project

- include dependency and repository on `pom.xml` file:

        ....
        <repositories>
          ....
          ....
          <repository>
           <id>gvsig-public-http-repository</id>
           <name>gvSIG maven public HTTP repository</name>
           <url>http://devel.gvsig.org/m2repo/j2se</url>
           <releases>
              <enabled>true</enabled>
              <updatePolicy>daily</updatePolicy>
              <checksumPolicy>warn</checksumPolicy>
           </releases>
           <snapshots>
              <enabled>true</enabled>
              <updatePolicy>daily</updatePolicy>
              <checksumPolicy>warn</checksumPolicy>
            </snapshots>
          </repository>
        </repositories>
        ....
        ....
        <dependencies>
          ....
          ....
          <dependency>
            <groupId>org.gvsig</groupId>
            <artifactId>org.gvsig.framework.web</artifactId>
            <version>${gvsig.web.fw.version}</version>
          </dependency>
          ....
        </dependencies>
          ....
        <properties>
            ....
            ....
            ....
            <gvsig.web.fw.version>Include_version_here</gvsig.web.fw.version>
            ....
        </properties>

- register service and controller on `webmvc-config.xml`:

        ....
        ....
        <!--  gvSIG Web Framework integration -->
        <bean class="org.gvsig.framework.web.service.impl.OGCInfoServiceImpl" name="ogcInfoService"/>
        <bean class="org.gvsig.framework.web.controllers.OGCInfoController" name="ogcInfoController"/>
        ....
        ....

- include web resources on `load-scripts.tagx`:

```
      <jsp:root xmlns:c="http://java.sun.com/jsp/jstl/core"
           xmlns:fn="http://java.sun.com/jsp/jstl/functions"
           xmlns:jsp="http://java.sun.com/JSP/Page"
           xmlns:spring="http://www.springframework.org/tags"
           xmlns:gvsig="http://gvsig.org/web-framework/TLD/util"
           version="2.0">
         ....
         ....
         ....
         <gvsig:load-scripts/>
      </jsp:root>
```

Now you are able to use tools on your map view