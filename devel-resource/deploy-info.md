# Deploy information

Information to make deploy of library on gvSIG maven repository

## Prerequisites

- Configure environment as explains in http://docs.gvsig.org/plone/projects/gvsig-desktop/docs/devel/gvsig-devel-guide/2.0.0/trabajar-con-el-nucleo-de-gvsig/gvsig-compilation/initial-configuration/initial-configuration#acceso-de-escritura-al-repositorio-maven-de-gvsig

## Delploy procedure

- Assure source is up-to-date:

  - Check server changes:

       $ cd root_library_folder
       $ git pull
       Already up-to-date.

   - Check local changes:

        $ git status
        On the master branch
        Your branch is up-to-date with 'origin/master'.

        nothing to commit, working directory clean
        $

- Assure all work fine:

  - Compile project:

       $ cd root_library_folder
       $ mvn clean install
       [INFO] Scanning for projects...
       [INFO]
       ....
       ....
       [INFO] ------------------------------------------------------------------------
       [INFO] BUILD SUCCESS
       [INFO] ------------------------------------------------------------------------
       [INFO] Total time: xs
       [INFO] Finished at: xxx
       [INFO] Final Memory: xxx
       [INFO] ------------------------------------------------------------------------

  - Perform functional test on a library that uses it

- Update version on `pom.xml`:

       <groupId>org.gvsig</groupId>
       <artifactId>org.gvsig.web.framework</artifactId>
       <version>X.X.X</version>

- Perform deploy maven operation:

       $ cd root_library_folder
       $ mvn clean install deploy
       [INFO] Scanning for projects...
       [INFO]
       ....
       ....
       [INFO] ------------------------------------------------------------------------
       [INFO] BUILD SUCCESS
       [INFO] ------------------------------------------------------------------------
       [INFO] Total time: xs
       [INFO] Finished at: xxx
       [INFO] Final Memory: xxx
       [INFO] ------------------------------------------------------------------------

- Commit release changes to github:

       $ git add pom.xml
       $ git commit -m "Release X.X.X"
       $ git push

- Create a release on github: https://help.github.com/articles/creating-releases/

- Update new stage version on `pom.xml`:

       <groupId>org.gvsig</groupId>
       <artifactId>org.gvsig.web.framework</artifactId>
       <version>Y.Y.Y.BUILD-SNAPSHOT</version>

- Commit version update to github:

       $ git add pom.xml
       $ git commit -m "Next development stage Y.Y.Y.BUILD-SNAPSHOT"
       $ git push