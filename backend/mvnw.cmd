@echo off
set MAVEN_OPTS=-Xmx384m -Xms64m
set _JAVA_OPTIONS=-Xmx384m -Xms64m
if exist "C:\Users\prust\apache-maven-3.9.9\bin\mvn.cmd" (
    "C:\Users\prust\apache-maven-3.9.9\bin\mvn.cmd" %*
) else (
    mvn %*
)
